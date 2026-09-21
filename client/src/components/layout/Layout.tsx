import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileTabBar } from './MobileTabBar';
import { ScrollToTop } from './ScrollToTop';
import { useLenis } from '@/hooks/useLenis';
import { motion } from 'framer-motion';

export const Layout: React.FC = () => {
  useLenis();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1 w-full">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
      <MobileTabBar />
    </div>
  );
};
