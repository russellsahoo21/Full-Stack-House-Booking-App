import { Request, Response, NextFunction } from 'express';
import { Experience } from '../models/Experience.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all experiences (with optional category filter)
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search } = req.query;

    const query: any = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { title: searchRegex },
        { tagline: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    const experiences = await Experience.find(query).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single experience by ID
// @route   GET /api/experiences/:id
// @access  Public
export const getExperienceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return next(new AppError(`Experience not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book / reserve experience
// @route   POST /api/experiences/:id/book
// @access  Public / Authenticated
export const bookExperience = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, guests = 1, contactName, contactEmail, contactPhone } = req.body;

    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return next(new AppError(`Experience not found with id ${req.params.id}`, 404));
    }

    const guestCount = Number(guests) || 1;
    const totalAmount = experience.pricePerPerson * guestCount;

    const reservation = {
      experienceId: experience._id,
      experienceTitle: experience.title,
      date,
      guests: guestCount,
      totalAmount,
      contact: {
        name: contactName || req.user?.name || 'Guest Explorer',
        email: contactEmail || req.user?.email || 'guest@wayfound.stay',
        phone: contactPhone || req.user?.phone || '+91 98765 43210',
      },
      status: 'confirmed',
      bookingReference: `EXP-${Date.now().toString().slice(-6)}`,
    };

    res.status(201).json({
      success: true,
      message: 'Experience reservation confirmed',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private (Admin)
export const createExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};
