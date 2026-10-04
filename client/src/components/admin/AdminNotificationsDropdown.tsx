import React from 'react';
import { Link } from 'react-router-dom';

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'booking' | 'refund' | 'property' | 'review' | 'system';
  unread: boolean;
  link?: string;
}

interface AdminNotificationsDropdownProps {
  notifications: AdminNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (id: string) => void;
  onClearNotification: (id: string) => void;
}

const typeStyles: Record<string, { icon: string; bg: string; color: string }> = {
  booking: {
    icon: 'calendar_clock',
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    color: 'text-amber-700 dark:text-amber-300',
  },
  refund: {
    icon: 'assignment_return',
    bg: 'bg-rose-100 dark:bg-rose-950/60',
    color: 'text-rose-700 dark:text-rose-300',
  },
  property: {
    icon: 'villa',
    bg: 'bg-teal-100 dark:bg-teal-950/60',
    color: 'text-teal-700 dark:text-teal-300',
  },
  review: {
    icon: 'rate_review',
    bg: 'bg-purple-100 dark:bg-purple-950/60',
    color: 'text-purple-700 dark:text-purple-300',
  },
  system: {
    icon: 'notifications',
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    color: 'text-blue-700 dark:text-blue-300',
  },
};

export const AdminNotificationsDropdown: React.FC<AdminNotificationsDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onNotificationClick,
  onClearNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      {/* Background click listener to close */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#e2e8f8]/70 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#171826]">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm text-[#151c27] dark:text-white">
              System Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#b52603] text-white text-[10px] font-extrabold">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-[#b52603] dark:text-[#ff5a36] hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#e2e8f8]/50 dark:divide-white/5 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#555f6f] dark:text-gray-400">
              <span className="material-symbols-outlined text-[32px] text-gray-300 dark:text-gray-600 block mb-2">
                notifications_off
              </span>
              No active alerts. All operations normal!
            </div>
          ) : (
            notifications.map((n) => {
              const meta = typeStyles[n.type] || typeStyles.system;

              const content = (
                <div
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                    n.unread
                      ? 'bg-[#f0f3ff]/80 dark:bg-white/[0.04] hover:bg-[#e7eefe] dark:hover:bg-white/[0.08]'
                      : 'hover:bg-[#f0f3ff]/40 dark:hover:bg-white/[0.02]'
                  }`}
                  onClick={() => onNotificationClick(n.id)}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {meta.icon}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs truncate ${
                          n.unread
                            ? 'font-bold text-[#151c27] dark:text-white'
                            : 'font-medium text-[#555f6f] dark:text-gray-300'
                        }`}
                      >
                        {n.title}
                      </p>
                      <span className="text-[10px] text-[#555f6f] dark:text-gray-400 flex-shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#555f6f] dark:text-gray-400 leading-snug line-clamp-2">
                      {n.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    title="Dismiss alert"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearNotification(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#ba1a1a] p-1 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              );

              return n.link ? (
                <Link
                  key={n.id}
                  to={n.link}
                  onClick={() => {
                    onNotificationClick(n.id);
                    onClose();
                  }}
                  className="block"
                >
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#f0f3ff]/60 dark:bg-white/5 border-t border-[#e2e8f8]/60 dark:border-white/10 text-center">
          <Link
            to="/admin/bookings"
            onClick={onClose}
            className="text-[11px] font-bold text-[#151c27] dark:text-white hover:text-[#b52603] dark:hover:text-[#ff5a36] transition-colors"
          >
            Open Live Action Queue &rarr;
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminNotificationsDropdown;
