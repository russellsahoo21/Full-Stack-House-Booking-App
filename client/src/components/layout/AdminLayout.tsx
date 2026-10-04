import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine current page title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/properties')) return 'Properties';
    if (path.includes('/admin/bookings')) return 'Bookings & Reservations';
    if (path.includes('/admin/users')) return 'Users & Hosts';
    if (path.includes('/admin/reviews')) return 'Review Moderation';
    if (path.includes('/admin/settings')) return 'Settings';
    return 'Overview';
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'grid_view', section: 'Overview' },
    { label: 'Properties', path: '/admin/properties', icon: 'villa', section: 'Management' },
    { label: 'Bookings', path: '/admin/bookings', icon: 'calendar_month', section: 'Management' },
    { label: 'Users', path: '/admin/users', icon: 'group', section: 'Management' },
    { label: 'Reviews', path: '/admin/reviews', icon: 'hotel_class', section: 'Management' },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9ff] dark:bg-[#0c0d14] text-[#151c27] dark:text-[#ebf1ff] font-sans transition-colors duration-200">
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full ${
          sidebarCollapsed ? 'w-20' : 'w-[260px]'
        } bg-white dark:bg-[#12131e] border-r border-[#e2e8f8] dark:border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-all duration-300`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          {/* Brand Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#e2e8f8]/60 dark:border-white/5">
            <Link to="/admin" className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#b52603] to-[#ff5a36] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                W
              </div>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg tracking-tight text-[#151c27] dark:text-white">
                    Wayfound
                  </span>
                  <span className="bg-[#e7eefe] dark:bg-white/10 text-[#555f6f] dark:text-[#a0aec0] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Admin
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4">
            <nav className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <div className="pt-2 pb-1 px-3">
                  <span className="text-[11px] font-bold text-[#5b403a]/70 dark:text-gray-400 uppercase tracking-widest">
                    Overview
                  </span>
                </div>
              )}

              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#b52603] text-white font-semibold shadow-sm'
                      : 'text-[#555f6f] dark:text-gray-300 hover:bg-[#f0f3ff] dark:hover:bg-white/5 hover:text-[#151c27] dark:hover:text-white font-medium text-sm'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`
                }
                title={sidebarCollapsed ? 'Dashboard' : undefined}
              >
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                {!sidebarCollapsed && <span>Dashboard</span>}
              </NavLink>

              {!sidebarCollapsed && (
                <div className="pt-4 pb-1 px-3">
                  <span className="text-[11px] font-bold text-[#5b403a]/70 dark:text-gray-400 uppercase tracking-widest">
                    Management
                  </span>
                </div>
              )}

              {navItems.slice(1).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#b52603] text-white font-semibold shadow-sm'
                        : 'text-[#555f6f] dark:text-gray-300 hover:bg-[#f0f3ff] dark:hover:bg-white/5 hover:text-[#151c27] dark:hover:text-white font-medium text-sm'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              ))}

              {!sidebarCollapsed && (
                <div className="pt-4 pb-1 px-3">
                  <span className="text-[11px] font-bold text-[#5b403a]/70 dark:text-gray-400 uppercase tracking-widest">
                    Quick Links
                  </span>
                </div>
              )}

              <Link
                to="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#555f6f] dark:text-gray-300 hover:bg-[#f0f3ff] dark:hover:bg-white/5 hover:text-[#151c27] dark:hover:text-white font-medium text-sm transition-all ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                title={sidebarCollapsed ? 'Consumer Storefront' : undefined}
              >
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                {!sidebarCollapsed && <span>Live Storefront</span>}
              </Link>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 m-3 bg-[#f0f3ff] dark:bg-white/5 rounded-2xl flex items-center justify-between border border-[#e2e8f8]/60 dark:border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-white/50"
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
            />
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="font-semibold text-xs text-[#151c27] dark:text-white truncate leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-[#555f6f] dark:text-gray-400 truncate leading-tight mt-0.5">
                  Executive Admin
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-[#555f6f] dark:text-gray-400 hover:text-[#151c27] dark:hover:text-white p-1 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors"
            type="button"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {sidebarCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
            </span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div
        className={`${
          sidebarCollapsed ? 'pl-20' : 'pl-[260px]'
        } flex flex-col min-h-screen transition-all duration-300`}
      >
        {/* TOP FIXED APP HEADER */}
        <header
          className={`fixed top-0 ${
            sidebarCollapsed ? 'left-20' : 'left-[260px]'
          } right-0 h-16 bg-white/90 dark:bg-[#12131e]/90 backdrop-blur-xl border-b border-[#e2e8f8] dark:border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-6 transition-all duration-300`}
        >
          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-sm text-[#555f6f] dark:text-gray-400 font-medium">
            <Link to="/admin" className="hover:text-[#151c27] dark:hover:text-white transition-colors">
              Admin
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#151c27] dark:text-white font-semibold">{getPageTitle()}</span>
          </div>

          {/* Quick Search Input */}
          <div className="hidden sm:block w-72 md:w-96">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[#555f6f] dark:text-gray-400 absolute left-3 pointer-events-none text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stays, guests, booking IDs..."
                className="w-full h-10 pl-9 pr-12 rounded-xl bg-[#f0f3ff] dark:bg-white/5 border border-transparent dark:border-white/10 text-xs md:text-sm text-[#151c27] dark:text-white placeholder:text-[#555f6f]/70 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#b52603] focus:bg-white dark:focus:bg-[#171826] transition-all"
              />
              <span className="absolute right-3 px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-[#e2e8f8] dark:border-white/10 text-[10px] font-bold text-[#555f6f] dark:text-gray-400">
                ⌘K
              </span>
            </div>
          </div>

          {/* Actions: Live Sync, Notifications, Dark Mode, Profile */}
          <div className="flex items-center gap-3">
            {/* Live Sync Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f3ff] dark:bg-white/5 border border-[#e2e8f8]/60 dark:border-white/5">
              <span className="w-2 h-2 rounded-full bg-[#2ca397] animate-pulse"></span>
              <span className="text-[11px] font-semibold text-[#555f6f] dark:text-gray-400">
                Live Sync
              </span>
            </div>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-[#555f6f] dark:text-gray-300 hover:text-[#151c27] dark:hover:text-white hover:bg-[#f0f3ff] dark:hover:bg-white/5 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#b52603] text-white text-[10px] leading-none flex items-center justify-center rounded-full font-bold">
                3
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-[#555f6f] dark:text-gray-300 hover:text-[#151c27] dark:hover:text-white hover:bg-[#f0f3ff] dark:hover:bg-white/5 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 pl-1 py-1 rounded-xl hover:bg-[#f0f3ff] dark:hover:bg-white/5 transition-colors"
              >
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#e2e8f8] dark:ring-white/10"
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                  }
                />
                <span className="material-symbols-outlined text-[#555f6f] text-[18px]">
                  arrow_drop_down
                </span>
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 text-sm animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-[#e2e8f8]/60 dark:border-white/5">
                      <p className="font-bold text-xs text-[#151c27] dark:text-white truncate">
                        {user?.name || 'Administrator'}
                      </p>
                      <p className="text-[11px] text-[#555f6f] dark:text-gray-400 truncate">
                        {user?.email || 'admin@wayfound.in'}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="px-3 py-2 rounded-xl text-[#555f6f] dark:text-gray-300 hover:bg-[#f0f3ff] dark:hover:bg-white/5 hover:text-[#151c27] dark:hover:text-white flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="px-3 py-2 rounded-xl text-[#555f6f] dark:text-gray-300 hover:bg-[#f0f3ff] dark:hover:bg-white/5 hover:text-[#151c27] dark:hover:text-white flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      <span>Back to Wayfound</span>
                    </Link>

                    <div className="h-px bg-[#e2e8f8] dark:bg-white/5 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="px-3 py-2 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6]/40 dark:hover:bg-[#ba1a1a]/10 flex items-center gap-2 font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 3. NESTED PAGE CONTENT OUTLET */}
        <main className="flex-1 w-full pt-20 px-6 sm:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
