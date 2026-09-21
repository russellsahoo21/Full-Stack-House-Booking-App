import React, { useRef, useState, useEffect } from 'react';
import { Listing } from '@/data/types';
import { ListingCard } from './ListingCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SnapCarouselProps {
  title: string;
  subtitle: string;
  listings: Listing[];
  viewAllQuery?: string;
}

export const SnapCarousel: React.FC<SnapCarouselProps> = ({
  title,
  subtitle,
  listings,
  viewAllQuery,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [listings]);

  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 320;
      const amount = dir === 'left' ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8">
      {/* Header with Title & Arrow Controls */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-ink-500 dark:text-warm-400 mt-1">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {viewAllQuery && (
            <Link
              to={`/search?where=${encodeURIComponent(viewAllQuery)}`}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-sunset-coral hover:underline mr-2"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-warm-300 dark:border-white/15 bg-white/80 dark:bg-ink-800 shadow-sm flex items-center justify-center text-ink-700 dark:text-warm-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-ink-700 transition-all active:scale-95"
              aria-label="Previous stays"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-warm-300 dark:border-white/15 bg-white/80 dark:bg-ink-800 shadow-sm flex items-center justify-center text-ink-700 dark:text-warm-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-ink-700 transition-all active:scale-95"
              aria-label="Next stays"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Snap Scroll Row */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {listings.map((stay) => (
          <div
            key={stay._id}
            className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start"
          >
            <ListingCard listing={stay} />
          </div>
        ))}
      </div>
    </section>
  );
};
