import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Star,
  Heart,
  ChevronDown,
  ArrowUpDown,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { mockListings } from '@/data/listings';
import { Listing } from '@/data/types';
import { ListingCard } from '@/components/home/ListingCard';
import { formatPrice } from '@/lib/utils';
import { listingsApi } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const where = searchParams.get('where') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [hoveredStayId, setHoveredStayId] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [listingsData, setListingsData] = useState<Listing[]>(mockListings);

  // Fetch from API
  useEffect(() => {
    let isMounted = true;
    listingsApi
      .getListings({
        search: where || undefined,
        guests: guests ? parseInt(guests, 10) : undefined,
      })
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          setListingsData(res.data);
        }
      })
      .catch((err) => {
        console.warn('API error, using cached data:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [where, guests]);

  // Filter listings based on URL where query + filter chips
  const filteredListings = useMemo(() => {
    let result = listingsData;

    if (where.trim()) {
      const q = where.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.location.city.toLowerCase().includes(q) ||
          l.location.state.toLowerCase().includes(q) ||
          l.location.area.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'guestFavorite') {
      result = result.filter((l) => l.guestFavorite);
    } else if (activeFilter === 'luxe') {
      result = result.filter((l) => l.price.perNight >= 18000);
    } else if (activeFilter === 'petFriendly') {
      result = result.filter((l) => l.amenities.includes('Pet friendly'));
    } else if (activeFilter === 'pools') {
      result = result.filter((l) =>
        l.amenities.some((a) => a.toLowerCase().includes('pool'))
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating.average - a.rating.average;
      if (sortBy === 'price-asc') return a.price.perNight - b.price.perNight;
      if (sortBy === 'price-desc') return b.price.perNight - a.price.perNight;
      return 0;
    });
  }, [where, activeFilter, sortBy]);

  return (
    <div className="pt-24 pb-20 w-full min-h-screen">
      {/* 1. TOP FILTER BAR */}
      <div className="border-b border-warm-200/60 dark:border-white/10 bg-background/95 backdrop-blur-md sticky top-[68px] z-30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          {/* Quick Filters Pill Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'all'
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-300 hover:border-ink-900'
              }`}
            >
              All Stays ({mockListings.length})
            </button>
            <button
              onClick={() => setActiveFilter('guestFavorite')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'guestFavorite'
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-300 hover:border-ink-900'
              }`}
            >
              Guest favourites
            </button>
            <button
              onClick={() => setActiveFilter('pools')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'pools'
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-300 hover:border-ink-900'
              }`}
            >
              Private pools
            </button>
            <button
              onClick={() => setActiveFilter('luxe')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'luxe'
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-300 hover:border-ink-900'
              }`}
            >
              Luxe villas (₹18,000+)
            </button>
            <button
              onClick={() => setActiveFilter('petFriendly')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'petFriendly'
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-300 hover:border-ink-900'
              }`}
            >
              Pet friendly
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-600 dark:text-warm-400 shrink-0">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-warm-100 dark:bg-ink-800 border border-warm-300/80 dark:border-white/15 rounded-xl px-3 py-1.5 text-xs text-ink-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT (LIST LEFT + MOCK MAP RIGHT) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 dark:text-white tracking-tight">
              {where ? `Stays in "${where}"` : 'All curated retreats in India'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 mt-1">
              Over {filteredListings.length} stays available {checkIn && `· ${checkIn} to ${checkOut}`} {guests && `· ${guests} guests`}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 ? (
          <div className="py-28 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-warm-200 dark:bg-ink-800 flex items-center justify-center mx-auto mb-4 text-sunset-coral">
              <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <h3 className="text-2xl font-bold text-ink-950 dark:text-white mb-2">
              No stays here. Try wider dates or a new spot.
            </h3>
            <p className="text-sm text-ink-500 dark:text-warm-400 mb-6 leading-relaxed">
              We couldn't find any stays matching your current search parameters. Discover destinations like Goa, Manali, Udaipur, or Kerala.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunset-gradient text-white text-xs font-semibold shadow-md hover:shadow-glow-sunset"
            >
              Reset search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: LISTINGS GRID */}
            <div
              className={`lg:col-span-7 ${
                showMobileMap ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredListings.map((stay) => (
                  <div
                    key={stay._id}
                    onMouseEnter={() => setHoveredStayId(stay._id)}
                    onMouseLeave={() => setHoveredStayId(null)}
                    className="transition-transform duration-200"
                  >
                    <ListingCard listing={stay} />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: INTERACTIVE MOCK MAP */}
            <div
              className={`lg:col-span-5 lg:sticky lg:top-36 rounded-3xl overflow-hidden shadow-xl border border-warm-300/80 dark:border-white/10 ${
                showMobileMap ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="relative w-full h-[620px] bg-[#E5E3DF] dark:bg-[#1A1A24] overflow-hidden">
                {/* Stylized Vector Map Grid Lines & Roads */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />
                  {/* Decorative coastline / contours */}
                  <path
                    d="M -50,150 Q 120,200 180,350 T 450,550 T 600,700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-sunset-coral/40"
                  />
                  <path
                    d="M 100,-20 Q 250,180 300,320 T 520,600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-sunset-amber/40"
                  />
                </svg>

                {/* Map Floating Header */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                  <div className="pointer-events-auto px-3.5 py-1.5 rounded-full glass-panel text-xs font-bold text-ink-900 dark:text-white shadow-sm flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-sunset-coral" />
                    <span>Interactive Map Preview</span>
                  </div>
                  <div className="pointer-events-auto px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] text-white font-medium">
                    {filteredListings.length} pins
                  </div>
                </div>

                {/* Interactive Price Markers */}
                <div className="absolute inset-0 p-8 flex flex-wrap content-around justify-around">
                  {filteredListings.slice(0, 10).map((stay, idx) => {
                    const isHovered = hoveredStayId === stay._id;
                    return (
                      <Link
                        key={stay._id}
                        to={`/stay/${stay._id}`}
                        onMouseEnter={() => setHoveredStayId(stay._id)}
                        onMouseLeave={() => setHoveredStayId(null)}
                        className={`transition-all duration-300 z-20 m-2 ${
                          isHovered
                            ? 'scale-110 z-30 shadow-glow-sunset'
                            : 'scale-100 hover:scale-105'
                        }`}
                      >
                        <div
                          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all duration-300 shadow-md flex items-center gap-1 cursor-pointer ${
                            isHovered
                              ? 'bg-sunset-gradient text-white ring-4 ring-sunset-coral/30'
                              : 'bg-white dark:bg-ink-900 text-ink-950 dark:text-white hover:bg-sunset-coral hover:text-white border border-warm-300 dark:border-white/10'
                          }`}
                        >
                          <span>₹{stay.price.perNight.toLocaleString('en-IN')}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Bottom preview pill if card is hovered */}
                <AnimatePresence>
                  {hoveredStayId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-4 inset-x-4 z-20"
                    >
                      {(() => {
                        const stay = mockListings.find((s) => s._id === hoveredStayId);
                        if (!stay) return null;
                        return (
                          <Link
                            to={`/stay/${stay._id}`}
                            className="flex items-center gap-3 p-3 rounded-2xl glass-panel shadow-2xl border border-warm-200 dark:border-white/15"
                          >
                            <img
                              src={stay.images[0]}
                              alt={stay.title}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="flex-1 truncate">
                              <h4 className="text-xs font-bold text-ink-900 dark:text-white truncate">
                                {stay.title}
                              </h4>
                              <p className="text-[11px] text-ink-500 dark:text-warm-400">
                                {stay.location.city} · ★ {stay.rating.average}
                              </p>
                              <p className="text-xs font-bold text-sunset-coral">
                                {formatPrice(stay.price.perNight)}/night
                              </p>
                            </div>
                          </Link>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. FLOATING MOBILE "MAP / LIST" TOGGLE BUTTON */}
      <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowMobileMap(!showMobileMap)}
          className="px-5 py-2.5 rounded-full bg-ink-950 dark:bg-white text-white dark:text-ink-950 font-bold text-xs shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          {showMobileMap ? (
            <>
              <List className="w-4 h-4" />
              <span>Show list</span>
            </>
          ) : (
            <>
              <MapIcon className="w-4 h-4" />
              <span>Show map</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default Search;
