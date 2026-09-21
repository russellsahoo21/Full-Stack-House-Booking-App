import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sliders,
  DollarSign,
  Home,
  Users,
  Calendar,
  Lock,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = [
  { name: 'Goa', rate: 18500 },
  { name: 'Manali', rate: 9800 },
  { name: 'Udaipur', rate: 24000 },
  { name: 'Mumbai', rate: 26000 },
  { name: 'Kerala', rate: 21500 },
  { name: 'Coorg', rate: 8200 },
];

const FAQS = [
  {
    q: 'Is my space right for Wayfound?',
    a: 'Wayfound guests seek character, thoughtful architecture, and immersion into local places. From ocean cliff villas in Goa and cedar A-frames in Manali to tranquil tea estate cottages in Coorg, if your space is cared for with love, wanderers will cherish it.',
  },
  {
    q: 'How do I get paid and what are the fees?',
    a: 'Payouts are transferred directly into your Indian bank account via NEFT/RTGS 24 hours after your guests check in. Wayfound charges a simple flat 3% host service fee — one of the lowest in the travel industry.',
  },
  {
    q: 'What protection do I have against damages?',
    a: 'Every reservation automatically includes WayfoundCover: up to ₹1 Crore in guest damage protection and ₹1 Crore in comprehensive liability insurance, with zero deductible and 24/7 priority claims support.',
  },
  {
    q: 'Can I choose my guests and set strict house rules?',
    a: 'Yes. You retain total control. You can require verified guest IDs, set maximum party sizes, specify pet policies, designate quiet hours, and accept bookings manually or through Instant Book.',
  },
  {
    q: 'Do I need to be present during the stay?',
    a: 'Not at all. Many hosts use smart locks or key lockboxes with digital entry codes. You can provide your guests with a self-check-in guide and remain reachable via the Wayfound messaging app.',
  },
];

export const Host: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [nightsPerWeek, setNightsPerWeek] = useState(4);
  const [spaceType, setSpaceType] = useState<'entire' | 'private'>('entire');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic estimate calculation
  const multiplier = spaceType === 'entire' ? 1 : 0.65;
  const estimatedMonthly = Math.round(
    selectedLocation.rate * multiplier * nightsPerWeek * 4.2
  );

  return (
    <div className="w-full pt-28 pb-20">
      {/* 1. HERO SECTION WITH ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider">
              Host on Wayfound
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-ink-950 dark:text-white tracking-tight leading-[1.08]">
              Your space. <br />
              <span className="text-transparent bg-clip-text bg-sunset-gradient">
                Their sanctuary.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-500 dark:text-warm-300 max-w-lg leading-relaxed font-normal">
              Join India’s most thoughtful community of boutique hosts, architects, and estate owners. Welcome wanderers who value design, nature, and quiet luxury.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => alert("Hosting onboarding begins! Setup your listing in 5 minutes.")}
                className="px-8 py-4 rounded-full bg-sunset-gradient text-white text-sm font-bold shadow-md hover:shadow-glow-sunset hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Start hosting today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-ink-400 dark:text-warm-400 font-medium">
                Free to list · 3% host fee
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Earnings Estimator */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl sm:rounded-[36px] glass-panel border border-warm-300/80 dark:border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-warm-200 dark:border-white/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-warm-400">
                  Estimated monthly income
                </span>
                <span className="text-xs font-semibold text-sunset-coral">
                  in {selectedLocation.name}
                </span>
              </div>

              {/* Big Gradient Price Figure */}
              <div className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-sunset-gradient tracking-tight">
                {formatPrice(estimatedMonthly)}
              </div>

              <p className="text-xs text-ink-500 dark:text-warm-400">
                Estimated at <span className="font-semibold text-ink-900 dark:text-white">{nightsPerWeek} nights</span> per week at {formatPrice(Math.round(selectedLocation.rate * multiplier))}/night.
              </p>

              {/* Nights Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold text-ink-700 dark:text-warm-200">
                  <span>Nights booked per week</span>
                  <span className="text-sunset-coral font-bold">{nightsPerWeek} nights</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={nightsPerWeek}
                  onChange={(e) => setNightsPerWeek(Number(e.target.value))}
                  className="w-full h-2.5 bg-warm-200 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-sunset-coral"
                />
                <div className="flex justify-between text-[11px] text-ink-400">
                  <span>1 night</span>
                  <span>4 nights</span>
                  <span>7 nights</span>
                </div>
              </div>

              {/* Location Pill Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-700 dark:text-warm-300 block">
                  Location in India
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => setSelectedLocation(loc)}
                      className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all text-center ${
                        selectedLocation.name === loc.name
                          ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900 shadow-sm'
                          : 'border border-warm-200 dark:border-white/10 text-ink-700 dark:text-warm-300 hover:border-warm-400'
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Space Type Selector */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSpaceType('entire')}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                    spaceType === 'entire'
                      ? 'border-sunset-coral bg-sunset-coral/10 text-sunset-coral font-bold'
                      : 'border-warm-200 dark:border-white/10 text-ink-600 dark:text-warm-400'
                  }`}
                >
                  Entire place
                </button>
                <button
                  type="button"
                  onClick={() => setSpaceType('private')}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                    spaceType === 'private'
                      ? 'border-sunset-coral bg-sunset-coral/10 text-sunset-coral font-bold'
                      : 'border-warm-200 dark:border-white/10 text-ink-600 dark:text-warm-400'
                  }`}
                >
                  Private suite
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE SIMPLE STEPS */}
      <section className="bg-warm-100/60 dark:bg-ink-900/60 py-20 border-y border-warm-200/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-950 dark:text-white tracking-tight">
              Hosting made effortless
            </h2>
            <p className="text-sm text-ink-500 dark:text-warm-400 mt-2">
              From your first photo upload to receiving your monthly earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sunset-gradient flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                1
              </div>
              <h3 className="text-xl font-bold text-ink-950 dark:text-white">
                Showcase your space
              </h3>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-300 leading-relaxed">
                Add photos, describe the atmosphere, highlight unique amenities like plunges or fireplaces, and set your own house rules.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sunset-gradient flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                2
              </div>
              <h3 className="text-xl font-bold text-ink-950 dark:text-white">
                Host on your terms
              </h3>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-300 leading-relaxed">
                Choose the dates you wish to open. Message guests before they arrive, arrange smart check-ins, and share your insider neighborhood tips.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sunset-gradient flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                3
              </div>
              <h3 className="text-xl font-bold text-ink-950 dark:text-white">
                Get paid seamlessly
              </h3>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-300 leading-relaxed">
                Receive direct bank deposits in ₹ INR 24 hours after check-in. Track your bookings, reviews, and revenue in your host dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WAYFOUND COVER FOR HOSTS */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-ink-900 to-ink-950 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Comprehensive Protection
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              WayfoundCover for every host. <br />
              Always included. Always free.
            </h2>

            <p className="text-sm text-white/70 max-w-xl leading-relaxed">
              Top-tier coverage from the moment you accept a booking. Zero deductible, instant photo claims via app.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">₹1 Crore Damage Protection</h4>
                  <p className="text-xs text-white/60">Covers furniture, art, architecture, and landscaping.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">₹1 Crore Liability Insurance</h4>
                  <p className="text-xs text-white/60">Protects in the rare event a guest gets injured on premises.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Deep Cleaning Protection</h4>
                  <p className="text-xs text-white/60">Reimbursement for unexpected deep cleaning fees.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">24/7 Dedicated Safety Line</h4>
                  <p className="text-xs text-white/60">Direct phone line to our senior trust & safety coordinators.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-ink-950 dark:text-white tracking-tight">
            Your questions, answered
          </h2>
          <p className="text-sm text-ink-500 dark:text-warm-400 mt-1">
            Everything you need to know about hosting on Wayfound.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-warm-200/80 dark:border-white/10 overflow-hidden glass-panel"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-ink-900 dark:text-white hover:text-sunset-coral transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-sunset-coral' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-ink-600 dark:text-warm-300 leading-relaxed border-t border-warm-200/60 dark:border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center p-12 rounded-3xl glass-panel border border-warm-200 dark:border-white/10 shadow-lift space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-ink-950 dark:text-white tracking-tight">
            Ready to find your guests?
          </h3>
          <p className="text-sm text-ink-500 dark:text-warm-400 max-w-md mx-auto">
            Take the first step toward welcoming wanderers to your space.
          </p>
          <div className="pt-2">
            <button
              onClick={() => alert("Welcome! Your host registration is starting.")}
              className="px-8 py-4 rounded-full bg-sunset-gradient text-white font-bold text-sm shadow-md hover:shadow-glow-sunset hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get started now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Host;
