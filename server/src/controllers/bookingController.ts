import { Request, Response, NextFunction } from 'express';
import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Create new booking / reservation
// @route   POST /api/bookings
// @access  Public / Authenticated
export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      listingId,
      checkIn,
      checkOut,
      nights: requestedNights,
      guests,
      guestInfo,
      paymentMethod = 'upi',
    } = req.body;

    if (!listingId || !checkIn || !checkOut) {
      return next(new AppError('listingId, checkIn, and checkOut are required', 400));
    }

    // 1. Fetch listing to get real pricing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new AppError(`Listing not found with id ${listingId}`, 404));
    }

    // 2. Calculate nights if not provided
    let nights = Number(requestedNights);
    if (!nights || isNaN(nights) || nights < 1) {
      const start = new Date(checkIn).getTime();
      const end = new Date(checkOut).getTime();
      const diffTime = Math.abs(end - start);
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    // 3. Calculate verified pricing
    const perNight = listing.price.perNight;
    const subtotal = perNight * nights;
    const cleaningFee = listing.price.cleaningFee || 0;
    const serviceFeePercent = listing.price.serviceFeePercent || 12;
    const serviceFee = Math.round(subtotal * (serviceFeePercent / 100));
    const total = subtotal + cleaningFee + serviceFee;

    // 4. Guest info fallback
    const resolvedGuestInfo = {
      name: guestInfo?.name || req.user?.name || 'Guest Traveler',
      email: guestInfo?.email || req.user?.email || 'guest@wayfound.stay',
      phone: guestInfo?.phone || req.user?.phone || '+91 98765 43210',
      specialRequests: guestInfo?.specialRequests || '',
    };

    // 5. Create reservation
    const booking = await Booking.create({
      listingId: listing._id,
      userId: req.user?._id,
      guestInfo: resolvedGuestInfo,
      checkIn,
      checkOut,
      nights,
      guests: guests || { adults: 1, children: 0, infants: 0, pets: 0 },
      pricing: {
        perNight,
        subtotal,
        cleaningFee,
        serviceFee,
        total,
        currency: 'INR',
      },
      paymentMethod,
      paymentStatus: 'paid',
      status: 'confirmed',
    });

    const populatedBooking = await Booking.findById(booking._id).populate('listing');

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings (or all if admin)
// @route   GET /api/bookings
// @access  Private / Authenticated
export const getBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query: any = {};

    // If not admin, restrict to logged-in user
    if (req.user?.role !== 'admin') {
      if (req.user?._id) {
        query.userId = req.user._id;
      }
    }

    const bookings = await Booking.find(query)
      .populate('listing')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Public / Authenticated
export const getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking) {
      return next(new AppError(`Booking not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (confirmed, cancelled, completed)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin / Host / User)
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, cancellationReason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, cancellationReason },
      { new: true, runValidators: true }
    ).populate('listing');

    if (!booking) {
      return next(new AppError(`Booking not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reason = 'Cancelled by guest' } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancellationReason: reason,
        paymentStatus: 'refunded',
      },
      { new: true }
    ).populate('listing');

    if (!booking) {
      return next(new AppError(`Booking not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
