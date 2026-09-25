import mongoose, { Document, Schema, Model } from 'mongoose';

export type PaymentMethod = 'upi' | 'card' | 'netbanking';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface IBooking {
  _id: string;
  listingId: string;
  userId?: string;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  pricing: {
    perNight: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    total: number;
    currency: 'INR';
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  status: BookingStatus;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    _id: {
      type: String,
      default: () => `book-${new mongoose.Types.ObjectId().toString()}`,
    },
    listingId: {
      type: String,
      ref: 'Listing',
      required: [true, 'Listing ID is required'],
      index: true,
    },
    userId: {
      type: String,
      ref: 'User',
      index: true,
    },
    guestInfo: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      specialRequests: { type: String, default: '' },
    },
    checkIn: {
      type: String,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: String,
      required: [true, 'Check-out date is required'],
    },
    nights: {
      type: Number,
      required: true,
      min: [1, 'Must book at least 1 night'],
    },
    guests: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 },
      pets: { type: Number, default: 0, min: 0 },
    },
    pricing: {
      perNight: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      cleaningFee: { type: Number, required: true },
      serviceFee: { type: Number, required: true },
      total: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking'],
      default: 'upi',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    paymentId: {
      type: String,
      default: () => `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: false,
  }
);

BookingSchema.virtual('listing', {
  ref: 'Listing',
  localField: 'listingId',
  foreignField: '_id',
  justOne: true,
});

export const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema);
