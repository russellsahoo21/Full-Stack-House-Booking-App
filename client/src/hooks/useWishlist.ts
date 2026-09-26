import { useState, useEffect } from 'react';
import { authApi } from '@/services/api';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wayfound-wishlist');
        return saved ? JSON.parse(saved) : ['stay-1', 'stay-3'];
      } catch {
        return ['stay-1', 'stay-3'];
      }
    }
    return ['stay-1', 'stay-3'];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('wayfound-wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist locally', e);
    }
  }, [wishlist]);

  // Sync with MongoDB backend if authenticated
  const toggleWishlist = async (id: string) => {
    // 1. Optimistic local update
    setWishlist((prev) => {
      const isSaved = prev.includes(id);
      return isSaved ? prev.filter((item) => item !== id) : [...prev, id];
    });

    // 2. Cloud sync if logged in
    const token = localStorage.getItem('wayfound_token');
    if (token) {
      try {
        await authApi.toggleWishlist(id);
      } catch (err) {
        console.warn('Could not sync wishlist to cloud:', err);
      }
    }
  };

  const isSaved = (id: string) => wishlist.includes(id);

  return { wishlist, toggleWishlist, isSaved };
}
