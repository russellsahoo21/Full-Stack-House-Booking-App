import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Heart, PlusCircle, User } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

export const MobileTabBar: React.FC = () => {
  const { wishlist } = useWishlist();

  const tabs = [
    { to: '/', label: 'Explore', icon: Compass },
    { to: '/wishlists', label: 'Wishlists', icon: Heart, badge: wishlist.length > 0 ? wishlist.length : undefined },
    { to: '/host', label: 'Host', icon: PlusCircle },
    { to: '/search', label: 'Search', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-ink-950/90 backdrop-blur-xl border-t border-warm-200/80 dark:border-white/10 px-6 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.label}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 relative transition-all duration-200 ${
                  isActive
                    ? 'text-sunset-coral font-semibold scale-105'
                    : 'text-ink-400 dark:text-warm-400 hover:text-ink-700 dark:hover:text-warm-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-sunset-gradient text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
