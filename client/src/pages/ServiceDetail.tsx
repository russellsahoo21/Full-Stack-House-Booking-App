import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockServices, Service } from '@/data/services';
import {
  Star,
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
  Send,
  Check,
  MapPin,
  Utensils,
  HeartHandshake,
  MessageSquare,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Find service or fallback to first
  const service: Service = mockServices.find((s) => s._id === id) || mockServices[0];

  // UI state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  // Booking / Inquiry Form State
  const [villaLocation, setVillaLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('07:30 PM (Dinner)');
  const [partySize, setPartySize] = useState(4);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

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
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % service.images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, service.images.length]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSuccess(true);
    try {
      confetti({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5A5F', '#FFB347', '#E83E8C', '#22C55E'],
      });
    } catch {}
  };

  const timeOptions = [
    '12:30 PM (Lunch)',
    '05:00 PM (Sundowner)',
    '07:30 PM (Dinner)',
  ];

  const dateOptions = [
    { label: 'Tomorrow', sub: 'Chef available' },
    { label: 'This Sat', sub: 'Fast booking' },
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
              <a href="#offerings" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                Offerings
              </a>
              <a href="#how-it-works" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                How It Works
              </a>
              <a href="#reviews" className="text-xs font-semibold text-ink-700 dark:text-warm-300 hover:text-sunset-coral">
                Reviews
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <span className="font-extrabold text-sm text-ink-950 dark:text-white">
                  {service.priceTag}
                </span>
              </div>
              <button
                onClick={() => {
                  const card = document.getElementById('service-request-card');
                  if (card) {
                    card.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-md hover:shadow-glow-sunset active:scale-95 transition-all"
              >
                Request service
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
            to="/services"
            className="inline-flex items-center gap-1 hover:text-sunset-coral transition-colors font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> All Services
          </Link>
          <span>/</span>
          <span className="text-ink-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
            {service.title}
          </span>
        </div>

        {/* 2. TITLE & META ACTIONS */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wayfound In-Villa {service.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-2">
            {service.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-ink-500 dark:text-warm-400">
            <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
              <span className="flex items-center gap-1 font-bold text-ink-950 dark:text-white">
                <Star className="w-4 h-4 fill-sunset-amber text-sunset-amber" />
                {service.rating}
              </span>
              <span>·</span>
              <a href="#reviews" className="underline font-semibold cursor-pointer hover:text-sunset-coral">
                {service.reviewCount} verified reviews
              </a>
              <span>·</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                In-Stay Delivery
              </span>
              <span>·</span>
              <span className="font-medium text-ink-700 dark:text-warm-300">
                {service.priceTag}
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
                src={service.images[0] || service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* 4 Smaller Photos in 2 columns */}
            <div className="hidden md:grid grid-cols-2 col-span-2 gap-2.5 h-full">
              {service.images.slice(1, 5).map((img, idx) => (
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
                    alt={`${service.title} photo ${idx + 2}`}
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
            Show all {service.images.length} photos
          </button>
        </section>

        {/* 4. TWO COLUMN DETAILS + STICKY REQUEST CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: SERVICE INFORMATION */}
          <div className="lg:col-span-8 space-y-12">
            {/* Provider info banner */}
            <div className="flex items-center justify-between pb-8 border-b border-warm-200/60 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Certified In-Stay Partner
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-ink-950 dark:text-white">
                  Provided by {service.providerName}
                </h2>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 mt-1 max-w-xl leading-relaxed">
                  {service.providerBio}
                </p>
              </div>
              <img
                src={service.providerAvatar}
                alt={service.providerName}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-sunset-coral/40 shrink-0 ml-4"
              />
            </div>

            {/* Key Features Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {service.features.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-warm-100/70 dark:bg-ink-900/60 border border-warm-200/80 dark:border-white/10 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-sunset-gradient-subtle text-sunset-coral flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-ink-900 dark:text-white">{f}</span>
                </div>
              ))}
            </div>

            {/* Detailed Description */}
            <div className="space-y-4 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white">
                About this service
              </h3>
              <p className="text-sm sm:text-base text-ink-600 dark:text-warm-300 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* SIGNATURE OFFERINGS / PACKAGES */}
            <section id="offerings" className="space-y-4 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <div>
                <span className="text-xs font-bold text-sunset-coral uppercase tracking-wider">
                  Menu & Packages
                </span>
                <h3 className="text-xl font-bold text-ink-950 dark:text-white mt-0.5">
                  Curated offerings for your stay
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {service.offerings.map((pkg, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPackageIndex(idx)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                      selectedPackageIndex === idx
                        ? 'border-sunset-coral bg-sunset-coral/[0.04] ring-1 ring-sunset-coral/30 shadow-sm'
                        : 'border-warm-200/80 dark:border-white/10 bg-card hover:border-warm-400 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-ink-950 dark:text-white">
                            {pkg.title}
                          </h4>
                          {selectedPackageIndex === idx && (
                            <span className="px-2 py-0.5 rounded-full bg-sunset-coral text-white text-[10px] font-bold">
                              Selected
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-sunset-coral font-medium">
                          {pkg.subtitle}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold text-ink-950 dark:text-white shrink-0">
                        {pkg.price}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS PIPELINE */}
            <section id="how-it-works" className="space-y-6 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <div>
                <span className="text-xs font-bold text-sunset-coral uppercase tracking-wider">
                  Seamless Coordination
                </span>
                <h3 className="text-xl font-bold text-ink-950 dark:text-white mt-0.5">
                  How it works at your villa
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.howItWorks.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-2xl bg-card border border-warm-200/60 dark:border-white/10 space-y-2 relative"
                  >
                    <div className="w-7 h-7 rounded-full bg-sunset-gradient text-white text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                    <h4 className="font-bold text-sm text-ink-950 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-xs text-ink-500 dark:text-warm-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* WHAT'S INCLUDED CHECKLIST */}
            <div className="space-y-4 pb-8 border-b border-warm-200/60 dark:border-white/10">
              <h3 className="text-lg font-bold text-ink-950 dark:text-white">
                What's included with your service
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.included.map((item, i) => (
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
                        {service.rating}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        Top Rated Concierge
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 dark:text-warm-400">
                      Based on {service.reviewCount} verified in-villa reviews
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-ink-500 dark:text-warm-400">
                  <div>
                    <span className="block font-bold text-ink-900 dark:text-white text-sm">100%</span>
                    <span>Punctuality</span>
                  </div>
                  <div>
                    <span className="block font-bold text-ink-900 dark:text-white text-sm">4.98</span>
                    <span>Hospitality</span>
                  </div>
                  <div>
                    <span className="block font-bold text-ink-900 dark:text-white text-sm">4.97</span>
                    <span>Quality</span>
                  </div>
                </div>
              </div>

              {/* Review Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-card border border-warm-200/60 dark:border-white/5 space-y-3 shadow-sm"
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
                          <span className="text-[11px] text-ink-400">{rev.date} · {rev.villa}</span>
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

          {/* RIGHT COLUMN: STICKY INQUIRY & BOOKING CARD */}
          <div className="lg:col-span-4 sticky top-28" id="service-request-card">
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-warm-200/80 dark:border-white/10 space-y-5">
              {/* Header */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-ink-950 dark:text-white">
                    {service.priceTag}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-ink-900 dark:text-white">
                  <Star className="w-3.5 h-3.5 fill-sunset-amber text-sunset-amber" />
                  <span>{service.rating}</span>
                  <span className="text-ink-400 font-normal">({service.reviewCount})</span>
                </div>
              </div>

              {requestSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-extrabold text-ink-950 dark:text-white">
                    Request Received!
                  </h4>
                  <p className="text-xs text-ink-500 dark:text-warm-300 leading-relaxed">
                    Your concierge request for <span className="font-bold text-ink-900 dark:text-white">{service.title}</span> has been forwarded to {service.providerName}.
                  </p>
                  <div className="p-3 rounded-2xl bg-warm-100 dark:bg-ink-800 text-left text-xs space-y-1">
                    <div className="text-ink-500">Location: <strong className="text-ink-900 dark:text-white">{villaLocation || 'Villa Mar Azul'}</strong></div>
                    <div className="text-ink-500">Date & Session: <strong className="text-ink-900 dark:text-white">{selectedDate} ({selectedTime})</strong></div>
                    <div className="text-ink-500">Party Size: <strong className="text-ink-900 dark:text-white">{partySize} guests</strong></div>
                  </div>
                  <button
                    onClick={() => setRequestSuccess(false)}
                    className="mt-4 px-5 py-2 rounded-full border border-warm-300 dark:border-white/20 text-xs font-bold text-ink-800 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
                  >
                    Send another request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  {/* Villa / Stay Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700 dark:text-warm-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sunset-coral" /> Your Stay or Villa Location
                    </label>
                    <input
                      type="text"
                      required
                      value={villaLocation}
                      onChange={(e) => setVillaLocation(e.target.value)}
                      placeholder="e.g. Villa Mar Azul, Anjuna or Booking ID"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-card border border-warm-200 dark:border-white/10 text-xs text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-sunset-coral"
                    />
                  </div>

                  {/* Select Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700 dark:text-warm-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sunset-coral" /> Preferred Date
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
                              : 'border-warm-200 dark:border-white/10 hover:border-warm-400 text-ink-800 dark:text-warm-200'
                          }`}
                        >
                          <div className="text-xs font-bold">{opt.label}</div>
                          <div className="text-[10px] text-ink-400">{opt.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Session / Time Slot */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700 dark:text-warm-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sunset-coral" /> Service Session
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {timeOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all text-center truncate ${
                            selectedTime === t
                              ? 'border-sunset-coral bg-sunset-coral/10 text-sunset-coral shadow-sm'
                              : 'border-warm-200 dark:border-white/10 hover:border-warm-400 text-ink-700 dark:text-warm-300'
                          }`}
                          title={t}
                        >
                          {t.split(' ')[1] || t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Party Size Stepper */}
                  <div className="p-3 rounded-2xl bg-card border border-warm-200/80 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-ink-900 dark:text-white block">
                        Party Size
                      </span>
                      <span className="text-[10px] text-ink-400">
                        Guests catered
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                        disabled={partySize <= 1}
                        className="w-7 h-7 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-warm-100 dark:hover:bg-ink-800"
                      >
                        -
                      </button>
                      <span className="text-sm font-extrabold text-ink-950 dark:text-white w-4 text-center">
                        {partySize}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPartySize((p) => Math.min(20, p + 1))}
                        className="w-7 h-7 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center font-bold text-sm hover:bg-warm-100 dark:hover:bg-ink-800"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Specific Requests Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700 dark:text-warm-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-sunset-coral" /> Dietary or Specific Notes
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. 2 vegetarian guests, no shellfish, celebrating an anniversary..."
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-card border border-warm-200 dark:border-white/10 text-xs text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-sunset-coral resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-sunset-gradient text-white font-bold text-sm shadow-md hover:shadow-glow-sunset active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Concierge Request</span>
                  </button>

                  {/* Guarantees */}
                  <div className="space-y-1.5 pt-2 text-[11px] text-ink-500 dark:text-warm-400">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>No upfront charge until confirmed by your host</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-sunset-coral shrink-0" />
                      <span>Wayfound Concierge Quality Guarantee</span>
                    </div>
                  </div>
                </form>
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
              {lightboxIndex + 1} / {service.images.length}
            </div>

            {/* Prev Button */}
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev - 1 + service.images.length) % service.images.length)
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
                src={service.images[lightboxIndex]}
                alt=""
                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev + 1) % service.images.length)}
              className="absolute right-6 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Bottom thumbnail row */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-full overflow-x-auto px-4 py-2">
              {service.images.map((thumb, idx) => (
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

export default ServiceDetail;
