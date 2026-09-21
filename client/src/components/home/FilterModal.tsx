import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  totalMatches: number;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  propertyTypes: string[];
  bedrooms: number;
  beds: number;
  amenities: string[];
}

const PROPERTY_TYPES = ['Villa', 'Chalet', 'Haveli', 'Treehouse', 'Cottage', 'Apartment', 'Houseboat', 'Tent'];

const POPULAR_AMENITIES = [
  'Ocean view',
  'Private plunge pool',
  'High-speed fiber WiFi',
  'Dedicated workspace',
  'Indoor wood fireplace',
  'Pet friendly',
  'Private chef option',
  'Air conditioning',
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  totalMatches,
}) => {
  const [minPrice, setMinPrice] = useState(2500);
  const [maxPrice, setMaxPrice] = useState(35000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [beds, setBeds] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleClearAll = () => {
    setMinPrice(2500);
    setMaxPrice(35000);
    setSelectedTypes([]);
    setBedrooms(0);
    setBeds(0);
    setSelectedAmenities([]);
  };

  const handleApply = () => {
    onApply({
      minPrice,
      maxPrice,
      propertyTypes: selectedTypes,
      bedrooms,
      beds,
      amenities: selectedAmenities,
    });
    onClose();
  };

  // Mock Histogram bars for price distribution
  const histogramBars = [15, 30, 60, 95, 80, 55, 40, 30, 20, 15, 10, 8];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[88vh] bg-white dark:bg-ink-900 rounded-3xl shadow-2xl border border-warm-200 dark:border-white/10 flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-warm-200 dark:border-white/10 shrink-0">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-warm-100 dark:hover:bg-ink-800 text-ink-600 dark:text-warm-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-base text-ink-900 dark:text-white">Filters</h3>
            <div className="w-8" />
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
            {/* 1. Price Range with Histogram */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-white mb-1">
                Price range (per night)
              </h4>
              <p className="text-xs text-ink-500 dark:text-warm-400 mb-6">
                Average nightly rate is ₹14,200 across boutique stays.
              </p>

              {/* Histogram bars */}
              <div className="flex items-end gap-1.5 h-16 px-4 mb-2">
                {histogramBars.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-warm-300 dark:bg-ink-700 rounded-t-sm transition-all"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              {/* Dual Range Controls */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1 p-3 rounded-2xl border border-warm-200 dark:border-white/15 bg-warm-50 dark:bg-ink-800">
                  <div className="text-[10px] uppercase font-bold text-ink-400">Minimum</div>
                  <div className="font-bold text-sm text-ink-900 dark:text-white">
                    {formatPrice(minPrice)}
                  </div>
                </div>
                <span className="text-ink-400 font-bold">—</span>
                <div className="flex-1 p-3 rounded-2xl border border-warm-200 dark:border-white/15 bg-warm-50 dark:bg-ink-800">
                  <div className="text-[10px] uppercase font-bold text-ink-400">Maximum</div>
                  <div className="font-bold text-sm text-ink-900 dark:text-white">
                    {formatPrice(maxPrice)}
                  </div>
                </div>
              </div>

              <input
                type="range"
                min="2000"
                max="45000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full mt-4 h-2 bg-warm-200 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-sunset-coral"
              />
            </div>

            <div className="w-full h-px bg-warm-200 dark:bg-white/10" />

            {/* 2. Rooms & Beds */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-white mb-4">
                Rooms and beds
              </h4>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-ink-700 dark:text-warm-300 mb-2 block">Bedrooms</span>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBedrooms(num)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                          bedrooms === num
                            ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-bold shadow-sm'
                            : 'border border-warm-300 dark:border-white/15 hover:border-ink-900 text-ink-700 dark:text-warm-300'
                        }`}
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-ink-700 dark:text-warm-300 mb-2 block">Beds</span>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBeds(num)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                          beds === num
                            ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-bold shadow-sm'
                            : 'border border-warm-300 dark:border-white/15 hover:border-ink-900 text-ink-700 dark:text-warm-300'
                        }`}
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-warm-200 dark:bg-white/10" />

            {/* 3. Property Type Cards */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-white mb-3">
                Property type
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PROPERTY_TYPES.map((type) => {
                  const isSelected = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-sunset-coral bg-sunset-coral/5 text-sunset-coral font-bold ring-1 ring-sunset-coral'
                          : 'border-warm-200 dark:border-white/10 hover:border-warm-400 text-ink-800 dark:text-warm-200'
                      }`}
                    >
                      <div className="text-xs">{type}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-px bg-warm-200 dark:bg-white/10" />

            {/* 4. Amenities Checkboxes */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-white mb-3">
                Amenities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {POPULAR_AMENITIES.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-sunset-coral border-sunset-coral text-white'
                            : 'border-warm-400 dark:border-white/20'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium text-ink-800 dark:text-warm-200">
                        {amenity}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-warm-200 dark:border-white/10 bg-warm-50 dark:bg-ink-950 shrink-0">
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-ink-600 dark:text-warm-400 underline hover:text-ink-900 dark:hover:text-white"
            >
              Clear all
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-3 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-md hover:shadow-glow-sunset active:scale-95 transition-all"
            >
              Show {totalMatches} stays
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
