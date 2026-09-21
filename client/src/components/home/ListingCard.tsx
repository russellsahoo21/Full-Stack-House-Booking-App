import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Listing } from '@/data/types';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(listing._id);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(listing._id);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-card transition-all duration-300 hover:shadow-lift dark:hover:shadow-lift-dark"
    >
      <Link to={`/stay/${listing._id}`} className="flex flex-col flex-1">
        {/* Image Carousel Box with fixed Aspect Ratio to avoid layout shift */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-warm-200 dark:bg-ink-800">
          <img
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            width={600}
            height={450}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Top-left Guest Favourite Badge */}
          {listing.guestFavorite && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-white/85 dark:bg-ink-900/85 backdrop-blur-md border border-white/40 dark:border-white/10 text-ink-900 dark:text-white text-[11px] font-bold tracking-tight shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-sunset-amber fill-sunset-amber" />
              <span>Guest favourite</span>
            </div>
          )}

          {/* Top-right Heart Burst Button */}
          <button
            onClick={handleHeartClick}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/35 backdrop-blur-md text-white transition-all active:scale-90"
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <motion.div
              animate={saved ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  saved ? 'fill-sunset-coral text-sunset-coral' : 'text-white'
                }`}
              />
            </motion.div>
          </button>

          {/* Carousel Next / Prev Arrows on Hover */}
          {isHovered && listing.images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-10">
              <button
                onClick={handlePrev}
                className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 dark:bg-ink-900/90 text-ink-900 dark:text-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 dark:bg-ink-900/90 text-ink-900 dark:text-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Indicator Dots */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
              {listing.images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === idx
                      ? 'w-4 bg-white shadow-sm'
                      : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Meta */}
        <div className="pt-3.5 pb-2 px-1 flex flex-col flex-1">
          {/* Row 1: Location & Star Rating */}
          <div className="flex items-center justify-between text-sm font-semibold mb-0.5">
            <span className="text-ink-900 dark:text-warm-100 truncate pr-2">
              {listing.location.city}
            </span>
            <span className="flex items-center gap-1 text-ink-900 dark:text-warm-100 shrink-0 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-sunset-amber text-sunset-amber" />
              <span>{listing.rating.average.toFixed(2)}</span>
            </span>
          </div>

          {/* Row 2: Distance & Tagline */}
          <div className="text-xs text-ink-500 dark:text-warm-400 truncate">
            {listing.location.distanceDesc}
          </div>

          {/* Row 3: Available Dates */}
          <div className="text-xs text-ink-500 dark:text-warm-400 mt-0.5 mb-2">
            {listing.availableDates}
          </div>

          {/* Row 4: Price */}
          <div className="mt-auto flex items-baseline gap-1 text-ink-900 dark:text-white">
            <span className="font-extrabold text-sm sm:text-base">
              {formatPrice(listing.price.perNight)}
            </span>
            <span className="text-xs text-ink-500 dark:text-warm-400 font-normal">night</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
