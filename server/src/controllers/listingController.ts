import { Request, Response, NextFunction } from 'express';
import { Listing } from '../models/Listing.js';
import { Review } from '../models/Review.js';
import { Host } from '../models/Host.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all listings with filtering, search, sorting & pagination
// @route   GET /api/listings
// @access  Public
export const getListings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      search,
      destination,
      category,
      vibe,
      propertyType,
      roomType,
      minPrice,
      maxPrice,
      guests,
      bedrooms,
      bathrooms,
      amenities,
      guestFavorite,
      sort,
      page = '1',
      limit = '50',
    } = req.query;

    const query: any = {};
    const andConditions: any[] = [];

    const statusFilter = req.query.status;
    if (statusFilter && statusFilter !== 'all') {
      andConditions.push({ status: String(statusFilter) });
    } else if (!statusFilter) {
      // By default, public queries only see Published properties or listings where status doesn't exist yet (legacy)
      andConditions.push({
        $or: [{ status: 'Published' }, { status: { $exists: false } }],
      });
    }

    // Destination / Text Search
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      andConditions.push({
        $or: [
          { title: searchRegex },
          { tagline: searchRegex },
          { description: searchRegex },
          { 'location.city': searchRegex },
          { 'location.state': searchRegex },
          { 'location.area': searchRegex },
        ],
      });
    }

    if (destination) {
      const destRegex = new RegExp(String(destination), 'i');
      andConditions.push({
        $or: [
          { 'location.city': destRegex },
          { 'location.state': destRegex },
          { 'location.area': destRegex },
        ],
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = { $in: [String(category)] };
    }

    // Vibe filter
    if (vibe) {
      query.vibe = String(vibe);
    }

    // Property Type
    if (propertyType) {
      const types = Array.isArray(propertyType) ? propertyType : [String(propertyType)];
      query.propertyType = { $in: types };
    }

    // Room Type
    if (roomType) {
      query.roomType = String(roomType);
    }

    // Price range
    if (minPrice || maxPrice) {
      query['price.perNight'] = {};
      if (minPrice) query['price.perNight'].$gte = Number(minPrice);
      if (maxPrice) query['price.perNight'].$lte = Number(maxPrice);
    }

    // Guest capacity
    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    // Bedrooms
    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Bathrooms
    if (bathrooms) {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Guest favorite flag
    if (guestFavorite === 'true') {
      query.guestFavorite = true;
    }

    // Amenities (all required)
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : String(amenities).split(',');
      query.amenities = { $all: amenitiesList };
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { 'price.perNight': 1 };
    } else if (sort === 'price-desc') {
      sortOption = { 'price.perNight': -1 };
    } else if (sort === 'rating') {
      sortOption = { 'rating.average': -1, 'rating.count': -1 };
    } else if (sort === 'featured') {
      sortOption = { guestFavorite: -1, 'rating.average': -1 };
    }

    // Pagination
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [listings, totalCount] = await Promise.all([
      Listing.find(query)
        .populate('host')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Listing.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: listings.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing by ID or slug with populated host & reviews
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Search by _id or by slug
    let listing = await Listing.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).populate('host');

    if (!listing) {
      return next(new AppError(`Listing not found with id or slug '${id}'`, 404));
    }

    // Get reviews for this listing
    const reviews = await Review.find({ listingId: listing._id }).sort({ createdAt: -1 });

    const listingData: any = listing.toObject();
    listingData.reviews = reviews;

    // Guarantee host profile is always populated from Host or User model
    if (!listingData.host || !listingData.host.name) {
      const hostDoc =
        (await Host.findById(listing.hostId)) ||
        (await Host.findOne({ userId: listing.hostId }));
      if (hostDoc) {
        listingData.host = hostDoc.toObject ? hostDoc.toObject() : hostDoc;
      } else {
        const userDoc = await User.findById(listing.hostId);
        if (userDoc) {
          listingData.host = {
            _id: userDoc._id,
            name: userDoc.name,
            avatar:
              userDoc.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            responseTime: 'within an hour',
            responseRate: 100,
            isSuperhost: false,
          };
        }
      }
    }

    res.status(200).json({
      success: true,
      data: listingData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories with counts
// @route   GET /api/listings/categories
// @access  Public
export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoriesMeta = [
      { id: 'beachfront', label: 'Beachfront', iconName: 'Waves' },
      { id: 'villas', label: 'Villas', iconName: 'Home' },
      { id: 'mountains', label: 'Mountains', iconName: 'Mountain' },
      { id: 'tiny-homes', label: 'Tiny homes', iconName: 'Box' },
      { id: 'treehouses', label: 'Treehouses', iconName: 'Trees' },
      { id: 'heritage', label: 'Heritage', iconName: 'Castle' },
      { id: 'lakeside', label: 'Lakeside', iconName: 'Sailboat' },
      { id: 'farm-stays', label: 'Farm stays', iconName: 'Tractor' },
      { id: 'luxe', label: 'Luxe', iconName: 'Sparkles' },
      { id: 'pet-friendly', label: 'Pet-friendly', iconName: 'Dog' },
      { id: 'camping', label: 'Camping', iconName: 'Tent' },
    ];

    const counts = await Listing.aggregate([
      { $unwind: '$category' },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(counts.map((c) => [c._id, c.count]));

    const result = categoriesMeta.map((cat) => ({
      ...cat,
      count: countMap.get(cat.id) || 0,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stays grouped by vibe (Bento Grid)
// @route   GET /api/listings/vibes
// @access  Public
export const getListingsByVibe = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vibes = ['hills', 'beach', 'heritage', 'workation'];
    const results: Record<string, any[]> = {};

    for (const vibe of vibes) {
      results[vibe] = await Listing.find({ vibe }).limit(6).populate('host');
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending stays (Goa, Mumbai getaways, top rated)
// @route   GET /api/listings/trending
// @access  Public
export const getTrendingListings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [trendingInGoa, mumbaiGetaways, guestFavorites] = await Promise.all([
      Listing.find({ 'location.state': 'Goa' }).limit(8).populate('host'),
      Listing.find({ 'location.state': 'Maharashtra' }).limit(8).populate('host'),
      Listing.find({ guestFavorite: true }).sort({ 'rating.average': -1 }).limit(8).populate('host'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        trendingInGoa,
        mumbaiGetaways,
        guestFavorites,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current host's listings (including drafts, pending, rejected)
// @route   GET /api/listings/my-listings
// @access  Private (Host/User)
export const getMyHostListings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError('Authentication required', 401));
    }

    // Find host profile for this user
    const host = await Host.findOne({ userId: user._id });
    if (!host) {
      res.status(200).json({
        success: true,
        data: [],
      });
      return;
    }

    const listings = await Listing.find({ hostId: host._id }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Host/Admin)
export const createListing = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listingData = { ...req.body };
    const user = req.user;

    // Resolve or automatically create Host profile for user
    if (!listingData.hostId && user) {
      let host = await Host.findOne({ userId: user._id });
      if (!host) {
        host = await Host.create({
          userId: user._id,
          name: user.name || 'Wayfound Host',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          bio: `Host on Wayfound since ${new Date().getFullYear()}. Passionate about curated boutique stays and mindful travel.`,
          isSuperhost: false,
          responseRate: 100,
          responseTime: 'within an hour',
        });
      }
      listingData.hostId = host._id;

      // Update user role to host if currently user
      if (user.role === 'user') {
        await User.findByIdAndUpdate(user._id, { role: 'host' });
      }
    }

    // Default status to 'Pending Approval' unless specified (or if saving draft)
    if (!listingData.status) {
      listingData.status = 'Pending Approval';
    }

    // Default category & vibe if omitted
    if (!listingData.category || !Array.isArray(listingData.category) || listingData.category.length === 0) {
      listingData.category = ['villas'];
    }
    if (!listingData.vibe) {
      listingData.vibe = 'hills';
    }

    // Auto-generate slug from title if not provided
    if (!listingData.slug && listingData.title) {
      listingData.slug = listingData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    }

    // Ensure price structure is populated
    if (typeof listingData.price === 'number') {
      listingData.price = {
        perNight: listingData.price,
        cleaningFee: 1200,
        serviceFeePercent: 12,
        currency: 'INR',
      };
    } else if (listingData.price && !listingData.price.currency) {
      listingData.price.currency = 'INR';
      listingData.price.cleaningFee = listingData.price.cleaningFee || 1200;
      listingData.price.serviceFeePercent = listingData.price.serviceFeePercent || 12;
    }

    // Ensure location has coordinates
    if (listingData.location && (listingData.location.lat === undefined || listingData.location.lng === undefined)) {
      listingData.location.lat = 15.4909;
      listingData.location.lng = 73.8278;
    }

    const listing = await Listing.create(listingData);

    res.status(201).json({
      success: true,
      data: listing,
      message: 'Listing created successfully and submitted for admin review.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Host/Admin)
export const updateListing = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!listing) {
      return next(new AppError(`Listing not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Host/Admin)
export const deleteListing = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);

    if (!listing) {
      return next(new AppError(`Listing not found with id ${req.params.id}`, 404));
    }

    // Clean up reviews associated with listing
    await Review.deleteMany({ listingId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Listing and its reviews have been deleted',
    });
  } catch (error) {
    next(error);
  }
};
