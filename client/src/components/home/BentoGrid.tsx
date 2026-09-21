import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const VIBES = [
  {
    title: 'Slow mornings in the hills',
    subtitle: 'Deodar chalets, crisp mountain air, and wood stoves.',
    locations: 'Manali · Darjeeling · Ladakh',
    query: 'Manali',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
    className: 'md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[460px]',
  },
  {
    title: 'Beach house days',
    subtitle: 'Barefoot sands, ocean plunge pools, and laterite clifftops.',
    locations: 'Goa · Pondicherry · Alibaug',
    query: 'Goa',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    className: 'md:col-span-1 md:row-span-1 min-h-[220px]',
  },
  {
    title: 'Royal heritage stays',
    subtitle: 'Lakeside havelis, marble jharokhas, and courtyard palaces.',
    locations: 'Udaipur · Jaipur',
    query: 'Udaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85',
    className: 'md:col-span-1 md:row-span-1 min-h-[220px]',
  },
  {
    title: 'Work from anywhere',
    subtitle: 'Fast fiber internet, ergonomic spaces, and estate coffee.',
    locations: 'Coorg · Rishikesh · Vaitarna',
    query: 'Coorg',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85',
    className: 'md:col-span-3 md:row-span-1 min-h-[220px]',
  },
];

export const BentoGrid: React.FC = () => {
  return (
    <section className="py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated Moods
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950 dark:text-white">
            Explore by vibe
          </h2>
          <p className="text-sm text-ink-500 dark:text-warm-400 mt-1">
            Choose how you want each morning to feel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {VIBES.map((vibe, idx) => (
          <motion.div
            key={vibe.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`relative rounded-3xl overflow-hidden group cursor-pointer ${vibe.className}`}
          >
            <Link to={`/search?where=${encodeURIComponent(vibe.query)}`} className="block w-full h-full">
              {/* Image with zoom on hover */}
              <img
                src={vibe.image}
                alt={vibe.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Top-right diagonal arrow icon pill */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-md">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end">
                <span className="text-xs font-bold uppercase tracking-wider text-sunset-amber mb-1.5">
                  {vibe.locations}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
                  {vibe.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-lg">
                  {vibe.subtitle}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
