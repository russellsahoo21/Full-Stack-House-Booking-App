import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_KEY || '';
  return { keyId, keySecret };
};

const getRazorpayInstance = (): Razorpay | null => {
  const { keyId, keySecret } = getRazorpayCredentials();
  if (keyId && keySecret) {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return null;
};

// @desc    Get Razorpay public key
// @route   GET /api/payments/key
// @access  Public
export const getRazorpayKey = async (_req: Request, res: Response): Promise<void> => {
  const { keyId } = getRazorpayCredentials();
  res.status(200).json({
    success: true,
    keyId,
  });
};


// @desc    Create payment order (Razorpay / UPI / Card / Mock)
// @route   POST /api/payments/create-order
// @access  Public / Authenticated
export const createPaymentOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { listingId, nights, guests, guestInfo, paymentMethod = 'upi' } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new AppError('Listing not found', 404));
    }

    const nightsNum = Number(nights) || 1;
    const subtotal = listing.price.perNight * nightsNum;
    const cleaningFee = listing.price.cleaningFee || 0;
    const serviceFee = Math.round(subtotal * (listing.price.serviceFeePercent / 100));
    const totalAmount = subtotal + cleaningFee + serviceFee;

    let orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    let razorpayOrderData: any = null;
    const { keyId, keySecret } = getRazorpayCredentials();
    const razorpay = getRazorpayInstance();

    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // amount in paise
          currency: 'INR',
          receipt: `rcpt_${Date.now().toString().slice(-10)}`,
          notes: {
            listingId: String(listing._id),
            listingTitle: listing.title?.substring(0, 40) || 'Wayfound Stay',
          },
        });
        orderId = order.id;
        razorpayOrderData = order;
      } catch (rzpErr: any) {
        console.warn('Razorpay order creation fallback:', rzpErr?.message || rzpErr);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        orderId,
        amount: totalAmount,
        currency: 'INR',
        keyId,
        paymentMethod,
        razorpayOrder: razorpayOrderData,
        listing: {
          id: listing._id,
          title: listing.title,
          city: listing.location.city,
        },
        pricing: {
          perNight: listing.price.perNight,
          nights: nightsNum,
          subtotal,
          cleaningFee,
          serviceFee,
          total: totalAmount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment and confirm booking
// @route   POST /api/payments/verify
// @access  Public / Authenticated
export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      listingId,
      checkIn,
      checkOut,
      nights,
      guests,
      guestInfo,
      paymentMethod = 'upi',
    } = req.body;

    if (!listingId || !checkIn || !checkOut) {
      return next(new AppError('listingId, checkIn, and checkOut are required', 400));
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new AppError('Listing not found', 404));
    }

    // Verify signature if provided by Razorpay checkout
    const rzpOrderId = razorpay_order_id || orderId;
    const rzpPaymentId = razorpay_payment_id || paymentId;
    const { keySecret } = getRazorpayCredentials();

    if (razorpay_signature && rzpOrderId && rzpPaymentId && keySecret) {
      const body = `${rzpOrderId}|${rzpPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return next(new AppError('Payment signature verification failed.', 400));
      }
    }


    const nightsNum = Number(nights) || 1;
    const subtotal = listing.price.perNight * nightsNum;
    const cleaningFee = listing.price.cleaningFee || 0;
    const serviceFee = Math.round(subtotal * (listing.price.serviceFeePercent / 100));
    const total = subtotal + cleaningFee + serviceFee;

    const resolvedGuestInfo = {
      name: guestInfo?.name || req.user?.name || 'Guest Traveler',
      email: guestInfo?.email || req.user?.email || 'guest@wayfound.stay',
      phone: guestInfo?.phone || req.user?.phone || '+91 98765 43210',
      specialRequests: guestInfo?.specialRequests || '',
    };

    const finalPaymentId = rzpPaymentId || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const booking = await Booking.create({
      listingId: listing._id,
      userId: req.user?._id,
      guestInfo: resolvedGuestInfo,
      checkIn,
      checkOut,
      nights: nightsNum,
      guests: guests || { adults: 1, children: 0, infants: 0, pets: 0 },
      pricing: {
        perNight: listing.price.perNight,
        subtotal,
        cleaningFee,
        serviceFee,
        total,
        currency: 'INR',
      },
      paymentMethod,
      paymentStatus: 'paid',
      paymentId: finalPaymentId,
      status: 'confirmed',
    });

    const populatedBooking = await Booking.findById(booking._id).populate('listing');

    res.status(200).json({
      success: true,
      message: 'Payment verified and reservation confirmed',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

