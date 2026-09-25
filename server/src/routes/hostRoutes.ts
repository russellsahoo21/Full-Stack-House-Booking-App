import { Router } from 'express';
import { getHosts, getHostById, createHost } from '../controllers/hostController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getHosts);
router.get('/:id', getHostById);
router.post('/', protect, createHost);

export default router;
