/**
 * WebSocket Real-Time Chat Service
 * Native browser WebSocket client with auto-reconnection and event dispatching.
 */

type MessageHandler = (data: any) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private currentUserId: string | null = null;
  private reconnectTimer: any = null;
  private isExplicitDisconnect = false;
  private isConnecting = false;

  private messageHandlers = new Set<MessageHandler>();
  private notificationHandlers = new Set<MessageHandler>();
  private typingHandlers = new Set<MessageHandler>();
  private statusHandlers = new Set<(connected: boolean) => void>();

  private getSocketUrl(): string {
    const envUrl = (import.meta as any).env?.VITE_API_URL?.trim();
    if (envUrl) {
      const wsUrl = envUrl.replace(/^http/, 'ws').replace(/\/+$/, '');
      return wsUrl.endsWith('/api') ? wsUrl.replace(/\/api$/, '/ws') : `${wsUrl}/ws`;
    }

    if ((import.meta as any).env?.PROD) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/ws`;
    }

    return 'ws://localhost:5000/ws';
  }

  public connect(userId: string) {
    if (!userId) return;
    this.currentUserId = userId;
    this.isExplicitDisconnect = false;

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      // If already connected, ensure auth is registered
      this.send({ type: 'auth', userId });
      return;
    }

    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      const url = this.getSocketUrl();
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.isConnecting = false;
        this.notifyStatus(true);
        // Authenticate with user ID
        this.send({ type: 'auth', userId: this.currentUserId });
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type } = payload;

          if (type === 'new_message' || type === 'message_sent') {
            this.messageHandlers.forEach((handler) => handler(payload));
          } else if (type === 'notification') {
            this.notificationHandlers.forEach((handler) => handler(payload.notification));
          } else if (type === 'typing_indicator') {
            this.typingHandlers.forEach((handler) => handler(payload));
          }
        } catch (err) {
          console.warn('Failed to parse WebSocket message:', err);
        }
      };

      this.socket.onclose = () => {
        this.isConnecting = false;
        this.notifyStatus(false);
        if (!this.isExplicitDisconnect && this.currentUserId) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => {
            if (this.currentUserId) this.connect(this.currentUserId);
          }, 3000);
        }
      };

      this.socket.onerror = (err) => {
        this.isConnecting = false;
        console.warn('WebSocket error:', err);
      };
    } catch (err) {
      this.isConnecting = false;
      console.warn('WebSocket connect failure:', err);
    }
  }

  public disconnect() {
    this.isExplicitDisconnect = true;
    clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.notifyStatus(false);
  }

  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  public send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  public sendMessage(payload: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    senderRole?: 'guest' | 'host';
    topic?: string;
    text: string;
  }) {
    return this.send({
      type: 'send_message',
      ...payload,
    });
  }

  public markRead(conversationId: string, userId: string) {
    return this.send({
      type: 'mark_read',
      conversationId,
      userId,
    });
  }

  public sendTyping(conversationId: string, senderId: string, recipientId: string, isTyping: boolean) {
    return this.send({
      type: 'typing',
      conversationId,
      senderId,
      recipientId,
      isTyping,
    });
  }

  public onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public onNotification(handler: MessageHandler) {
    this.notificationHandlers.add(handler);
    return () => this.notificationHandlers.delete(handler);
  }

  public onTyping(handler: MessageHandler) {
    this.typingHandlers.add(handler);
    return () => this.typingHandlers.delete(handler);
  }

  public onStatusChange(handler: (connected: boolean) => void) {
    this.statusHandlers.add(handler);
    handler(this.isConnected());
    return () => this.statusHandlers.delete(handler);
  }

  private notifyStatus(connected: boolean) {
    this.statusHandlers.forEach((handler) => handler(connected));
  }
}

export const socketService = new SocketService();
