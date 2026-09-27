import { Router } from 'express';

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  toggleWishlist,
  getWishlist,
  logout,
} from '../controllers/authController.js';

import { protect } from '../middleware/auth.js';

const router = Router();

// ======================================================
// PUBLIC AUTH ROUTES
// ======================================================

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

// ======================================================
// PROTECTED USER ROUTES
// ======================================================

router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);

router.patch('/profile', protect, updateProfile);

// ======================================================
// WISHLIST ROUTES
// ======================================================

router.post(
  '/wishlist/toggle',
  protect,
  toggleWishlist
);

router.post(
  '/wishlist/:listingId',
  protect,
  toggleWishlist
);

router.get(
  '/wishlist',
  protect,
  getWishlist
);

export default router;