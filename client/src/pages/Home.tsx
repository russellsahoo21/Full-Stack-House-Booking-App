import React, { useState, useMemo } from 'react';
import { Hero } from '@/components/home/Hero';
import { CategoryBar } from '@/components/home/CategoryBar';
import { FilterModal, FilterState } from '@/components/home/FilterModal';
import { ListingGrid } from '@/components/home/ListingGrid';
import { SnapCarousel } from '@/components/home/SnapCarousel';
import { BentoGrid } from '@/components/home/BentoGrid';
import { HostBanner } from '@/components/home/HostBanner';
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee';
import { mockListings } from '@/data/listings';
import { CategoryId } from '@/data/types';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState | null>(null);

  // Filter listings based on active category and modal filter values
  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      // Category check
      if (selectedCategory !== 'all' && !listing.category.includes(selectedCategory)) {
        return false;
      }

      // Modal Filters check
      if (filters) {
        if (listing.price.perNight > filters.maxPrice || listing.price.perNight < filters.minPrice) {
          return false;
        }
        if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(listing.propertyType)) {
          return false;
        }
        if (filters.bedrooms > 0 && listing.bedrooms < filters.bedrooms) {
          return false;
        }
        if (filters.beds > 0 && listing.beds < filters.beds) {
          return false;
        }
        if (filters.amenities.length > 0) {
          const hasAllAmenities = filters.amenities.every((a) =>
            listing.amenities.includes(a)
          );
          if (!hasAllAmenities) return false;
        }
      }

      return true;
    });
  }, [selectedCategory, filters]);

  // Curated collections
  const goaListings = useMemo(
    () => mockListings.filter((l) => l.location.state === 'Goa'),
    []
  );

  const mumbaiGetaways = useMemo(
    () => mockListings.filter((l) => l.location.state === 'Maharashtra'),
    []
  );

  const activeFilterCount = useMemo(() => {
    if (!filters) return 0;
    let count = 0;
    if (filters.maxPrice < 45000 || filters.minPrice > 2000) count++;
    if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
    if (filters.bedrooms > 0) count++;
    if (filters.beds > 0) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    return count;
  }, [filters]);

  return (
    <div className="w-full">
      {/* 1. CINEMATIC FULLSCREEN HERO */}
      <Hero />

      {/* 2. STICKY CATEGORY BAR */}
      <CategoryBar
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenFilters={() => setIsFilterModalOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* FILTER MODAL */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
        totalMatches={filteredListings.length}
      />

      {/* MAIN CONTAINER FOR CONTENT SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* 3. PRIMARY LISTING GRID */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white">
                {selectedCategory === 'all'
                  ? 'Sanctuaries across India'
                  : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')} stays`}
              </h2>
              <p className="text-sm text-ink-500 dark:text-warm-400 mt-1">
                Showing {filteredListings.length} curated stays with verified superhosts
              </p>
            </div>
          </div>

          <ListingGrid listings={filteredListings} />
        </section>

        {/* 4. SNAP CAROUSEL 1: TRENDING IN GOA */}
        {goaListings.length > 0 && (
          <SnapCarousel
            title="Trending in Goa"
            subtitle="Ocean clifftops, laterite villas, and barefoot beach houses."
            listings={goaListings}
            viewAllQuery="Goa"
          />
        )}

        {/* 5. BENTO GRID "EXPLORE BY VIBE" */}
        <BentoGrid />

        {/* 6. SNAP CAROUSEL 2: WEEKEND GETAWAYS FROM MUMBAI */}
        {mumbaiGetaways.length > 0 && (
          <SnapCarousel
            title="Weekend getaways from Mumbai"
            subtitle="Alibaug coastal pavilions, Lonavala chalets, and lakeside glass houses."
            listings={mumbaiGetaways}
            viewAllQuery="Mumbai"
          />
        )}

        {/* 7. HOST ON WAYFOUND FULL-WIDTH BANNER */}
        <HostBanner />
      </div>

      {/* 8. TESTIMONIALS MARQUEE */}
      <TestimonialsMarquee />
    </div>
  );
};
export default Home;
