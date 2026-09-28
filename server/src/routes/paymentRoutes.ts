import { Router } from 'express';
import { createPaymentOrder, verifyPayment, getRazorpayKey } from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/key', getRazorpayKey);
router.post('/create-order', optionalAuth, createPaymentOrder);
router.post('/verify', optionalAuth, verifyPayment);

export default router;

