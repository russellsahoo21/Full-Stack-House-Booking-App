import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showLogoMark?: boolean;
  isLink?: boolean;
  colorClass?: string;
}

export const LogoMark: React.FC<{ size?: number; className?: string; animated?: boolean }> = ({
  size = 36,
  className = '',
  animated = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-[11px] bg-[#111116] border border-white/15 shadow-sm overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 36 36"
        width={size * 0.85}
        height={size * 0.85}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoSunsetGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF5A5F" />
            <stop offset="50%" stopColor="#FFB347" />
            <stop offset="100%" stopColor="#E83E8C" />
          </linearGradient>
        </defs>

        {/* Minimalist Journey Path */}
        {animated ? (
          <motion.path
            d="M 8 26 C 14 26, 12 17, 18 17 C 23 17, 25 13, 24 9.5"
            stroke="url(#logoSunsetGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          <path
            d="M 8 26 C 14 26, 12 17, 18 17 C 23 17, 25 13, 24 9.5"
            stroke="url(#logoSunsetGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Pin Head */}
        <circle cx="24" cy="9.5" r="3.2" fill="url(#logoSunsetGrad)" />
        <circle cx="24" cy="9.5" r="1.3" fill="#111116" />
      </svg>
    </div>
  );
};

export const Wordmark: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  colorClass?: string;
}> = ({
  className = '',
  size = 'md',
  colorClass = 'text-ink-900 dark:text-warm-100',
}) => {
  const fontSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <span
      className={`font-display font-bold tracking-tight inline-flex items-center select-none ${colorClass} ${fontSizes[size]} ${className}`}
    >
      wayfound
    </span>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  showLogoMark = false,
  isLink = true,
  colorClass,
}) => {
  const markSize = size === 'sm' ? 28 : size === 'lg' ? 40 : 34;

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {showLogoMark && (
        <LogoMark size={markSize} className="group-hover:scale-105 transition-transform duration-300" />
      )}
      {showWordmark && <Wordmark size={size} colorClass={colorClass} />}
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sunset-coral rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
};

export const LogoLoader: React.FC<{ size?: number; text?: string }> = ({
  size = 52,
  text = "Finding your way...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <LogoMark size={size} animated={true} />
      {text && (
        <p className="text-sm font-medium text-ink-400 dark:text-warm-300 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};
