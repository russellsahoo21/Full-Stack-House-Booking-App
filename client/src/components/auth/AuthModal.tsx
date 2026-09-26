import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await login(email.trim(), password);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register(name.trim(), email.trim(), password, phone.trim() || undefined);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (type: 'guest' | 'host') => {
    setError(null);
    if (type === 'guest') {
      setEmail('guest@wayfound.in');
      setPassword('guest123');
    } else {
      setEmail('arjun@wayfound.in');
      setPassword('host123');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white dark:bg-ink-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-warm-200/80 dark:border-white/10 z-10"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-warm-100 dark:hover:bg-white/10 text-ink-500 dark:text-warm-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunset-gradient-subtle text-sunset-coral text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wayfound Member Portal</span>
            </div>
            <h3 className="text-2xl font-extrabold text-ink-950 dark:text-white tracking-tight">
              {authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className="text-xs text-ink-500 dark:text-warm-400 mt-1">
              {authModalMode === 'login'
                ? 'Sign in to access your bookings, wishlists, and concierge'
                : 'Join Wayfound to book verified heritage sanctuaries and villas'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-ink-700 dark:text-warm-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-warm-100/70 dark:bg-ink-800/80 border border-warm-200 dark:border-white/10 text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sunset-coral"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-ink-700 dark:text-warm-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-warm-100/70 dark:bg-ink-800/80 border border-warm-200 dark:border-white/10 text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sunset-coral"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-ink-700 dark:text-warm-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-warm-100/70 dark:bg-ink-800/80 border border-warm-200 dark:border-white/10 text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sunset-coral"
                />
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-ink-700 dark:text-warm-300 block mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-warm-100/70 dark:bg-ink-800/80 border border-warm-200 dark:border-white/10 text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sunset-coral"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-2xl bg-sunset-gradient text-white text-xs font-bold shadow-md hover:shadow-glow-sunset active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Please wait...' : authModalMode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-5 pt-4 border-t border-warm-200/60 dark:border-white/10">
            <span className="text-[10px] font-bold text-ink-400 dark:text-warm-400 uppercase tracking-wider block text-center mb-2">
              Instant Demo Logins
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('guest')}
                className="flex-1 py-1.5 px-2 rounded-xl border border-warm-300/80 dark:border-white/10 hover:bg-warm-100 dark:hover:bg-white/5 text-[11px] font-semibold text-ink-700 dark:text-warm-200 transition-colors"
              >
                👤 Guest Demo
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('host')}
                className="flex-1 py-1.5 px-2 rounded-xl border border-warm-300/80 dark:border-white/10 hover:bg-warm-100 dark:hover:bg-white/5 text-[11px] font-semibold text-ink-700 dark:text-warm-200 transition-colors"
              >
                ⭐ Superhost Demo
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="mt-4 text-center text-xs text-ink-500 dark:text-warm-400">
            {authModalMode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="font-bold text-sunset-coral hover:underline"
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-sunset-coral hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
