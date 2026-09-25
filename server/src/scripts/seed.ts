import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Host } from '../models/Host.js';
import { Listing } from '../models/Listing.js';
import { Review } from '../models/Review.js';
import { Experience } from '../models/Experience.js';
import { Service } from '../models/Service.js';
import { Booking } from '../models/Booking.js';
import { Enquiry } from '../models/Enquiry.js';
import {
  seedUsers,
  seedHosts,
  seedListings,
  seedReviews,
  seedExperiences,
  seedServices,
} from './seedData.js';

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();

    console.log('🌿 Purging existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Host.deleteMany({}),
      Listing.deleteMany({}),
      Review.deleteMany({}),
      Experience.deleteMany({}),
      Service.deleteMany({}),
      Booking.deleteMany({}),
      Enquiry.deleteMany({}),
    ]);
    console.log('✅ Collections cleared.');

    if (process.argv.includes('--delete')) {
      console.log('🗑️ All data wiped cleanly.');
      process.exit(0);
    }

    console.log('🌿 Seeding demo users...');
    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log(`✅ Seeded ${seedUsers.length} users`);

    console.log('🌿 Seeding hosts...');
    await Host.insertMany(seedHosts);
    console.log(`✅ Seeded ${seedHosts.length} hosts`);

    console.log('🌿 Seeding stays / listings...');
    await Listing.insertMany(seedListings);
    console.log(`✅ Seeded ${seedListings.length} curated stays`);

    console.log('🌿 Seeding reviews...');
    await Review.insertMany(seedReviews);
    console.log(`✅ Seeded ${seedReviews.length} reviews`);

    console.log('🌿 Seeding experiences...');
    await Experience.insertMany(seedExperiences);
    console.log(`✅ Seeded ${seedExperiences.length} experiences`);

    console.log('🌿 Seeding concierge services...');
    await Service.insertMany(seedServices);
    console.log(`✅ Seeded ${seedServices.length} luxury services`);

    console.log('🌿 ==============================================');
    console.log('🌿 🌟 Database Seed Completed Successfully! 🌟');
    console.log('🌿 ==============================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
