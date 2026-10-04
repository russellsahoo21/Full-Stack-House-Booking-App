import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminRouteProps {
  children?: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // If loading user state from token, show sleek loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] dark:bg-[#0c0d14] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#ffdad2] border-t-[#b52603] animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-[#555f6f] dark:text-gray-400">
          Authenticating Executive Session...
        </p>
      </div>
    );
  }

  // Check if authenticated and user role is admin
  const isAdmin = Boolean(isAuthenticated && user && user.role === 'admin');

  const { openAuthModal } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] dark:bg-[#0c0d14] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#ffdad2] text-[#b52603] flex items-center justify-center mb-4 shadow-sm">
          <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#151c27] dark:text-white tracking-tight mb-2">
          Administrator Access Required
        </h2>
        <p className="text-sm text-[#555f6f] dark:text-gray-400 max-w-md mb-6 leading-relaxed">
          The Executive Portal is restricted to authorized operators and platform administrators. Please sign in with an administrative account to continue.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-3 rounded-xl bg-[#b52603] text-white text-xs font-bold shadow-md hover:bg-[#8c1900] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Sign In as Admin</span>
          </button>
          <a
            href="/"
            className="px-5 py-3 rounded-xl bg-[#f0f3ff] dark:bg-white/5 text-xs font-semibold text-[#151c27] dark:text-white hover:bg-[#e2e8f8] transition-all"
          >
            Return to Storefront
          </a>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
