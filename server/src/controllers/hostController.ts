import { Request, Response, NextFunction } from 'express';
import { Host } from '../models/Host.js';
import { Listing } from '../models/Listing.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all hosts
// @route   GET /api/hosts
// @access  Public
export const getHosts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hosts = await Host.find().sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: hosts.length,
      data: hosts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get host profile with their listings
// @route   GET /api/hosts/:id
// @access  Public
export const getHostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const host = await Host.findById(req.params.id);

    if (!host) {
      return next(new AppError(`Host not found with id ${req.params.id}`, 404));
    }

    const listings = await Listing.find({ hostId: host._id });

    res.status(200).json({
      success: true,
      data: {
        ...host.toObject(),
        listings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/register new host profile
// @route   POST /api/hosts
// @access  Private
export const createHost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostData = {
      ...req.body,
      userId: req.user?._id,
      name: req.body.name || req.user?.name,
      avatar: req.body.avatar || req.user?.avatar,
    };

    const host = await Host.create(hostData);

    res.status(201).json({
      success: true,
      data: host,
    });
  } catch (error) {
    next(error);
  }
};
