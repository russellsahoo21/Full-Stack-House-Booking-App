import React from 'react';
import { Listing } from '@/data/types';
import { ListingCard } from './ListingCard';
import { Skeleton } from '@/components/common/Skeleton';
import { motion } from 'framer-motion';

interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
}

export const ListingGrid: React.FC<ListingGridProps> = ({ listings, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h3 className="text-xl font-bold mb-2">No stays match your criteria</h3>
        <p className="text-sm text-ink-500 dark:text-warm-400">
          Try resetting your filters or selecting a different category to view more sanctums.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {listings.map((listing, index) => (
        <motion.div
          key={listing._id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: Math.min(index * 0.04, 0.4),
            ease: 'easeOut',
          }}
        >
          <ListingCard listing={listing} />
        </motion.div>
      ))}
    </div>
  );
};
