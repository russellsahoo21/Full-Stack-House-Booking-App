/**
 * Wayfound API Client Layer
 * Full integration with the Express & Mongoose Backend API
 */

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// ==========================================
// Types
// ==========================================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'host' | 'admin';
  avatar?: string;
  phone?: string;
  bio?: string;
  wishlist: string[];
  isSuperhost?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  user: User;
}

export interface ListingFilterParams {
  city?: string;
  state?: string;
  category?: string;
  vibe?: string;
  priceMin?: number;
  priceMax?: number;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface CreateBookingData {
  listingId: string;
  checkIn: string; // YYYY-MM-DD or ISO
  checkOut: string;
  guests: {
    adults: number;
    children?: number;
    infants?: number;
    pets?: number;
  };
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    specialRequests?: string;
  };
  paymentMethod?: string;
  specialRequests?: string;
}

export interface BookingResponse {
  _id: string;
  listingId: any;
  listing?: any;
  userId?: any;
  hostId?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: {
    adults: number;
    children?: number;
    infants?: number;
    pets?: number;
  };
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  pricing: {
    perNight?: number;
    nightlyRate?: number;
    subtotal?: number;
    baseSubtotal?: number;
    cleaningFee?: number;
    serviceFee?: number;
    taxes?: number;
    total?: number;
    totalAmount?: number;
    currency: string;
  };
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellationReason?: string;
  createdAt: string;
}

// ==========================================
// Base HTTP Request Helper
// ==========================================

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('wayfound_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'omit', // Standard bearer token auth
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// ==========================================
// 1. Authentication API
// ==========================================
export const authApi = {
  async register(body: { name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
    const res = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.token) {
      localStorage.setItem('wayfound_token', res.token);
    }
    return res;
  },

  async login(body: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.token) {
      localStorage.setItem('wayfound_token', res.token);
    }
    return res;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('wayfound_token');
    }
  },

  async getMe(): Promise<{ status: string; user: User }> {
    return apiRequest<{ status: string; user: User }>('/auth/me');
  },

  async updateProfile(updates: Partial<User>): Promise<{ status: string; user: User }> {
    return apiRequest<{ status: string; user: User }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async getWishlist(): Promise<{ status: string; wishlist: any[] }> {
    return apiRequest<{ status: string; wishlist: any[] }>('/auth/wishlist');
  },

  async toggleWishlist(listingId: string): Promise<{ status: string; isSaved: boolean; wishlist: string[] }> {
    return apiRequest<{ status: string; isSaved: boolean; wishlist: string[] }>(`/auth/wishlist/${listingId}`, {
      method: 'POST',
    });
  },
};

// ==========================================
// 2. Listings / Stays API
// ==========================================
export const listingsApi = {
  async getListings(params?: ListingFilterParams): Promise<{ status: string; count: number; data: any[] }> {
    const query = new URLSearchParams();
    if (params) {
      if (params.city) query.set('city', params.city);
      if (params.state) query.set('state', params.state);
      if (params.category && params.category !== 'All') query.set('category', params.category);
      if (params.vibe) query.set('vibe', params.vibe);
      if (params.priceMin !== undefined) query.set('priceMin', params.priceMin.toString());
      if (params.priceMax !== undefined) query.set('priceMax', params.priceMax.toString());
      if (params.guests) query.set('guests', params.guests.toString());
      if (params.bedrooms) query.set('bedrooms', params.bedrooms.toString());
      if (params.bathrooms) query.set('bathrooms', params.bathrooms.toString());
      if (params.search) query.set('search', params.search);
      if (params.limit) query.set('limit', params.limit.toString());
      if (params.page) query.set('page', params.page.toString());
      if (params.sort) query.set('sort', params.sort);
      if (params.amenities && params.amenities.length > 0) {
        query.set('amenities', params.amenities.join(','));
      }
    }
    const qStr = query.toString();
    return apiRequest<{ status: string; count: number; data: any[] }>(`/listings${qStr ? `?${qStr}` : ''}`);
  },

  async getListingById(id: string): Promise<{ status: string; data: any }> {
    return apiRequest<{ status: string; data: any }>(`/listings/${id}`);
  },

  async getFeatured(): Promise<{ status: string; count: number; data: any[] }> {
    return apiRequest<{ status: string; count: number; data: any[] }>('/listings/featured');
  },

  async getNearby(lat: number, lng: number, maxDistanceKm = 100): Promise<{ status: string; data: any[] }> {
    return apiRequest<{ status: string; data: any[] }>(
      `/listings/nearby?lat=${lat}&lng=${lng}&maxDistance=${maxDistanceKm}`
    );
  },
};

// ==========================================
// 3. Hosts API
// ==========================================
export const hostsApi = {
  async getHostById(id: string): Promise<{ status: string; data: any }> {
    return apiRequest<{ status: string; data: any }>(`/hosts/${id}`);
  },

  async getHostListings(hostId: string): Promise<{ status: string; count: number; data: any[] }> {
    return apiRequest<{ status: string; count: number; data: any[] }>(`/hosts/${hostId}/listings`);
  },
};

// ==========================================
// 4. Bookings API
// ==========================================
export const bookingsApi = {
  async createBooking(data: CreateBookingData): Promise<{ status?: string; success?: boolean; message?: string; data: BookingResponse }> {
    return apiRequest<{ status?: string; success?: boolean; message?: string; data: BookingResponse }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyBookings(): Promise<{ status?: string; success?: boolean; count: number; data: BookingResponse[] }> {
    return apiRequest<{ status?: string; success?: boolean; count: number; data: BookingResponse[] }>('/bookings');
  },

  async getBookedDates(listingId: string): Promise<{
    success: boolean;
    listingId: string;
    bookedRanges: { checkIn: string; checkOut: string }[];
    bookedDates: string[];
  }> {
    return apiRequest(`/bookings/listing/${listingId}/booked-dates`);
  },

  async getBookingById(id: string): Promise<{ status?: string; success?: boolean; data: BookingResponse }> {
    return apiRequest<{ status?: string; success?: boolean; data: BookingResponse }>(`/bookings/${id}`);
  },

  async cancelBooking(id: string, reason = 'Cancelled by guest'): Promise<{ status?: string; success?: boolean; message: string; data: BookingResponse }> {
    return apiRequest<{ status?: string; success?: boolean; message: string; data: BookingResponse }>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
};

// ==========================================
// 5. Reviews API
// ==========================================
export const reviewsApi = {
  async getReviewsByListing(listingId: string): Promise<{ status?: string; success?: boolean; count: number; data: any[] }> {
    return apiRequest<{ status?: string; success?: boolean; count: number; data: any[] }>(`/reviews/listing/${listingId}`);
  },

  async createReview(data: {
    listingId: string;
    rating: number;
    comment: string;
    cleanliness?: number;
    accuracy?: number;
    communication?: number;
    locationRating?: number;
    value?: number;
    userName?: string;
    userAvatar?: string;
  }): Promise<{ status?: string; success?: boolean; data: any }> {
    return apiRequest<{ status?: string; success?: boolean; data: any }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==========================================
// 6. Experiences API
// ==========================================
export const experiencesApi = {
  async getExperiences(category?: string): Promise<{ status: string; count: number; data: any[] }> {
    const qStr = category && category !== 'All' ? `?category=${category}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/experiences${qStr}`);
  },

  async getExperienceById(id: string): Promise<{ status: string; data: any }> {
    return apiRequest<{ status: string; data: any }>(`/experiences/${id}`);
  },
};

// ==========================================
// 7. Services API
// ==========================================
export const servicesApi = {
  async getServices(category?: string): Promise<{ status: string; count: number; data: any[] }> {
    const qStr = category && category !== 'All' ? `?category=${category}` : '';
    return apiRequest<{ status: string; count: number; data: any[] }>(`/services${qStr}`);
  },

  async getServiceById(id: string): Promise<{ status: string; data: any }> {
    return apiRequest<{ status: string; data: any }>(`/services/${id}`);
  },

  async submitEnquiry(data: {
    serviceId: string;
    villaLocation: string;
    date: string;
    partySize: number;
    specialNotes?: string;
  }): Promise<{ status: string; message: string; data: any }> {
    return apiRequest<{ status: string; message: string; data: any }>('/services/enquiry', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==========================================
// 8. Payments API
// ==========================================
export const paymentsApi = {
  async createOrder(bookingId: string, paymentMethod = 'upi'): Promise<{ status: string; order: any }> {
    return apiRequest<{ status: string; order: any }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingId, paymentMethod }),
    });
  },

  async verifyPayment(data: {
    orderId: string;
    paymentId: string;
    signature?: string;
  }): Promise<{ status: string; message: string; booking: any }> {
    return apiRequest<{ status: string; message: string; booking: any }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
