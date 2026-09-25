import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, cancelBooking);

export default router;
