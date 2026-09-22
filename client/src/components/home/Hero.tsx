import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, ChevronDown } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useNavigate } from 'react-router-dom';

const TRENDING_CHIPS = [
  { label: 'Goa beachfronts', query: 'Goa' },
  { label: 'Manali cedar chalets', query: 'Manali' },
  { label: 'Udaipur royal havelis', query: 'Udaipur' },
  { label: 'Kerala backwaters', query: 'Kerala' },
  { label: 'Ladakh star domes', query: 'Ladakh' },
];

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Programmatic autoplay initiation on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay restricted until user interaction
            setIsPlaying(false);
          });
      }
    }
  }, []);

  // Parallax on scroll: video scales and subtle fade
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const headlineWords = "Find a place that feels like you.".split(" ");

  return (
    <div
      ref={heroRef}
      className="relative z-40 w-full h-[100svh] min-h-[680px] flex flex-col justify-between pt-24 pb-8 select-none"
    >
      {/* ================= BACKGROUND VIDEO / POSTER FALLBACK ================= */}
      <motion.div
        style={{ scale: videoScale, opacity: videoOpacity }}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          onPlaying={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>

        {/* Ken Burns zoom fallback for poster image if video is loading */}
        {!videoLoaded && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center animate-pulse-subtle scale-105"
            style={{
              backgroundImage: `url('/images/hero-poster.jpg')`,
            }}
          />
        )}

        {/* Film grain noise overlay */}
        <div className="absolute inset-0 film-grain pointer-events-none" />

        {/* Multi-layered cinematic contrast gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-ink-950/75 pointer-events-none" />
      </motion.div>

      {/* ================= CENTER HERO CONTENT ================= */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-40 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto flex flex-col items-center"
      >
        {/* Editorial Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm"
        >
          <span>Curated Stays Across India</span>
        </motion.div>

        {/* Headline with word-by-word reveal */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-4 drop-shadow-md">
          {headlineWords.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.7,
                delay: 0.15 + idx * 0.08,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="inline-block mr-[0.25em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto font-normal leading-relaxed mb-8 drop-shadow"
        >
          Find your way to stay. Handcrafted cliffside villas, deodar chalets, and royal lakeside retreats.
        </motion.p>

        {/* Floating Glass Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.75, ease: 'easeOut' }}
          className="w-full"
        >
          <SearchBar />
        </motion.div>
      </motion.div>

      {/* ================= HERO FOOTER CONTROLS & CHIPS ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Trending Glass Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-white/60 mr-1 shrink-0">
            Trending:
          </span>
          {TRENDING_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => navigate(`/search?where=${encodeURIComponent(chip.query)}`)}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium whitespace-nowrap transition-all shadow-sm hover:scale-105"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Video Controls & Scroll Indicator */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Scroll cue */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-white/60 font-medium animate-bounce">
            <span>Scroll</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>

          {/* Small glass pause/play + mute/unmute controller */}
          <div className="flex items-center p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-white/90 shadow-md">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="w-px h-3 bg-white/20 mx-1" />
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
