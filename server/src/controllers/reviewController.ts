import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.js';
import { Listing } from '../models/Listing.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get reviews for a listing
// @route   GET /api/reviews/listing/:listingId
// @access  Public
export const getReviewsByListing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { listingId } = req.params;

    const reviews = await Review.find({ listingId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review for a listing
// @route   POST /api/reviews
// @access  Public / Authenticated
export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      listingId,
      rating,
      comment,
      cleanliness = 5,
      accuracy = 5,
      communication = 5,
      locationRating = 5,
      value = 5,
      userName,
      userAvatar,
    } = req.body;

    if (!listingId || !rating || !comment) {
      return next(new AppError('listingId, rating, and comment are required', 400));
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new AppError(`Listing not found with id ${listingId}`, 404));
    }

    const review = await Review.create({
      listingId,
      userId: req.user?._id,
      userName: userName || req.user?.name || 'Traveler',
      userAvatar: userAvatar || req.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: Number(rating),
      comment,
      cleanliness: Number(cleanliness),
      accuracy: Number(accuracy),
      communication: Number(communication),
      locationRating: Number(locationRating),
      value: Number(value),
      date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    });

    // Recalculate listing rating
    const allListingReviews = await Review.find({ listingId });
    const count = allListingReviews.length;
    const avgRating = allListingReviews.reduce((sum, r) => sum + r.rating, 0) / count;

    listing.rating = {
      average: Number(avgRating.toFixed(2)),
      count,
      cleanliness: Number((allListingReviews.reduce((s, r) => s + r.cleanliness, 0) / count).toFixed(1)),
      accuracy: Number((allListingReviews.reduce((s, r) => s + r.accuracy, 0) / count).toFixed(1)),
      communication: Number((allListingReviews.reduce((s, r) => s + r.communication, 0) / count).toFixed(1)),
      location: Number((allListingReviews.reduce((s, r) => s + r.locationRating, 0) / count).toFixed(1)),
      value: Number((allListingReviews.reduce((s, r) => s + r.value, 0) / count).toFixed(1)),
    };
    await listing.save();

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
