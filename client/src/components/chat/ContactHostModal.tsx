import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Send,
  HelpCircle,
  Sparkles,
  Clock,
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Building,
} from 'lucide-react';
import { INQUIRY_TOPICS, InquiryTopicId } from '@/constants/inquiryTopics';
import { messagesApi } from '@/services/api';
import { socketService } from '@/services/socket';
import { useAuth } from '@/context/AuthContext';

interface ContactHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    _id: string;
    title: string;
    images?: string[];
    price?: { perNight: number };
    location?: { city: string; state?: string };
    roomType?: string;
  };
  host: {
    _id?: string;
    name: string;
    avatar?: string;
    responseTime?: string;
  };
  onOpenChat: (conversationId: string) => void;
}

export const ContactHostModal: React.FC<ContactHostModalProps> = ({
  isOpen,
  onClose,
  listing,
  host,
  onOpenChat,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<InquiryTopicId>(
    'Ask questions before booking'
  );
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectTopic = (topic: (typeof INQUIRY_TOPICS)[number]) => {
    setSelectedTopic(topic.id);
    if (!messageText.trim() || INQUIRY_TOPICS.some((t) => messageText === t.template)) {
      setMessageText(topic.template);
    }
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle className="w-4 h-4 text-sunset-coral" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-purple-500" />;
      case 'AlertCircle':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-sunset-coral" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      openAuthModal('login');
      return;
    }

    const trimmed = messageText.trim();
    if (!trimmed) {
      setErrorMsg('Please write your question or inquiry.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await messagesApi.getOrCreateConversation({
        listingId: listing._id,
        hostId: host._id,
        initialMessage: trimmed,
        topic: selectedTopic,
      });

      if (response?.success && response.data) {
        // Also inform WebSocket server if active
        if (socketService.isConnected()) {
          socketService.sendMessage({
            conversationId: response.data._id,
            senderId: user._id,
            recipientId: host._id || response.data.hostId,
            senderRole: 'guest',
            topic: selectedTopic,
            text: trimmed,
          });
        }

        onClose();
        onOpenChat(response.data._id);
      } else {
        throw new Error('Could not start conversation with host.');
      }
    } catch (err: any) {
      console.error('Contact host error:', err);
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl my-auto bg-white dark:bg-ink-900 border border-warm-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-warm-200/70 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sunset-coral to-sunset-amber text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-sunset-coral/50 uppercase">
                {host.name?.trim()?.charAt(0) || 'H'}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-ink-900 rounded-full" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink-950 dark:text-white flex items-center gap-2">
                Ask {host.name} a question
              </h3>
              <p className="text-xs text-ink-500 dark:text-warm-400">
                Host responds {host.responseTime || 'within an hour'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-ink-400 hover:text-ink-700 dark:text-warm-400 dark:hover:text-white hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing preview banner */}
        <div className="px-5 py-3.5 bg-warm-50 dark:bg-ink-950/60 border-b border-warm-200/60 dark:border-white/5 flex items-center gap-3">
          {listing.images && listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-warm-200 dark:bg-ink-800 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6 text-sunset-coral" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-sunset-coral uppercase tracking-wider">
              {listing.roomType || 'Entire Place'}
            </p>
            <p className="text-sm font-bold text-ink-900 dark:text-white truncate">
              {listing.title}
            </p>
            {listing.location && (
              <p className="text-xs text-ink-500 dark:text-warm-400 truncate">
                {listing.location.city}
              </p>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Inquiry Topic Selection Grid */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-500 dark:text-warm-400 mb-2.5">
              Select inquiry topic
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INQUIRY_TOPICS.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-sunset-coral bg-sunset-gradient-subtle ring-1 ring-sunset-coral shadow-sm dark:bg-sunset-coral/10'
                        : 'border-warm-200 dark:border-white/10 hover:border-warm-400 dark:hover:border-white/20 bg-warm-50/50 dark:bg-ink-800/40'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getTopicIcon(topic.icon)}</div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold leading-tight ${
                          isSelected
                            ? 'text-sunset-coral dark:text-rose-400'
                            : 'text-ink-900 dark:text-white'
                        }`}
                      >
                        {topic.label}
                      </p>
                      <p className="text-[11px] text-ink-400 dark:text-warm-400 leading-snug mt-0.5">
                        {topic.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-ink-500 dark:text-warm-400">
                Your message to the host
              </label>
              <span className="text-[11px] text-ink-400">
                {messageText.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write your question, dates of interest, or requirements..."
              className="w-full px-4 py-3 rounded-2xl bg-warm-50 dark:bg-ink-800/80 border border-warm-200 dark:border-white/10 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 dark:placeholder:text-warm-500 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 resize-none transition-all shadow-inner"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-warm-200/60 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-warm-300 dark:border-white/15 text-xs font-bold text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !messageText.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-md hover:shadow-glow-sunset disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send to Host</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
