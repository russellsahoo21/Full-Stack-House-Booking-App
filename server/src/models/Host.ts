import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IHost {
  _id: string;
  userId?: string;
  name: string;
  avatar: string;
  isSuperhost: boolean;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
  bio: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const HostSchema = new Schema<IHost>(
  {
    _id: {
      type: String,
      default: () => `host-${new mongoose.Types.ObjectId().toString()}`,
    },
    userId: {
      type: String,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Host name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      required: [true, 'Host avatar is required'],
    },
    isSuperhost: {
      type: Boolean,
      default: false,
    },
    joinedDate: {
      type: String,
      default: () => `Joined ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
    },
    responseRate: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    responseTime: {
      type: String,
      default: 'within an hour',
    },
    bio: {
      type: String,
      required: [true, 'Host bio is required'],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const Host: Model<IHost> = mongoose.model<IHost>('Host', HostSchema);
