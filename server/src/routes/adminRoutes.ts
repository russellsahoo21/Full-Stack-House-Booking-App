import { Router } from 'express';
import { protect, authorize, AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import {
  getAdminDashboardStats,
  getAdminBookings,
  updateBookingStatus,
  getAdminProperties,
  updatePropertyStatus,
  deleteProperty,
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
  exportAdminData,
  getAdminProfile,
} from '../controllers/adminController.js';

const router = Router();

// Enforce strict authentication & admin authorization
// Unauthenticated requests or non-admin users are strictly rejected with 401/403
router.use(protect);
router.use(authorize('admin'));

// 1. Dashboard Overview & Telemetry
router.get('/dashboard', getAdminDashboardStats);
router.get('/stats', getAdminDashboardStats);
router.get('/profile', getAdminProfile);

// 2. Bookings
router.get('/bookings', getAdminBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

// 3. Properties / Listings
router.get('/properties', getAdminProperties);
router.patch('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deleteProperty);

// 4. Users Directory
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// 5. Reviews Moderation
router.get('/reviews', getAdminReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

// 6. Data Export (CSV)
router.get('/export/:type', exportAdminData);

export default router;
