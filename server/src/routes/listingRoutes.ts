import { Router } from 'express';
import {
  getListings,
  getListingById,
  getCategories,
  getListingsByVibe,
  getTrendingListings,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getListings);
router.get('/categories', getCategories);
router.get('/vibes', getListingsByVibe);
router.get('/trending', getTrendingListings);
router.get('/:id', getListingById);

router.post('/', protect, authorize('host', 'admin'), createListing);
router.put('/:id', protect, authorize('host', 'admin'), updateListing);
router.delete('/:id', protect, authorize('admin'), deleteListing);

export default router;
