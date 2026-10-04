import mongoose, { Document, Schema, Model } from 'mongoose';

export type InquiryTopic =
  | 'Ask questions before booking'
  | 'Ask about amenities'
  | 'Confirm check-in/check-out details'
  | 'Ask about house rules'
  | 'Share special requirements'
  | 'Discuss problems during the stay'
  | 'General question';

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  senderRole: 'guest' | 'host' | 'admin';
  topic?: string;
  text: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    _id: {
      type: String,
      default: () => `msg-${new mongoose.Types.ObjectId().toString()}`,
    },
    conversationId: {
      type: String,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    senderId: {
      type: String,
      ref: 'User',
      required: [true, 'Sender ID is required'],
      index: true,
    },
    recipientId: {
      type: String,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
      index: true,
    },
    senderRole: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: 'guest',
    },
    topic: {
      type: String,
      default: 'General question',
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MessageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
});

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);
