import React, { useRef, useState, useEffect } from 'react';
import { CATEGORIES } from '@/data/listings';
import { CategoryId } from '@/data/types';
import {
  Waves,
  Home,
  Mountain,
  Box,
  Trees,
  Castle,
  Sailboat,
  Tractor,
  Sparkles,
  Dog,
  Tent,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryBarProps {
  activeCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Waves,
  Home,
  Mountain,
  Box,
  Trees,
  Castle,
  Sailboat,
  Tractor,
  Sparkles,
  Dog,
  Tent,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenFilters,
  activeFilterCount,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[68px] z-20 bg-background/90 backdrop-blur-xl border-b border-warm-200/60 dark:border-white/5 py-4 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        {/* Horizontal Category Scroll Area with Fade Edges */}
        <div className="relative flex-1 overflow-hidden flex items-center">
          {/* Left Arrow & Fade */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-6 bg-gradient-to-r from-background via-background to-transparent">
              <button
                onClick={() => scroll('left')}
                className="w-7 h-7 rounded-full border border-warm-300 dark:border-white/10 bg-white/90 dark:bg-ink-800 shadow-sm flex items-center justify-center text-ink-700 dark:text-warm-200 hover:scale-105 transition-transform"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Categories Pill List */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
          >
            {/* 'All' Category Option */}
            <button
              onClick={() => onSelectCategory('all')}
              className={`relative flex flex-col items-center gap-1.5 pb-2 text-xs font-semibold whitespace-nowrap transition-colors shrink-0 group ${
                activeCategory === 'all'
                  ? 'text-ink-950 dark:text-white'
                  : 'text-ink-500 dark:text-warm-400 hover:text-ink-800 dark:hover:text-warm-200'
              }`}
            >
              <div className="p-1 rounded-xl group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-sunset-coral" />
              </div>
              <span>All Stays</span>
              {activeCategory === 'all' && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-sunset-gradient"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>

            {CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.iconName] || Home;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`relative flex flex-col items-center gap-1.5 pb-2 text-xs font-medium whitespace-nowrap transition-colors shrink-0 group ${
                    isActive
                      ? 'text-ink-950 dark:text-white font-semibold'
                      : 'text-ink-500 dark:text-warm-400 hover:text-ink-800 dark:hover:text-warm-200'
                  }`}
                >
                  <div className="p-1 rounded-xl group-hover:scale-110 transition-transform">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-sunset-coral' : 'text-ink-400 dark:text-warm-400'
                      }`}
                    />
                  </div>
                  <span>{cat.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-sunset-gradient"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow & Fade */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-6 bg-gradient-to-l from-background via-background to-transparent">
              <button
                onClick={() => scroll('right')}
                className="w-7 h-7 rounded-full border border-warm-300 dark:border-white/10 bg-white/90 dark:bg-ink-800 shadow-sm flex items-center justify-center text-ink-700 dark:text-warm-200 hover:scale-105 transition-transform"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-warm-300/80 dark:border-white/15 bg-white/60 dark:bg-ink-800/60 hover:bg-white dark:hover:bg-ink-700 shadow-sm text-xs font-semibold text-ink-800 dark:text-warm-100 transition-all shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sunset-coral" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-sunset-gradient text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
