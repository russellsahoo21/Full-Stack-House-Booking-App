import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: string; // e.g. 'aspect-[4/3]', 'aspect-video', 'aspect-square'
  containerClassName?: string;
  fallbackSrc?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-[4/3]',
  className,
  containerClassName,
  width = 600,
  height = 450,
  fallbackSrc = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-warm-200 dark:bg-ink-800',
        aspectRatio,
        containerClassName
      )}
    >
      {/* Shimmer skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-warm-200 via-warm-100 to-warm-200 dark:from-ink-800 dark:via-ink-700 dark:to-ink-800" />
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt || 'Stay preview'}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          'w-full h-full object-cover transition-all duration-700 ease-out',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
          className
        )}
        {...props}
      />
    </div>
  );
};
