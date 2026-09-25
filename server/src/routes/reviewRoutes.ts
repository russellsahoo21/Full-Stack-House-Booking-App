import { Router } from 'express';
import { getReviewsByListing, createReview } from '../controllers/reviewController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/listing/:listingId', getReviewsByListing);
router.post('/', optionalAuth, createReview);

export default router;
