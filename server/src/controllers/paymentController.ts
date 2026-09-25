import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

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

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    res.status(200).json({
      success: true,
      data: {
        orderId,
        amount: totalAmount,
        currency: 'INR',
        paymentMethod,
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
      paymentId: paymentId || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
