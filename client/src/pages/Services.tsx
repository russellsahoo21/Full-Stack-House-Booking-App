import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockServices, Service } from '@/data/services';
import { servicesApi } from '@/services/api';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [services, setServices] = useState<Service[]>(mockServices);

  useEffect(() => {
    let isMounted = true;
    servicesApi
      .getServices()
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          setServices(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', 'Culinary', 'Wellness', 'Transport', 'Concierge'];

  const filtered =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Ambient Atmospheric Background Image */}
      <div className="absolute top-0 left-0 right-0 h-[580px] pointer-events-none select-none overflow-hidden z-0">
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="w-full h-full object-cover object-center opacity-25 dark:opacity-15 scale-105 filter blur-[0.5px]"
        />
        {/* Smooth gradient fade to page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        {/* Soft radial sunset glow in the center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sunset-gradient opacity-10 dark:opacity-15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wayfound Concierge & Services</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-3">
            Tailored In-Stay Luxury
          </h1>
          <p className="text-sm sm:text-base text-ink-500 dark:text-warm-300">
            Elevate your escape with private chefs, certified wellness therapists, and seamless chauffeur transfers coordinated directly with your stay.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 shadow-sm'
                  : 'border border-warm-300 dark:border-white/15 text-ink-700 dark:text-warm-300 hover:border-ink-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((service) => (
            <motion.div
              key={service._id}
              whileHover={{ y: -4 }}
              className="flex flex-col sm:flex-row rounded-3xl overflow-hidden glass-panel border border-warm-200/80 dark:border-white/10 shadow-sm hover:shadow-lift transition-all group"
            >
              {/* Image Box */}
              <Link
                to={`/service/${service._id}`}
                className="relative sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-warm-200 dark:bg-ink-800 block shrink-0"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-bold">
                  {service.category}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 dark:bg-ink-900/90 text-ink-950 dark:text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-sunset-amber text-sunset-amber" />
                  <span>{service.rating}</span>
                </div>
              </Link>

              {/* Details */}
              <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <Link to={`/service/${service._id}`}>
                    <h3 className="text-lg font-bold text-ink-950 dark:text-white mb-1 hover:text-sunset-coral transition-colors">
                      {service.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-sunset-coral font-medium mb-3">
                    {service.tagline}
                  </p>
                  <p className="text-xs text-ink-500 dark:text-warm-400 line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Feature checklist */}
                  <div className="space-y-1.5 mb-5">
                    {service.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2 text-xs text-ink-700 dark:text-warm-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-warm-200/60 dark:border-white/5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-ink-400 block font-medium">Pricing</span>
                    <span className="text-sm font-extrabold text-ink-950 dark:text-white">
                      {service.priceTag}
                    </span>
                  </div>
                  <Link
                    to={`/service/${service._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-sm hover:shadow-glow-sunset active:scale-95 transition-all"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-16 rounded-3xl p-8 bg-warm-100/70 dark:bg-ink-900/50 border border-warm-200/70 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sunset-gradient flex items-center justify-center text-white shrink-0 shadow-md">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-ink-950 dark:text-white text-base">
                The Wayfound White-Glove Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400">
                All culinary chefs, drivers, and wellness practitioners are background-checked, insured, and verified.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-ink-700 dark:text-warm-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> ₹5,00,000 Damage & Hygiene Cover
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
