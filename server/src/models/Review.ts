import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview {
  _id: string;
  listingId: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  cleanliness: number;
  accuracy: number;
  communication: number;
  locationRating: number;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    _id: {
      type: String,
      default: () => `rev-${new mongoose.Types.ObjectId().toString()}`,
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
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    userAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    date: {
      type: String,
      default: () => new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    cleanliness: { type: Number, default: 5, min: 1, max: 5 },
    accuracy: { type: Number, default: 5, min: 1, max: 5 },
    communication: { type: Number, default: 5, min: 1, max: 5 },
    locationRating: { type: Number, default: 5, min: 1, max: 5 },
    value: { type: Number, default: 5, min: 1, max: 5 },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);
