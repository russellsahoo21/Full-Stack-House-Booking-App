import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, ArrowRight, Sparkles, FolderHeart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { mockListings } from '@/data/listings';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Wishlists: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const savedStays = mockListings.filter((s) => wishlist.includes(s._id));

  // Curate sample collections
  const collections = [
    {
      title: 'Ocean Sanctuaries',
      desc: 'Clifftops, laterite villas & barefoot beaches',
      stays: mockListings.filter((s) => s.category.includes('beachfront')).slice(0, 3),
    },
    {
      title: 'Alpine & High Passes',
      desc: 'Cedar chalets, stargazers & valley vistas',
      stays: mockListings.filter((s) => s.category.includes('mountains')).slice(0, 3),
    },
    {
      title: 'Royal Haveli Escapes',
      desc: 'Lakeside Mewari architecture & courtyards',
      stays: mockListings.filter((s) => s.category.includes('heritage')).slice(0, 3),
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      {/* Heading */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider mb-2">
            Your Wishlists
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 dark:text-white tracking-tight">
            Saved sanctums
          </h1>
          <p className="text-sm text-ink-500 dark:text-warm-400 mt-1">
            {savedStays.length} stays saved across your curated wanderings.
          </p>
        </div>
      </div>

      {/* 1. CURATED COLLECTIONS WITH 3-OVERLAPPING STACKED PHOTO CARDS */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-ink-950 dark:text-white mb-6">
          Curated Collections
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <motion.div
              key={col.title}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              {/* Stacked 3 Overlapping Photo Cards with Tilt on Hover */}
              <div className="relative h-64 w-full mb-4">
                {/* 3rd background card (tilted left) */}
                <div className="absolute inset-x-4 top-0 h-52 rounded-3xl overflow-hidden shadow-sm bg-warm-300 dark:bg-ink-800 -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-60">
                  <img
                    src={col.stays[2]?.images[0] || col.stays[0]?.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 2nd background card (tilted right) */}
                <div className="absolute inset-x-2 top-2 h-52 rounded-3xl overflow-hidden shadow-md bg-warm-200 dark:bg-ink-700 rotate-2 group-hover:rotate-4 transition-transform duration-300 opacity-80">
                  <img
                    src={col.stays[1]?.images[0] || col.stays[0]?.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 1st foreground card */}
                <div className="absolute inset-0 h-56 rounded-3xl overflow-hidden shadow-lift dark:shadow-lift-dark bg-card border border-warm-200/80 dark:border-white/10 group-hover:scale-[1.02] transition-transform duration-300 z-10">
                  <img
                    src={col.stays[0]?.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-sunset-amber">
                      Collection
                    </span>
                    <h3 className="text-lg font-extrabold">{col.title}</h3>
                  </div>
                </div>
              </div>

              {/* Collection Meta */}
              <div className="pt-2">
                <p className="text-xs text-ink-500 dark:text-warm-400">
                  {col.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. SAVED INDIVIDUAL STAYS */}
      <div>
        <h2 className="text-xl font-bold text-ink-950 dark:text-white mb-6">
          All Saved Stays ({savedStays.length})
        </h2>

        {savedStays.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto p-8 rounded-3xl glass-panel border border-warm-200 dark:border-white/10">
            <div className="w-16 h-16 rounded-3xl bg-warm-200 dark:bg-ink-800 flex items-center justify-center mx-auto mb-4 text-sunset-coral shadow-sm">
              <FolderHeart className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-ink-950 dark:text-white mb-2">
              Nothing found yet. Go wander.
            </h3>
            <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 mb-6 leading-relaxed">
              As you browse stays, tap the heart icon on any retreat to save your favorite spots into custom collections.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunset-gradient text-white text-xs font-semibold shadow-md hover:shadow-glow-sunset"
            >
              <Compass className="w-4 h-4" /> Start exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedStays.map((stay) => (
              <div
                key={stay._id}
                className="group relative flex flex-col rounded-3xl overflow-hidden glass-panel border border-warm-200/80 dark:border-white/10 hover:shadow-lift transition-all"
              >
                <Link to={`/stay/${stay._id}`} className="flex flex-col flex-1">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={stay.images[0]}
                      alt={stay.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(stay._id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-sunset-coral shadow-sm"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-sm font-semibold mb-1">
                      <span className="text-ink-950 dark:text-white truncate">{stay.title}</span>
                      <span className="text-xs font-bold text-ink-900 dark:text-white shrink-0 ml-2">★ {stay.rating.average}</span>
                    </div>
                    <span className="text-xs text-ink-500 dark:text-warm-400 mb-3">{stay.location.city}</span>
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-warm-200/50 dark:border-white/5">
                      <span className="font-extrabold text-sm text-ink-950 dark:text-white">
                        {formatPrice(stay.price.perNight)}/night
                      </span>
                      <span className="text-xs text-sunset-coral font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Wishlists;
