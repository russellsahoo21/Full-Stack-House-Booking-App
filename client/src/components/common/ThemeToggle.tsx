import React from 'react';
import ReactDOM from 'react-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Check if View Transitions API is available and user doesn't prefer reduced motion
    const startViewTransition = (document as unknown as { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }).startViewTransition;

    if (
      typeof startViewTransition !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      toggleTheme();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const right = window.innerWidth - x;
    const bottom = window.innerHeight - y;
    const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

    const transition = startViewTransition.call(document, () => {
      ReactDOM.flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full glass-pill text-ink-700 dark:text-warm-100 hover:bg-white/80 dark:hover:bg-ink-700 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sunset-coral ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {isDark ? <Sun className="w-4 h-4 text-sunset-amber" /> : <Moon className="w-4 h-4 text-ink-800" />}
      </motion.div>
    </button>
  );
};
