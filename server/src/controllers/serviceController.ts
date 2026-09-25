import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/Service.js';
import { Enquiry } from '../models/Enquiry.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all concierge services
// @route   GET /api/services
// @access  Public
export const getServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;

    const query: any = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const services = await Service.find(query).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single concierge service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError(`Service not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit concierge / service enquiry
// @route   POST /api/services/enquiry
// @access  Public / Authenticated
export const createServiceEnquiry = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      serviceId,
      serviceTitle,
      villaName,
      dates,
      guestCount = 2,
      dietaryPreferences,
      specialRequests,
      contactName,
      contactEmail,
      contactPhone,
    } = req.body;

    if (!serviceTitle || !villaName || !contactEmail || !contactName) {
      return next(new AppError('Please provide service title, villa name, contact name and email', 400));
    }

    const enquiry = await Enquiry.create({
      serviceId,
      serviceTitle,
      villaName,
      dates: dates || 'Flexible / During stay',
      guestCount: Number(guestCount) || 2,
      dietaryPreferences,
      specialRequests,
      contactName: contactName || req.user?.name,
      contactEmail: contactEmail || req.user?.email,
      contactPhone: contactPhone || req.user?.phone || '+91 98765 43210',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Your concierge enquiry has been sent. Our team will contact you shortly.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new concierge service
// @route   POST /api/services
// @access  Private (Admin)
export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};
