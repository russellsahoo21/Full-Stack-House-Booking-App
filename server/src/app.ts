import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './utils/appError.js';

const app: Application = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev for convenience
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsers & Compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'cookie_secret_key'));
app.use(compression());

// Root endpoint with API directory
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: '🌿 Wayfound API',
    tagline: 'Find your way to stay.',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      listings: {
        all: 'GET /api/listings',
        single: 'GET /api/listings/:id',
        categories: 'GET /api/listings/categories',
        vibes: 'GET /api/listings/vibes',
        trending: 'GET /api/listings/trending',
      },
      hosts: {
        all: 'GET /api/hosts',
        single: 'GET /api/hosts/:id',
      },
      bookings: {
        create: 'POST /api/bookings',
        myBookings: 'GET /api/bookings',
        single: 'GET /api/bookings/:id',
      },
      reviews: {
        byListing: 'GET /api/reviews/listing/:listingId',
        create: 'POST /api/reviews',
      },
      experiences: {
        all: 'GET /api/experiences',
        single: 'GET /api/experiences/:id',
        book: 'POST /api/experiences/:id/book',
      },
      services: {
        all: 'GET /api/services',
        single: 'GET /api/services/:id',
        enquiry: 'POST /api/services/enquiry',
      },
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        wishlist: 'GET /api/auth/wishlist',
      },
      payments: {
        createOrder: 'POST /api/payments/create-order',
        verify: 'POST /api/payments/verify',
      },
    },
  });
});

// Mount Main API Routes
app.use('/api', apiRoutes);

// 404 Route Handler
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find route ${req.originalUrl} on this server`, 404));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
