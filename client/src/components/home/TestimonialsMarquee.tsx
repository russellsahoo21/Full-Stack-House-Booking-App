import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Kabir & Tara Sen',
    location: 'Travelers from Bengaluru',
    stay: 'The Cliff Sanctuary, Vagator',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'We spent five days working from the cliff edge with the ocean beneath us. Wayfound curates places with soul, not just beds.',
  },
  {
    name: 'Devika Singhal',
    location: 'Architect from New Delhi',
    stay: 'Rawla Pichola, Udaipur',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    quote: 'The 250-year-old fresco work was preserved with so much honesty. The host greeted us with rose petal tea on arrival.',
  },
  {
    name: 'Neil Robertson',
    location: 'Photographer from London',
    stay: 'Nubra Celestial Dome, Ladakh',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'Waking up inside an insulated glass dome with the Milky Way above and snow mountains all around. Beyond words.',
  },
  {
    name: 'Priyanka Chopra-Verma',
    location: 'Author from Mumbai',
    stay: 'The Canopy Treehouse, Coorg',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    quote: 'High-speed fiber in the middle of a 100-acre coffee estate. Completed two book chapters in total peace.',
  },
  {
    name: 'Arjun & Zoya Kapoor',
    location: 'Designers from Pune',
    stay: 'Solang Cedar Chalet, Manali',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'The wood stove, the deodar scent, the snowfall at dusk. It felt like living inside an architectural editorial.',
  },
];

export const TestimonialsMarquee: React.FC = () => {
  return (
    <section className="py-20 overflow-hidden border-t border-warm-200/60 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white">
          Loved by wandering souls
        </h2>
        <p className="text-sm text-ink-500 dark:text-warm-400 mt-1">
          Unfiltered reflections from guests who found their way.
        </p>
      </div>

      {/* Marquee Row: paused on hover */}
      <div className="relative w-full flex overflow-x-hidden group">
        <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused] shrink-0">
          {TESTIMONIALS.concat(TESTIMONIALS).map((item, idx) => (
            <div
              key={idx}
              className="w-[340px] sm:w-[400px] p-6 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 shadow-sm shrink-0 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-sunset-amber mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-ink-700 dark:text-warm-200 italic leading-relaxed mb-4">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-warm-200/50 dark:border-white/5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sunset-coral/30"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h4 className="text-xs font-bold text-ink-900 dark:text-white">{item.name}</h4>
                  <p className="text-[11px] text-ink-400 dark:text-warm-400">{item.stay}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
