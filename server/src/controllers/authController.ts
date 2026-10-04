import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { User } from '../models/User.js';
import { Admin } from '../models/Admin.js';
import { Listing } from '../models/Listing.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

const signToken = (id: string, role: string): string => {
  const secret =
    process.env.JWT_SECRET || 'supersecret_default_key';

  const expiresIn: any =
    process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    { id, role },
    secret,
    { expiresIn }
  );
};

const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production'
        ? ('none' as const)
        : ('lax' as const),
  };

  res.cookie('token', token, cookieOptions);

  // Exclude password from output
  const userObj =
    typeof user.toObject === 'function'
      ? user.toObject()
      : { ...user };

  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;

  res.status(statusCode).json({
    success: true,
    token,
    data: userObj,
    user: userObj,
  });
};

// ======================================================
// REGISTER
// ======================================================

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      avatar,
      role,
      phone,
    } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return next(
        new AppError('Please provide name, email, and password', 400)
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return next(
        new AppError(
          'An account with this email address already exists',
          400
        )
      );
    }

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      avatar,
      phone: phone ? phone.trim() : undefined,
      role:
        role && ['user', 'host'].includes(role)
          ? role
          : 'user',
    });

    sendTokenResponse(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

// ======================================================
// LOGIN
// ======================================================

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError(
          'Please provide both email and password',
          400
        )
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select(
      '+password'
    );


    if (
      !user ||
      !(await user.comparePassword(password))
    ) {
      return next(
        new AppError(
          'Invalid email or password',
          401
        )
      );
    }

    // If logging in user is an admin, store / record session in Admin DB collection
    if (user.role === 'admin') {
      try {
        const clientIp =
          (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
          req.socket?.remoteAddress ||
          '127.0.0.1';
        const userAgent = req.headers['user-agent'] || 'Browser Client';
        const now = new Date();

        await Admin.findOneAndUpdate(
          { email: user.email },
          {
            $set: {
              userId: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              phone: user.phone,
              role: 'admin',
              lastLoginAt: now,
              lastLoginIp: clientIp,
              lastLoginUserAgent: userAgent,
              status: 'active',
            },
            $inc: { loginCount: 1 },
            $push: {
              loginHistory: {
                $each: [
                  {
                    timestamp: now,
                    ip: clientIp,
                    userAgent,
                    status: 'success',
                  },
                ],
                $slice: -50, // Keep latest 50 login events
              },
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (adminErr) {
        console.error('Failed to log admin login into Admin schema:', adminErr);
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(
        new AppError(
          'Please provide your email address',
          400
        )
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select(
      '+resetPasswordToken +resetPasswordExpire'
    );

    // Do not reveal whether an account exists
    if (!user) {
      res.status(200).json({
        success: true,
        message:
          'If an account exists with this email, a password reset link has been generated.',
      });

      return;
    }

    // Generate secure random token
    const resetToken = crypto
      .randomBytes(32)
      .toString('hex');

    // Hash token before storing it
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;

    // Token valid for 15 minutes
    user.resetPasswordExpire = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save({
      validateBeforeSave: false,
    });

    const clientUrl =
      process.env.CLIENT_URL ||
      'http://localhost:5173';

    const resetUrl =
      `${clientUrl}/reset-password/${resetToken}`;

    // Development testing
    console.log('');
    console.log('==============================================');
    console.log('🔐 PASSWORD RESET URL');
    console.log(resetUrl);
    console.log('==============================================');
    console.log('');

    const response: any = {
      success: true,
      message:
        'Password reset link generated successfully.',
    };

    // Only expose token during development
    if (process.env.NODE_ENV !== 'production') {
      response.resetToken = resetToken;
      response.resetUrl = resetUrl;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ======================================================
// RESET PASSWORD
// ======================================================

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!token) {
      return next(
        new AppError(
          'Password reset token is required',
          400
        )
      );
    }

    if (!password) {
      return next(
        new AppError(
          'Please provide a new password',
          400
        )
      );
    }

    if (password.length < 6) {
      return next(
        new AppError(
          'Password must be at least 6 characters long',
          400
        )
      );
    }

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: new Date(),
      },
    }).select(
      '+password +resetPasswordToken +resetPasswordExpire'
    );

    if (!user) {
      return next(
        new AppError(
          'Reset token is invalid or has expired',
          400
        )
      );
    }

    // Update password
    // UserSchema pre-save hook automatically hashes it.
    user.password = password;

    // Invalidate reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        'Password reset successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(
      req.user?._id
    );

    if (!user) {
      return next(
        new AppError('User not found', 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE PROFILE
// ======================================================

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      avatar,
      phone,
      bio,
    } = req.body;

    const updateFields: Record<string, any> = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (phone !== undefined) updateFields.phone = phone ? phone.trim() : '';
    if (bio !== undefined) updateFields.bio = bio ? bio.trim() : '';

    const user =
      await User.findByIdAndUpdate(
        req.user?._id,
        updateFields,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE ACCOUNT
// ======================================================

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Protect permanent demo accounts from deletion
    const protectedEmails = [
      'guest@wayfound.in',
      'arjun@wayfound.in',
      'traveler@wayfound.stay',
      'host@wayfound.stay',
      'admin@wayfound.stay',
    ];

    if (protectedEmails.includes(user.email.toLowerCase())) {
      return next(
        new AppError(
          'Protected demo accounts cannot be deleted. Please register your own personal account to test deleting.',
          403
        )
      );
    }

    await User.findByIdAndDelete(userId);

    // Clear authentication cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


// ======================================================
// TOGGLE WISHLIST
// ======================================================

// @desc    Toggle stay in wishlist
// @route   POST /api/auth/wishlist/toggle
// @access  Private
export const toggleWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listingId =
      req.body?.listingId ||
      req.params?.listingId;

    if (!listingId) {
      return next(
        new AppError(
          'listingId is required to update wishlist',
          400
        )
      );
    }

    const user = await User.findById(
      req.user?._id
    );

    if (!user) {
      return next(
        new AppError('User not found', 404)
      );
    }

    const isSaved =
      user.wishlist.includes(listingId);

    if (isSaved) {
      user.wishlist =
        user.wishlist.filter(
          (id) => id !== listingId
        );
    } else {
      user.wishlist.push(listingId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !isSaved,
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET WISHLIST
// ======================================================

// @desc    Get user's wishlist stays
// @route   GET /api/auth/wishlist
// @access  Private
export const getWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(
      req.user?._id
    );

    if (!user) {
      return next(
        new AppError('User not found', 404)
      );
    }

    const savedStays =
      await Listing.find({
        _id: {
          $in: user.wishlist,
        },
      }).populate('host');

    res.status(200).json({
      success: true,
      count: savedStays.length,
      data: savedStays,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// LOGOUT
// ======================================================

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.cookie('token', 'none', {
    expires: new Date(
      Date.now() + 10 * 1000
    ),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message:
      'User logged out successfully',
  });
};