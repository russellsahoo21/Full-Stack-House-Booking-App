import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { reviewsApi } from '@/services/api';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  onReviewSubmitted?: (newReview: any) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  listingImage,
  onReviewSubmitted,
}) => {
  const { user } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [cleanliness, setCleanliness] = useState<number>(5);
  const [accuracy, setAccuracy] = useState<number>(5);
  const [communication, setCommunication] = useState<number>(5);
  const [locationRating, setLocationRating] = useState<number>(5);
  const [value, setValue] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [guestName, setGuestName] = useState<string>(user?.name || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const ratingDescriptions: Record<number, string> = {
    1: 'Poor — Needs urgent improvements',
    2: 'Fair — Did not meet expectations',
    3: 'Good — Acceptable stay with a few issues',
    4: 'Great — Very pleasant stay with great amenities',
    5: 'Exceptional — Truly an unforgettable luxury experience',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.length < 10) {
      setError('Please provide at least 10 characters describing your experience.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await reviewsApi.createReview({
        listingId,
        rating,
        comment: comment.trim(),
        cleanliness,
        accuracy,
        communication,
        locationRating,
        value,
        userName: guestName.trim() || user?.name || 'Verified Guest',
        userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });

      setSuccess(true);
      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF5A5F', '#FFB347', '#22C55E', '#3B82F6'],
        });
      } catch {}

      if (onReviewSubmitted && res?.data) {
        onReviewSubmitted(res.data);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2200);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-xl bg-white dark:bg-ink-950 rounded-3xl border border-warm-200/80 dark:border-white/10 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-warm-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {listingImage ? (
                <img
                  src={listingImage}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-warm-200 dark:border-white/10"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-sunset-gradient flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-base text-ink-950 dark:text-white line-clamp-1">
                  Leave a Review
                </h3>
                <p className="text-xs text-ink-500 dark:text-warm-400 line-clamp-1">
                  {listingTitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-warm-100 dark:bg-white/10 flex items-center justify-center text-ink-700 dark:text-warm-300 hover:text-ink-950 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Notification */}
          {success ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-ink-950 dark:text-white">
                Thank You for Your Feedback!
              </h4>
              <p className="text-sm text-ink-500 dark:text-warm-300 max-w-sm mx-auto">
                Your verified review has been published and helps future travelers find sanctuary.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Overall Star Rating */}
              <div className="text-center space-y-2 py-1">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-warm-400 block">
                  Overall Experience
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating !== null ? hoverRating : rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(star)}
                        className="p-1.5 focus:outline-none transition-transform active:scale-90"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            active
                              ? 'text-sunset-amber fill-sunset-amber'
                              : 'text-warm-300 dark:text-ink-700 stroke-1'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-semibold text-sunset-coral min-h-[18px]">
                  {ratingDescriptions[hoverRating || rating]}
                </p>
              </div>

              {/* Sub-Ratings Slider Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-warm-200/60 dark:border-white/10">
                {[
                  { label: 'Cleanliness', val: cleanliness, setVal: setCleanliness },
                  { label: 'Accuracy of listing', val: accuracy, setVal: setAccuracy },
                  { label: 'Communication with host', val: communication, setVal: setCommunication },
                  { label: 'Location & surroundings', val: locationRating, setVal: setLocationRating },
                  { label: 'Value for money', val: value, setVal: setValue },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-ink-800 dark:text-warm-200">
                        {item.label}
                      </span>
                      <span className="font-bold text-sunset-coral">{item.val}.0</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={item.val}
                      onChange={(e) => item.setVal(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-warm-200 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-sunset-coral"
                    />
                  </div>
                ))}
              </div>

              {/* Guest Display Name */}
              <div>
                <label className="block text-xs font-semibold text-ink-700 dark:text-warm-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-warm-300 dark:border-white/15 bg-white dark:bg-ink-900 text-sm text-ink-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-sunset-coral/50"
                />
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-semibold text-ink-700 dark:text-warm-300 mb-1.5">
                  Share Your Story
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What made your stay memorable? Share insights about the property, host hospitality, sunrise views, or favorite local spots..."
                  className="w-full px-4 py-3 rounded-2xl border border-warm-300 dark:border-white/15 bg-white dark:bg-ink-900 text-sm text-ink-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-warm-500 focus:outline-none focus:ring-2 focus:ring-sunset-coral/50 resize-none leading-relaxed"
                />
                <span className="text-[11px] text-ink-400 dark:text-warm-500 mt-1 block">
                  Minimum 10 characters ({comment.length} entered)
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-warm-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Guest Review
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full bg-sunset-gradient text-white text-xs font-bold hover:shadow-glow-sunset active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
