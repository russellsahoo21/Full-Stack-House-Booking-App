import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  FileText,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
  ArrowLeft,
  Heart,
  Calendar,
  Sparkles,
  LogOut,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Curated aesthetic avatar presets
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
];

export const Profile: React.FC = () => {
  const { user, isAuthenticated, updateProfile, deleteAccount, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || AVATAR_PRESETS[0]);
    }
  }, [user]);

  useEffect(() => {
    if (window.location.hash === '#danger') {
      const el = document.getElementById('danger');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-32 pb-24 max-w-xl mx-auto px-4 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-sunset-coral/10 text-sunset-coral flex items-center justify-center mb-6">
          <UserIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 dark:text-white tracking-tight mb-3">
          Sign in to view your profile
        </h1>
        <p className="text-sm text-ink-500 dark:text-warm-400 mb-8 max-w-md">
          Manage your personal details, travel preferences, and account security.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-8 py-3.5 rounded-full bg-sunset-gradient text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-glow-sunset hover:scale-105 active:scale-95 transition-all"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const isDemoAccount = [
    'guest@wayfound.in',
    'arjun@wayfound.in',
    'traveler@wayfound.stay',
    'host@wayfound.stay',
    'admin@wayfound.stay',
  ].includes(user.email.toLowerCase());

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        avatar: avatar || customAvatarInput.trim() || undefined,
      });

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (isDemoAccount) {
      setDeleteError('Protected demo accounts cannot be deleted.');
      return;
    }

    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteAccount();
      setIsDeleteModalOpen(false);
      navigate('/');
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-ink-600 dark:text-warm-300 hover:text-sunset-coral mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to explore
      </Link>

      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 shadow-lg">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <img
              src={avatar || user.avatar || AVATAR_PRESETS[0]}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-white dark:ring-ink-800 shadow-md"
            />
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
              <Camera className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-sunset-gradient text-white shadow-sm">
                {user.role === 'admin' ? 'Administrator' : user.role === 'host' ? 'Superhost' : 'Member'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>
            {user.createdAt && (
              <p className="text-[11px] text-ink-400 dark:text-warm-500 mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sunset-coral" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2.5 sm:self-center">
          <Link
            to="/trips"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-warm-200 dark:border-white/10 text-xs font-bold text-ink-700 dark:text-warm-200 hover:border-sunset-coral hover:bg-warm-50 dark:hover:bg-white/5 transition-all"
          >
            <Calendar className="w-4 h-4 text-sunset-coral" />
            <span>My Trips</span>
          </Link>
          <Link
            to="/wishlists"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-warm-200 dark:border-white/10 text-xs font-bold text-ink-700 dark:text-warm-200 hover:border-sunset-coral hover:bg-warm-50 dark:hover:bg-white/5 transition-all"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Wishlists</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2.5 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Form: Left/Center Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink-950 dark:text-white">Personal Information</h2>
              <p className="text-xs text-ink-500 dark:text-warm-400 mt-0.5">
                Update your identity details shown on reservations and host check-ins.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-ink-700 dark:text-warm-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-warm-200 dark:border-white/10 bg-warm-50/70 dark:bg-ink-800/80 text-sm text-ink-900 dark:text-white outline-none focus:border-sunset-coral focus:ring-4 focus:ring-sunset-coral/10 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-ink-700 dark:text-warm-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-warm-200 dark:border-white/10 bg-warm-50/70 dark:bg-ink-800/80 text-sm text-ink-900 dark:text-white outline-none focus:border-sunset-coral focus:ring-4 focus:ring-sunset-coral/10 transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-ink-700 dark:text-warm-300 mb-2">
                  About You (Bio)
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell hosts about your travel interests, favorite vibes, or background..."
                    className="w-full p-4 rounded-2xl border border-warm-200 dark:border-white/10 bg-warm-50/70 dark:bg-ink-800/80 text-sm text-ink-900 dark:text-white outline-none focus:border-sunset-coral focus:ring-4 focus:ring-sunset-coral/10 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Avatar Chooser */}
              <div>
                <label className="block text-xs font-bold text-ink-700 dark:text-warm-300 mb-2">
                  Profile Avatar
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatar(preset);
                          setCustomAvatarInput('');
                        }}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all group ${
                          avatar === preset
                            ? 'border-sunset-coral ring-2 ring-sunset-coral/30 scale-105'
                            : 'border-transparent hover:border-warm-300 dark:hover:border-white/20'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        {avatar === preset && (
                          <div className="absolute inset-0 bg-sunset-coral/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Avatar URL option */}
                  <div className="pt-2">
                    <p className="text-[11px] text-ink-400 dark:text-warm-400 mb-1.5">
                      Or use a custom image URL:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customAvatarInput}
                        onChange={(e) => {
                          setCustomAvatarInput(e.target.value);
                          if (e.target.value) setAvatar(e.target.value);
                        }}
                        placeholder="https://example.com/your-photo.jpg"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-warm-200 dark:border-white/10 bg-warm-50/70 dark:bg-ink-800/80 text-xs text-ink-900 dark:text-white outline-none focus:border-sunset-coral"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-warm-200/60 dark:border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-7 py-3 rounded-full bg-sunset-gradient text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-glow-sunset hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone: Delete Account */}
          <div id="danger" className="p-6 sm:p-8 rounded-3xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-4 scroll-mt-24">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">Danger Zone</h3>
                <p className="text-xs text-ink-600 dark:text-warm-300 mt-1 leading-relaxed">
                  Permanently delete your Wayfound account and all associated personal data. This action is irreversible.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setDeleteError(null);
                  setDeleteConfirmationText('');
                  setIsDeleteModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-full border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Account Meta & Security */}
        <div className="md:col-span-4 space-y-6">
          {/* Security & Verification Card */}
          <div className="p-6 rounded-3xl glass-panel border border-warm-200/80 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-ink-950 dark:text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Account Security</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-warm-200/60 dark:border-white/5">
                <span className="text-ink-500 dark:text-warm-400">Email status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-warm-200/60 dark:border-white/5">
                <span className="text-ink-500 dark:text-warm-400">Account role</span>
                <span className="font-bold text-ink-900 dark:text-white capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-warm-200/60 dark:border-white/5">
                <span className="text-ink-500 dark:text-warm-400">Wishlist saved</span>
                <span className="font-bold text-ink-900 dark:text-white">{user.wishlist?.length || 0} stays</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="w-full py-3 rounded-2xl border border-warm-200 dark:border-white/10 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out of Wayfound</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-rose-500/20 shadow-2xl space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-ink-950 dark:text-white">Delete your account?</h3>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-warm-400 mt-2 leading-relaxed">
                  Are you absolutely sure you want to delete your account ({user.email})? This will permanently delete your profile and sign you out.
                </p>
              </div>

              {isDemoAccount && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  Protected demo accounts ({user.email}) cannot be deleted. To test account deletion, please sign up with your own email.
                </div>
              )}

              {!isDemoAccount && (
                <div>
                  <label className="block text-xs font-bold text-ink-700 dark:text-warm-300 mb-2">
                    Type <span className="font-mono text-rose-600 dark:text-rose-400 font-extrabold">DELETE</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-4 py-3 rounded-2xl border border-warm-200 dark:border-white/10 bg-warm-50 dark:bg-ink-800 text-sm text-ink-900 dark:text-white font-mono uppercase outline-none focus:border-rose-500"
                  />
                </div>
              )}

              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400">
                  {deleteError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-warm-200 dark:border-white/10 text-xs font-bold text-ink-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-ink-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting || isDemoAccount || deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                  onClick={handleDeleteAccount}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-40 transition-all flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
