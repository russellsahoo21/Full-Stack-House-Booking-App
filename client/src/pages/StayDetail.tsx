import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockListings } from '@/data/listings';
import { mockHosts } from '@/data/hosts';
import { mockReviews } from '@/data/reviews';
import { Listing, Host, Review } from '@/data/types';
import {
  Star,
  MapPin,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ShieldCheck,
  Award,
  Bed,
  Calendar,
  Users,
  Check,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/utils';
import { listingsApi, reviewsApi, bookingsApi } from '@/services/api';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { motion, AnimatePresence } from 'framer-motion';

export const StayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fallbackStay = mockListings.find((s) => s._id === id) || mockListings[0];
  const fallbackHost = mockHosts[fallbackStay.hostId] || Object.values(mockHosts)[0];
  const fallbackReviews = mockReviews[fallbackStay._id] || mockReviews['stay-1'] || [];

  const [stay, setStay] = useState<Listing>(fallbackStay);
  const [host, setHost] = useState<Host>(fallbackHost);
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    listingsApi
      .getListingById(id)
      .then((res) => {
        if (isMounted && res?.data) {
          setStay(res.data);
          if (res.data.hostId && typeof res.data.hostId === 'object') {
            setHost(res.data.hostId);
          }
        }
      })
      .catch((err) => console.warn('API stay fetch error:', err.message));

    reviewsApi
      .getReviewsByListing(id)
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          setReviews(res.data);
        }
      })
      .catch((err) => console.warn('API reviews fetch error:', err.message));

    bookingsApi
      .getBookedDates(id)
      .then((res) => {
        if (isMounted && res?.bookedDates) {
          setBookedDates(res.bookedDates);
        }
      })
      .catch((err) => console.warn('API booked-dates fetch error:', err.message));

    return () => {
      isMounted = false;
    };
  }, [id]);

  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(stay._id);

  // Lightbox & Modal states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Booking Card States
  const [nights, setNights] = useState(4);
  const [guests, setGuests] = useState(2);
  const [checkInDate, setCheckInDate] = useState('Nov 14');
  const [checkOutDate, setCheckOutDate] = useState('Nov 18');

  // Sticky mini header when scrolling
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowMiniHeader(window.scrollY > 520);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % stay.images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + stay.images.length) % stay.images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, stay.images.length]);

  // Calculations
  const basePrice = stay.price.perNight * nights;
  const serviceFee = Math.round(basePrice * (stay.price.serviceFeePercent / 100));
  const totalPrice = basePrice + stay.price.cleaningFee + serviceFee;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Stay link copied to clipboard!');
    }
  };

  return (
    <div className="pt-24 pb-28 w-full min-h-screen">
      {/* 1. STICKY MINI HEADER ON SCROLL */}
      <AnimatePresence>
        {showMiniHeader && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-warm-200/60 dark:border-white/10 shadow-sm py-3 px-4 sm:px-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <a href="#photos" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                Photos
              </a>
              <a href="#amenities" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                Amenities
              </a>
              <a href="#reviews" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                Reviews
              </a>
              <a href="#location" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                Location
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <span className="font-extrabold text-sm">{formatPrice(stay.price.perNight)}</span>
                <span className="text-xs text-ink-400"> / night</span>
              </div>
              <button
                onClick={() => navigate(`/book/${stay._id}`)}
                className="px-5 py-2.5 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-md hover:shadow-glow-sunset"
              >
                Reserve
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. TITLE & META ACTIONS */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-2">
            {stay.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-ink-500 dark:text-warm-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-bold text-ink-950 dark:text-white">
                <Star className="w-4 h-4 fill-sunset-amber text-sunset-amber" />
                {stay.rating.average}
              </span>
              <span>·</span>
              <span className="underline font-semibold cursor-pointer">{stay.rating.count} reviews</span>
              <span>·</span>
              {stay.guestFavorite && (
                <span className="px-2.5 py-0.5 rounded-full bg-sunset-gradient-subtle text-sunset-coral font-bold text-xs">
                  Guest favourite
                </span>
              )}
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sunset-coral" />
                {stay.location.city}, {stay.location.state}
              </span>
            </div>

            {/* Share & Save Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-warm-200/60 dark:hover:bg-ink-800 transition-colors font-semibold"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={() => toggleWishlist(stay._id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-warm-200/60 dark:hover:bg-ink-800 transition-colors font-semibold"
              >
                <Heart
                  className={`w-4 h-4 ${
                    saved ? 'fill-sunset-coral text-sunset-coral' : ''
                  }`}
                />
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. PHOTO MOSAIC (1 LARGE + 4 SMALL) */}
        <section id="photos" className="relative rounded-3xl overflow-hidden mb-12 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 h-[340px] sm:h-[480px]">
            {/* 1 Large Photo */}
            <div
              onClick={() => {
                setLightboxIndex(0);
                setIsLightboxOpen(true);
              }}
              className="md:col-span-2 h-full cursor-pointer overflow-hidden group relative"
            >
              <img
                src={stay.images[0]}
                alt={stay.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* 4 Smaller Photos in 2 columns */}
            <div className="hidden md:grid grid-cols-2 col-span-2 gap-2.5 h-full">
              {stay.images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setLightboxIndex(idx + 1);
                    setIsLightboxOpen(true);
                  }}
                  className="h-full cursor-pointer overflow-hidden group relative"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* "Show All Photos" Button */}
          <button
            onClick={() => {
              setLightboxIndex(0);
              setIsLightboxOpen(true);
            }}
            className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl glass-panel text-xs font-bold text-ink-900 dark:text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Show all {stay.images.length} photos
          </button>
        </section>

        {/* 4. TWO COLUMN DETAILS + STICKY BOOKING CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: STAY INFORMATION */}
          <div className="lg:col-span-8 space-y-10">
            {/* Host info banner */}
            <div className="flex items-center justify-between pb-8 border-b border-warm-200/60 dark:border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-ink-950 dark:text-white">
                  {stay.roomType} hosted by {host.name}
                </h2>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 mt-1">
                  {stay.maxGuests} guests · {stay.bedrooms} bedrooms · {stay.beds} beds · {stay.bathrooms} baths
                </p>
              </div>
              <img
                src={host.avatar}
                alt={host.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-sunset-coral/40 shrink-0"
              />
            </div>

            {/* Highlights */}
            <div className="space-y-4 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <div className="flex items-start gap-4">
                <Award className="w-5 h-5 text-sunset-coral shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-ink-900 dark:text-white">Experienced Superhost</h4>
                  <p className="text-xs text-ink-500 dark:text-warm-400">
                    {host.name} has 100% 5-star ratings and responds {host.responseTime}.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-sunset-coral shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-ink-900 dark:text-white">Unrivaled Location</h4>
                  <p className="text-xs text-ink-500 dark:text-warm-400">
                    {stay.location.distanceDesc}. 95% of recent guests gave location 5 stars.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-sunset-coral shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-ink-900 dark:text-white">Flexible Cancellation</h4>
                  <p className="text-xs text-ink-500 dark:text-warm-400">
                    {stay.cancellationPolicy}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-warm-200/60 dark:border-white/10">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white mb-3">About this space</h3>
              <p className="text-sm sm:text-base text-ink-700 dark:text-warm-200 leading-relaxed">
                {stay.description}
              </p>
            </div>

            {/* Sleeping Arrangements */}
            <div className="pb-8 border-b border-warm-200/60 dark:border-white/10">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white mb-4">Where you'll sleep</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stay.sleepingArrangements.map((arrangement, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl glass-panel border border-warm-200/80 dark:border-white/10 space-y-2"
                  >
                    <Bed className="w-5 h-5 text-sunset-coral" />
                    <h4 className="font-bold text-sm text-ink-900 dark:text-white">{arrangement.room}</h4>
                    <p className="text-xs text-ink-500 dark:text-warm-400">{arrangement.bedType}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div id="amenities" className="pb-8 border-b border-warm-200/60 dark:border-white/10">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3.5">
                {stay.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-sm text-ink-800 dark:text-warm-200">
                    <Check className="w-4 h-4 text-sunset-coral shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="pb-8 border-b border-warm-200/60 dark:border-white/10">
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-sunset-amber text-sunset-amber" />
                  <h3 className="text-xl font-bold text-ink-950 dark:text-white">
                    {stay.rating.average} · {reviews.length} guest reviews
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-warm-300 dark:border-white/15 text-xs font-bold text-ink-900 dark:text-white hover:border-sunset-coral hover:text-sunset-coral transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-sunset-coral text-sunset-coral" />
                  <span>Write a Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 rounded-2xl glass-panel border border-warm-200/80 dark:border-white/10 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-ink-900 dark:text-white">{rev.userName}</h4>
                        <p className="text-[11px] text-ink-400">{rev.date}</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-700 dark:text-warm-200 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div id="location" className="pb-8">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white mb-3">Where you'll be</h3>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 mb-4">
                {stay.location.area}, {stay.location.city}, {stay.location.country}
              </p>
              <div className="h-64 rounded-3xl overflow-hidden glass-panel border border-warm-200/80 dark:border-white/10 relative flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-sunset-gradient flex items-center justify-center text-white mx-auto shadow-glow-sunset">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold">{stay.location.city}</div>
                  <div className="text-[11px] text-ink-400">{stay.location.distanceDesc}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-warm-300/80 dark:border-white/15 shadow-2xl space-y-5">
              <div className="flex items-baseline justify-between border-b border-warm-200/60 dark:border-white/10 pb-4">
                <div>
                  <span className="text-2xl font-extrabold text-ink-950 dark:text-white">
                    {formatPrice(stay.price.perNight)}
                  </span>
                  <span className="text-xs text-ink-500 dark:text-warm-400 font-normal"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-sunset-amber text-sunset-amber" />
                  <span>{stay.rating.average}</span>
                  <span className="text-ink-400">({stay.rating.count})</span>
                </div>
              </div>

              {/* Booked Dates Badge */}
              {bookedDates.length > 0 && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sunset-gradient-subtle border border-sunset-coral/20 text-sunset-coral text-[11px] font-semibold">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Popular stay &bull; {bookedDates.length} night(s) already reserved</span>
                </div>
              )}

              {/* Date & Guest Input Boxes */}
              <div className="border border-warm-300 dark:border-white/15 rounded-2xl overflow-hidden text-xs">
                <div className="grid grid-cols-2 border-b border-warm-300 dark:border-white/15">
                  <div className="p-3 border-r border-warm-300 dark:border-white/15">
                    <span className="font-bold text-[10px] uppercase text-ink-400 block">Check-in</span>
                    <input
                      type="text"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-transparent font-semibold text-ink-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="p-3">
                    <span className="font-bold text-[10px] uppercase text-ink-400 block">Checkout</span>
                    <input
                      type="text"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-transparent font-semibold text-ink-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[10px] uppercase text-ink-400 block">Guests</span>
                    <span className="font-semibold">{guests} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-6 h-6 rounded-full border border-warm-400 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGuests(Math.min(stay.maxGuests, guests + 1))}
                      className="w-6 h-6 rounded-full border border-warm-400 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => navigate(`/book/${stay._id}`)}
                className="w-full py-4 rounded-full bg-sunset-gradient text-white font-bold text-sm shadow-md hover:shadow-glow-sunset hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Reserve stay
              </button>

              <p className="text-center text-xs text-ink-400">
                You won't be charged yet
              </p>

              {/* Live Price Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-warm-200/60 dark:border-white/10 pt-4">
                <div className="flex justify-between text-ink-700 dark:text-warm-300">
                  <span>{formatPrice(stay.price.perNight)} × {nights} nights</span>
                  <span>{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between text-ink-700 dark:text-warm-300">
                  <span>Cleaning fee</span>
                  <span>{formatPrice(stay.price.cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-ink-700 dark:text-warm-300">
                  <span>Wayfound service fee (12%)</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-ink-950 dark:text-white border-t border-warm-200/60 dark:border-white/10 pt-3">
                  <span>Total before taxes</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FULLSCREEN PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 sm:p-8 select-none"
          >
            <div className="flex items-center justify-between text-white z-10">
              <span className="text-xs font-bold">
                {lightboxIndex + 1} / {stay.images.length}
              </span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <img
                src={stay.images[lightboxIndex]}
                alt=""
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
              />

              <button
                onClick={() =>
                  setLightboxIndex(
                    (prev) => (prev - 1 + stay.images.length) % stay.images.length
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev + 1) % stay.images.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
              {stay.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setLightboxIndex(i)}
                  className={`w-16 h-12 object-cover rounded-lg cursor-pointer transition-all ${
                    lightboxIndex === i
                      ? 'ring-2 ring-sunset-coral scale-105'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-warm-200/80 dark:border-white/10 px-6 py-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="font-bold text-sm sm:text-base">{formatPrice(stay.price.perNight)}</span>
          <span className="text-xs text-ink-400"> / night</span>
          <p className="text-[10px] text-ink-500 underline">{checkInDate} – {checkOutDate}</p>
        </div>
        <button
          onClick={() => navigate(`/book/${stay._id}`)}
          className="px-6 py-3 rounded-full bg-sunset-gradient text-white font-bold text-xs shadow-md"
        >
          Reserve
        </button>
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        listingId={stay._id}
        listingTitle={stay.title}
        listingImage={stay.images[0]}
        onReviewSubmitted={(newRev) => {
          setReviews((prev) => [newRev, ...prev]);
        }}
      />
    </div>
  );
};
export default StayDetail;
