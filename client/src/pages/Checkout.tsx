import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
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
import { listingsApi, bookingsApi, paymentsApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';

const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const paramCheckIn = searchParams.get('checkIn');
  const paramCheckOut = searchParams.get('checkOut');
  const paramGuests = searchParams.get('guests');
  const paramNights = searchParams.get('nights');

  const nights = paramNights && parseInt(paramNights, 10) > 0 ? parseInt(paramNights, 10) : 4;
  const guestsCount = paramGuests && parseInt(paramGuests, 10) > 0 ? parseInt(paramGuests, 10) : 2;
  const displayCheckIn = paramCheckIn || 'Nov 14, 2026';
  const displayCheckOut = paramCheckOut || 'Nov 18, 2026';

  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [stay, setStay] = useState<any>(() => mockListings.find((s) => s._id === id) || mockListings[0]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card' | 'netbanking'>('razorpay');
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

    const startDate = new Date(Date.now() + 86400000 * 2);
    const endDate = new Date(startDate.getTime() + 86400000 * nights);
    const checkInStr = startDate.toISOString().split('T')[0];
    const checkOutStr = endDate.toISOString().split('T')[0];

    const guestPayload = {
      name: user?.name || 'Verified Traveler',
      email: user?.email || 'guest@wayfound.in',
      phone: user?.phone || '+91 98765 43210',
    };

    try {
      // 1. Create payment order on backend
      const orderRes = await paymentsApi.createOrder({
        listingId: stay._id,
        nights,
        guests: { adults: guestsCount, children: 0, infants: 0, pets: 0 },
        guestInfo: guestPayload,
        paymentMethod,
      });

      const orderData = orderRes?.data;
      const keyId =
        orderData?.keyId ||
        (import.meta as any).env?.VITE_RAZORPAY_KEY_ID ||
        'rzp_test_VluIVfT6rvYkaJ';

      const scriptLoaded = await loadRazorpay();

      // If Razorpay SDK loaded and we have a valid key, launch Razorpay Checkout modal
      if (scriptLoaded && (window as any).Razorpay && keyId) {
        const rzpOrderId =
          orderData?.razorpayOrder?.id ||
          (orderData?.orderId?.startsWith('order_') ? undefined : orderData?.orderId);

        const options: any = {
          key: keyId,
          amount: Math.round(total * 100),
          currency: 'INR',
          name: 'Wayfound Stay Booking',
          description: `Reservation at ${stay.title}`,
          image: stay.images?.[0] || 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
          order_id: rzpOrderId,
          prefill: {
            name: guestPayload.name,
            email: guestPayload.email,
            contact: guestPayload.phone,
          },
          notes: {
            listingId: stay._id,
            property: stay.title,
            city: stay.location?.city || '',
          },
          theme: {
            color: '#FF5A5F',
          },
          handler: async (response: any) => {
            try {
              setIsSubmitting(true);
              await paymentsApi.verifyPayment({
                orderId: response.razorpay_order_id || orderData?.orderId || rzpOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: response.razorpay_payment_id,
                listingId: stay._id,
                checkIn: checkInStr,
                checkOut: checkOutStr,
                nights,
                guests: { adults: guestsCount, children: 0, infants: 0, pets: 0 },
                guestInfo: guestPayload,
                paymentMethod,
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
            } catch (vErr: any) {
              setBookingError(vErr?.message || 'Payment verification failed. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          console.error('Razorpay payment failed:', resp.error);
          setBookingError(resp.error?.description || 'Payment was declined or failed.');
          setIsSubmitting(false);
        });
        rzp.open();
        return;
      }

      // Fallback: direct booking confirmation if script blocked
      await bookingsApi.createBooking({
        listingId: stay._id,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        nights,
        guests: { adults: guestsCount, children: 0, infants: 0, pets: 0 },
        guestInfo: guestPayload,
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
                <span className="text-ink-500 dark:text-warm-400">
                  {displayCheckIn} – {displayCheckOut} ({nights} nights)
                </span>
              </div>
              <Link to={`/stay/${stay._id}`} className="text-xs font-bold text-sunset-coral hover:underline">
                Edit
              </Link>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-t border-warm-200/60 dark:border-white/10 pt-3">
              <div>
                <span className="font-bold block text-ink-900 dark:text-white">Guests</span>
                <span className="text-ink-500 dark:text-warm-400">{guestsCount} guest{guestsCount > 1 ? 's' : ''}</span>
              </div>
              <Link to={`/stay/${stay._id}`} className="text-xs font-bold text-sunset-coral hover:underline">
                Edit
              </Link>
            </div>
          </div>

          {/* Payment Method Selector Tiles */}
          <div className="p-6 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-ink-950 dark:text-white">Choose how to pay</h3>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Razorpay Gateway Active</span>
              </div>
            </div>
            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-sunset-coral bg-sunset-coral/5 ring-1 ring-sunset-coral'
                    : 'border-warm-200 dark:border-white/10 hover:border-warm-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="accent-sunset-coral"
                />
                <ShieldCheck className="w-5 h-5 text-sunset-coral" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink-900 dark:text-white">Razorpay Secure Checkout</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-sunset-gradient text-white font-bold tracking-wider uppercase">Recommended</span>
                  </div>
                  <div className="text-xs text-ink-400">UPI, Cards, Netbanking, Cred & Wallets with instant verification</div>
                </div>
              </label>

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
