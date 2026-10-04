import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Listing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { Host } from '../models/Host.js';
import { AppError } from '../utils/appError.js';
import { emitToUser } from '../socket.js';

// ==========================================
// 1. GET ALL USER CONVERSATIONS
// @route   GET /api/messages/conversations
// ==========================================
export const getUserConversations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user._id.toString();

    // Check if user has linked Host document(s)
    const hostProfiles = await Host.find({ userId });
    const hostProfileIds = hostProfiles.map((h) => h._id.toString());

    // Also find all listings owned by this user or their Host profiles
    const myListings = await Listing.find({
      $or: [
        { hostId: userId },
        ...(hostProfileIds.length > 0 ? [{ hostId: { $in: hostProfileIds } }] : []),
      ],
    }).select('_id');
    const myListingIds = myListings.map((l) => l._id.toString());

    // User can see conversations where they are the guest, host, or listing owner
    const conversations = await Conversation.find({
      $or: [
        { guestId: userId },
        { hostId: userId },
        ...(hostProfileIds.length > 0 ? [{ hostId: { $in: hostProfileIds } }] : []),
        ...(myListingIds.length > 0 ? [{ listingId: { $in: myListingIds } }] : []),
      ],
    })
      .populate('guest', 'name avatar email role')
      .populate('host', 'name avatar email role')
      .populate('listing', 'title images price location roomType hostId')
      .sort({ lastMessageAt: -1 });

    const formatted = await Promise.all(
      conversations.map(async (c) => {
        const obj: any = c.toObject();

        // Resolve host details: check listing's Host document first to get true host name & avatar
        const hostDoc =
          (c.listing?.hostId ? await Host.findById(c.listing.hostId) : null) ||
          (await Host.findById(c.hostId)) ||
          (await Host.findOne({ userId: c.hostId }));

        if (hostDoc) {
          obj.host = {
            _id: hostDoc.userId || hostDoc._id,
            name: hostDoc.name,
            avatar: hostDoc.avatar,
            email: 'host@wayfound.com',
            role: 'host',
          };
        } else if (!obj.host) {
          const userHost = await User.findById(c.hostId);
          obj.host = {
            _id: c.hostId,
            name: userHost?.name || 'Property Host',
            avatar:
              userHost?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            role: 'host',
          };
        }

        // If guest was not populated
        if (!obj.guest) {
          const guestUser = await User.findById(c.guestId);
          if (guestUser) {
            obj.guest = {
              _id: guestUser._id,
              name: guestUser.name,
              avatar: guestUser.avatar,
              email: guestUser.email,
              role: guestUser.role,
            };
          } else {
            obj.guest = {
              _id: c.guestId,
              name: 'Guest Traveler',
              avatar:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              role: 'user',
            };
          }
        }

        return obj;
      })
    );

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. GET OR CREATE CONVERSATION FOR A LISTING
// @route   POST /api/messages/conversations
// ==========================================
export const getOrCreateConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const guestId = req.user._id.toString();
    let { listingId, initialMessage, topic } = req.body;

    if (!listingId) {
      return next(new AppError('Listing ID is required', 400));
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new AppError('Listing not found', 404));
    }

    // ALWAYS resolve true host from the listing!
    let resolvedHostId: string = '';
    let resolvedHostDoc: any = await Host.findById(listing.hostId);
    if (!resolvedHostDoc) {
      resolvedHostDoc = await Host.findOne({ userId: listing.hostId });
    }

    if (resolvedHostDoc && resolvedHostDoc.userId) {
      resolvedHostId = resolvedHostDoc.userId.toString();
    } else {
      const userHost = await User.findById(listing.hostId);
      if (userHost) {
        resolvedHostId = userHost._id.toString();
      } else if (resolvedHostDoc) {
        resolvedHostId = resolvedHostDoc._id.toString();
      } else {
        resolvedHostId = listing.hostId || 'host-1';
      }
    }

    const hostId = resolvedHostId;

    // Prevent messaging yourself if you are the host
    if (guestId === hostId) {
      return next(new AppError('You cannot start a chat thread with yourself as the host', 400));
    }

    // Find existing conversation between this guest and listing
    let conv: any = await Conversation.findOne({
      guestId,
      listingId,
    })
      .populate('guest', 'name avatar email')
      .populate('host', 'name avatar email')
      .populate('listing', 'title images price location roomType hostId');

    // If found, update hostId if it was previously wrong
    if (conv) {
      if (conv.hostId !== hostId) {
        conv.hostId = hostId;
        await conv.save();
      }
    } else {
      conv = await Conversation.create({
        guestId,
        hostId,
        listingId,
        lastMessage: initialMessage?.trim() || '',
        lastMessageAt: new Date(),
        lastSenderId: guestId,
        unreadHost: initialMessage ? 1 : 0,
        unreadGuest: 0,
      });

      conv = await Conversation.findById(conv._id)
        .populate('guest', 'name avatar email')
        .populate('host', 'name avatar email')
        .populate('listing', 'title images price location roomType hostId');
    }

    let convObj: any = conv.toObject();

    // Ensure host profile information is accurately populated with the listing's true host
    if (resolvedHostDoc) {
      convObj.host = {
        _id: resolvedHostDoc.userId || resolvedHostDoc._id,
        name: resolvedHostDoc.name,
        avatar: resolvedHostDoc.avatar,
        email: 'host@wayfound.com',
        role: 'host',
      };
    }

    if (!convObj.guest) {
      convObj.guest = {
        _id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
        email: req.user.email,
        role: req.user.role,
      };
    }

    // If initialMessage was sent
    if (initialMessage && initialMessage.trim()) {
      const newMsg = await Message.create({
        conversationId: conv._id,
        senderId: guestId,
        recipientId: hostId,
        senderRole: 'guest',
        topic: topic || 'Ask questions before booking',
        text: initialMessage.trim(),
        read: false,
      });

      conv.lastMessage = initialMessage.trim();
      conv.lastMessageAt = new Date();
      conv.lastSenderId = guestId;
      conv.unreadHost = (conv.unreadHost || 0) + 1;
      await conv.save();

      convObj.lastMessage = initialMessage.trim();
      convObj.lastMessageAt = conv.lastMessageAt;
      convObj.lastSenderId = guestId;

      // Emit real-time WebSocket notification to host
      emitToUser(hostId, {
        type: 'new_message',
        message: newMsg,
        conversationId: conv._id,
      });

      emitToUser(hostId, {
        type: 'notification',
        notification: {
          id: `notif-inquiry-${newMsg._id}`,
          type: 'chat_message',
          title: `Inquiry from ${req.user.name}`,
          description: `Regarding "${listing.title}": ${initialMessage.trim()}`,
          timestamp: 'Just now',
          link: `/messages/${conv._id}`,
          conversationId: conv._id,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: convObj,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. GET MESSAGES IN CONVERSATION
// @route   GET /api/messages/conversations/:id/messages
// ==========================================
export const getConversationMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const conv = await Conversation.findById(id);
    if (!conv) {
      return next(new AppError('Conversation not found', 404));
    }

    // Check if user is guest, host, owns host profile, or owns the listing
    const hostProfiles = await Host.find({ userId });
    const hostProfileIds = hostProfiles.map((h) => h._id.toString());
    const isListingOwner = await Listing.exists({
      _id: conv.listingId,
      $or: [{ hostId: userId }, { hostId: { $in: hostProfileIds } }],
    });

    const isParticipant =
      conv.guestId === userId ||
      conv.hostId === userId ||
      hostProfileIds.includes(conv.hostId) ||
      !!isListingOwner ||
      req.user.role === 'admin';

    if (!isParticipant) {
      return next(new AppError('Not authorized to access this conversation', 403));
    }

    const messages = await Message.find({ conversationId: id })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 });

    // Mark messages addressed to current user as read
    await Message.updateMany(
      {
        conversationId: id,
        recipientId: { $in: [userId, ...hostProfileIds, conv.guestId, conv.hostId] },
        read: false,
      },
      { $set: { read: true } }
    );

    // Reset unread count on conversation
    if (conv.guestId === userId) {
      conv.unreadGuest = 0;
    }
    if (
      conv.hostId === userId ||
      hostProfileIds.includes(conv.hostId) ||
      req.user.role === 'admin'
    ) {
      conv.unreadHost = 0;
    }
    await conv.save();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. SEND MESSAGE VIA HTTP REST
// @route   POST /api/messages/conversations/:id/messages
// ==========================================
export const sendMessageHttp = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { text, topic } = req.body;
    const senderId = req.user._id.toString();

    if (!text || !text.trim()) {
      return next(new AppError('Message text cannot be empty', 400));
    }

    const conv = await Conversation.findById(id);
    if (!conv) {
      return next(new AppError('Conversation not found', 404));
    }

    // Determine recipient
    const isGuest = conv.guestId === senderId;
    let recipientId = isGuest ? conv.hostId : conv.guestId;
    const senderRole = isGuest ? 'guest' : 'host';

    // If host recipient is a host profile ID, resolve the true user ID
    if (isGuest) {
      const hostDoc = await Host.findById(recipientId);
      if (hostDoc && hostDoc.userId) {
        recipientId = hostDoc.userId.toString();
      }
    }

    const newMsg = await Message.create({
      conversationId: id,
      senderId,
      recipientId,
      senderRole,
      topic: topic || 'General question',
      text: text.trim(),
      read: false,
    });

    // Update conversation
    conv.lastMessage = text.trim();
    conv.lastMessageAt = new Date();
    conv.lastSenderId = senderId;
    if (senderRole === 'guest') {
      conv.unreadHost = (conv.unreadHost || 0) + 1;
    } else {
      conv.unreadGuest = (conv.unreadGuest || 0) + 1;
    }
    await conv.save();

    // Populate sender info for response
    const populatedMsg = await Message.findById(newMsg._id).populate('sender', 'name avatar role');

    // Broadcast in real-time via WebSockets to recipient
    emitToUser(recipientId, {
      type: 'new_message',
      message: populatedMsg,
      conversationId: id,
    });

    // Also emit to conv.hostId if different from recipientId
    if (conv.hostId !== recipientId) {
      emitToUser(conv.hostId, {
        type: 'new_message',
        message: populatedMsg,
        conversationId: id,
      });
    }

    // Trigger notification alert on recipient
    emitToUser(recipientId, {
      type: 'notification',
      notification: {
        id: `notif-chat-${newMsg._id}`,
        type: 'chat_message',
        title: `New message from ${req.user.name}`,
        description: text.trim(),
        timestamp: 'Just now',
        link: `/messages/${id}`,
        conversationId: id,
      },
    });

    res.status(201).json({
      success: true,
      data: populatedMsg,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. GET TOTAL UNREAD COUNT
// @route   GET /api/messages/unread-count
// ==========================================
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user._id.toString();
    const hostProfiles = await Host.find({ userId });
    const hostProfileIds = hostProfiles.map((h) => h._id.toString());

    const unreadCount = await Message.countDocuments({
      recipientId: { $in: [userId, ...hostProfileIds] },
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};
