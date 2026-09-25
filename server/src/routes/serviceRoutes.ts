import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createServiceEnquiry,
  createService,
} from '../controllers/serviceController.js';
import { optionalAuth, protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/enquiry', optionalAuth, createServiceEnquiry);
router.post('/', protect, authorize('admin'), createService);

export default router;
