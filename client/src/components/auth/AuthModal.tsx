import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when switching between Login and Signup
  useEffect(() => {
    setError(null);
    setShowPassword(false);
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (authModalMode === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(
          name.trim(),
          email.trim(),
          password,
          phone.trim() || undefined
        );
      }
    } catch (err: any) {
      setError(
        err?.message || 'Authentication failed. Please try again.'
      );
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

  const passwordChecks = [
    {
      label: 'At least 6 characters',
      valid: password.length >= 6,
    },
    {
      label: 'Contains a number',
      valid: /\d/.test(password),
    },
    {
      label: 'Contains an uppercase letter',
      valid: /[A-Z]/.test(password),
    },
  ];

  const switchMode = () => {
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setShowPassword(false);

    openAuthModal(
      authModalMode === 'login' ? 'register' : 'login'
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/70 backdrop-blur-lg"
        />

        {/* Main Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white dark:bg-ink-900 shadow-2xl border border-white/20 dark:border-white/10"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-black/30 text-ink-700 dark:text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white dark:hover:bg-black/50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            {/* LEFT BRAND PANEL */}
            <div className="relative hidden min-h-[620px] overflow-hidden bg-ink-950 md:block">
              {/* Decorative gradients */}
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sunset-coral/30 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

              {/* Decorative circles */}
              <div className="absolute left-10 top-16 h-24 w-24 rounded-full border border-white/10" />
              <div className="absolute right-10 top-28 h-40 w-40 rounded-full border border-white/5" />

              <div className="relative flex h-full flex-col justify-between p-10 text-white">
                <div>
                  <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                    <span className="text-xs font-bold tracking-widest">
                      WAYFOUND
                    </span>
                  </div>

                  <h2 className="max-w-sm text-4xl font-extrabold leading-tight tracking-tight">
                    Find a place
                    <span className="block text-orange-300">
                      worth remembering.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                    Discover carefully selected stays, memorable
                    experiences and thoughtful services — all in one
                    place.
                  </p>
                </div>

                {/* Feature cards */}
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/15">
                        <ShieldCheck className="h-5 w-5 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          Verified stays
                        </p>
                        <p className="mt-0.5 text-xs text-white/50">
                          Quality experiences you can trust
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/15">
                        <Sparkles className="h-5 w-5 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          Curated experiences
                        </p>
                        <p className="mt-0.5 text-xs text-white/50">
                          More than just a place to stay
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/35">
                  Your next unforgettable stay starts here.
                </p>
              </div>
            </div>

            {/* RIGHT FORM PANEL */}
            <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-10">
              {/* Header */}
              <div className="mb-7 pr-8">
                <div className="mb-4 inline-flex items-center rounded-full bg-sunset-gradient-subtle px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-sunset-coral">
                  Wayfound Member
                </div>

                <motion.h3
                  key={authModalMode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white"
                >
                  {authModalMode === 'login'
                    ? 'Welcome back'
                    : 'Create your account'}
                </motion.h3>

                <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-warm-400">
                  {authModalMode === 'login'
                    ? 'Sign in to continue your Wayfound journey.'
                    : 'Join Wayfound and discover your next unforgettable stay.'}
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-sm text-rose-600 dark:text-rose-400"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                {authModalMode === 'register' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink-700 dark:text-warm-300">
                      Full Name
                    </label>

                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-2xl border border-warm-200 bg-warm-50/70 py-3.5 pl-11 pr-4 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-400 focus:border-sunset-coral focus:bg-white focus:ring-4 focus:ring-sunset-coral/10 dark:border-white/10 dark:bg-ink-800/80 dark:text-white dark:focus:bg-ink-800"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink-700 dark:text-warm-300">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-warm-200 bg-warm-50/70 py-3.5 pl-11 pr-4 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-400 focus:border-sunset-coral focus:bg-white focus:ring-4 focus:ring-sunset-coral/10 dark:border-white/10 dark:bg-ink-800/80 dark:text-white dark:focus:bg-ink-800"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-bold text-ink-700 dark:text-warm-300">
                      Password
                    </label>

                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-sunset-coral hover:underline"
                        onClick={() =>
                          setError(
                            'Password reset will be added in the next step.'
                          )
                        }
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-warm-200 bg-warm-50/70 py-3.5 pl-11 pr-12 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-400 focus:border-sunset-coral focus:bg-white focus:ring-4 focus:ring-sunset-coral/10 dark:border-white/10 dark:bg-ink-800/80 dark:text-white dark:focus:bg-ink-800"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-warm-200 hover:text-ink-700 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password requirements */}
                {authModalMode === 'register' && password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="rounded-2xl bg-warm-50 p-4 dark:bg-ink-800/70"
                  >
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-warm-400">
                      Password strength
                    </p>

                    <div className="grid gap-2">
                      {passwordChecks.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full ${
                              item.valid
                                ? 'bg-emerald-500 text-white'
                                : 'bg-ink-200 text-transparent dark:bg-ink-700'
                            }`}
                          >
                            <Check className="h-2.5 w-2.5" />
                          </span>

                          <span
                            className={
                              item.valid
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-ink-500 dark:text-warm-400'
                            }
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Phone */}
                {authModalMode === 'register' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink-700 dark:text-warm-300">
                      Phone Number{' '}
                      <span className="font-normal text-ink-400">
                        (Optional)
                      </span>
                    </label>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-warm-200 bg-warm-50/70 py-3.5 pl-11 pr-4 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-400 focus:border-sunset-coral focus:bg-white focus:ring-4 focus:ring-sunset-coral/10 dark:border-white/10 dark:bg-ink-800/80 dark:text-white dark:focus:bg-ink-800"
                      />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-sunset-gradient py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-glow-sunset active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>
                        {authModalMode === 'login'
                          ? 'Signing in...'
                          : 'Creating account...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {authModalMode === 'login'
                          ? 'Sign In'
                          : 'Create Account'}
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo logins */}
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-warm-200 dark:bg-white/10" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-400">
                    Demo access
                  </span>
                  <div className="h-px flex-1 bg-warm-200 dark:bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('guest')}
                    className="rounded-xl border border-warm-200 bg-white py-2.5 text-xs font-semibold text-ink-700 transition-all hover:-translate-y-0.5 hover:border-sunset-coral hover:bg-warm-50 dark:border-white/10 dark:bg-ink-800 dark:text-warm-200"
                  >
                    👤 Guest Demo
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillDemo('host')}
                    className="rounded-xl border border-warm-200 bg-white py-2.5 text-xs font-semibold text-ink-700 transition-all hover:-translate-y-0.5 hover:border-sunset-coral hover:bg-warm-50 dark:border-white/10 dark:bg-ink-800 dark:text-warm-200"
                  >
                    ⭐ Host Demo
                  </button>
                </div>
              </div>

              {/* Switch Login / Signup */}
              <div className="mt-6 text-center text-sm text-ink-500 dark:text-warm-400">
                {authModalMode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="font-bold text-sunset-coral transition-colors hover:text-orange-600 hover:underline"
                    >
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="font-bold text-sunset-coral transition-colors hover:text-orange-600 hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>

              {/* Security note */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-ink-400 dark:text-warm-500">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure authentication powered by Wayfound
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};