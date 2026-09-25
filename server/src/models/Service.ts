import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IServiceOffering {
  title: string;
  subtitle: string;
  description: string;
  price: string;
}

export interface IServiceStep {
  step: number;
  title: string;
  description: string;
}

export interface IServiceReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  villa: string;
}

export interface IService {
  _id: string;
  title: string;
  category: 'Culinary' | 'Wellness' | 'Concierge' | 'Transport';
  tagline: string;
  description: string;
  priceTag: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  providerName: string;
  providerAvatar: string;
  providerBio: string;
  features: string[];
  included: string[];
  offerings: IServiceOffering[];
  howItWorks: IServiceStep[];
  reviewsList: IServiceReview[];
  createdAt: Date;
  updatedAt: Date;
}

const OfferingSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    price: { type: String, required: true },
  },
  { _id: false }
);

const StepSchema = new Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ServiceReviewSchema = new Schema(
  {
    id: { type: String, required: true },
    author: { type: String, required: true },
    avatar: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: String, required: true },
    comment: { type: String, required: true },
    villa: { type: String, default: '' },
  },
  { _id: false }
);

const ServiceSchema = new Schema<IService>(
  {
    _id: {
      type: String,
      default: () => `srv-${new mongoose.Types.ObjectId().toString()}`,
    },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Culinary', 'Wellness', 'Concierge', 'Transport'],
    },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    priceTag: { type: String, required: true },
    basePrice: { type: Number, required: true },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    providerName: { type: String, required: true },
    providerAvatar: { type: String, required: true },
    providerBio: { type: String, required: true },
    features: { type: [String], default: [] },
    included: { type: [String], default: [] },
    offerings: { type: [OfferingSchema], default: [] },
    howItWorks: { type: [StepSchema], default: [] },
    reviewsList: { type: [ServiceReviewSchema], default: [] },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const Service: Model<IService> = mongoose.model<IService>('Service', ServiceSchema);
