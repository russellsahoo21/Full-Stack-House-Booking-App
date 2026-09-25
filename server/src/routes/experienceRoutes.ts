import { Router } from 'express';
import {
  getExperiences,
  getExperienceById,
  bookExperience,
  createExperience,
} from '../controllers/experienceController.js';
import { optionalAuth, protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getExperiences);
router.get('/:id', getExperienceById);
router.post('/:id/book', optionalAuth, bookExperience);
router.post('/', protect, authorize('admin'), createExperience);

export default router;
