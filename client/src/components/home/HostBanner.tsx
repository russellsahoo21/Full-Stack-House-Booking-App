import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const HostBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={containerRef} className="py-16">
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden min-h-[440px] flex items-center shadow-2xl">
        {/* Parallax Background Image */}
        <motion.div
          style={{ y: imageY }}
          className="absolute -inset-y-12 inset-x-0 h-[120%] pointer-events-none"
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Host your architectural retreat"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/60 to-ink-950/20" />
        </motion.div>

        {/* Content Card with Glassmorphism */}
        <div className="relative z-10 max-w-xl p-8 sm:p-14 ml-4 sm:ml-8 my-8 rounded-3xl glass-panel border border-white/20 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Host on Wayfound</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Turn your space into a traveler's sanctuary.
          </h3>

          <p className="text-sm text-white/80 leading-relaxed mb-6">
            Whether it's an oceanfront laterite villa, a cedar mountain cabin, or a family heritage haveli, share it with guests who care deeply about architecture and quiet destinations.
          </p>

          <div className="flex items-center gap-3 text-xs text-white/90 mb-6 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>₹1 Crore Wayfound Host Protection included</span>
          </div>

          <Link
            to="/host"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-sunset-gradient text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-glow-sunset hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Learn about hosting</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
