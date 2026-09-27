import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  toggleWishlist,
  getWishlist,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.patch('/profile', protect, updateProfile);
router.post('/wishlist/toggle', protect, toggleWishlist);
router.post('/wishlist/:listingId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

export default router;
