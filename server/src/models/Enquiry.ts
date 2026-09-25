import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IEnquiry {
  _id: string;
  serviceId?: string;
  serviceTitle: string;
  villaName: string;
  dates: string;
  guestCount: number;
  dietaryPreferences?: string;
  specialRequests?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'pending' | 'in-review' | 'confirmed' | 'fulfilled';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    _id: {
      type: String,
      default: () => `enq-${new mongoose.Types.ObjectId().toString()}`,
    },
    serviceId: {
      type: String,
      ref: 'Service',
    },
    serviceTitle: {
      type: String,
      required: true,
    },
    villaName: {
      type: String,
      required: true,
    },
    dates: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    dietaryPreferences: {
      type: String,
      default: '',
    },
    specialRequests: {
      type: String,
      default: '',
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-review', 'confirmed', 'fulfilled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const Enquiry: Model<IEnquiry> = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
