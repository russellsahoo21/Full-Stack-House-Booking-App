import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
await connectDB();

const server = app.listen(PORT, () => {
  console.log('🌿 ==============================================');
  console.log(`🌿 Wayfound Backend running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌿 Listening on: http://localhost:${PORT}`);
  console.log(`🌿 Health check: http://localhost:${PORT}/api/health`);
  console.log('🌿 ==============================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down gracefully...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});
