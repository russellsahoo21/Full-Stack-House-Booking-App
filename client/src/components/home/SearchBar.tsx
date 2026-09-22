import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POPULAR_DESTINATIONS = [
  { city: 'Goa', desc: 'Sun-drenched beaches & cliffside villas', state: 'Goa' },
  { city: 'Manali', desc: 'Cedar forests & snow-capped peaks', state: 'Himachal Pradesh' },
  { city: 'Udaipur', desc: 'Lake Pichola & royal Mewari havelis', state: 'Rajasthan' },
  { city: 'Kerala Backwaters', desc: 'Private teak houseboats & lagoons', state: 'Kerala' },
  { city: 'Coorg', desc: 'Misty coffee estate treehouses', state: 'Karnataka' },
  { city: 'Ladakh', desc: 'Celestial stargazing domes & passes', state: 'Ladakh' },
  { city: 'Pondicherry', desc: 'Bougainvillea villas in White Town', state: 'Puducherry' },
];

export const SearchBar: React.FC<{ isCompact?: boolean; className?: string }> = ({
  isCompact = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState<'where' | 'checkIn' | 'checkOut' | 'who' | null>(null);

  // Form states
  const [where, setWhere] = useState('');
  const [checkIn, setCheckIn] = useState('Nov 14');
  const [checkOut, setCheckOut] = useState('Nov 19');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const totalGuests = adults + children;
  const guestText = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}${
    pets > 0 ? `, ${pets} pet${pets !== 1 ? 's' : ''}` : ''
  }`;

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveSegment(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSegment(null);
    const params = new URLSearchParams();
    if (where.trim()) params.set('where', where.trim());
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (totalGuests > 0) params.set('guests', totalGuests.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto ${
        activeSegment ? 'z-50' : 'z-30'
      } ${className}`}
    >
      <form
        onSubmit={handleSearch}
        className={`relative flex flex-col md:flex-row items-center rounded-3xl md:rounded-full shadow-2xl transition-all duration-300 ${
          activeSegment
            ? 'bg-white dark:bg-ink-900 border border-warm-300 dark:border-white/20'
            : 'glass-panel border border-white/40 dark:border-white/10 hover:border-white/60 shadow-glass'
        } p-2 md:p-1.5`}
      >
        {/* SEGMENT 1: WHERE */}
        <div
          onClick={() => setActiveSegment('where')}
          className={`w-full md:w-1/3 px-6 py-3.5 rounded-2xl md:rounded-full cursor-pointer transition-all duration-200 text-left ${
            activeSegment === 'where'
              ? 'bg-white dark:bg-ink-800 shadow-md ring-1 ring-black/5 dark:ring-white/10'
              : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-700 dark:text-warm-300">
            Where
          </div>
          <input
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="Where to next?"
            className="w-full bg-transparent text-sm font-medium text-ink-900 dark:text-white placeholder:text-ink-400 dark:placeholder:text-warm-400 focus:outline-none truncate"
          />
        </div>

        <div className="hidden md:block w-px h-8 bg-warm-300/60 dark:bg-white/10 mx-1" />

        {/* SEGMENT 2: CHECK IN */}
        <div
          onClick={() => setActiveSegment('checkIn')}
          className={`w-full md:w-1/5 px-5 py-3.5 rounded-2xl md:rounded-full cursor-pointer transition-all duration-200 text-left ${
            activeSegment === 'checkIn'
              ? 'bg-white dark:bg-ink-800 shadow-md ring-1 ring-black/5 dark:ring-white/10'
              : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-700 dark:text-warm-300">
            Check in
          </div>
          <div className="text-sm font-medium text-ink-900 dark:text-white truncate">
            {checkIn || 'Add dates'}
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-warm-300/60 dark:bg-white/10 mx-1" />

        {/* SEGMENT 3: CHECK OUT */}
        <div
          onClick={() => setActiveSegment('checkOut')}
          className={`w-full md:w-1/5 px-5 py-3.5 rounded-2xl md:rounded-full cursor-pointer transition-all duration-200 text-left ${
            activeSegment === 'checkOut'
              ? 'bg-white dark:bg-ink-800 shadow-md ring-1 ring-black/5 dark:ring-white/10'
              : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-700 dark:text-warm-300">
            Check out
          </div>
          <div className="text-sm font-medium text-ink-900 dark:text-white truncate">
            {checkOut || 'Add dates'}
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-warm-300/60 dark:bg-white/10 mx-1" />

        {/* SEGMENT 4: WHO */}
        <div
          onClick={() => setActiveSegment('who')}
          className={`w-full md:w-1/4 px-5 py-3.5 rounded-2xl md:rounded-full cursor-pointer transition-all duration-200 text-left flex items-center justify-between ${
            activeSegment === 'who'
              ? 'bg-white dark:bg-ink-800 shadow-md ring-1 ring-black/5 dark:ring-white/10'
              : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
          }`}
        >
          <div className="truncate">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-700 dark:text-warm-300">
              Who
            </div>
            <div className="text-sm font-medium text-ink-900 dark:text-white truncate">
              {guestText}
            </div>
          </div>

          {/* Gradient Expanding Search Button */}
          <button
            type="submit"
            className="group/btn relative flex items-center justify-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-sunset-gradient text-white font-bold text-xs shadow-md hover:shadow-glow-sunset hover:scale-[1.03] active:scale-[0.98] transition-all ml-2 shrink-0"
            aria-label="Search stays"
          >
            <Search className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover/btn:max-w-xs transition-all duration-300 ease-out font-display tracking-wide">
              Search
            </span>
          </button>
        </div>
      </form>

      {/* ================= POPOVERS ================= */}
      <AnimatePresence>
        {/* Destination Autocomplete Dropdown */}
        {activeSegment === 'where' && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-3 w-full md:w-[480px] rounded-3xl bg-white/95 dark:bg-ink-900/95 backdrop-blur-2xl shadow-2xl p-4 border border-warm-200/80 dark:border-white/10 z-[70] overflow-hidden"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-warm-400 px-3 py-2">
              Trending Destinations across India
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {POPULAR_DESTINATIONS.map((dest) => (
                <div
                  key={dest.city}
                  onClick={() => {
                    setWhere(dest.city);
                    setActiveSegment('checkIn');
                  }}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-warm-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-2xl bg-warm-200 dark:bg-ink-800 flex items-center justify-center text-sunset-coral shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink-900 dark:text-white">
                      {dest.city}
                    </div>
                    <div className="text-xs text-ink-500 dark:text-warm-400">
                      {dest.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Dual-Month Calendar Popover */}
        {(activeSegment === 'checkIn' || activeSegment === 'checkOut') && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 md:left-1/4 mt-3 w-full md:w-[540px] rounded-3xl bg-white/95 dark:bg-ink-900/95 backdrop-blur-2xl shadow-2xl p-6 border border-warm-200/80 dark:border-white/15 z-[70]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-warm-200/60 dark:border-white/10 mb-4">
              <div>
                <h4 className="text-sm font-bold text-ink-900 dark:text-white">Select Dates</h4>
                <p className="text-xs text-ink-500 dark:text-warm-400">Flexible getaway dates in November</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn('Nov 14');
                    setCheckOut('Nov 19');
                    setActiveSegment('who');
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-sunset-gradient-subtle text-sunset-coral hover:bg-sunset-coral/20 transition-colors"
                >
                  This Weekend (Nov 14–19)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn('Nov 21');
                    setCheckOut('Nov 26');
                    setActiveSegment('who');
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-warm-200 dark:bg-ink-800 text-ink-700 dark:text-warm-200 hover:bg-warm-300 dark:hover:bg-ink-700 transition-colors"
                >
                  Next Week
                </button>
              </div>
            </div>

            {/* Quick Mock Month Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="font-bold text-ink-400 py-1">{d}</span>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isSelected = day >= 14 && day <= 19;
                const isEndpoint = day === 14 || day === 19;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (activeSegment === 'checkIn') {
                        setCheckIn(`Nov ${day}`);
                        setActiveSegment('checkOut');
                      } else {
                        setCheckOut(`Nov ${day}`);
                        setActiveSegment('who');
                      }
                    }}
                    className={`py-2 rounded-xl text-xs font-medium transition-all ${
                      isEndpoint
                        ? 'bg-sunset-gradient text-white font-bold shadow-sm'
                        : isSelected
                        ? 'bg-sunset-coral/15 text-sunset-coral dark:text-warm-100 font-semibold'
                        : 'hover:bg-warm-200 dark:hover:bg-ink-800 text-ink-700 dark:text-warm-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Who / Guest Counter Popover */}
        {activeSegment === 'who' && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-full md:w-80 rounded-3xl bg-white/95 dark:bg-ink-900/95 backdrop-blur-2xl shadow-2xl p-5 border border-warm-200/80 dark:border-white/15 z-[70] space-y-4"
          >
            {/* Adults */}
            <div className="flex items-center justify-between pb-3 border-b border-warm-200/60 dark:border-white/10">
              <div>
                <div className="text-sm font-bold text-ink-900 dark:text-white">Adults</div>
                <div className="text-xs text-ink-500 dark:text-warm-400">Ages 13 or above</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  className="w-8 h-8 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center text-ink-700 dark:text-warm-200 disabled:opacity-40 hover:bg-warm-200 dark:hover:bg-ink-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-4 text-center font-bold text-sm">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="w-8 h-8 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center text-ink-700 dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-ink-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between pb-3 border-b border-warm-200/60 dark:border-white/10">
              <div>
                <div className="text-sm font-bold text-ink-900 dark:text-white">Children</div>
                <div className="text-xs text-ink-500 dark:text-warm-400">Ages 2–12</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                  className="w-8 h-8 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center text-ink-700 dark:text-warm-200 disabled:opacity-40 hover:bg-warm-200 dark:hover:bg-ink-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-4 text-center font-bold text-sm">{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  className="w-8 h-8 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center text-ink-700 dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-ink-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pets */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-ink-900 dark:text-white">Pets</div>
                <div className="text-xs text-ink-500 dark:text-warm-400">Bringing a service animal?</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPets(Math.max(0, pets - 1))}
                  disabled={pets <= 0}
                  className="w-8 h-8 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center text-ink-700 dark:text-warm-200 disabled:opacity-40 hover:bg-warm-200 dark:hover:bg-ink-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-4 text-center font-bold text-sm">{pets}</span>
                <button
                  type="button"
                  onClick={() => setPets(pets + 1)}
                  className="w-8 h-8 rounded-full border border-warm-300 dark:border-white/20 flex items-center justify-center text-ink-700 dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-ink-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveSegment(null)}
                className="w-full py-2.5 rounded-full bg-warm-200 dark:bg-ink-800 hover:bg-warm-300 dark:hover:bg-ink-700 text-ink-900 dark:text-white font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
