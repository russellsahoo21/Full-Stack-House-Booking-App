export interface Host {
  _id: string;
  name: string;
  avatar: string;
  isSuperhost: boolean;
  joinedDate: string;
  responseRate: number; // e.g. 98%
  responseTime: string; // e.g. 'within an hour'
  bio: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  _id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  cleanliness: number;
  accuracy: number;
  communication: number;
  locationRating: number;
  value: number;
}

export type CategoryId =
  | 'beachfront'
  | 'villas'
  | 'mountains'
  | 'tiny-homes'
  | 'treehouses'
  | 'heritage'
  | 'lakeside'
  | 'farm-stays'
  | 'luxe'
  | 'pet-friendly'
  | 'camping';

export interface Category {
  id: CategoryId;
  label: string;
  iconName: string;
}

export type Vibe = 'hills' | 'beach' | 'heritage' | 'workation';

export interface Listing {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  propertyType: 'Villa' | 'Cottage' | 'Haveli' | 'Apartment' | 'Houseboat' | 'Tent' | 'Treehouse' | 'Chalet';
  roomType: 'Entire place' | 'Private room' | 'Shared room';
  category: CategoryId[];
  vibe: Vibe;
  location: {
    city: string;
    state: string;
    country: string;
    area: string;
    distanceDesc: string; // e.g. "82 km away", "Beachfront"
    lat: number;
    lng: number;
  };
  price: {
    perNight: number;
    cleaningFee: number;
    serviceFeePercent: number;
    currency: 'INR';
  };
  rating: {
    average: number;
    count: number;
    accuracy?: number;
    cleanliness?: number;
    communication?: number;
    location?: number;
    value?: number;
  };
  images: string[];
  amenities: string[];
  hostId: string;
  guestFavorite: boolean;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  availableDates: string; // e.g. "Oct 12 – 17"
  sleepingArrangements: Array<{
    room: string;
    bedType: string;
  }>;
  houseRules: string[];
  cancellationPolicy: string;
  createdAt: string;
}
