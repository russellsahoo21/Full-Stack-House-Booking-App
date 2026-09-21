import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Menu, User, Search } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const currentTab = location.pathname.startsWith('/experiences')
    ? 'experiences'
    : location.pathname.startsWith('/services')
    ? 'services'
    : 'stays';

  const handleTabClick = (tab: 'stays' | 'experiences' | 'services') => {
    if (tab === 'stays') {
      navigate('/');
    } else if (tab === 'experiences') {
      navigate('/experiences');
    } else if (tab === 'services') {
      navigate('/services');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.45;
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For non-home pages, navbar is always glass
  const showGlass = !isHome || isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showGlass
          ? 'bg-white/75 dark:bg-ink-900/80 backdrop-blur-xl border-b border-warm-200/50 dark:border-white/10 shadow-sm py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <Logo
              size="md"
              colorClass={!showGlass ? 'text-white' : undefined}
            />
          </div>

          {/* Center Tabs or Compact Search Pill */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <AnimatePresence mode="wait">
              {showGlass && isHome ? (
                // Compact Search Pill when scrolled on Home
                <motion.button
                  key="compact-search"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate('/search')}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-pill text-xs font-medium text-ink-700 dark:text-warm-200 shadow-sm hover:shadow-md transition-all border border-warm-300/40 dark:border-white/10"
                >
                  <span className="font-semibold text-ink-900 dark:text-white">Anywhere</span>
                  <span className="w-1 h-1 rounded-full bg-ink-300 dark:bg-ink-600" />
                  <span>Any week</span>
                  <span className="w-1 h-1 rounded-full bg-ink-300 dark:bg-ink-600" />
                  <span className="text-ink-500 dark:text-ink-400">Add guests</span>
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sunset-gradient text-white ml-1">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                </motion.button>
              ) : (
                // Center Experience Tabs
                <motion.div
                  key="nav-tabs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex items-center gap-1 p-1"
                >
                  {(['stays', 'experiences', 'services'] as const).map((tab) => {
                    const isActive = currentTab === tab;
                    const labels = {
                      stays: 'Stays',
                      experiences: 'Experiences',
                      services: 'Services',
                    };

                    return (
                      <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                          isActive
                            ? showGlass
                              ? 'text-ink-900 dark:text-white font-semibold'
                              : 'text-white font-semibold'
                            : showGlass
                            ? 'text-ink-500 dark:text-warm-400 hover:text-ink-900 dark:hover:text-white'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        {labels[tab]}
                        {isActive && (
                          <motion.div
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-sunset-gradient shadow-[0_0_8px_rgba(255,90,95,0.7)]"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/host"
              className={`hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                showGlass
                  ? 'text-ink-800 dark:text-warm-100 hover:bg-warm-200/60 dark:hover:bg-ink-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Become a host
            </Link>

            {/* Language/Globe icon */}
            <button
              className={`hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                showGlass
                  ? 'text-ink-700 dark:text-warm-200 hover:bg-warm-200/60 dark:hover:bg-ink-800'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Language and currency"
              title="India (INR ₹)"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle
              className={
                !showGlass
                  ? 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                  : ''
              }
            />

            {/* Profile Menu Pill */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-2.5 p-1.5 pl-3 rounded-full border transition-all shadow-sm ${
                  showGlass
                    ? 'border-warm-300/60 dark:border-white/10 hover:shadow-md bg-white/70 dark:bg-ink-800/70 text-ink-800 dark:text-warm-100'
                    : 'border-white/25 hover:border-white/40 bg-black/20 text-white backdrop-blur-md'
                }`}
                aria-label="User menu"
              >
                <Menu className="w-4 h-4" />
                <div className="w-7 h-7 rounded-full bg-sunset-gradient flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  <User className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 rounded-2xl glass-panel shadow-xl py-2 z-50 border border-warm-200/80 dark:border-white/10"
                  >
                    <div className="px-4 py-2 border-b border-warm-200/60 dark:border-white/5">
                      <p className="text-xs text-ink-400 dark:text-warm-400">Welcome to Wayfound</p>
                      <p className="text-sm font-semibold text-ink-900 dark:text-white">Find your way to stay</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/wishlists"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                      >
                        Wishlists
                      </Link>
                      <Link
                        to="/experiences"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                      >
                        Experiences
                      </Link>
                      <Link
                        to="/services"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                      >
                        Services & Concierge
                      </Link>
                      <Link
                        to="/host"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                      >
                        Host on Wayfound
                      </Link>
                      <Link
                        to="/search"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-ink-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-ink-800/60 transition-colors"
                      >
                        Explore all stays
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
