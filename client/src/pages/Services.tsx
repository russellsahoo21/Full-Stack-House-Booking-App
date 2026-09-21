import React, { useState } from 'react';
import { mockServices, Service } from '@/data/services';
import {
  Sparkles,
  CheckCircle2,
  X,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
  HeartHandshake,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [stayLocation, setStayLocation] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const categories = ['All', 'Culinary', 'Wellness', 'Transport', 'Concierge'];

  const filtered =
    selectedCategory === 'All'
      ? mockServices
      : mockServices.filter((s) => s.category === selectedCategory);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSuccess(true);
    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#FF5A5F', '#FFB347', '#E83E8C'],
      });
    } catch {}
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen">
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
            <div className="relative sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-warm-200 dark:bg-ink-800">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-bold">
                {service.category}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:w-3/5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-ink-950 dark:text-white mb-1">
                  {service.title}
                </h3>
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
                  <span className="text-xs text-ink-400 block">Pricing</span>
                  <span className="text-sm font-extrabold text-ink-950 dark:text-white">
                    {service.priceTag}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveService(service);
                    setRequestSuccess(false);
                    setStayLocation('');
                    setSpecialNotes('');
                  }}
                  className="px-4 py-2 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-sm hover:shadow-glow-sunset active:scale-95 transition-all"
                >
                  Request service
                </button>
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

      {/* Service Request Modal */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-warm-200 dark:border-white/15 z-10 space-y-5"
            >
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-warm-200 dark:hover:bg-ink-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {requestSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-ink-950 dark:text-white">
                    Request Coordinated!
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-300 max-w-sm mx-auto">
                    Our concierge team has received your enquiry for{' '}
                    <span className="font-bold text-ink-900 dark:text-white">
                      {activeService.title}
                    </span>
                    . We are syncing with your stay's property manager and will confirm details via WhatsApp.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setActiveService(null)}
                      className="px-6 py-2.5 rounded-full bg-sunset-gradient text-white text-xs font-bold"
                    >
                      Return to Services
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <img
                      src={activeService.image}
                      alt={activeService.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-sunset-coral uppercase tracking-wider">
                        {activeService.category}
                      </span>
                      <h4 className="font-bold text-base text-ink-950 dark:text-white">
                        {activeService.title}
                      </h4>
                      <p className="text-xs text-ink-500 dark:text-warm-400">
                        {activeService.priceTag}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-warm-200/60 dark:border-white/10">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 dark:text-warm-200 mb-1">
                        Your Stay or Villa Location
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Villa Mar Azul, Anjuna or Booking ID"
                        value={stayLocation}
                        onChange={(e) => setStayLocation(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-warm-100/70 dark:bg-ink-800/80 border border-warm-300/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 text-ink-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-700 dark:text-warm-200 mb-1">
                        Preferred Date & Specific Requests
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Saturday evening dinner for 4 guests, 2 vegetarian, no shellfish..."
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-warm-100/70 dark:bg-ink-800/80 border border-warm-300/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 text-ink-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-warm-200/60 dark:border-white/10">
                    <span className="text-xs text-ink-400">
                      No upfront charge until confirmed
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunset-gradient text-white text-xs font-bold shadow-md hover:shadow-glow-sunset"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
