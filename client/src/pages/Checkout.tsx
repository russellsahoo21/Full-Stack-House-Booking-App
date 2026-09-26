import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockListings } from '@/data/listings';
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { listingsApi, bookingsApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';

export const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [stay, setStay] = useState<any>(() => mockListings.find((s) => s._id === id) || mockListings[0]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    listingsApi
      .getListingById(id)
      .then((res) => {
        if (res?.data) setStay(res.data);
      })
      .catch(() => {});
  }, [id]);

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);
    try {
      await bookingsApi.createBooking({
        listingId: stay._id,
        checkIn: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
        guests: { adults: 2, children: 0, infants: 0, pets: 0 },
        guestInfo: {
          name: user?.name || 'Verified Traveler',
          email: user?.email || 'guest@wayfound.in',
          phone: user?.phone || '+91 98765 43210',
        },
      });

      setIsSuccess(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF5A5F', '#FFB347', '#E83E8C'],
        });
      } catch {}
    } catch (err: any) {
      console.warn('Backend booking creation note:', err);
      setBookingError(err?.message || 'Could not complete reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-3">
          You found your way. Pack up.
        </h1>
        <p className="text-sm sm:text-base text-ink-500 dark:text-warm-300 max-w-lg mb-8 leading-relaxed">
          Your reservation at{' '}
          <span className="font-bold text-ink-900 dark:text-white">{stay.title}</span> in{' '}
          {stay.location.city} is confirmed. Details, host check-in guide, and printable receipt are available in your trips.
        </p>
        <div className="flex items-center gap-3.5 flex-wrap justify-center">
          <Link
            to="/trips"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-sunset-gradient text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-glow-sunset hover:scale-105 active:scale-95 transition-all"
          >
            <span>View My Trips</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-200 text-xs font-bold uppercase tracking-wider hover:border-ink-900 transition-colors"
          >
            Explore More Stays
          </Link>
        </div>
      </div>
    );
  }

  const nights = 4;
  const subtotal = stay.price.perNight * nights;
  const serviceFee = Math.round(subtotal * (stay.price.serviceFeePercent / 100));
  const total = subtotal + stay.price.cleaningFee + serviceFee;

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      <Link
        to={`/stay/${stay._id}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-ink-600 dark:text-warm-300 hover:text-sunset-coral mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to stay
      </Link>

      {/* Stepper Progress */}
      <div className="mb-8 flex items-center gap-3 text-xs font-semibold">
        <div className="flex items-center gap-2 text-sunset-coral font-bold">
          <span className="w-6 h-6 rounded-full bg-sunset-gradient text-white flex items-center justify-center text-[11px]">
            1
          </span>
          <span>Review Trip</span>
        </div>
        <div className="w-8 h-px bg-warm-300 dark:bg-white/20" />
        <div className="flex items-center gap-2 text-ink-950 dark:text-white font-bold">
          <span className="w-6 h-6 rounded-full bg-ink-950 dark:bg-white text-white dark:text-ink-950 flex items-center justify-center text-[11px]">
            2
          </span>
          <span>Payment & Protection</span>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-8">
        Confirm and pay
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Trip summary & Payment selector */}
        <div className="md:col-span-7 space-y-6">
          {/* Trip Overview Card */}
          <div className="p-6 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 space-y-4">
            <h3 className="font-bold text-base text-ink-950 dark:text-white">Your trip</h3>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <div>
                <span className="font-bold block text-ink-900 dark:text-white">Dates</span>
                <span className="text-ink-500 dark:text-warm-400">Nov 14 – Nov 18, 2026 ({nights} nights)</span>
              </div>
              <span className="text-xs font-bold text-sunset-coral cursor-pointer underline">Edit</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-t border-warm-200/60 dark:border-white/10 pt-3">
              <div>
                <span className="font-bold block text-ink-900 dark:text-white">Guests</span>
                <span className="text-ink-500 dark:text-warm-400">2 guests</span>
              </div>
              <span className="text-xs font-bold text-sunset-coral cursor-pointer underline">Edit</span>
            </div>
          </div>

          {/* Payment Method Selector Tiles */}
          <div className="p-6 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 space-y-4">
            <h3 className="font-bold text-base text-ink-950 dark:text-white">Choose how to pay</h3>
            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-sunset-coral bg-sunset-coral/5 ring-1 ring-sunset-coral'
                    : 'border-warm-200 dark:border-white/10 hover:border-warm-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="accent-sunset-coral"
                />
                <Smartphone className="w-5 h-5 text-sunset-coral" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-ink-900 dark:text-white">UPI (Google Pay, PhonePe, Paytm)</div>
                  <div className="text-xs text-ink-400">Instant approval with zero surcharge</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-sunset-coral bg-sunset-coral/5 ring-1 ring-sunset-coral'
                    : 'border-warm-200 dark:border-white/10 hover:border-warm-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-sunset-coral"
                />
                <CreditCard className="w-5 h-5 text-sunset-coral" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-ink-900 dark:text-white">Credit or Debit Card</div>
                  <div className="text-xs text-ink-400">Visa, Mastercard, RuPay, Amex</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-sunset-coral bg-sunset-coral/5 ring-1 ring-sunset-coral'
                    : 'border-warm-200 dark:border-white/10 hover:border-warm-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="accent-sunset-coral"
                />
                <Building2 className="w-5 h-5 text-sunset-coral" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-ink-900 dark:text-white">Netbanking</div>
                  <div className="text-xs text-ink-400">All major Indian scheduled banks</div>
                </div>
              </label>
            </div>
          </div>

          {/* Protection Note */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-warm-100/70 dark:bg-ink-900/70 border border-warm-200 dark:border-white/10 text-xs text-ink-600 dark:text-warm-300">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-ink-900 dark:text-white block">Wayfound Protection Included</span>
              Your booking is shielded by our verified host guarantee and round-the-clock traveler support.
            </div>
          </div>

          {bookingError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bookingError}</span>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-sunset-gradient text-white font-bold text-sm shadow-md hover:shadow-glow-sunset hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming reservation...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Confirm and pay {formatPrice(total)}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Sticky Price Breakdown & Listing Card */}
        <div className="md:col-span-5 md:sticky md:top-24">
          <div className="p-6 rounded-3xl glass-panel border border-warm-300/80 dark:border-white/15 shadow-2xl space-y-4">
            <div className="flex gap-4 items-center">
              <img
                src={stay.images[0]}
                alt={stay.title}
                className="w-24 h-24 rounded-2xl object-cover ring-1 ring-black/5"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-sunset-coral uppercase tracking-wider">
                  {stay.propertyType}
                </span>
                <h4 className="font-bold text-sm text-ink-950 dark:text-white truncate">
                  {stay.title}
                </h4>
                <p className="text-xs text-ink-500 dark:text-warm-400 mt-0.5">
                  {stay.location.city}
                </p>
                <div className="text-xs text-ink-700 dark:text-warm-200 mt-1 font-semibold">
                  ★ {stay.rating.average} ({stay.rating.count})
                </div>
              </div>
            </div>

            <div className="border-t border-warm-200/60 dark:border-white/10 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-ink-700 dark:text-warm-300">
                <span>{formatPrice(stay.price.perNight)} × {nights} nights</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-700 dark:text-warm-300">
                <span>Cleaning fee</span>
                <span>{formatPrice(stay.price.cleaningFee)}</span>
              </div>
              <div className="flex justify-between text-ink-700 dark:text-warm-300">
                <span>Wayfound service fee (12%)</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-ink-950 dark:text-white pt-3 border-t border-warm-200/60 dark:border-white/10">
                <span>Total (INR)</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
