import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Send,
  MessageSquare,
  Search,
  Check,
  CheckCheck,
  Radio,
  Building,
  User,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  ChevronLeft,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConversationItem, MessageItem, messagesApi } from '@/services/api';
import { socketService } from '@/services/socket';
import { useAuth } from '@/context/AuthContext';
import { INQUIRY_TOPICS, InquiryTopicId } from '@/constants/inquiryTopics';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string | null;
  onUnreadChange?: (unreadCount: number) => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  initialConversationId,
  onUnreadChange,
}) => {
  const { user, isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversationId || null
  );
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<InquiryTopicId | ''>('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showMobileList, setShowMobileList] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // 1. Initial conversation selection when opened
  useEffect(() => {
    if (initialConversationId) {
      setActiveConversationId(initialConversationId);
      setShowMobileList(false);
    }
  }, [initialConversationId, isOpen]);

  // 2. Load conversations
  const loadConversations = async () => {
    if (!isAuthenticated) return;
    setIsLoadingConversations(true);
    try {
      const res = await messagesApi.getConversations();
      if (res.success) {
        setConversations(res.data);
        const totalUnread = res.data.reduce((acc, c) => {
          const isGuest = user?._id === c.guestId;
          return acc + (isGuest ? c.unreadGuest : c.unreadHost);
        }, 0);
        if (onUnreadChange) onUnreadChange(totalUnread);

        // If no conversation selected yet, pick first
        if (!activeConversationId && res.data.length > 0 && !initialConversationId) {
          setActiveConversationId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadConversations();
    }
  }, [isOpen, isAuthenticated]);

  // 3. Connect WebSocket & listen to real-time events
  useEffect(() => {
    if (!isOpen || !user) return;

    // Connect WebSocket
    socketService.connect(user._id);
    setIsWsConnected(socketService.isConnected());

    const unsubStatus = socketService.onStatusChange((connected) => {
      setIsWsConnected(connected);
    });

    const unsubMessage = socketService.onMessage((payload) => {
      const { type, message, conversationId } = payload;
      if (type === 'new_message' && message) {
        // Update messages list if in active chat
        if (conversationId === activeConversationId) {
          setMessages((prev) => {
            if (prev.some((m) => m._id === message._id)) return prev;
            return [...prev, message];
          });
          // Mark as read immediately
          socketService.markRead(conversationId, user._id);
        }

        // Update conversations preview
        setConversations((prev) =>
          prev.map((c) => {
            if (c._id === conversationId) {
              const isGuest = user._id === c.guestId;
              const wasActive = conversationId === activeConversationId;
              return {
                ...c,
                lastMessage: message.text,
                lastMessageAt: message.createdAt || new Date().toISOString(),
                lastSenderId: message.senderId,
                unreadGuest:
                  isGuest && !wasActive ? c.unreadGuest + 1 : wasActive ? 0 : c.unreadGuest,
                unreadHost:
                  !isGuest && !wasActive ? c.unreadHost + 1 : wasActive ? 0 : c.unreadHost,
              };
            }
            return c;
          })
        );
      }
    });

    const unsubTyping = socketService.onTyping((payload) => {
      if (payload.conversationId === activeConversationId && payload.senderId !== user._id) {
        if (payload.isTyping) {
          setTypingUser('Typing...');
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
        } else {
          setTypingUser(null);
        }
      }
    });

    return () => {
      unsubStatus();
      unsubMessage();
      unsubTyping();
    };
  }, [isOpen, user, activeConversationId]);

  // 4. Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId || !isOpen) return;

    setIsLoadingMessages(true);
    messagesApi
      .getMessages(activeConversationId)
      .then((res) => {
        if (res.success) {
          setMessages(res.data);
          // Mark as read via WS
          if (user) {
            socketService.markRead(activeConversationId, user._id);
            setConversations((prev) =>
              prev.map((c) => {
                if (c._id === activeConversationId) {
                  const isGuest = user._id === c.guestId;
                  return {
                    ...c,
                    unreadGuest: isGuest ? 0 : c.unreadGuest,
                    unreadHost: !isGuest ? 0 : c.unreadHost,
                  };
                }
                return c;
              })
            );
          }
        }
      })
      .catch((err) => console.warn('Failed to load messages:', err))
      .finally(() => setIsLoadingMessages(false));
  }, [activeConversationId, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Handle typing indicator dispatch
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!activeConversationId || !user) return;
    const activeConv = conversations.find((c) => c._id === activeConversationId);
    if (!activeConv) return;
    const recipientId = user._id === activeConv.guestId ? activeConv.hostId : activeConv.guestId;
    socketService.sendTyping(activeConversationId, user._id, recipientId, true);
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !activeConversationId || !user || isSending) return;

    const activeConv = conversations.find((c) => c._id === activeConversationId);
    if (!activeConv) return;

    const isGuest = user._id === activeConv.guestId;
    const recipientId = isGuest ? activeConv.hostId : activeConv.guestId;
    const senderRole = isGuest ? 'guest' : 'host';
    const topicToSend = selectedTopic || undefined;

    setIsSending(true);

    try {
      // 1. Emit via WebSocket for instant delivery
      socketService.sendMessage({
        conversationId: activeConversationId,
        senderId: user._id,
        recipientId,
        senderRole,
        topic: topicToSend,
        text: trimmed,
      });

      // 2. Also persist via REST API for guaranteed delivery & DB storage
      const res = await messagesApi.sendMessage(activeConversationId, {
        text: trimmed,
        topic: topicToSend,
      });

      if (res.success && res.data) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === res.data._id)) return prev;
          return [...prev, res.data];
        });

        // Update preview in conversations list
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeConversationId
              ? {
                  ...c,
                  lastMessage: trimmed,
                  lastMessageAt: new Date().toISOString(),
                  lastSenderId: user._id,
                }
              : c
          )
        );
      }

      setInputText('');
      setSelectedTopic('');
      socketService.sendTyping(activeConversationId, user._id, recipientId, false);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const activeConv = conversations.find((c) => c._id === activeConversationId);
  const isGuestInActive = user?._id === activeConv?.guestId;
  const counterpart = isGuestInActive ? activeConv?.host : activeConv?.guest;
  const counterpartRole = isGuestInActive ? 'Host' : 'Guest';

  const filteredConversations = conversations.filter((c) => {
    const isGuest = user?._id === c.guestId;
    const otherUser = isGuest ? c.host : c.guest;
    const matchName = otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTitle = c.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLast = c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchName || matchTitle || matchLast;
  });

  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case 'Ask questions before booking':
        return <HelpCircle className="w-3.5 h-3.5 text-sunset-coral" />;
      case 'Ask about amenities':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'Confirm check-in/check-out details':
        return <Clock className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Ask about house rules':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />;
      case 'Share special requirements':
        return <HeartHandshake className="w-3.5 h-3.5 text-purple-500" />;
      case 'Discuss problems during the stay':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-sunset-coral" />;
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-hidden p-2 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl h-[88vh] bg-white dark:bg-ink-950 border border-warm-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-warm-200/70 dark:border-white/10 flex items-center justify-between bg-warm-50/60 dark:bg-ink-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sunset-gradient-subtle flex items-center justify-center text-sunset-coral">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-ink-950 dark:text-white">
                  Airbnb Messages
                </h2>
                {/* WebSocket Status Indicator */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isWsConnected
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  }`}
                  title={isWsConnected ? 'Connected via WebSockets' : 'Connecting to WebSockets...'}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isWsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <span>{isWsConnected ? 'Live WS' : 'Connecting'}</span>
                </div>
              </div>
              <p className="text-xs text-ink-500 dark:text-warm-400">
                Direct guest & host communication with live sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadConversations}
              className="p-2 rounded-full text-ink-500 hover:text-ink-900 dark:text-warm-400 dark:hover:text-white hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
              title="Refresh conversations"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingConversations ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-ink-400 hover:text-ink-700 dark:text-warm-400 dark:hover:text-white hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area: Two Panes */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT COLUMN: CONVERSATION LIST */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-warm-200/70 dark:border-white/10 flex flex-col bg-warm-50/30 dark:bg-ink-900/30 ${
              !showMobileList ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search Bar */}
            <div className="p-3.5 border-b border-warm-200/60 dark:border-white/10">
              <div className="relative">
                <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or property..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-ink-800 border border-warm-200 dark:border-white/10 text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-warm-200/40 dark:divide-white/5">
              {isLoadingConversations && conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-400 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-sunset-coral/30 border-t-sunset-coral rounded-full animate-spin" />
                  <span>Loading conversations...</span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-400 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-ink-300 dark:text-ink-700" />
                  <p className="font-semibold text-ink-600 dark:text-warm-300">No conversations</p>
                  <p>Inquire with any host on a property page to start a chat thread.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isGuest = user?._id === conv.guestId;
                  const otherUser = isGuest ? conv.host : conv.guest;
                  const unread = isGuest ? conv.unreadGuest : conv.unreadHost;
                  const isSelected = conv._id === activeConversationId;

                  return (
                    <button
                      key={conv._id}
                      onClick={() => {
                        setActiveConversationId(conv._id);
                        setShowMobileList(false);
                      }}
                      className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                        isSelected
                          ? 'bg-sunset-gradient-subtle dark:bg-sunset-coral/10 border-l-4 border-sunset-coral'
                          : 'hover:bg-warm-100/60 dark:hover:bg-ink-800/40'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {otherUser?.avatar ? (
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.name || 'User'}
                            className="w-11 h-11 rounded-full object-cover ring-1 ring-warm-200 dark:ring-white/10"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-sunset-gradient-subtle text-sunset-coral flex items-center justify-center font-bold text-sm">
                            {otherUser?.name?.[0] || 'U'}
                          </div>
                        )}
                        {unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-sunset-coral text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                            {unread}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4
                            className={`text-xs sm:text-sm font-bold truncate ${
                              isSelected ? 'text-sunset-coral' : 'text-ink-950 dark:text-white'
                            }`}
                          >
                            {otherUser?.name || 'Wayfound Host'}
                          </h4>
                          <span className="text-[10px] text-ink-400 shrink-0 font-medium">
                            {conv.lastMessageAt
                              ? new Date(conv.lastMessageAt).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : ''}
                          </span>
                        </div>

                        {/* Listing Title */}
                        {conv.listing && (
                          <p className="text-[11px] font-semibold text-sunset-coral truncate mb-0.5">
                            {conv.listing.title}
                          </p>
                        )}

                        {/* Last message */}
                        <p
                          className={`text-xs truncate ${
                            unread > 0
                              ? 'font-bold text-ink-900 dark:text-white'
                              : 'text-ink-500 dark:text-warm-400'
                          }`}
                        >
                          {conv.lastMessage || 'New inquiry conversation started'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIVE CHAT ROOM */}
          <div
            className={`flex-1 flex flex-col bg-white dark:bg-ink-950 ${
              showMobileList ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConv ? (
              <>
                {/* Active Chat Header */}
                <div className="px-5 py-3 border-b border-warm-200/60 dark:border-white/10 flex items-center justify-between bg-warm-50/40 dark:bg-ink-900/40">
                  <div className="flex items-center gap-3">
                    {/* Mobile back to list */}
                    <button
                      onClick={() => setShowMobileList(true)}
                      className="md:hidden p-1.5 rounded-full hover:bg-warm-100 dark:hover:bg-ink-800 text-ink-600 dark:text-warm-300"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      {counterpart?.avatar ? (
                        <img
                          src={counterpart.avatar}
                          alt={counterpart.name || 'User'}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-sunset-coral/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-sunset-gradient-subtle text-sunset-coral flex items-center justify-center font-bold">
                          {counterpart?.name?.[0] || 'U'}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-ink-900 rounded-full" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-ink-950 dark:text-white">
                          {counterpart?.name || 'Wayfound Host'}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-warm-100 dark:bg-ink-800 text-ink-600 dark:text-warm-300">
                          {counterpartRole}
                        </span>
                      </div>
                      {typingUser ? (
                        <p className="text-[11px] text-sunset-coral font-semibold animate-pulse">
                          {typingUser}
                        </p>
                      ) : (
                        <p className="text-[11px] text-ink-400">
                          Active now · Real-time WebSocket
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Property Banner Link */}
                  {activeConv.listing && (
                    <Link
                      to={`/stay/${activeConv.listing._id}`}
                      target="_blank"
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warm-100/80 dark:bg-ink-800 border border-warm-200/60 dark:border-white/10 hover:border-sunset-coral transition-colors text-xs font-semibold text-ink-700 dark:text-warm-200"
                    >
                      <Building className="w-3.5 h-3.5 text-sunset-coral" />
                      <span className="truncate max-w-[150px]">{activeConv.listing.title}</span>
                      <ExternalLink className="w-3 h-3 text-ink-400" />
                    </Link>
                  )}
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="w-6 h-6 border-2 border-sunset-coral/30 border-t-sunset-coral rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-ink-400 space-y-2">
                      <MessageSquare className="w-10 h-10 mx-auto text-ink-300 dark:text-ink-700" />
                      <p className="text-sm font-bold text-ink-700 dark:text-warm-300">
                        No messages yet
                      </p>
                      <p className="text-xs">
                        Start the conversation by choosing an inquiry topic below or typing your question.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === user?._id;
                      const timeStr = msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '';

                      return (
                        <div
                          key={msg._id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          {/* Topic Badge if exists */}
                          {msg.topic && (
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1 shadow-sm ${
                                isMe
                                  ? 'bg-sunset-gradient-subtle text-sunset-coral border border-sunset-coral/30'
                                  : 'bg-warm-100 dark:bg-ink-800 text-ink-700 dark:text-warm-300 border border-warm-200 dark:border-white/10'
                              }`}
                            >
                              {getTopicIcon(msg.topic)}
                              <span>{msg.topic}</span>
                            </div>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm break-words leading-relaxed ${
                              isMe
                                ? 'bg-sunset-gradient text-white rounded-br-none'
                                : 'bg-warm-100/90 dark:bg-ink-800/90 text-ink-950 dark:text-white rounded-bl-none border border-warm-200/50 dark:border-white/5'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>

                          {/* Timestamp & read receipts */}
                          <div
                            className={`flex items-center gap-1 mt-1 text-[10px] ${
                              isMe ? 'text-ink-400' : 'text-ink-400'
                            }`}
                          >
                            <span>{timeStr}</span>
                            {isMe && (
                              <span>
                                {msg.read ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-sunset-coral inline" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-ink-400 inline" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Topic Chips Bar */}
                <div className="px-4 py-2 bg-warm-50/70 dark:bg-ink-900/60 border-t border-warm-200/60 dark:border-white/5 overflow-x-auto flex items-center gap-2 scrollbar-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-400 shrink-0">
                    Topic:
                  </span>
                  {INQUIRY_TOPICS.map((topic) => {
                    const isSelected = selectedTopic === topic.id;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopic(isSelected ? '' : topic.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                          isSelected
                            ? 'bg-sunset-coral text-white shadow-sm'
                            : 'bg-white dark:bg-ink-800 border border-warm-200/80 dark:border-white/10 text-ink-700 dark:text-warm-300 hover:border-sunset-coral'
                        }`}
                      >
                        {getTopicIcon(topic.icon)}
                        <span>{topic.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Input Area */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3.5 border-t border-warm-200/70 dark:border-white/10 bg-white dark:bg-ink-950 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder={
                      selectedTopic
                        ? `Ask regarding "${selectedTopic}"...`
                        : `Message ${counterpart?.name || 'host'}...`
                    }
                    className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl bg-warm-50 dark:bg-ink-900 border border-warm-200 dark:border-white/10 text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="p-3 rounded-2xl bg-sunset-gradient text-white shadow-md hover:shadow-glow-sunset disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-ink-400 space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-sunset-gradient-subtle flex items-center justify-center text-sunset-coral">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-ink-900 dark:text-white">
                  Select a Conversation
                </h3>
                <p className="text-xs max-w-sm">
                  Choose a conversation from the left to read messages, ask questions, and chat directly with your host.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
