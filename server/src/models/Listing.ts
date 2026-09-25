import mongoose, { Document, Schema, Model } from 'mongoose';

export type CategoryId =
  | 'beachfront'
  | 'villas'
  | 'mountains'
  | 'tiny-homes'
  | 'treehouses'
  | 'heritage'
  | 'lakeside'
  | 'farm-stays'
  | 'luxe'
  | 'pet-friendly'
  | 'camping';

export type Vibe = 'hills' | 'beach' | 'heritage' | 'workation';

export type PropertyType =
  | 'Villa'
  | 'Cottage'
  | 'Haveli'
  | 'Apartment'
  | 'Houseboat'
  | 'Tent'
  | 'Treehouse'
  | 'Chalet';

export type RoomType = 'Entire place' | 'Private room' | 'Shared room';

export interface IListing {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  propertyType: PropertyType;
  roomType: RoomType;
  category: CategoryId[];
  vibe: Vibe;
  location: {
    city: string;
    state: string;
    country: string;
    area: string;
    distanceDesc: string;
    lat: number;
    lng: number;
  };
  price: {
    perNight: number;
    cleaningFee: number;
    serviceFeePercent: number;
    currency: 'INR';
  };
  rating: {
    average: number;
    count: number;
    accuracy?: number;
    cleanliness?: number;
    communication?: number;
    location?: number;
    value?: number;
  };
  images: string[];
  amenities: string[];
  hostId: string;
  guestFavorite: boolean;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  availableDates: string;
  sleepingArrangements: Array<{
    room: string;
    bedType: string;
  }>;
  houseRules: string[];
  cancellationPolicy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SleepingArrangementSchema = new Schema(
  {
    room: { type: String, required: true },
    bedType: { type: String, required: true },
  },
  { _id: false }
);

const ListingSchema = new Schema<IListing>(
  {
    _id: {
      type: String,
      default: () => `stay-${new mongoose.Types.ObjectId().toString()}`,
    },
    title: {
      type: String,
      required: [true, 'Stay title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['Villa', 'Cottage', 'Haveli', 'Apartment', 'Houseboat', 'Tent', 'Treehouse', 'Chalet'],
    },
    roomType: {
      type: String,
      required: true,
      enum: ['Entire place', 'Private room', 'Shared room'],
      default: 'Entire place',
    },
    category: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'A listing must have at least one category',
      },
    },
    vibe: {
      type: String,
      required: true,
      enum: ['hills', 'beach', 'heritage', 'workation'],
    },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, default: 'India', trim: true },
      area: { type: String, required: true, trim: true },
      distanceDesc: { type: String, default: '' },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    price: {
      perNight: { type: Number, required: true, min: [0, 'Price per night cannot be negative'] },
      cleaningFee: { type: Number, required: true, default: 0 },
      serviceFeePercent: { type: Number, required: true, default: 12 },
      currency: { type: String, default: 'INR', enum: ['INR'] },
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
      accuracy: { type: Number, default: 5 },
      cleanliness: { type: Number, default: 5 },
      communication: { type: Number, default: 5 },
      location: { type: Number, default: 5 },
      value: { type: Number, default: 5 },
    },
    images: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'A listing must include at least one photo',
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    hostId: {
      type: String,
      ref: 'Host',
      required: [true, 'Host ID is required'],
    },
    guestFavorite: {
      type: Boolean,
      default: false,
    },
    maxGuests: {
      type: Number,
      required: true,
      min: [1, 'Must accommodate at least 1 guest'],
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    beds: {
      type: Number,
      required: true,
      min: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0.5,
    },
    availableDates: {
      type: String,
      default: 'Available year-round',
    },
    sleepingArrangements: {
      type: [SleepingArrangementSchema],
      default: [],
    },
    houseRules: {
      type: [String],
      default: [],
    },
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 48 hours before check-in',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: false,
  }
);

// Virtual to populate host
ListingSchema.virtual('host', {
  ref: 'Host',
  localField: 'hostId',
  foreignField: '_id',
  justOne: true,
});

// Virtual to populate reviews
ListingSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'listingId',
});

// Search Indexes
ListingSchema.index({
  title: 'text',
  tagline: 'text',
  description: 'text',
  'location.city': 'text',
  'location.state': 'text',
  'location.area': 'text',
});

ListingSchema.index({ 'location.city': 1 });
ListingSchema.index({ 'location.state': 1 });
ListingSchema.index({ category: 1 });
ListingSchema.index({ vibe: 1 });
ListingSchema.index({ 'price.perNight': 1 });
ListingSchema.index({ 'rating.average': -1 });

export const Listing: Model<IListing> = mongoose.model<IListing>('Listing', ListingSchema);
