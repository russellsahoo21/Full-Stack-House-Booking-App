import React from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Calendar, Bell, CheckCircle2, Clock, X, AlertTriangle, MessageSquare } from 'lucide-react';

export interface UserNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type:
    | 'upcoming_trip'
    | 'reminder_tomorrow'
    | 'booking_confirmed'
    | 'trip_cancelled'
    | 'property_rejected'
    | 'property_approved'
    | 'chat_message';
  unread: boolean;
  link?: string;
  tripDate?: string;
  stayTitle?: string;
  feedback?: string;
  conversationId?: string;
}

interface UserNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: UserNotification[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpenChat?: (conversationId: string) => void;
}

export const UserNotificationsModal: React.FC<UserNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
  onDismiss,
  onOpenChat,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg my-auto bg-white dark:bg-ink-900 border border-warm-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-warm-200/70 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sunset-gradient-subtle flex items-center justify-center text-sunset-coral">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink-950 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-sunset-coral text-white text-[11px] font-extrabold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-500 dark:text-warm-400">
                Trip alerts, reminders and reservation updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-xs font-bold text-sunset-coral hover:underline mr-1"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-warm-100 dark:hover:bg-ink-800 text-ink-500 dark:text-warm-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-warm-100 dark:divide-white/5 p-2 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-warm-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 dark:text-warm-400 mb-3">
                <Bell className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-ink-900 dark:text-white mb-1">
                You're all caught up!
              </h4>
              <p className="text-xs text-ink-500 dark:text-warm-400 max-w-xs mx-auto">
                Whenever you book a trip, we'll notify you here with reminders before your check-in.
              </p>
            </div>
          ) : (
            notifications.map((item) => {
              const isTomorrow = item.type === 'reminder_tomorrow';
              const isCancelled = item.type === 'trip_cancelled';
              const isRejected = item.type === 'property_rejected';
              const isApproved = item.type === 'property_approved';
              const isChatMessage = item.type === 'chat_message';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNotificationClick(item.id);
                    if (isChatMessage && item.conversationId && onOpenChat) {
                      onClose();
                      onOpenChat(item.conversationId);
                    }
                  }}
                  className={`p-4 rounded-2xl transition-all cursor-pointer group flex items-start gap-3.5 relative ${
                    item.unread
                      ? 'bg-sunset-gradient-subtle/50 dark:bg-white/[0.04] border border-sunset-coral/20'
                      : 'hover:bg-warm-50 dark:hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Icon badge */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isChatMessage
                        ? 'bg-sunset-gradient-subtle text-sunset-coral dark:bg-sunset-coral/20'
                        : isTomorrow
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : isCancelled || isRejected
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : isApproved
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {isChatMessage ? (
                      <MessageSquare className="w-5 h-5 text-sunset-coral" />
                    ) : isTomorrow ? (
                      <Clock className="w-5 h-5" />
                    ) : isCancelled || isRejected ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isApproved ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm truncate ${
                          item.unread
                            ? 'font-bold text-ink-950 dark:text-white'
                            : 'font-semibold text-ink-800 dark:text-warm-200'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-ink-400 dark:text-warm-500 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-ink-600 dark:text-warm-300 leading-relaxed mb-2">
                      {item.description}
                    </p>

                    {isChatMessage && item.conversationId ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          if (onOpenChat) onOpenChat(item.conversationId!);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-sunset-coral hover:underline"
                      >
                        <span>Open Chat</span>
                        <span>&rarr;</span>
                      </button>
                    ) : item.link ? (
                      <Link
                        to={item.link}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-sunset-coral hover:underline"
                      >
                        <span>{isRejected || isApproved ? 'View Property' : 'View Trip Details'}</span>
                        <span>&rarr;</span>
                      </Link>
                    ) : null}
                  </div>

                  {/* Dismiss */}
                  <button
                    type="button"
                    title="Dismiss"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(item.id);
                    }}
                    className="absolute top-4 right-3 text-ink-400 dark:text-warm-500 hover:text-ink-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Unread indicator dot */}
                  {item.unread && (
                    <span className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-sunset-coral" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-warm-50 dark:bg-ink-950/60 border-t border-warm-200/60 dark:border-white/10 flex items-center justify-between text-xs">
          <Link
            to="/trips"
            onClick={onClose}
            className="font-bold text-ink-700 dark:text-warm-200 hover:text-sunset-coral transition-colors"
          >
            Go to My Trips &rarr;
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-full bg-warm-200 dark:bg-ink-800 text-ink-800 dark:text-warm-200 font-semibold hover:bg-warm-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
