import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Instagram, Twitter, Youtube, Compass } from 'lucide-react';
import { LogoMark } from '@/components/common/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-warm-100 dark:bg-ink-950 border-t border-warm-200/80 dark:border-white/5 pt-16 pb-24 sm:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink-900 dark:text-warm-100 mb-4">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-ink-500 dark:text-warm-400">
              <li><a href="#help" className="hover:text-sunset-coral transition-colors">Help Center</a></li>
              <li><a href="#aircover" className="hover:text-sunset-coral transition-colors">Wayfound Protection</a></li>
              <li><a href="#anti-discrimination" className="hover:text-sunset-coral transition-colors">Anti-discrimination</a></li>
              <li><a href="#disability-support" className="hover:text-sunset-coral transition-colors">Accessibility</a></li>
              <li><a href="#cancellation" className="hover:text-sunset-coral transition-colors">Cancellation options</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink-900 dark:text-warm-100 mb-4">
              Hosting
            </h4>
            <ul className="space-y-3 text-sm text-ink-500 dark:text-warm-400">
              <li><Link to="/host" className="hover:text-sunset-coral transition-colors">Host on Wayfound</Link></li>
              <li><a href="#host-cover" className="hover:text-sunset-coral transition-colors">WayfoundCover for Hosts</a></li>
              <li><a href="#community-forum" className="hover:text-sunset-coral transition-colors">Hosting resources</a></li>
              <li><a href="#community" className="hover:text-sunset-coral transition-colors">Community forum</a></li>
              <li><a href="#responsible-hosting" className="hover:text-sunset-coral transition-colors">Responsible hosting</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink-900 dark:text-warm-100 mb-4">
              Destinations
            </h4>
            <ul className="space-y-3 text-sm text-ink-500 dark:text-warm-400">
              <li><Link to="/search?where=Goa" className="hover:text-sunset-coral transition-colors">Goa Beachfronts</Link></li>
              <li><Link to="/search?where=Manali" className="hover:text-sunset-coral transition-colors">Manali Alpine Chalets</Link></li>
              <li><Link to="/search?where=Udaipur" className="hover:text-sunset-coral transition-colors">Udaipur Royal Havelis</Link></li>
              <li><Link to="/search?where=Kerala" className="hover:text-sunset-coral transition-colors">Kerala Backwater Villas</Link></li>
              <li><Link to="/search?where=Ladakh" className="hover:text-sunset-coral transition-colors">Ladakh Celestial Domes</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink-900 dark:text-warm-100 mb-4">
              Wayfound
            </h4>
            <ul className="space-y-3 text-sm text-ink-500 dark:text-warm-400">
              <li><a href="#newsroom" className="hover:text-sunset-coral transition-colors">Newsroom</a></li>
              <li><a href="#features" className="hover:text-sunset-coral transition-colors">New features</a></li>
              <li><a href="#careers" className="hover:text-sunset-coral transition-colors">Careers</a></li>
              <li><a href="#investors" className="hover:text-sunset-coral transition-colors">Investors</a></li>
              <li><a href="#emergency" className="hover:text-sunset-coral transition-colors">Wayfound.org stays</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with Language & Currency & Social */}
        <div className="pt-8 border-t border-warm-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-500 dark:text-warm-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 Wayfound, Inc.</span>
            <span>·</span>
            <a href="#privacy" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#terms" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#sitemap" className="hover:underline">Sitemap</a>
            <span>·</span>
            <span className="text-sunset-coral font-medium">Find your way to stay.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-medium text-ink-700 dark:text-warm-200">
              <Globe className="w-3.5 h-3.5" />
              <span>English (IN)</span>
              <span className="font-semibold ml-2">₹ INR</span>
            </div>

            <div className="flex items-center gap-3">
              <a href="#instagram" aria-label="Instagram" className="hover:text-sunset-coral transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#twitter" aria-label="Twitter" className="hover:text-sunset-coral transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#youtube" aria-label="YouTube" className="hover:text-sunset-coral transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Giant faded "wayfound" wordmark across full width, gradient fade into background */}
      <div className="mt-8 sm:mt-12 w-full select-none pointer-events-none overflow-hidden flex justify-center pb-2">
        <div className="text-[17vw] leading-none font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-ink-900/35 via-ink-900/12 to-transparent dark:from-white/45 dark:via-white/18 dark:to-transparent whitespace-nowrap">
          wayfound
        </div>
      </div>
    </footer>
  );
};
