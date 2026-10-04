import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Menu, User, Search, LogOut, Trash2, Bell } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingsApi, listingsApi } from '@/services/api';
import {
  UserNotificationsModal,
  UserNotification,
} from '@/components/notifications/UserNotificationsModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  // Load and derive user notifications based on real bookings
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    const fetchUserAlerts = async () => {
      try {
        const res = await bookingsApi.getMyBookings();
        if (res?.data && Array.isArray(res.data)) {
          // Read dismissed/read notification IDs from localStorage
          const userKey = user._id || user.email;
          let readIds: string[] = [];
          try {
            const raw = localStorage.getItem(`wayfound_user_read_ids_${userKey}`);
            if (raw) readIds = JSON.parse(raw);
          } catch {}

          const now = new Date();
          const todayStr = now.toISOString().split('T')[0];

          // Compute tomorrow date string
          const tomorrow = new Date();
          tomorrow.setDate(now.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];

          const alerts: UserNotification[] = [];

          res.data.forEach((b: any) => {
            const listing = b.listing || (typeof b.listingId === 'object' ? b.listingId : null);
            const stayTitle = listing?.title || 'Sanctuary Stay';
            const checkInStr = typeof b.checkIn === 'string' ? b.checkIn.split('T')[0] : '';
            const isConfirmed = b.status === 'confirmed';

            if (b.status === 'cancelled') {
              const notifId = `notif-cancelled-${b._id}`;
              const totalPaid = b.pricing?.total || 0;
              const refundAmount = Math.max(0, totalPaid - 1000);
              alerts.push({
                id: notifId,
                title: 'Booking Cancelled & Refunded',
                description: `Your trip to "${stayTitle}" was cancelled. ₹${refundAmount.toLocaleString('en-IN')} has been automatically refunded to your account (₹1,000 cancellation fee deducted).`,
                timestamp: 'Cancelled',
                type: 'trip_cancelled',
                unread: !readIds.includes(notifId),
                link: '/trips',
                tripDate: checkInStr,
                stayTitle,
              });
            } else if (isConfirmed && checkInStr === tomorrowStr) {
              // Check if trip is scheduled for tomorrow
              const notifId = `notif-tomorrow-${b._id}`;
              alerts.push({
                id: notifId,
                title: 'Trip Scheduled Tomorrow! 🎒',
                description: `Pack your bags! Your stay at "${stayTitle}" begins tomorrow. Check-in starts at 2:00 PM.`,
                timestamp: 'Tomorrow',
                type: 'reminder_tomorrow',
                unread: !readIds.includes(notifId),
                link: '/trips',
                tripDate: checkInStr,
                stayTitle,
              });
            } else if (isConfirmed && checkInStr === todayStr) {
              // Check-in is today
              const notifId = `notif-today-${b._id}`;
              alerts.push({
                id: notifId,
                title: 'Check-in Today! 🔑',
                description: `Welcome! Your reservation at "${stayTitle}" is active today. Contact your host for smooth arrival.`,
                timestamp: 'Today',
                type: 'upcoming_trip',
                unread: !readIds.includes(notifId),
                link: '/trips',
                tripDate: checkInStr,
                stayTitle,
              });
            } else if (isConfirmed && new Date(checkInStr) > now) {
              // Upcoming future trip
              const notifId = `notif-confirmed-${b._id}`;
              alerts.push({
                id: notifId,
                title: 'Reservation Confirmed',
                description: `Your trip to "${stayTitle}" on ${checkInStr} is confirmed and locked in.`,
                timestamp: 'Upcoming',
                type: 'booking_confirmed',
                unread: !readIds.includes(notifId),
                link: '/trips',
                tripDate: checkInStr,
                stayTitle,
              });
            }
          });

          // 2. Fetch host listings alerts (rejections with feedback or approvals)
          try {
            const hostRes = await listingsApi.getMyListings();
            if (hostRes?.data && Array.isArray(hostRes.data)) {
              hostRes.data.forEach((listing: any) => {
                if (listing.status === 'Draft' && (listing.reviewFeedback || listing.rejectionReason)) {
                  const notifId = `notif-property-rejected-${listing._id}`;
                  const feedbackText =
                    listing.reviewFeedback ||
                    listing.rejectionReason ||
                    'Sorry, we could not publish your property at this time. Please update the requested details.';
                  alerts.push({
                    id: notifId,
                    title: 'Property Publication Feedback ⚠️',
                    description: `Notice for "${listing.title}": ${feedbackText}`,
                    timestamp: 'Feedback',
                    type: 'property_rejected',
                    unread: !readIds.includes(notifId),
                    link: `/become-a-host`,
                    stayTitle: listing.title,
                    feedback: feedbackText,
                  });
                } else if (listing.status === 'Published') {
                  const notifId = `notif-property-approved-${listing._id}`;
                  alerts.push({
                    id: notifId,
                    title: 'Property Published Live! ✨',
                    description: `Congratulations! "${listing.title}" has been reviewed, approved, and is now live for guest bookings.`,
                    timestamp: 'Approved',
                    type: 'property_approved',
                    unread: !readIds.includes(notifId),
                    link: `/stay/${listing._id}`,
                    stayTitle: listing.title,
                  });
                }
              });
            }
          } catch (hostErr) {
            // Not a host or no listings yet, ignore
          }

          setNotifications(alerts);
        }
      } catch (err) {
        console.warn('Could not fetch user notifications:', err);
      }
    };

    fetchUserAlerts();

    const handleSync = () => fetchUserAlerts();
    window.addEventListener('wayfound_booking_cancelled', handleSync);
    window.addEventListener('wayfound_property_status_changed', handleSync);
    return () => {
      window.removeEventListener('wayfound_booking_cancelled', handleSync);
      window.removeEventListener('wayfound_property_status_changed', handleSync);
    };
  }, [isAuthenticated, user]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllNotificationsRead = () => {
    if (!user) return;
    const userKey = user._id || user.email;
    const allIds = notifications.map((n) => n.id);
    try {
      localStorage.setItem(
        `wayfound_user_read_ids_${userKey}`,
        JSON.stringify(allIds)
      );
    } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id: string) => {
    if (!user) return;
    const userKey = user._id || user.email;
    try {
      const raw = localStorage.getItem(`wayfound_user_read_ids_${userKey}`);
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem(`wayfound_user_read_ids_${userKey}`, JSON.stringify(list));
      }
    } catch {}
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleDismissNotification = (id: string) => {
    handleNotificationClick(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const isHome = location.pathname === '/';
  const currentTab = location.pathname.startsWith('/experiences')
    ? 'experiences'
    : location.pathname.startsWith('/services')
    ? 'services'
    : 'stays';

  const handleTabClick = (tab: 'stays' | 'experiences' | 'services') => {
    if (tab === 'stays') {
      navigate('/');
    } else if (tab === 'experiences') {
      navigate('/experiences');
    } else if (tab === 'services') {
      navigate('/services');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.45;
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For non-home pages, navbar is always glass
  const showGlass = !isHome || isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showGlass
          ? 'bg-white/75 dark:bg-ink-900/80 backdrop-blur-xl border-b border-warm-200/50 dark:border-white/10 shadow-sm py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <Logo
              size="md"
              colorClass={!showGlass ? 'text-white' : undefined}
            />
          </div>

          {/* Center Tabs or Compact Search Pill */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <AnimatePresence mode="wait">
              {showGlass && isHome ? (
                // Compact Search Pill when scrolled on Home
                <motion.button
                  key="compact-search"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate('/search')}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-pill text-xs font-medium text-ink-700 dark:text-warm-200 shadow-sm hover:shadow-md transition-all border border-warm-300/40 dark:border-white/10"
                >
                  <span className="font-semibold text-ink-900 dark:text-white">Anywhere</span>
                  <span className="w-1 h-1 rounded-full bg-ink-300 dark:bg-ink-600" />
                  <span>Any week</span>
                  <span className="w-1 h-1 rounded-full bg-ink-300 dark:bg-ink-600" />
                  <span className="text-ink-500 dark:text-ink-400">Add guests</span>
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sunset-gradient text-white ml-1">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                </motion.button>
              ) : (
                // Center Experience Tabs
                <motion.div
                  key="nav-tabs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex items-center gap-1 p-1"
                >
                  {(['stays', 'experiences', 'services'] as const).map((tab) => {
                    const isActive = currentTab === tab;
                    const labels = {
                      stays: 'Stays',
                      experiences: 'Experiences',
                      services: 'Services',
                    };

                    return (
                      <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                          isActive
                            ? showGlass
                              ? 'text-ink-900 dark:text-white font-semibold'
                              : 'text-white font-semibold'
                            : showGlass
                            ? 'text-ink-500 dark:text-warm-400 hover:text-ink-900 dark:hover:text-white'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        {labels[tab]}
                        {isActive && (
                          <motion.div
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-sunset-gradient shadow-[0_0_8px_rgba(255,90,95,0.7)]"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/become-a-host"
              className={`hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                showGlass
                  ? 'text-ink-800 dark:text-warm-100 hover:bg-warm-200/60 dark:hover:bg-ink-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Become a host
            </Link>

            {/* Language/Globe icon */}
            <button
              className={`hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                showGlass
                  ? 'text-ink-700 dark:text-warm-200 hover:bg-warm-200/60 dark:hover:bg-ink-800'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Language and currency"
              title="India (INR ₹)"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle
              className={
                !showGlass
                  ? 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                  : ''
              }
            />

              {/* Profile Menu Pill */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`relative flex items-center gap-2.5 p-1.5 pl-3 rounded-full border transition-all shadow-sm ${
                    showGlass
                      ? 'border-warm-300/60 dark:border-white/10 hover:shadow-md bg-white/70 dark:bg-ink-800/70 text-ink-800 dark:text-warm-100'
                      : 'border-white/25 hover:border-white/40 bg-black/20 text-white backdrop-blur-md'
                  }`}
                  aria-label="User menu"
                >
                  <div className="relative">
                    <Menu className="w-4 h-4" />
                    {/* Red dot on three lines menu icon when user has unread notifications */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF5A5F] rounded-full ring-2 ring-white dark:ring-ink-900 animate-pulse" />
                    )}
                  </div>
                  {isAuthenticated && user ? (
                    <UserAvatar name={user.name} size="sm" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-warm-200 dark:bg-white/10 flex items-center justify-center text-ink-600 dark:text-warm-300 text-xs font-bold shadow-sm">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel shadow-xl py-2 z-50 border border-warm-200/80 dark:border-white/10"
                    >
                      {isAuthenticated && user ? (
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2.5 border-b border-warm-200/60 dark:border-white/5 hover:bg-warm-100/60 dark:hover:bg-ink-800/40 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-ink-950 dark:text-white truncate group-hover:text-sunset-coral transition-colors">{user.name}</p>
                            <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sunset-gradient-subtx text-sunset-coral">
                              {user.role === 'admin' ? 'Administrator' : user.role === 'host' ? 'Host' : 'Member'}
                            </span>
                          </div>
                          <p className="text-xs text-ink-500 dark:text-warm-400 truncate">{user.email}</p>
                          <p className="text-[11px] text-sunset-coral font-medium mt-1">Profile & Settings &rarr;</p>
                        </Link>
                      ) : (
                        <div className="px-4 py-2 border-b border-warm-200/60 dark:border-white/5">
                          <p className="text-xs text-ink-400 dark:text-warm-400">Welcome to Wayfound</p>
                          <p className="text-sm font-semibold text-ink-900 dark:text-white">Find your way to stay</p>
                        </div>
                      )}

                      <div className="py-1">
                        {isAuthenticated && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              setIsNotificationsModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors font-semibold group text-left"
                          >
                            <span className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-sunset-coral" />
                              <span>Notifications</span>
                            </span>
                            {unreadCount > 0 ? (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sunset-coral text-white animate-pulse">
                                {unreadCount} new
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-warm-200/70 dark:bg-ink-800 text-ink-500 dark:text-warm-400">
                                {notifications.length}
                              </span>
                            )}
                          </button>
                        )}
                        {!isAuthenticated ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                openAuthModal('login');
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm font-bold text-ink-900 dark:text-white hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                            >
                              Login / Signup
                            </button>
                            <div className="my-1 border-t border-warm-200/60 dark:border-white/5" />
                          </>
                        ) : (
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors font-medium"
                          >
                            <span>Profile & Settings</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-warm-200/70 dark:bg-ink-800 text-ink-600 dark:text-warm-300">
                              Edit
                            </span>
                          </Link>
                        )}

                        {isAuthenticated && (user?.role === 'admin' || user?.email?.includes('admin')) && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-2 text-sm text-[#b52603] dark:text-[#ff5a36] hover:bg-[#ffdad6]/40 dark:hover:bg-[#b52603]/10 transition-colors font-bold"
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                              <span>Admin Portal</span>
                            </span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#b52603] text-white">
                              Portal
                            </span>
                          </Link>
                        )}

                        <Link
                          to="/trips"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors font-medium"
                        >
                          <span>My Trips</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sunset-gradient-subtle text-sunset-coral">
                            Reservations
                          </span>
                        </Link>
                        <Link
                          to="/wishlists"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                        >
                          Wishlists
                        </Link>
                        <Link
                          to="/experiences"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                        >
                          Experiences
                        </Link>
                        <Link
                          to="/services"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                        >
                          Services & Concierge
                        </Link>
                        <Link
                          to="/host"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                        >
                          Host on Wayfound
                        </Link>
                        <Link
                          to="/search"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                        >
                          Explore all stays
                        </Link>

                        {isAuthenticated && (
                          <>
                            <div className="my-1 border-t border-warm-200/60 dark:border-white/5" />
                            <Link
                              to="/profile#danger"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/20 transition-colors font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete account</span>
                            </Link>
                            <button
                              type="button"
                              onClick={async () => {
                                setIsProfileMenuOpen(false);
                                await logout();
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-ink-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors font-medium"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Log out</span>
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          </div>
        </div>
      </div>

      {/* Guest Trip Notifications Modal */}
      <UserNotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onNotificationClick={handleNotificationClick}
        onDismiss={handleDismissNotification}
      />
    </header>
  );
};
