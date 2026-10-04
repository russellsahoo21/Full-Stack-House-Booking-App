import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Conversation } from './models/Conversation.js';
import { Message } from './models/Message.js';
import { User } from './models/User.js';
import { Host } from './models/Host.js';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  hostProfileIds?: string[];
  isAlive?: boolean;
}

// Map of userId -> Set of active WebSocket connections
const userConnections = new Map<string, Set<AuthenticatedWebSocket>>();

let wssInstance: WebSocketServer | null = null;

export const initWebSocketServer = (server: HttpServer) => {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
  });

  wssInstance = wss;

  // Heartbeat ping-pong to clean up dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {
      const authWs = ws as AuthenticatedWebSocket;
      if (authWs.isAlive === false) {
        if (authWs.userId) {
          const userSockets = userConnections.get(authWs.userId);
          if (userSockets) {
            userSockets.delete(authWs);
            if (userSockets.size === 0) userConnections.delete(authWs.userId);
          }
        }
        return authWs.terminate();
      }
      authWs.isAlive = false;
      authWs.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  wss.on('connection', (ws: AuthenticatedWebSocket) => {
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async (raw: string) => {
      try {
        const payload = JSON.parse(raw.toString());
        const { type } = payload;

        switch (type) {
          // 1. Authenticate / register user's socket
          case 'auth': {
            const { userId } = payload;
            if (!userId) return;

            ws.userId = userId;
            if (!userConnections.has(userId)) {
              userConnections.set(userId, new Set());
            }
            userConnections.get(userId)!.add(ws);

            // Also register linked Host profile IDs for instant real-time delivery
            try {
              const hostProfiles = await Host.find({ userId });
              ws.hostProfileIds = hostProfiles.map((h) => h._id.toString());
              for (const hId of ws.hostProfileIds) {
                if (!userConnections.has(hId)) {
                  userConnections.set(hId, new Set());
                }
                userConnections.get(hId)!.add(ws);
              }
            } catch (err: any) {
              console.warn('Could not register host profiles for socket:', err.message);
            }

            ws.send(
              JSON.stringify({
                type: 'auth_success',
                userId,
                timestamp: new Date(),
              })
            );
            break;
          }

          // 2. Real-time message exchange
          case 'send_message': {
            const { conversationId, senderId, recipientId, senderRole, topic, text } = payload;
            if (!conversationId || !senderId || !recipientId || !text?.trim()) {
              ws.send(JSON.stringify({ type: 'error', message: 'Missing required message parameters' }));
              return;
            }

            // If recipient is a Host document ID, resolve true User ID
            let targetUserId = recipientId;
            let targetHostId: string | null = null;
            if (recipientId.startsWith('host-')) {
              targetHostId = recipientId;
              const hostDoc = await Host.findById(recipientId);
              if (hostDoc && hostDoc.userId) {
                targetUserId = hostDoc.userId.toString();
              }
            }

            // Save message to MongoDB
            const newMsg = await Message.create({
              conversationId,
              senderId,
              recipientId: targetUserId,
              senderRole: senderRole || 'guest',
              topic: topic || 'General question',
              text: text.trim(),
              read: false,
            });

            // Update conversation telemetry & unread counts
            const conv = await Conversation.findById(conversationId);
            if (conv) {
              conv.lastMessage = text.trim();
              conv.lastMessageAt = new Date();
              conv.lastSenderId = senderId;
              if (senderRole === 'guest') {
                conv.unreadHost = (conv.unreadHost || 0) + 1;
              } else {
                conv.unreadGuest = (conv.unreadGuest || 0) + 1;
              }
              await conv.save();
            }

            // Fetch sender info for preview
            const sender = await User.findById(senderId).select('name avatar');
            const messageData = {
              ...newMsg.toObject(),
              sender: sender || { name: 'User', avatar: '' },
            };

            // Ack to sender
            ws.send(
              JSON.stringify({
                type: 'message_sent',
                message: messageData,
                conversationId,
              })
            );

            // Broadcast real-time to recipient (both user ID and host ID if different)
            emitToUser(targetUserId, {
              type: 'new_message',
              message: messageData,
              conversationId,
            });
            if (targetHostId && targetHostId !== targetUserId) {
              emitToUser(targetHostId, {
                type: 'new_message',
                message: messageData,
                conversationId,
              });
            }

            // Trigger notification alert on recipient
            const notifPayload = {
              type: 'notification',
              notification: {
                id: `notif-msg-${newMsg._id}`,
                type: 'chat_message',
                title: `New message from ${sender?.name || 'Host/Guest'}`,
                description: text.trim(),
                timestamp: 'Just now',
                link: `/messages/${conversationId}`,
                conversationId,
              },
            };
            emitToUser(targetUserId, notifPayload);
            if (targetHostId && targetHostId !== targetUserId) {
              emitToUser(targetHostId, notifPayload);
            }

            break;
          }

          // 3. Mark conversation read
          case 'mark_read': {
            const { conversationId, userId } = payload;
            if (!conversationId || !userId) return;

            await Message.updateMany(
              { conversationId, read: false },
              { $set: { read: true } }
            );

            const conv = await Conversation.findById(conversationId);
            if (conv) {
              if (conv.guestId === userId) {
                conv.unreadGuest = 0;
              }
              if (conv.hostId === userId || userId === 'usr-demo-admin') {
                conv.unreadHost = 0;
              }
              await conv.save();
            }

            ws.send(JSON.stringify({ type: 'marked_read_success', conversationId }));
            break;
          }

          // 4. Typing indicator
          case 'typing': {
            const { conversationId, senderId, recipientId, isTyping } = payload;
            if (recipientId) {
              emitToUser(recipientId, {
                type: 'typing_indicator',
                conversationId,
                senderId,
                isTyping,
              });
            }
            break;
          }

          default:
            break;
        }
      } catch (err: any) {
        console.error('WebSocket message parsing error:', err.message);
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        const userSockets = userConnections.get(ws.userId);
        if (userSockets) {
          userSockets.delete(ws);
          if (userSockets.size === 0) {
            userConnections.delete(ws.userId);
          }
        }
      }
      if (ws.hostProfileIds && ws.hostProfileIds.length > 0) {
        for (const hId of ws.hostProfileIds) {
          const hSockets = userConnections.get(hId);
          if (hSockets) {
            hSockets.delete(ws);
            if (hSockets.size === 0) {
              userConnections.delete(hId);
            }
          }
        }
      }
    });
  });

  console.log('🌿 WebSocket Server initialized on path /ws');
  return wss;
};

// Helper to broadcast JSON event to a specific user
export const emitToUser = (userId: string, data: any) => {
  const sockets = userConnections.get(userId);
  if (!sockets || sockets.size === 0) return false;

  const payload = JSON.stringify(data);
  sockets.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
  return true;
};
