import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IExperienceItineraryStep {
  step: number;
  title: string;
  time: string;
  description: string;
}

export interface IExperienceReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface IExperience {
  _id: string;
  title: string;
  tagline: string;
  category: 'Culinary' | 'Adventure' | 'Culture' | 'Nature' | 'Wellness';
  location: string;
  duration: string;
  groupSize: string;
  pricePerPerson: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  hostName: string;
  hostAvatar: string;
  hostBio: string;
  venueName: string;
  venueType: string;
  venueDescription: string;
  highlights: string[];
  included: string[];
  itinerary: IExperienceItineraryStep[];
  reviewsList: IExperienceReview[];
  createdAt: Date;
  updatedAt: Date;
}

const ItineraryStepSchema = new Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ExperienceReviewSchema = new Schema(
  {
    id: { type: String, required: true },
    author: { type: String, required: true },
    avatar: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    _id: {
      type: String,
      default: () => `exp-${new mongoose.Types.ObjectId().toString()}`,
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Culinary', 'Adventure', 'Culture', 'Nature', 'Wellness'],
    },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    groupSize: { type: String, required: true },
    pricePerPerson: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    description: { type: String, required: true },
    hostName: { type: String, required: true },
    hostAvatar: { type: String, required: true },
    hostBio: { type: String, required: true },
    venueName: { type: String, default: '' },
    venueType: { type: String, default: '' },
    venueDescription: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    included: { type: [String], default: [] },
    itinerary: { type: [ItineraryStepSchema], default: [] },
    reviewsList: { type: [ExperienceReviewSchema], default: [] },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const Experience: Model<IExperience> = mongoose.model<IExperience>('Experience', ExperienceSchema);
