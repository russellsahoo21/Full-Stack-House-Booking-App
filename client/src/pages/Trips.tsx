import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Compass,
  ArrowRight,
  Printer,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Star,
  Sparkles,
  Loader2,
  Receipt,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { bookingsApi, BookingResponse } from '@/services/api';
import { formatPrice } from '@/lib/utils';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { motion, AnimatePresence } from 'framer-motion';

export const Trips: React.FC = () => {
  const { user, openAuthModal } = useAuth();

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  // Cancel modal state
  const [cancellingBooking, setCancellingBooking] = useState<BookingResponse | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Change of travel plans');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState<BookingResponse | null>(null);

  // Fetch bookings
  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsApi.getMyBookings();
      if (res?.data && Array.isArray(res.data)) {
        setBookings(res.data);
      }
    } catch (err: any) {
      console.warn('Could not load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Filter bookings based on active tab and date
  const now = new Date();

  const upcomingBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const checkoutDate = new Date(b.checkOut);
    return checkoutDate >= now && b.status !== 'completed';
  });

  const completedBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const checkoutDate = new Date(b.checkOut);
    return checkoutDate < now || b.status === 'completed';
  });

  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const currentList =
    activeTab === 'upcoming'
      ? upcomingBookings
      : activeTab === 'completed'
      ? completedBookings
      : cancelledBookings;

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    try {
      setCancelLoading(true);
      setCancelError(null);
      await bookingsApi.cancelBooking(cancellingBooking._id, cancelReason);

      // Refresh list
      await loadBookings();
      setCancellingBooking(null);
    } catch (err: any) {
      setCancelError(err?.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Printable Receipt Generator
  const handlePrintReceipt = (booking: BookingResponse) => {
    const listing = booking.listing || (typeof booking.listingId === 'object' ? booking.listingId : null);
    const title = listing?.title || 'Luxury Sanctuary';
    const city = listing?.location?.city || 'India';
    const pricePaid = booking.pricing?.total || booking.pricing?.totalAmount || 0;
    const bookingCode = `WF-${booking._id.slice(-6).toUpperCase()}`;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Wayfound Booking Receipt - ${bookingCode}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .brand { font-size: 26px; font-weight: 800; color: #0f172a; }
            .brand span { color: #FF5A5F; }
            .code { background: #f1f5f9; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; }
            .card { margin-top: 30px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; }
            .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
            .meta { font-size: 13px; color: #64748b; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; padding: 16px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
            .label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
            .val { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 2px; }
            .pricing { margin-top: 20px; }
            .price-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #475569; }
            .price-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #0f172a; padding-top: 12px; border-top: 2px solid #e2e8f0; margin-top: 12px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">wayfound<span>.</span></div>
            <div class="code">Confirmation: ${bookingCode}</div>
          </div>
          <div class="card">
            <div class="title">${title}</div>
            <div class="meta">${city} &bull; ${booking.nights} nights &bull; ${booking.guests?.adults || 1} Guests</div>
            <div class="grid">
              <div>
                <div class="label">Check-In</div>
                <div class="val">${new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} (After 02:00 PM)</div>
              </div>
              <div>
                <div class="label">Check-Out</div>
                <div class="val">${new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} (By 11:00 AM)</div>
              </div>
              <div>
                <div class="label">Primary Guest</div>
                <div class="val">${booking.guestInfo?.name || user?.name || 'Verified Traveler'}</div>
              </div>
              <div>
                <div class="label">Payment Status</div>
                <div class="val" style="color: #16a34a; font-weight: 700;">Paid in Full (${booking.paymentMethod?.toUpperCase() || 'UPI'})</div>
              </div>
            </div>
            <div class="pricing">
              <div class="price-row">
                <span>Accommodation Rate</span>
                <span>₹${(pricePaid - 2000).toLocaleString('en-IN')}</span>
              </div>
              <div class="price-row">
                <span>Sanitization & Cleaning Fee</span>
                <span>₹2,000</span>
              </div>
              <div class="price-total">
                <span>Total Amount Paid</span>
                <span>₹${pricePaid.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          <div class="footer">
            Thank you for booking with Wayfound. For assistance, contact concierge@wayfound.in or +91 1800 200 4500.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(receiptHtml);
      printWin.document.close();
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Guest Reservations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 dark:text-white tracking-tight">
            My Trips & Journeys
          </h1>
          <p className="text-sm text-ink-500 dark:text-warm-400 mt-1">
            Manage your verified reservations, review past escapes, and access check-in details.
          </p>
        </div>

        {/* Explore Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-950 dark:bg-white text-white dark:text-ink-950 text-xs font-bold shadow-sm hover:opacity-90 transition-all self-start sm:self-auto"
        >
          <span>Find more stays</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Unauthenticated State */}
      {!user ? (
        <div className="rounded-3xl p-12 text-center glass-panel border border-warm-200/80 dark:border-white/10 max-w-xl mx-auto my-12 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sunset-gradient-subtle text-sunset-coral flex items-center justify-center mx-auto shadow-sm">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-ink-950 dark:text-white">
            Sign in to access your reservations
          </h3>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 leading-relaxed">
            Your upcoming bookings, check-in instructions, and printable travel receipts are securely synchronized with your Wayfound profile.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-6 py-2.5 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-sm hover:shadow-glow-sunset active:scale-95 transition-all"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-warm-200/60 dark:border-white/10 pb-4 mb-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'bg-warm-100 dark:bg-ink-900 text-ink-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-ink-800'
              }`}
            >
              <span>Upcoming</span>
              <span className="w-5 h-5 rounded-full bg-sunset-coral text-white text-[11px] flex items-center justify-center font-bold">
                {upcomingBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'completed'
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'bg-warm-100 dark:bg-ink-900 text-ink-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-ink-800'
              }`}
            >
              <span>Completed Stays</span>
              <span className="text-xs opacity-70">({completedBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'cancelled'
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'bg-warm-100 dark:bg-ink-900 text-ink-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-ink-800'
              }`}
            >
              <span>Cancelled</span>
              <span className="text-xs opacity-70">({cancelledBookings.length})</span>
            </button>
          </div>

          {/* Bookings List / Loader */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-sunset-coral animate-spin mx-auto" />
              <p className="text-xs text-ink-400 dark:text-warm-500">Loading your reservations...</p>
            </div>
          ) : currentList.length === 0 ? (
            <div className="rounded-3xl p-12 text-center glass-panel border border-warm-200/80 dark:border-white/10 my-8 space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-warm-100 dark:bg-ink-900 flex items-center justify-center text-ink-400 dark:text-warm-500 mx-auto">
                <Compass className="w-7 h-7 stroke-1" />
              </div>
              <h4 className="font-bold text-ink-950 dark:text-white text-lg">
                No {activeTab} journeys found
              </h4>
              <p className="text-xs text-ink-500 dark:text-warm-400">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming trips planned yet. Explore handpicked villas and clifftop retreats."
                  : activeTab === 'completed'
                  ? 'You have not completed any stays with Wayfound yet.'
                  : 'No cancelled reservations.'}
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-sm hover:shadow-glow-sunset transition-all"
                >
                  <span>Explore Stays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentList.map((booking) => {
                const listing =
                  booking.listing ||
                  (typeof booking.listingId === 'object' ? booking.listingId : null);
                const listingId = listing?._id || booking.listingId;
                const title = listing?.title || 'Luxury Sanctuary';
                const image =
                  listing?.images?.[0] ||
                  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';
                const locationCity = listing?.location?.city || 'India';
                const propertyType = listing?.propertyType || 'Villa';
                const pricePaid =
                  booking.pricing?.total || booking.pricing?.totalAmount || 0;
                const confirmationCode = `WF-${booking._id.slice(-6).toUpperCase()}`;

                const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <motion.div
                    key={booking._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row rounded-3xl overflow-hidden glass-panel border border-warm-200/80 dark:border-white/10 shadow-sm hover:shadow-lift transition-all"
                  >
                    {/* Stay Image Thumbnail */}
                    <Link
                      to={`/stay/${listingId}`}
                      className="relative md:w-80 aspect-[16/10] md:aspect-auto overflow-hidden bg-warm-200 dark:bg-ink-800 shrink-0 block group"
                    >
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                        {propertyType}
                      </div>
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono tracking-wider">
                        {confirmationCode}
                      </div>
                    </Link>

                    {/* Booking Details */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Status & City */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="flex items-center gap-1.5 text-xs text-sunset-coral font-semibold">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{locationCity}</span>
                          </span>

                          {booking.status === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                            </span>
                          ) : booking.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800">
                              <XCircle className="w-3.5 h-3.5" /> Cancelled
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <Link to={`/stay/${listingId}`}>
                          <h3 className="text-lg sm:text-xl font-bold text-ink-950 dark:text-white mb-3 hover:text-sunset-coral transition-colors line-clamp-1">
                            {title}
                          </h3>
                        </Link>

                        {/* Date Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-warm-100/70 dark:bg-ink-900/60 border border-warm-200/50 dark:border-white/5 mb-4">
                          <div>
                            <span className="text-[10px] text-ink-400 dark:text-warm-400 font-bold uppercase tracking-wider block">
                              Check-In
                            </span>
                            <span className="text-xs font-extrabold text-ink-950 dark:text-white">
                              {checkInDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-ink-400 dark:text-warm-400 font-bold uppercase tracking-wider block">
                              Check-Out
                            </span>
                            <span className="text-xs font-extrabold text-ink-950 dark:text-white">
                              {checkOutDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-ink-400 dark:text-warm-400 font-bold uppercase tracking-wider block">
                              Guests & Duration
                            </span>
                            <span className="text-xs font-extrabold text-ink-950 dark:text-white">
                              {booking.nights} nights &bull; {booking.guests?.adults || 1} guest(s)
                            </span>
                          </div>
                        </div>

                        {booking.cancellationReason && (
                          <p className="text-xs text-rose-500 mb-3 italic">
                            Reason: {booking.cancellationReason}
                          </p>
                        )}
                      </div>

                      {/* Footer Actions & Price */}
                      <div className="pt-4 border-t border-warm-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] text-ink-400 block font-medium">Total Paid</span>
                          <span className="text-base font-black text-ink-950 dark:text-white">
                            ₹{pricePaid.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Receipt Button */}
                          <button
                            onClick={() => handlePrintReceipt(booking)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-200 text-xs font-semibold hover:border-ink-900 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>

                          {/* Write Review Button (Completed Stays) */}
                          {activeTab === 'completed' && (
                            <button
                              onClick={() => setReviewBooking(booking)}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-sm hover:shadow-glow-sunset active:scale-95 transition-all"
                            >
                              <Star className="w-3.5 h-3.5 fill-white" />
                              <span>Write a Review</span>
                            </button>
                          )}

                          {/* Cancel Reservation Button (Upcoming Only) */}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => setCancellingBooking(booking)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              <span>Cancel</span>
                            </button>
                          )}

                          {/* View Stay Link */}
                          <Link
                            to={`/stay/${listingId}`}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ink-950 dark:bg-white text-white dark:text-ink-950 text-xs font-bold hover:opacity-90 transition-opacity"
                          >
                            <span>View Stay</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancellingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancellingBooking(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-ink-950 rounded-3xl p-6 border border-warm-200 dark:border-white/10 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h4 className="font-extrabold text-lg text-ink-950 dark:text-white">
                  Cancel Reservation?
                </h4>
                <p className="text-xs text-ink-500 dark:text-warm-400 mt-1">
                  Are you sure you want to cancel this reservation? A full refund will be initiated to your original payment method.
                </p>
              </div>

              {cancelError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs">
                  {cancelError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink-700 dark:text-warm-300 mb-1.5">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 dark:border-white/15 bg-white dark:bg-ink-900 text-xs font-medium text-ink-950 dark:text-white focus:outline-none"
                >
                  <option>Change of travel plans</option>
                  <option>Booked by mistake</option>
                  <option>Dates need adjustment</option>
                  <option>Found alternative accommodation</option>
                  <option>Emergency circumstances</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCancellingBooking(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-ink-600 dark:text-warm-300 hover:text-ink-950"
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  disabled={cancelLoading}
                  onClick={handleConfirmCancel}
                  className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  {cancelLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Confirm Cancellation</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Submission Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          listingId={
            reviewBooking.listing?._id ||
            (typeof reviewBooking.listingId === 'object'
              ? reviewBooking.listingId._id
              : reviewBooking.listingId)
          }
          listingTitle={reviewBooking.listing?.title || 'Luxury Sanctuary'}
          listingImage={reviewBooking.listing?.images?.[0]}
          onReviewSubmitted={() => {
            loadBookings();
          }}
        />
      )}
    </div>
  );
};

export default Trips;
