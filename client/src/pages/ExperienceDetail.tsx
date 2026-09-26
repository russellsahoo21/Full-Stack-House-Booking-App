import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockExperiences, Experience } from '@/data/experiences';
import { experiencesApi } from '@/services/api';
import {
  Star,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ShieldCheck,
  Award,
  Calendar,
  Building2,
  Check,
  Compass,
  MessageCircle,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const ExperienceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find experience or fallback
  const fallbackExp: Experience = mockExperiences.find((e) => e._id === id) || mockExperiences[0];
  const [exp, setExp] = useState<Experience>(fallbackExp);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    experiencesApi
      .getExperienceById(id)
      .then((res) => {
        if (isMounted && res?.data) {
          setExp(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [id]);

  // UI state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Booking states
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('09:30 AM');
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  // Parse max guests from groupSize string if possible (e.g. "Max 6 guests" -> 6)
  const maxGuestsMatch = exp.groupSize.match(/\d+/);
  const maxGuests = maxGuestsMatch ? parseInt(maxGuestsMatch[0], 10) : 8;

  // Scroll listener for sticky mini header
  useEffect(() => {
    const handleScroll = () => {
      setShowMiniHeader(window.scrollY > 480);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % exp.images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + exp.images.length) % exp.images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, exp.images.length]);

  // Pricing calculations
  const basePrice = exp.pricePerPerson * guestsCount;
  const serviceFee = Math.round(basePrice * 0.1);
  const grandTotal = basePrice + serviceFee;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handleBook = () => {
    setBookingSuccess(true);
    try {
      confetti({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5A5F', '#FFB347', '#E83E8C', '#22C55E'],
      });
    } catch {}
  };

  const availableTimes = ['09:30 AM', '02:00 PM', '05:30 PM'];
  const dateOptions = [
    { label: 'Tomorrow', sub: 'Spots available' },
    { label: 'This Sat', sub: 'Fast filling' },
    { label: 'This Sun', sub: 'Available' },
    { label: 'Next Weekend', sub: 'Available' },
  ];

  return (
    <div className="pt-24 pb-28 w-full min-h-screen relative">
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
              <a href="#venue" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                House & Venue
              </a>
              <a href="#itinerary" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                Itinerary
              </a>
              <a href="#reviews" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                Reviews
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <span className="font-extrabold text-sm text-ink-950 dark:text-white">
                  {formatPrice(exp.pricePerPerson)}
                </span>
                <span className="text-xs text-ink-400"> / guest</span>
              </div>
              <button
                onClick={() => {
                  const card = document.getElementById('booking-card');
                  if (card) {
                    card.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleBook();
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-md hover:shadow-glow-sunset active:scale-95 transition-all"
              >
                Reserve spot
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-ink-950 text-white dark:bg-white dark:text-ink-950 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-ink-500 dark:text-warm-400">
          <Link
            to="/experiences"
            className="inline-flex items-center gap-1 hover:text-sunset-coral transition-colors font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> All Experiences
          </Link>
          <span>/</span>
          <span className="text-ink-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
            {exp.title}
          </span>
        </div>

        {/* 2. TITLE & META ACTIONS */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{exp.category} Masterclass</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-2">
            {exp.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-ink-500 dark:text-warm-400">
            <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
              <span className="flex items-center gap-1 font-bold text-ink-950 dark:text-white">
                <Star className="w-4 h-4 fill-sunset-amber text-sunset-amber" />
                {exp.rating}
              </span>
              <span>·</span>
              <a href="#reviews" className="underline font-semibold cursor-pointer hover:text-sunset-coral">
                {exp.reviewCount} reviews
              </a>
              <span>·</span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-sunset-coral" />
                {exp.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-ink-400" />
                {exp.duration}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-ink-400" />
                {exp.groupSize}
              </span>
            </div>

            {/* Share & Save Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-warm-200/60 dark:hover:bg-ink-800 transition-colors font-semibold text-xs text-ink-700 dark:text-warm-300"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-warm-200/60 dark:hover:bg-ink-800 transition-colors font-semibold text-xs text-ink-700 dark:text-warm-300"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isSaved ? 'fill-sunset-coral text-sunset-coral' : ''
                  }`}
                />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. PHOTO MOSAIC & GALLERY (1 LARGE + 4 SMALL) */}
        <section id="photos" className="relative rounded-3xl overflow-hidden mb-12 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 h-[320px] sm:h-[460px]">
            {/* 1 Large Photo */}
            <div
              onClick={() => {
                setLightboxIndex(0);
                setIsLightboxOpen(true);
              }}
              className="md:col-span-2 h-full cursor-pointer overflow-hidden group relative"
            >
              <img
                src={exp.images[0] || exp.image}
                alt={exp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* 4 Smaller Photos in 2 columns */}
            <div className="hidden md:grid grid-cols-2 col-span-2 gap-2.5 h-full">
              {exp.images.slice(1, 5).map((img, idx) => (
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
                    alt={`${exp.title} photo ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
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
            Show all {exp.images.length} photos
          </button>
        </section>

        {/* 4. TWO COLUMN DETAILS + STICKY BOOKING CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: EXPERIENCE INFORMATION & HOUSE DETAILS */}
          <div className="lg:col-span-8 space-y-12">
            {/* Host info banner */}
            <div className="flex items-center justify-between pb-8 border-b border-warm-200/60 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Master Host
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-ink-950 dark:text-white">
                  Experience hosted by {exp.hostName}
                </h2>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 mt-1 max-w-xl leading-relaxed">
                  {exp.hostBio}
                </p>
              </div>
              <img
                src={exp.hostAvatar}
                alt={exp.hostName}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-sunset-coral/40 shrink-0 ml-4"
              />
            </div>

            {/* DEDICATED HOUSE / VENUE HERITAGE SECTION */}
            <section id="venue" className="p-6 sm:p-8 rounded-3xl bg-warm-100/70 dark:bg-ink-900/60 border border-warm-200 dark:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-sunset-gradient opacity-10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sunset-gradient text-white flex items-center justify-center shrink-0 shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sunset-coral">
                    {exp.venueType}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-ink-950 dark:text-white tracking-tight">
                    {exp.venueName}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-ink-600 dark:text-warm-300 leading-relaxed mb-6">
                {exp.venueDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-warm-200/80 dark:border-white/10">
                <div className="p-3.5 rounded-2xl bg-card/80 border border-warm-200/60 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Access</span>
                  <p className="text-xs font-bold text-ink-900 dark:text-white mt-0.5">Private Private Grounds</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-card/80 border border-warm-200/60 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Atmosphere</span>
                  <p className="text-xs font-bold text-ink-900 dark:text-white mt-0.5">Historical & Immersive</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-card/80 border border-warm-200/60 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Setting</span>
                  <p className="text-xs font-bold text-ink-900 dark:text-white mt-0.5">{exp.location}</p>
                </div>
              </div>
            </section>

            {/* Experience Highlights & Key Badges */}
            <div className="space-y-4 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white">
                What makes this extraordinary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {exp.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-warm-200/60 dark:border-white/10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-ink-800 dark:text-warm-200">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Narrative */}
            <div className="space-y-4 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white">
                About this experience
              </h3>
              <p className="text-sm sm:text-base text-ink-600 dark:text-warm-300 leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>

            {/* STEP-BY-STEP ITINERARY */}
            <section id="itinerary" className="space-y-6 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <div>
                <span className="text-xs font-bold text-sunset-coral uppercase tracking-wider">
                  Timeline Breakdown
                </span>
                <h3 className="text-xl font-bold text-ink-950 dark:text-white mt-0.5">
                  Your curated itinerary
                </h3>
              </div>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-sunset-coral/30 space-y-8 my-4">
                {exp.itinerary.map((step) => (
                  <div key={step.step} className="relative group">
                    {/* Glowing Bullet */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-sunset-coral text-white text-[11px] font-bold flex items-center justify-center ring-4 ring-background shadow-sm">
                      {step.step}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-warm-200/70 dark:bg-ink-800 text-ink-600 dark:text-warm-300">
                          {step.time}
                        </span>
                        <h4 className="text-base font-bold text-ink-950 dark:text-white">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* WHAT'S INCLUDED */}
            <div className="space-y-4 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white">
                What's included in your reservation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exp.included.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-ink-700 dark:text-warm-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REVIEWS & RATINGS */}
            <section id="reviews" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-warm-200/70 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-sunset-gradient-subtle text-sunset-coral flex items-center justify-center">
                    <Star className="w-7 h-7 fill-sunset-amber text-sunset-amber" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-ink-950 dark:text-white">
                        {exp.rating}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        Top Rated Experience
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 dark:text-warm-400">
                      Based on {exp.reviewCount} verified guest reviews
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-ink-500 dark:text-warm-400">
                  <div>
                    <span className="block font-bold text-ink-900 dark:text-white text-sm">100%</span>
                    <span>Hospitality</span>
                  </div>
                  <div>
                    <span className="block font-bold text-ink-900 dark:text-white text-sm">4.99</span>
                    <span>Authenticity</span>
                  </div>
                  <div>
                    <span className="block font-bold text-ink-900 dark:text-white text-sm">4.97</span>
                    <span>Venue</span>
                  </div>
                </div>
              </div>

              {/* Review Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exp.reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-card border border-warm-200/60 dark:border-white/5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-warm-300"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-ink-900 dark:text-white">
                            {rev.author}
                          </h4>
                          <span className="text-[11px] text-ink-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-sunset-amber text-sunset-amber" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-ink-600 dark:text-warm-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD */}
          <div className="lg:col-span-4 sticky top-28" id="booking-card">
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-warm-200/80 dark:border-white/10 space-y-6">
              {/* Price Header */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-ink-950 dark:text-white">
                    {formatPrice(exp.pricePerPerson)}
                  </span>
                  <span className="text-xs text-ink-400 font-medium"> / guest</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-ink-900 dark:text-white">
                  <Star className="w-3.5 h-3.5 fill-sunset-amber text-sunset-amber" />
                  <span>{exp.rating}</span>
                  <span className="text-ink-400 font-normal">({exp.reviewCount})</span>
                </div>
              </div>

              {bookingSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-extrabold text-ink-950 dark:text-white">
                    Reservation Confirmed!
                  </h4>
                  <p className="text-xs text-ink-500 dark:text-warm-300 leading-relaxed">
                    You're booked for <span className="font-bold text-ink-900 dark:text-white">{guestsCount} guests</span> on{' '}
                    <span className="font-bold text-ink-900 dark:text-white">{selectedDate} ({selectedTime})</span> at {exp.venueName}.
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="mt-4 px-5 py-2 rounded-full border border-warm-300 dark:border-white/20 text-xs font-bold text-ink-800 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
                  >
                    Modify booking
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Select Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-700 dark:text-warm-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sunset-coral" /> Select Date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {dateOptions.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setSelectedDate(opt.label)}
                          className={`p-2.5 rounded-2xl text-left border transition-all ${
                            selectedDate === opt.label
                              ? 'border-sunset-coral bg-sunset-coral/10 text-sunset-coral shadow-sm'
                              : 'border-warm-200 dark:border-white/10 hover:border-warm-400 dark:hover:border-white/30 text-ink-800 dark:text-warm-200'
                          }`}
                        >
                          <div className="text-xs font-bold">{opt.label}</div>
                          <div className="text-[10px] text-ink-400">{opt.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Session / Time Slot */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-700 dark:text-warm-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sunset-coral" /> Select Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                            selectedTime === t
                              ? 'border-sunset-coral bg-sunset-coral/10 text-sunset-coral shadow-sm'
                              : 'border-warm-200 dark:border-white/10 hover:border-warm-400 dark:hover:border-white/30 text-ink-700 dark:text-warm-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Guests Stepper */}
                  <div className="p-3 rounded-2xl bg-card border border-warm-200/80 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-ink-900 dark:text-white block">
                        Number of Guests
                      </span>
                      <span className="text-[10px] text-ink-400">
                        {exp.groupSize}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuestsCount((prev) => Math.max(1, prev - 1))}
                        disabled={guestsCount <= 1}
                        className="w-8 h-8 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-extrabold text-ink-950 dark:text-white w-4 text-center">
                        {guestsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuestsCount((prev) => Math.min(maxGuests, prev + 1))}
                        disabled={guestsCount >= maxGuests}
                        className="w-8 h-8 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-3 border-t border-warm-200/60 dark:border-white/10 text-xs">
                    <div className="flex justify-between text-ink-600 dark:text-warm-300">
                      <span>{formatPrice(exp.pricePerPerson)} × {guestsCount} guests</span>
                      <span className="font-semibold">{formatPrice(basePrice)}</span>
                    </div>
                    <div className="flex justify-between text-ink-600 dark:text-warm-300">
                      <span>Artisan prep & venue service fee (10%)</span>
                      <span className="font-semibold">{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="pt-3 border-t border-warm-200/80 dark:border-white/10 flex justify-between font-extrabold text-ink-950 dark:text-white text-base">
                      <span>Total</span>
                      <span className="text-sunset-coral">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <button
                    onClick={handleBook}
                    className="w-full py-3.5 rounded-2xl bg-sunset-gradient text-white font-bold text-sm shadow-md hover:shadow-glow-sunset active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Reserve spot for {guestsCount} guest{guestsCount > 1 ? 's' : ''}</span>
                  </button>

                  {/* Guarantees */}
                  <div className="space-y-2 pt-2 text-[11px] text-ink-500 dark:text-warm-400">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Free cancellation up to 48 hours in advance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-sunset-coral shrink-0" />
                      <span>Wayfound Experience Quality Guarantee</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/80 text-sm font-semibold z-50">
              {lightboxIndex + 1} / {exp.images.length}
            </div>

            {/* Prev Button */}
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev - 1 + exp.images.length) % exp.images.length)
              }
              className="absolute left-6 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Image display */}
            <div className="max-w-5xl max-h-[80vh] px-4 flex items-center justify-center">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                src={exp.images[lightboxIndex]}
                alt=""
                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev + 1) % exp.images.length)}
              className="absolute right-6 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Bottom thumbnail row */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-full overflow-x-auto px-4 py-2">
              {exp.images.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    lightboxIndex === idx ? 'border-sunset-coral scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceDetail;
