import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ILoginHistoryItem {
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  status: 'success' | 'failed';
  failureReason?: string;
}

export interface IAdmin {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: 'superadmin' | 'admin' | 'moderator';
  permissions: string[];
  status: 'active' | 'suspended' | 'inactive';
  lastLoginAt: Date;
  lastLoginIp?: string;
  lastLoginUserAgent?: string;
  loginCount: number;
  loginHistory: ILoginHistoryItem[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const LoginHistorySchema = new Schema<ILoginHistoryItem>(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    failureReason: {
      type: String,
    },
  },
  { _id: false }
);

const AdminSchema = new Schema<IAdmin>(
  {
    _id: {
      type: String,
      default: () => `admin-${new mongoose.Types.ObjectId().toString()}`,
    },
    userId: {
      type: String,
      ref: 'User',
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'moderator'],
      default: 'admin',
    },
    permissions: {
      type: [String],
      default: [
        'manage_bookings',
        'manage_properties',
        'manage_users',
        'manage_reviews',
        'export_reports',
        'view_analytics',
      ],
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'inactive'],
      default: 'active',
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginIp: {
      type: String,
      default: '127.0.0.1',
    },
    lastLoginUserAgent: {
      type: String,
      default: 'Unknown Browser',
    },
    loginCount: {
      type: Number,
      default: 1,
    },
    loginHistory: {
      type: [LoginHistorySchema],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AdminSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema);
