import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import { UserAvatar } from '@/components/common/UserAvatar';

interface ReviewItem {
  id: string;
  guestName: string;
  guestAvatar: string;
  property: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Flagged' | 'Under Investigation';
  flagReason?: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'REV-901',
    guestName: 'Rohan Verma',
    guestAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    property: 'Heritage Haveli',
    location: 'Jaipur, Rajasthan',
    rating: 1,
    comment:
      'The pool had not been cleaned and wifi was completely dead during our 3 night stay. Host refused to send staff.',
    date: '2 hours ago',
    status: 'Flagged',
    flagReason: 'Host disputed review for policy violation',
  },
  {
    id: 'REV-902',
    guestName: 'Aarav Mehta',
    guestAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    property: 'Casa Verde Retreat',
    location: 'Lonavala, Maharashtra',
    rating: 5,
    comment:
      'Extraordinary experience. The architecture blends seamlessly with the Western Ghats. Sunita was the perfect host.',
    date: '1 day ago',
    status: 'Approved',
  },
  {
    id: 'REV-903',
    guestName: 'Ananya Iyer',
    guestAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    property: 'The Hillside Cabin',
    location: 'Manali, Himachal',
    rating: 2,
    comment:
      'Beautiful location but road was blocked by snow and no emergency contact answered our repeated calls.',
    date: '3 days ago',
    status: 'Under Investigation',
    flagReason: 'Weather emergency dispute',
  },
];

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [filter, setFilter] = useState<'All' | 'Flagged' | 'Approved'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchReviews = async () => {
    try {
      const res = await adminApi.getReviews();
      if (res?.success && res.data && res.data.length > 0) {
        const mapped: ReviewItem[] = res.data.map((r: any) => ({
          id: r._id,
          guestName: r.userName || 'Guest Traveler',
          guestAvatar: r.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          property: r.listingId?.title || 'Luxury Estate',
          location: r.listingId?.location?.city || 'India',
          rating: r.rating || 5,
          comment: r.comment || '',
          date: r.date || 'Recently',
          status: r.status || 'Approved',
          flagReason: r.flagReason,
        }));
        setReviews(mapped);
      }
    } catch (err: any) {
      console.warn('Could not load reviews from API:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApproveReview = async (id: string) => {
    try {
      await adminApi.updateReviewStatus(id, { status: 'Approved' });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Approved', flagReason: undefined } : r))
      );
      showToast(`Review ${id} cleared and verified.`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not approve review'}`);
    }
  };

  const handleDismissReview = async (id: string) => {
    try {
      await adminApi.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast(`Review ${id} redacted from public view.`);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Could not delete review'}`);
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'Flagged') return r.status === 'Flagged' || r.status === 'Under Investigation';
    if (filter === 'Approved') return r.status === 'Approved';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#151c27] text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#b52603] font-bold mb-1">
            <span>Quality & Moderation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-[#555f6f] dark:text-gray-400">Content Integrity</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#151c27] dark:text-white tracking-tight">
            Review Moderation Queue
          </h1>
          <p className="text-sm text-[#555f6f] dark:text-gray-400 mt-0.5">
            Audit guest feedback, investigate disputes, and maintain platform authenticity.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#171826] border border-[#e2e8f8] dark:border-white/10 rounded-xl p-1 text-xs">
          {(['All', 'Flagged', 'Approved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === tab
                  ? 'bg-[#b52603] text-white font-bold'
                  : 'text-[#555f6f] dark:text-gray-400 hover:text-[#151c27]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl bg-white dark:bg-[#171826] p-5 shadow-sm border border-[#e2e8f8] dark:border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <UserAvatar name={r.guestName} size="md" className="flex-shrink-0" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#151c27] dark:text-white">{r.guestName}</h3>
                  <span className="text-xs text-[#555f6f] dark:text-gray-400">• {r.date}</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#151c27] dark:text-white">{r.property}</span>
                  <span className="text-[#555f6f]">({r.location})</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    <span className="font-bold">{r.rating}/5</span>
                  </div>
                </div>

                <p className="text-xs text-[#151c27] dark:text-gray-200 mt-2 max-w-2xl leading-relaxed">
                  "{r.comment}"
                </p>

                {r.flagReason && (
                  <div className="mt-2 p-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 text-xs flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">report</span>
                    <span><strong>Reason:</strong> {r.flagReason}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-center">
              {r.status !== 'Approved' && (
                <button
                  onClick={() => handleApproveReview(r.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#006a61] text-white text-xs font-bold hover:bg-[#005049] transition-all flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Approve</span>
                </button>
              )}
              <button
                onClick={() => handleDismissReview(r.id)}
                className="px-3 py-1.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold hover:bg-[#ba1a1a] hover:text-white transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
