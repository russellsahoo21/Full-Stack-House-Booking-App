import React, { useState } from 'react';
import { mockExperiences, Experience } from '@/data/experiences';
import {
  Star,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Experiences: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeExp, setActiveExp] = useState<Experience | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const categories = ['All', 'Culinary', 'Adventure', 'Nature', 'Culture', 'Wellness'];

  const filtered = selectedCategory === 'All'
    ? mockExperiences
    : mockExperiences.filter((e) => e.category === selectedCategory);

  const handleBook = () => {
    setBookingSuccess(true);
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5A5F', '#FFB347', '#E83E8C'],
      });
    } catch {}
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider mb-3">
          Wayfound Experiences
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-3">
          Immersive Journeys
        </h1>
        <p className="text-sm sm:text-base text-ink-500 dark:text-warm-300">
          Unforgettable masterclasses, night-sky expeditions, and wild adventures hosted by verified local artisans.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                : 'border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-300 hover:border-ink-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((exp) => (
          <motion.div
            key={exp._id}
            whileHover={{ y: -5 }}
            className="flex flex-col rounded-3xl overflow-hidden glass-panel border border-warm-200/80 dark:border-white/10 shadow-sm hover:shadow-lift transition-all group"
          >
            {/* Image Box */}
            <div className="relative aspect-[16/10] overflow-hidden bg-warm-200 dark:bg-ink-800">
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-bold">
                {exp.category}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-ink-900/90 text-ink-950 dark:text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-sunset-amber text-sunset-amber" />
                <span>{exp.rating}</span>
                <span className="text-ink-400 font-normal">({exp.reviewCount})</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-1 text-xs text-sunset-coral font-bold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{exp.location}</span>
              </div>

              <h3 className="text-lg font-bold text-ink-950 dark:text-white line-clamp-1 mb-1.5">
                {exp.title}
              </h3>
              <p className="text-xs text-ink-500 dark:text-warm-400 line-clamp-2 leading-relaxed mb-4">
                {exp.tagline}
              </p>

              {/* Host & Meta Row */}
              <div className="flex items-center justify-between py-3 border-y border-warm-200/60 dark:border-white/5 text-xs text-ink-600 dark:text-warm-300">
                <div className="flex items-center gap-2">
                  <img
                    src={exp.hostAvatar}
                    alt={exp.hostName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-ink-900 dark:text-white truncate max-w-[120px]">
                    {exp.hostName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-ink-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {exp.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {exp.groupSize}
                  </span>
                </div>
              </div>

              {/* Price & Book Button */}
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-ink-950 dark:text-white">
                    {formatPrice(exp.pricePerPerson)}
                  </span>
                  <span className="text-xs text-ink-400"> / guest</span>
                </div>
                <button
                  onClick={() => {
                    setActiveExp(exp);
                    setBookingSuccess(false);
                  }}
                  className="px-5 py-2 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-sm hover:shadow-glow-sunset active:scale-95 transition-all"
                >
                  Book experience
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {activeExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveExp(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-warm-200 dark:border-white/15 z-10 space-y-5"
            >
              <button
                onClick={() => setActiveExp(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-warm-200 dark:hover:bg-ink-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-ink-950 dark:text-white">
                    You're on the list!
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-300 max-w-sm mx-auto">
                    Your spot for <span className="font-bold text-ink-900 dark:text-white">{activeExp.title}</span> has been confirmed. Meeting location and host details sent.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setActiveExp(null)}
                      className="px-6 py-2.5 rounded-full bg-sunset-gradient text-white text-xs font-bold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-4 items-center">
                    <img
                      src={activeExp.image}
                      alt={activeExp.title}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-sunset-coral uppercase tracking-wider">
                        {activeExp.category}
                      </span>
                      <h4 className="font-bold text-base text-ink-950 dark:text-white">
                        {activeExp.title}
                      </h4>
                      <p className="text-xs text-ink-500 dark:text-warm-400">
                        {activeExp.location} · {activeExp.duration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-warm-200/60 dark:border-white/10">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-warm-400">
                      Highlights included:
                    </h5>
                    {activeExp.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-ink-700 dark:text-warm-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-warm-200/60 dark:border-white/10">
                    <div>
                      <span className="text-xl font-extrabold text-ink-950 dark:text-white">
                        {formatPrice(activeExp.pricePerPerson)}
                      </span>
                      <span className="text-xs text-ink-400"> / guest</span>
                    </div>
                    <button
                      onClick={handleBook}
                      className="px-6 py-3 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-md hover:shadow-glow-sunset"
                    >
                      Confirm reservation
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Experiences;
