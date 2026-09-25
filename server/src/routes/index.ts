import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js';
import listingRoutes from './listingRoutes.js';
import hostRoutes from './hostRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    app: 'Wayfound Stay Booking API',
  });
});

// Mount Sub-routes
router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/hosts', hostRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/experiences', experienceRoutes);
router.use('/services', serviceRoutes);
router.use('/payments', paymentRoutes);

export default router;
