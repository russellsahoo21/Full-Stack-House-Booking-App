# 🌿 Wayfound Backend API

> Production-ready, TypeScript-powered REST API for the **Wayfound** stay booking platform. Built with Express, MongoDB Atlas, Mongoose, JWT authentication, and full support for stays, hosts, reviews, bookings, curated experiences, and luxury concierge services across India.

---

## 📖 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Directory Architecture](#-directory-architecture)
- [🔐 Environment Variables](#-environment-variables)
- [🚀 Quick Start & How to Run](#-quick-start--how-to-run)
- [🌱 Database Seeding](#-database-seeding)
- [📡 API Endpoints Reference](#-api-endpoints-reference)
- [🔑 Demo Credentials](#-demo-credentials)
- [🛡️ Security & Middleware](#️-security--middleware)

---

## ✨ Features

- **MongoDB Atlas Integration:** Pre-configured connection with resilient retry logic, schema indexing, and custom string `_id` support for 100% interoperability with frontend route parameters (`stay-1`, `host-1`, etc.).
- **Rich Stay Search & Filtering:** Filter by destination (city/state/area), categories, vibe (hills, beach, heritage, workation), price range (min/max), guest capacity, bedrooms, bathrooms, and verified amenities.
- **Dynamic Reservation Engine:** Automatically verifies stay existence, calculates nights, cleaning fee, service fee (12%), subtotal, and total amount in ₹ INR.
- **JWT & Cookie Authentication:** Secure token-based auth with bcrypt password hashing, HTTP-only cookies, role-based access control (`user`, `host`, `admin`), and personal wishlist synchronization.
- **Curated Travel Features:** Endpoints for Experiences (masterclasses, stargazing, treks) and In-Stay Concierge Services (in-villa chefs, Ayurvedic spa, private chauffeurs, pantry stocking).
- **Payment Verification:** Endpoints for UPI (GPay/PhonePe/Paytm), Cards, and Netbanking order creation and verification.
- **Automated Database Seeder:** One-command import for all 24+ Indian stays, 6 Superhost profiles, reviews, experiences, and concierge services.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v18+) | JavaScript/TypeScript server runtime |
| **Language** | TypeScript (v5.6+) | Strict compile-time safety and typed models |
| **Framework** | Express (v4.21+) | Fast, minimalist web framework |
| **Database** | MongoDB Atlas & Mongoose (v8.6+) | Cloud document database & ODM |
| **Auth** | JWT & bcryptjs | Secure authentication & password encryption |
| **Security** | Helmet & CORS | HTTP header security and flexible CORS origins |
| **Dev Tooling** | tsx & tsc | Instant TypeScript execution & zero-config watch mode |

---

## 📂 Directory Architecture

```
server/
├── .env                     # Local environment credentials (DB, JWT, Port)
├── .env.example             # Example environment template
├── package.json             # Dependencies and npm scripts
├── tsconfig.json            # TypeScript configuration
├── README.md                # Server documentation
└── src/
    ├── app.ts               # Express configuration, middlewares, routes, 404 & error handler
    ├── index.ts             # Application entry point, DB connection & server listening
    ├── config/
    │   └── db.ts            # Mongoose connection & lifecycle events
    ├── models/
    │   ├── User.ts          # User account schema with bcrypt methods
    │   ├── Host.ts          # Host / Superhost profile schema
    │   ├── Listing.ts       # Curated stay document schema with search indexes
    │   ├── Booking.ts       # Reservation & pricing model
    │   ├── Review.ts        # Stay reviews & sub-ratings
    │   ├── Experience.ts    # Curated travel experiences model
    │   ├── Service.ts       # Concierge & in-stay luxury services model
    │   └── Enquiry.ts       # Concierge enquiry submissions
    ├── controllers/
    │   ├── authController.ts       # Register, login, profile, wishlist
    │   ├── listingController.ts    # Search, filter, categories, vibes, trending, CRUD
    │   ├── hostController.ts       # Hosts listing & host profiles with stays
    │   ├── bookingController.ts    # Create reservation, cancel, status
    │   ├── reviewController.ts     # Listing reviews & auto rating recalculation
    │   ├── experienceController.ts # Experience discovery & booking
    │   ├── serviceController.ts    # Concierge services & enquiries
    │   └── paymentController.ts    # Order creation & checkout verification
    ├── middleware/
    │   ├── auth.ts          # protect, optionalAuth, and authorize middlewares
    │   └── errorHandler.ts  # Centralized operational error handler
    ├── routes/
    │   ├── index.ts         # Main router mounting /api sub-routes + /api/health
    │   ├── authRoutes.ts
    │   ├── listingRoutes.ts
    │   ├── hostRoutes.ts
    │   ├── bookingRoutes.ts
    │   ├── reviewRoutes.ts
    │   ├── experienceRoutes.ts
    │   ├── serviceRoutes.ts
    │   └── paymentRoutes.ts
    ├── scripts/
    │   ├── seed.ts          # Database seeder script (`npm run seed`)
    │   └── seedData.ts      # 24+ stays, 6 hosts, reviews, experiences, services
    └── utils/
        └── appError.ts      # Operational AppError class
```

---

## 🔐 Environment Variables

The server reads configuration from `server/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection (MongoDB Atlas)
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.qukmwlh.mongodb.net/HouseBooking?appName=Cluster0"

# Authentication & Security
JWT_SECRET=supersecret_key_here
JWT_EXPIRES_IN=7d
COOKIE_SECRET=cookie_secret_key_here
```

---

## 🚀 Quick Start & How to Run

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Seed Database
Seed all 24 curated stays, 6 hosts, experiences, services, reviews, and test accounts:
```bash
npm run seed
```

### 3. Start Development Server
Runs with hot-reloading using `tsx`:
```bash
npm run dev
```

The server will start at:
👉 **`http://localhost:5000`**  
👉 **`http://localhost:5000/api/health`**

### 4. Build & Start for Production
```bash
npm run build
npm start
```

---

## 🌱 Database Seeding

To populate your MongoDB Atlas cluster with the full Wayfound dataset:
```bash
npm run seed
```
To purge all collections without re-seeding:
```bash
npm run seed:delete
```

---

## 🔐 How Authentication Works

All protected endpoints require a valid **JSON Web Token (JWT)**.

### 1. How to get a Token
Send a `POST` request to `/api/auth/login` (or `/api/auth/register`):
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "traveler@wayfound.stay", "password": "password123"}'
```
Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { "_id": "usr-demo-traveler", "name": "Kabir Singhania", ... }
}
```

### 2. How to pass the Token in requests
Copy the `token` string from the response and pass it in the HTTP request headers:

```http
Authorization: Bearer <PASTE_YOUR_TOKEN_HERE>
```

> [!TIP]
> If testing with a browser or Postman with cookies enabled, the server also sets an `HttpOnly` cookie named `token`, which is automatically sent with subsequent requests.

---

## 📡 API Endpoints Reference (Full URLs)

### Base URL
```
http://localhost:5000
```

---

### 1. Authentication Endpoints (`/api/auth`)

#### `POST http://localhost:5000/api/auth/register`
- **Authentication:** `None` (Public)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Arjun Kapoor",
  "email": "arjun@example.com",
  "password": "SecurePassword123!",
  "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
  "phone": "+91 98765 43210",
  "role": "user"
}
```
- **cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Arjun Kapoor","email":"arjun@example.com","password":"SecurePassword123!","role":"user"}'
```

---

#### `POST http://localhost:5000/api/auth/login`
- **Authentication:** `None` (Public)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "traveler@wayfound.stay",
  "password": "password123"
}
```
- **cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"traveler@wayfound.stay","password":"password123"}'
```

---

#### `GET http://localhost:5000/api/auth/me`
- **Authentication:** `Required`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

#### `PUT http://localhost:5000/api/auth/profile`
- **Authentication:** `Required`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Request Body:**
```json
{
  "name": "Kabir Singhania Updated",
  "phone": "+91 98201 99999",
  "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
}
```

---

#### `POST http://localhost:5000/api/auth/wishlist/toggle`
- **Authentication:** `Required`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Request Body:**
```json
{
  "listingId": "stay-1"
}
```
- **cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/wishlist/toggle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"listingId": "stay-1"}'
```

---

#### `GET http://localhost:5000/api/auth/wishlist`
- **Authentication:** `Required`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

#### `POST http://localhost:5000/api/auth/logout`
- **Authentication:** `None`

---

### 2. Stays / Listings Endpoints (`/api/listings`)

| Method | Full Endpoint URL | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `http://localhost:5000/api/listings` | Search and filter all stays | `None` |
| `GET` | `http://localhost:5000/api/listings/categories` | Categories with active stay count | `None` |
| `GET` | `http://localhost:5000/api/listings/vibes` | Grouped stays for Bento Grid (hills, beach, etc.) | `None` |
| `GET` | `http://localhost:5000/api/listings/trending` | Curated Goa & Mumbai getaways | `None` |
| `GET` | `http://localhost:5000/api/listings/:id` | Get single stay by ID (e.g. `stay-1`) or slug | `None` |
| `POST` | `http://localhost:5000/api/listings` | Create a new stay | `Required (host/admin)` |
| `PUT` | `http://localhost:5000/api/listings/:id` | Update an existing stay | `Required (host/admin)` |
| `DELETE` | `http://localhost:5000/api/listings/:id` | Delete a stay and its reviews | `Required (admin)` |

#### Query Parameters for `GET http://localhost:5000/api/listings`:
- `destination`: Search by city, state, or area (e.g., `Goa`, `Manali`, `Udaipur`)
- `category`: Filter by category (e.g., `beachfront`, `villas`, `mountains`, `heritage`, `luxe`)
- `vibe`: Filter by vibe (`hills`, `beach`, `heritage`, `workation`)
- `minPrice`: Minimum price per night in INR (e.g., `5000`)
- `maxPrice`: Maximum price per night in INR (e.g., `35000`)
- `guests`: Minimum guests accommodated (e.g., `4`)
- `bedrooms`: Number of bedrooms (e.g., `2`)
- `bathrooms`: Number of bathrooms (e.g., `2`)
- `amenities`: Comma-separated list (e.g., `Private pool,Fast WiFi,Ocean view`)
- `guestFavorite`: `true` or `false`
- `sort`: `price-asc`, `price-desc`, `rating`, `featured`
- `page`: Page number (default: `1`)
- `limit`: Number of items per page (default: `50`)

*Example:* `http://localhost:5000/api/listings?destination=Goa&category=beachfront&sort=price-asc`

---

#### `POST http://localhost:5000/api/listings`
- **Authentication:** `Required` (User role must be `host` or `admin`)
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <HOST_OR_ADMIN_JWT_TOKEN>`
- **Request Body:**
```json
{
  "title": "Aura Seacliff Sanctuary",
  "slug": "aura-seacliff-sanctuary-goa",
  "tagline": "Private ocean cliffside villa in Anjuna",
  "description": "Perched on the red laterite cliffs of Anjuna, overlooking the Arabian Sea.",
  "propertyType": "Villa",
  "roomType": "Entire place",
  "category": ["beachfront", "villas", "luxe"],
  "vibe": "beach",
  "location": {
    "city": "Anjuna, Goa",
    "state": "Goa",
    "country": "India",
    "area": "North Goa",
    "distanceDesc": "Cliffside direct sea access",
    "lat": 15.5800,
    "lng": 73.7420
  },
  "price": {
    "perNight": 22000,
    "cleaningFee": 2500,
    "serviceFeePercent": 12,
    "currency": "INR"
  },
  "images": [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"
  ],
  "amenities": ["Infinity pool", "Sea view", "Chef kitchen", "Fast WiFi"],
  "hostId": "host-1",
  "guestFavorite": true,
  "maxGuests": 6,
  "bedrooms": 3,
  "beds": 3,
  "bathrooms": 3,
  "availableDates": "Available year-round",
  "sleepingArrangements": [
    { "room": "Master Suite", "bedType": "1 King Bed" },
    { "room": "Guest Suite", "bedType": "1 Queen Bed" }
  ],
  "houseRules": ["No smoking inside", "Pets welcome", "Quiet hours after 10 PM"],
  "cancellationPolicy": "Free cancellation up to 48 hours before check-in"
}
```

---

### 3. Bookings & Reservations (`/api/bookings`)

#### `POST http://localhost:5000/api/bookings`
- **Authentication:** `Optional` (Works for guests or authenticated users. If `Authorization: Bearer <TOKEN>` is provided, the booking will be linked to the user account).
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN>` *(Optional)*
- **Request Body:**
```json
{
  "listingId": "stay-1",
  "checkIn": "2026-10-15",
  "checkOut": "2026-10-19",
  "nights": 4,
  "guests": {
    "adults": 2,
    "children": 1,
    "infants": 0,
    "pets": 0
  },
  "guestInfo": {
    "name": "Kabir Singhania",
    "email": "traveler@wayfound.stay",
    "phone": "+91 98201 23456",
    "specialRequests": "Late check-in requested around 8 PM"
  },
  "paymentMethod": "upi"
}
```
- **cURL Example:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "stay-1",
    "checkIn": "2026-10-15",
    "checkOut": "2026-10-19",
    "nights": 4,
    "guests": { "adults": 2, "children": 0, "infants": 0, "pets": 0 },
    "guestInfo": {
      "name": "Kabir Singhania",
      "email": "traveler@wayfound.stay",
      "phone": "+91 98201 23456"
    },
    "paymentMethod": "upi"
  }'
```

---

#### `GET http://localhost:5000/api/bookings`
- **Authentication:** `Required` (Returns current user's reservations, or all if `admin`)
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

#### `GET http://localhost:5000/api/bookings/:id`
- **Authentication:** `None` or `Bearer Token`
- **Example:** `GET http://localhost:5000/api/bookings/book-6ab66fa58e0e52c62a2c392a`

---

#### `PATCH http://localhost:5000/api/bookings/:id/status`
- **Authentication:** `Required`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Request Body:**
```json
{
  "status": "cancelled",
  "cancellationReason": "Travel dates rescheduled by guest"
}
```

---

#### `DELETE http://localhost:5000/api/bookings/:id`
- **Authentication:** `Required`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

### 4. Reviews (`/api/reviews`)

#### `GET http://localhost:5000/api/reviews/listing/:listingId`
- **Full URL:** `GET http://localhost:5000/api/reviews/listing/stay-1`
- **Authentication:** `None`

---

#### `POST http://localhost:5000/api/reviews`
- **Authentication:** `Optional / Authenticated` (Auto recalculates average stay rating & count)
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN>` *(Optional)*
- **Request Body:**
```json
{
  "listingId": "stay-1",
  "userName": "Rhea Kapoor",
  "userAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "rating": 5,
  "comment": "Unbelievable cliffside views and exceptional hospitality from Meera and Aarav. The plunge pool sunset was pure magic.",
  "cleanliness": 5,
  "accuracy": 5,
  "communication": 5,
  "locationRating": 5,
  "value": 5
}
```
- **cURL Example:**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "stay-1",
    "userName": "Rhea Kapoor",
    "rating": 5,
    "comment": "Unbelievable cliffside views. The plunge pool sunset was pure magic."
  }'
```

---

### 5. Curated Experiences (`/api/experiences`)

| Method | Full Endpoint URL | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `http://localhost:5000/api/experiences` | List all experiences (filter with `?category=Culinary`) | `None` |
| `GET` | `http://localhost:5000/api/experiences/:id` | Single experience (e.g. `exp-1`) | `None` |
| `POST` | `http://localhost:5000/api/experiences/:id/book` | Reserve an experience slot | `Optional` |
| `POST` | `http://localhost:5000/api/experiences` | Create an experience | `Required (admin)` |

#### `POST http://localhost:5000/api/experiences/:id/book`
- **Full URL Example:** `POST http://localhost:5000/api/experiences/exp-1/book`
- **Authentication:** `Optional`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN>` *(Optional)*
- **Request Body:**
```json
{
  "date": "2026-10-20",
  "guests": 2,
  "contactName": "Pooja Bhattacharya",
  "contactEmail": "pooja@example.com",
  "contactPhone": "+91 98765 12345"
}
```

---

### 6. In-Stay Concierge & Luxury Services (`/api/services`)

| Method | Full Endpoint URL | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `http://localhost:5000/api/services` | List all concierge services (filter `?category=Culinary`) | `None` |
| `GET` | `http://localhost:5000/api/services/:id` | Single service details (e.g. `srv-1`) | `None` |
| `POST` | `http://localhost:5000/api/services/enquiry` | Submit in-villa concierge booking request | `Optional` |
| `POST` | `http://localhost:5000/api/services` | Create new service | `Required (admin)` |

#### `POST http://localhost:5000/api/services/enquiry`
- **Authentication:** `Optional`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN>` *(Optional)*
- **Request Body:**
```json
{
  "serviceId": "srv-1",
  "serviceTitle": "Private In-Villa Chef & Banquet",
  "villaName": "The Cliff Sanctuary, Vagator",
  "dates": "Oct 16 – Oct 18",
  "guestCount": 4,
  "dietaryPreferences": "Traditional coastal Goan seafood & vegetarian options",
  "specialRequests": "Sunset dinner on the pool deck",
  "contactName": "Kabir Singhania",
  "contactEmail": "traveler@wayfound.stay",
  "contactPhone": "+91 98201 23456"
}
```

---

### 7. Payments & Checkout (`/api/payments`)

#### `POST http://localhost:5000/api/payments/create-order`
- **Authentication:** `Optional`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "listingId": "stay-1",
  "nights": 4,
  "guests": { "adults": 2, "children": 0, "infants": 0, "pets": 0 },
  "paymentMethod": "upi"
}
```

---

#### `POST http://localhost:5000/api/payments/verify`
- **Authentication:** `Optional`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN>` *(Optional)*
- **Request Body:**
```json
{
  "orderId": "order_1727269000_abc123",
  "paymentId": "pay_upi_1234567890",
  "listingId": "stay-1",
  "checkIn": "2026-10-15",
  "checkOut": "2026-10-19",
  "nights": 4,
  "guests": { "adults": 2, "children": 0, "infants": 0, "pets": 0 },
  "guestInfo": {
    "name": "Kabir Singhania",
    "email": "traveler@wayfound.stay",
    "phone": "+91 98201 23456"
  },
  "paymentMethod": "upi"
}
```

---

### 8. Hosts (`/api/hosts`)

| Method | Full Endpoint URL | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `http://localhost:5000/api/hosts` | List all verified hosts | `None` |
| `GET` | `http://localhost:5000/api/hosts/:id` | Get host profile with hosted stays (e.g. `host-1`) | `None` |
| `POST` | `http://localhost:5000/api/hosts` | Register/create a host profile | `Required` |

#### `POST http://localhost:5000/api/hosts`
- **Authentication:** `Required`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Request Body:**
```json
{
  "name": "Meera & Aarav Desai",
  "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "bio": "Architects turned slow-living enthusiasts restoring Goan heritage sanctuaries.",
  "isSuperhost": true,
  "responseTime": "within an hour"
}
```


---

## 🔑 Demo Credentials

When running `npm run seed`, the following test accounts are pre-configured:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Traveler** | `traveler@wayfound.stay` | `password123` |
| **Host** | `host@wayfound.stay` | `password123` |
| **Admin** | `admin@wayfound.stay` | `adminpassword123` |

---

## 🛡️ Security & Middleware

- **Centralized Error Handling:** Consistent JSON error structure with status codes, validation feedback, and duplicate key handling.
- **Helmet:** Protects against common web vulnerabilities via secure HTTP headers.
- **CORS Protection:** Pre-configured to allow the frontend client at `http://localhost:5173` with credentials support.
- **Data Compression:** Gzip/Brotli response compression for ultra-fast payload delivery.
