import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IConversation {
  _id: string;
  guestId: string;
  hostId: string;
  listingId: string;
  lastMessage: string;
  lastMessageAt: Date;
  lastSenderId?: string;
  unreadGuest: number;
  unreadHost: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    _id: {
      type: String,
      default: () => `conv-${new mongoose.Types.ObjectId().toString()}`,
    },
    guestId: {
      type: String,
      ref: 'User',
      required: [true, 'Guest ID is required'],
      index: true,
    },
    hostId: {
      type: String,
      ref: 'User',
      required: [true, 'Host ID is required'],
      index: true,
    },
    listingId: {
      type: String,
      ref: 'Listing',
      required: [true, 'Listing ID is required'],
      index: true,
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastSenderId: {
      type: String,
      ref: 'User',
    },
    unreadGuest: {
      type: Number,
      default: 0,
    },
    unreadHost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals for populating relations
ConversationSchema.virtual('guest', {
  ref: 'User',
  localField: 'guestId',
  foreignField: '_id',
  justOne: true,
});

ConversationSchema.virtual('host', {
  ref: 'User',
  localField: 'hostId',
  foreignField: '_id',
  justOne: true,
});

ConversationSchema.virtual('listing', {
  ref: 'Listing',
  localField: 'listingId',
  foreignField: '_id',
  justOne: true,
});

// Compound index to quickly find an existing conversation between a guest and host for a listing
ConversationSchema.index({ guestId: 1, hostId: 1, listingId: 1 }, { unique: true });

export const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema
);
