import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockExperiences } from '@/data/experiences';
import {
  Star,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { experiencesApi } from '@/services/api';
import { motion } from 'framer-motion';

export const Experiences: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [experiences, setExperiences] = useState<any[]>(mockExperiences);

  useEffect(() => {
    let isMounted = true;
    experiencesApi
      .getExperiences()
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          setExperiences(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', 'Culinary', 'Adventure', 'Nature', 'Culture', 'Wellness'];

  const filtered = selectedCategory === 'All'
    ? experiences
    : experiences.filter((e) => e.category === selectedCategory);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Ambient Atmospheric Background Image */}
      <div className="absolute top-0 left-0 right-0 h-[580px] pointer-events-none select-none overflow-hidden z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="w-full h-full object-cover object-center opacity-30 dark:opacity-20 scale-105 filter blur-[0.5px]"
        />
        {/* Smooth gradient fade to page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        {/* Soft radial sunset glow in the center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sunset-gradient opacity-10 dark:opacity-15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wayfound Experiences</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-3">
            Immersive Journeys
          </h1>
          <p className="text-sm sm:text-base text-ink-500 dark:text-warm-300">
            Unforgettable masterclasses, night-sky expeditions, and wild adventures hosted inside authentic heritage venues.
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
              {/* Image Box linking to Detail Page */}
              <Link to={`/experience/${exp._id}`} className="relative aspect-[16/10] overflow-hidden bg-warm-200 dark:bg-ink-800 block">
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
              </Link>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1 text-xs text-sunset-coral font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exp.location}</span>
                </div>

                <Link to={`/experience/${exp._id}`}>
                  <h3 className="text-lg font-bold text-ink-950 dark:text-white line-clamp-1 mb-1.5 hover:text-sunset-coral transition-colors">
                    {exp.title}
                  </h3>
                </Link>
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

                {/* Price & View Detail Button */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-ink-950 dark:text-white">
                      {formatPrice(exp.pricePerPerson)}
                    </span>
                    <span className="text-xs text-ink-400"> / guest</span>
                  </div>
                  <Link
                    to={`/experience/${exp._id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-sm hover:shadow-glow-sunset active:scale-95 transition-all"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experiences;
