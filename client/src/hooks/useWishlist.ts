import { useState, useEffect } from 'react';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wayfound-wishlist');
        return saved ? JSON.parse(saved) : ['stay-1', 'stay-3']; // Default with a couple saved
      } catch {
        return ['stay-1', 'stay-3'];
      }
    }
    return ['stay-1', 'stay-3'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('wayfound-wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const isSaved = prev.includes(id);
      return isSaved ? prev.filter(item => item !== id) : [...prev, id];
    });
  };

  const isSaved = (id: string) => wishlist.includes(id);

  return { wishlist, toggleWishlist, isSaved };
}
