/**
 * Wayfound API Client Layer
 * Full integration with the Express & Mongoose Backend API
 */

// Determine API base URL:
// 1. If VITE_API_URL is provided in environment, use it.
// 2. In production (import.meta.env.PROD), default to the live Render deployment:
//    https://full-stack-house-booking-app.onrender.com/api
// 3. In development (import.meta.env.DEV), default to local server: http://localhost:5000/api
const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL?.trim();
  const rawUrl = envUrl
    ? envUrl
    : (import.meta as any).env?.PROD
    ? 'https://full-stack-house-booking-app.onrender.com/api'
    : 'http://localhost:5000/api';

  // Normalize: strip trailing slashes
  const cleaned = rawUrl.replace(/\/+$/, '');
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

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
  status?: string;
  success?: boolean;
  token: string;
  user: User;
  data?: User;
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
  nights?: number;
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

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      credentials: 'omit', // Standard bearer token auth
    });
  } catch (netErr: any) {
    throw new Error(
      `Unable to connect to the backend server (${API_BASE_URL}). Please verify your network connection and server status.`
    );
  }

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
    const res = await apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.token) {
      localStorage.setItem('wayfound_token', res.token);
    }
    const user = res.user || res.data;
    return { ...res, user, data: user };
  },

  async login(body: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.token) {
      localStorage.setItem('wayfound_token', res.token);
    }
    const user = res.user || res.data;
    return { ...res, user, data: user };
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

  async getMe(): Promise<{ status?: string; success?: boolean; user: User; data: User }> {
    const res = await apiRequest<any>('/auth/me');
    const user = res.user || res.data;
    return { ...res, user, data: user };
  },

  async updateProfile(updates: Partial<User>): Promise<{ status?: string; success?: boolean; user: User; data: User }> {
    const res = await apiRequest<any>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    const user = res.user || res.data;
    return { ...res, user, data: user };
  },

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const res = await apiRequest<{ success: boolean; message: string }>('/auth/account', {
      method: 'DELETE',
    });
    localStorage.removeItem('wayfound_token');
    return res;
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

  async createListing(payload: any): Promise<{ success: boolean; data: any; message?: string }> {
    return apiRequest<{ success: boolean; data: any; message?: string }>('/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateListing(id: string, payload: any): Promise<{ success: boolean; data: any }> {
    return apiRequest<{ success: boolean; data: any }>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
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
// 8. Payments API (Razorpay & Online Gateway)
// ==========================================
export const paymentsApi = {
  async getKey(): Promise<{ success: boolean; keyId: string }> {
    return apiRequest<{ success: boolean; keyId: string }>('/payments/key');
  },

  async createOrder(payload: {
    listingId: string;
    nights: number;
    guests?: any;
    guestInfo?: any;
    paymentMethod?: string;
  }): Promise<{ success: boolean; data: any }> {
    return apiRequest<{ success: boolean; data: any }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async verifyPayment(data: {
    orderId?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    paymentId?: string;
    listingId: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests?: any;
    guestInfo?: any;
    paymentMethod?: string;
  }): Promise<{ success: boolean; message: string; data: any }> {
    return apiRequest<{ success: boolean; message: string; data: any }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==========================================
// 9. Admin Portal API
// ==========================================
export const adminApi = {
  async getDashboard(range: '7D' | '30D' | '3M' | '12M' = '30D'): Promise<{
    success: boolean;
    data: {
      kpis: {
        grossRevenue: number;
        grossGrowth: string;
        platformMargin: number;
        activeBookings: number;
        bookingsGrowth: string;
        confirmedCount: number;
        pendingCount: number;
        cancelledCount: number;
        curatedInventory: number;
        inventoryGrowth: string;
        registeredUsers: number;
        communityGrowth: string;
        hostsCount: number;
        travelersCount: number;
        occupancyPercentage: number;
      };
      revenueVelocity: {
        range: string;
        labels: string[];
        currentCycle: number[];
        previousCycle: number[];
        peakAmount: number;
        projectedMonthlyClose: number;
      };
      recentBookings: any[];
      liveActivities: any[];
      systemHealth: {
        database: string;
        uptime: number;
        version: string;
        services: string;
      };
    };
  }> {
    return apiRequest(`/admin/dashboard?range=${range}`);
  },

  async getBookings(params?: {
    search?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{
    success: boolean;
    count: number;
    total: number;
    stats: {
      totalRevenue: number;
      confirmed: number;
      pending: number;
      cancelled: number;
    };
    page: number;
    totalPages: number;
    data: any[];
  }> {
    const q = new URLSearchParams();
    if (params) {
      if (params.search) q.set('search', params.search);
      if (params.status) q.set('status', params.status);
      if (params.paymentStatus) q.set('paymentStatus', params.paymentStatus);
      if (params.page) q.set('page', params.page.toString());
      if (params.limit) q.set('limit', params.limit.toString());
      if (params.sort) q.set('sort', params.sort);
    }
    const qStr = q.toString();
    return apiRequest(`/admin/bookings${qStr ? `?${qStr}` : ''}`);
  },

  async updateBookingStatus(
    id: string,
    updates: { status?: string; paymentStatus?: string; reason?: string }
  ): Promise<{ success: boolean; message: string; data: any }> {
    return apiRequest(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async getProperties(params?: {
    search?: string;
    category?: string;
    city?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{
    success: boolean;
    count: number;
    total: number;
    page: number;
    totalPages: number;
    data: any[];
  }> {
    const q = new URLSearchParams();
    if (params) {
      if (params.search) q.set('search', params.search);
      if (params.category) q.set('category', params.category);
      if (params.city) q.set('city', params.city);
      if (params.page) q.set('page', params.page.toString());
      if (params.limit) q.set('limit', params.limit.toString());
      if (params.sort) q.set('sort', params.sort);
    }
    const qStr = q.toString();
    return apiRequest(`/admin/properties${qStr ? `?${qStr}` : ''}`);
  },

  async updatePropertyStatus(
    id: string,
    updates: { status?: string; guestFavorite?: boolean }
  ): Promise<{ success: boolean; message: string; data: any }> {
    return apiRequest(`/admin/properties/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteProperty(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/admin/properties/${id}`, {
      method: 'DELETE',
    });
  },

  async getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{
    success: boolean;
    count: number;
    total: number;
    stats: {
      totalUsers: number;
      hostsCount: number;
      adminsCount: number;
      guestsCount: number;
    };
    page: number;
    totalPages: number;
    data: any[];
  }> {
    const q = new URLSearchParams();
    if (params) {
      if (params.search) q.set('search', params.search);
      if (params.role) q.set('role', params.role);
      if (params.status) q.set('status', params.status);
      if (params.page) q.set('page', params.page.toString());
      if (params.limit) q.set('limit', params.limit.toString());
      if (params.sort) q.set('sort', params.sort);
    }
    const qStr = q.toString();
    return apiRequest(`/admin/users${qStr ? `?${qStr}` : ''}`);
  },

  async updateUserRole(id: string, role: string): Promise<{ success: boolean; message: string; data: any }> {
    return apiRequest(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async updateUserStatus(id: string, status: string): Promise<{ success: boolean; message: string; data: any }> {
    return apiRequest(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  async getReviews(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    count: number;
    total: number;
    page: number;
    totalPages: number;
    data: any[];
  }> {
    const q = new URLSearchParams();
    if (params) {
      if (params.search) q.set('search', params.search);
      if (params.status) q.set('status', params.status);
      if (params.page) q.set('page', params.page.toString());
      if (params.limit) q.set('limit', params.limit.toString());
    }
    const qStr = q.toString();
    return apiRequest(`/admin/reviews${qStr ? `?${qStr}` : ''}`);
  },

  async updateReviewStatus(
    id: string,
    updates: { status?: string; flagReason?: string }
  ): Promise<{ success: boolean; message: string; data: any }> {
    return apiRequest(`/admin/reviews/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteReview(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  async exportReport(type: 'bookings' | 'properties'): Promise<void> {
    const token = localStorage.getItem('wayfound_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/admin/export/${type}`, { headers });
    if (!res.ok) throw new Error('Failed to export CSV report');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wayfound_${type}_audit.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};


