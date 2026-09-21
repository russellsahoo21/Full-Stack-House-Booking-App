<div align="center">

# 🌿 Wayfound
### *Find your way to stay.*

An award-winning, cinematic stay-booking web application inspired by Airbnb's structure with an editorial identity, warm palette, sunset gradients, and micro-interactions. Handcrafted for discovering cliffside sanctuaries, deodar chalets, royal havelis, and tranquil backwaters across India.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4.7-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Explore Live Demo](http://localhost:5173/) · [Report Bug](https://github.com/russellsahoo21/Full-Stack-House-Booking-App/issues) · [Request Feature](https://github.com/russellsahoo21/Full-Stack-House-Booking-App/issues)

</div>

---

## 📖 Table of Contents
- [✨ Key Highlights](#-key-highlights)
- [🖥️ Page & Component Breakdown](#️-page--component-breakdown)
- [📂 Comprehensive File Structure](#-comprehensive-file-structure)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🚀 Getting Started & How to Run](#-getting-started--how-to-run)
- [🗺️ Design Tokens & Brand Identity](#️-design-tokens--brand-identity)
- [🔮 Future Backend Roadmap](#-future-backend-roadmap)
- [📄 License & Authors](#-license--authors)

---

## ✨ Key Highlights

- **Cinematic Tropical Video Hero:** Looping 720p/1080p aerial drone footage of sunlit turquoise coastline and swaying coconut palms with programmatic muted autoplay, fallback poster, and interactive video/audio controls.
- **Radial Circular Theme Transition:** Seamless light/dark mode powered by the native View Transitions API with expanding radial clip-path animation originating from the toggle button's click coordinates.
- **Curated India-Centric Stays:** 24+ fully modeled stays across Goa, Manali, Udaipur, Kerala, Ladakh, Coorg, Pondicherry, and Mumbai.
- **Split-Screen Search & Live Mock Map:** Left pane with responsive listing cards synchronized with an interactive custom-styled vector map on the right, featuring live price-pill markers and hover stay cards.
- **Dynamic Reservation Calculator:** Live pricing calculations on stay detail cards accounting for length of stay, cleaning fees, taxes, and service fees.
- **Micro-Interactions & Delighters:** Animated heart-burst wishlist toggling, confetti celebration cannons on checkout and bookings, multi-image swipe carousels, and smooth Lenis momentum scrolling.

---

## 🖥️ Page & Component Breakdown

### 1. 🏠 Fullscreen Home (`/`)
- **Hero Section:** Word-by-word reveal headline (*"Find a place that feels like you."*), scroll parallax video scaling, trending destination quick-filter chips.
- **Multi-Segment Search Bar:** Floating frosted glass pill with popovers:
  - *Where:* Autocomplete destination search across major Indian regions.
  - *Check-in / Check-out:* Dual-month interactive calendar with quick picks (*This Weekend*, *Next Week*).
  - *Who:* Stepper controls for Adults, Children, and Pets.
  - *Search:* Expanding sunset-gradient trigger.
- **Category Filter Bar & Modal:** 11 property categories with animated active underlines, paired with a Filter Modal featuring an interactive price histogram slider, property types, and amenities.
- **Responsive Listing Grid:** 1 to 4 responsive columns with multi-image carousels, verified guest favorite badges, and instant wishlist toggles.
- **Editorial Snap Carousels:** Curated sections for *"Trending in Goa"* and *"Weekend getaways from Mumbai"*.
- **Asymmetric Bento Grid ("Explore by Vibe"):** Editorial visual tiles (*Slow mornings in the hills*, *Beach house days*, *Royal heritage*, *Work from anywhere*).
- **Parallax Host Banner & Infinite Testimonials Marquee:** Smooth continuous ticker of traveler reviews with pause-on-hover.

### 2. 🔍 Split Search & Map (`/search`)
- Left column featuring sort controls (*Price: Low to High*, *Highest Rated*) and responsive listing cards.
- Right column hosting an interactive vector map with road contours and hovering price pins. Hovering over cards highlights the corresponding pin and vice versa.
- Floating mobile toggle button to switch fluidly between map and list views.

### 3. 🏡 Editorial Stay Details (`/stay/:id`)
- 5-image architectural photo mosaic with a fullscreen lightbox modal supporting keyboard navigation ($\leftarrow$ / $\rightarrow$ / `Esc`).
- Sticky scroll mini-header with section anchors (*Photos*, *Amenities*, *Reviews*, *Location*).
- Host bio, Superhost badge, sleeping arrangements showcase, and amenity checklist.
- Sticky Booking Card with live interactive subtotal, cleaning, service fees, and dates.

### 4. 🧭 Experiences Portal (`/experiences`)
- Category filtering (*Culinary*, *Adventure*, *Nature*, *Culture*, *Wellness*).
- Cards featuring host avatar, verified star rating, duration, and group sizes.
- Interactive reservation modal with included highlights and confetti celebration.

### 5. 🛎️ In-Stay Concierge & Services (`/services`)
- Luxury add-ons: In-villa regional chefs, traditional Ayurvedic spa sessions, private chauffeur airport transfers, and pantry pre-stocking.
- Interactive enquiry modal with villa location and custom dietary preferences.
- Wayfound White-Glove Guarantee banner with damage and hygiene coverage.

### 6. ❤️ Stacked Wishlists (`/wishlists`)
- Curated collections rendered with 3 overlapping photo cards that dynamically tilt on hover.
- Saved stays grid with persistent `localStorage` synchronization.
- Brand microcopy empty state: *"Nothing found yet. Go wander."*

### 7. 💳 Checkout & Confirmation (`/book/:id`)
- 2-step stepper progress: *Review Trip* $\to$ *Payment & Protection*.
- Payment method selector tiles for UPI (GPay/PhonePe/Paytm), Cards, and Netbanking.
- Confirmation screen with celebration confetti and brand microcopy: *"You found your way. Pack up."*

### 8. 🌟 Host on Wayfound (`/host`)
- Interactive earnings calculator with nights/week slider, destination multipliers, and entire place vs. private suite toggle.
- 3-step hosting roadmap cards and WayfoundCover breakdown (₹1 Crore damage protection).
- FAQ accordion with fluid spring animation expand/collapse.

---

## 📂 Comprehensive File Structure

```
full-stack-house-booking-app/
├── .gitignore                   # Root git ignore rules (builds, node_modules, envs)
├── README.md                    # Root project documentation
├── server/                      # Backend structure (Express + Mongoose placeholder)
│   └── README.md                # Server architecture guide & API design
└── client/                      # React frontend application
    ├── index.html               # Entry HTML with dark theme pre-check script
    ├── package.json             # Frontend dependencies & scripts
    ├── tsconfig.json            # Base TypeScript configuration
    ├── tsconfig.app.json        # Application-specific TS configuration
    ├── vite.config.ts           # Vite configuration with path aliases (@ -> /src)
    ├── tailwind.config.js       # Design tokens, sunset gradients, fonts, shadows
    ├── postcss.config.js        # PostCSS with Tailwind & Autoprefixer
    ├── public/                  # Static web assets
    │   ├── images/              # Poster fallbacks (hero-poster.jpg)
    │   ├── videos/              # HD WebM & MP4 hero videos (hero.mp4, hero.webm)
    │   ├── favicon.svg          # Minimal SVG favicon
    │   └── icons.svg            # SVG sprite sheet
    └── src/
        ├── main.tsx             # Application bootstrap & StrictMode root
        ├── App.tsx              # RouterProvider container
        ├── routes.tsx           # React Router v6 createBrowserRouter route tree
        ├── globals.css          # Tailwind base, view transitions, film-grain texture
        ├── assets/              # Internal static images
        ├── components/
        │   ├── common/          # Universal reusable components
        │   │   ├── Logo.tsx        # Wordmark & LogoMark components
        │   │   ├── ThemeToggle.tsx # Circular view transition sun/moon toggle
        │   │   ├── LazyImage.tsx   # Shift-free lazy loaded image wrapper
        │   │   └── Skeleton.tsx    # Shimmer loading placeholders
        │   ├── layout/          # Global layout chrome
        │   │   ├── Navbar.tsx      # Frosted glass sticky navbar with route sync
        │   │   ├── Footer.tsx      # Directory links & giant faded brand watermark
        │   │   ├── Layout.tsx      # Main layout wrapper with ScrollToTop
        │   │   ├── MobileTabBar.tsx# Mobile bottom navigation bar with live badges
        │   │   └── ScrollToTop.tsx # Automatic window scroll-to-top on route change
        │   ├── home/            # Home page sections
        │   │   ├── Hero.tsx        # Video hero with Ken Burns fallback & controls
        │   │   ├── SearchBar.tsx   # Multi-segment popover search bar
        │   │   ├── CategoryBar.tsx # Horizontal category pills & modal trigger
        │   │   ├── FilterModal.tsx # Price histogram & feature filter dialog
        │   │   ├── ListingGrid.tsx # Responsive stay cards grid
        │   │   ├── ListingCard.tsx # Swipeable card with guest favorite badge
        │   │   ├── SnapCarousel.tsx# Horizontal momentum carousels
        │   │   ├── BentoGrid.tsx   # "Explore by vibe" asymmetric grid
        │   │   ├── HostBanner.tsx  # Parallax host recruitment CTA
        │   │   └── TestimonialsMarquee.tsx # Infinite scrolling review ticker
        │   └── ui/              # Primitive headless UI components
        ├── data/                # Typed mock datasets (Mongoose-ready schemas)
        │   ├── types.ts         # TypeScript interfaces (Listing, Host, Review)
        │   ├── listings.ts      # 24+ Indian stays with pricing, photos, amenities
        │   ├── hosts.ts         # Verified Superhost profiles
        │   ├── reviews.ts       # Detailed user reviews with star ratings
        │   ├── experiences.ts   # Masterclasses, stargazing, and treks
        │   └── services.ts      # In-villa chefs, Ayurvedic spa, and chauffeurs
        ├── hooks/               # Custom React hooks
        │   ├── useTheme.ts      # Dark/light mode state with localStorage sync
        │   ├── useWishlist.ts   # Add/remove stays with storage persistence
        │   └── useLenis.ts      # Smooth momentum scroll initialization
        ├── lib/
        │   └── utils.ts         # Formatting helpers (formatPrice in INR ₹, cn)
        └── pages/               # Top-level route pages
            ├── Home.tsx         # Fullscreen cinematic landing page
            ├── Search.tsx       # Dual-pane listing search & vector map
            ├── StayDetail.tsx   # Photo mosaic, reviews, dynamic booking card
            ├── Experiences.tsx  # Immersive masterclasses & nature tours
            ├── Services.tsx     # In-stay luxury amenities & concierge
            ├── Wishlists.tsx    # Stacked cards collections & saved stays
            ├── Host.tsx         # Earnings calculator & onboarding guide
            ├── Checkout.tsx     # UPI/Card checkout & confirmation confetti
            └── NotFound.tsx     # 404 page ("Lost your way? Go home.")
```

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Functional UI with concurrent rendering and hooks |
| **TypeScript** | Strict compile-time typing across all data models and components |
| **Vite 6** | Ultra-fast bundling, HMR, and Rollup production optimization |
| **Tailwind CSS** | Utility-first responsive styling and custom color tokens |
| **Framer Motion** | Spring physics, layout animations, and entry transitions |
| **React Router v6** | Modern nested routing via `createBrowserRouter` |
| **Lucide React** | Clean, consistent SVG iconography |
| **Canvas Confetti** | Canvas-based celebratory bursts upon reservation |
| **Lenis** | Lightweight smooth scrolling engine |
| **Fontsource** | Self-hosted *Plus Jakarta Sans* and *Inter* font weights |

---

## 🚀 Getting Started & How to Run

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or later) and **npm** installed:
```bash
node -v
npm -v
```

### 1. Clone the Repository
```bash
git clone https://github.com/russellsahoo21/Full-Stack-House-Booking-App.git
cd Full-Stack-House-Booking-App
```

### 2. Install Client Dependencies
Navigate to the `client` directory and install dependencies:
```bash
cd client
npm install
```

### 3. Run Development Server
Start the Vite local development server:
```bash
npm run dev
```
The application will launch at:
👉 **`http://localhost:5173/`**

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```
The compiled output will be generated inside `client/dist/`.

### 5. Preview Production Build
To preview the generated production build locally:
```bash
npm run preview
```

---

## 🗺️ Design Tokens & Brand Identity

- **Wordmark:** lowercase `"wayfound"` in *Plus Jakarta Sans 700* with tight letter tracking.
- **Brand Palette:**
  - **Ink (Dark):** `#0F0F14` (Background: `#08080C`)
  - **Warm (Light):** `#FAF7F2` (Background: `#FDFBF9`)
  - **Sunset Gradient:** `#FF5A5F` (Coral) $\to$ `#FFB347` (Amber) $\to$ `#E83E8C` (Magenta)
- **Voice & Tone:** Warm, curious, short sentences.
  - *Search placeholder:* "Where to next?"
  - *Empty wishlist:* "Nothing found yet. Go wander."
  - *Empty search:* "No stays here. Try wider dates or a new spot."
  - *Checkout success:* "You found your way. Pack up."
  - *404:* "Lost your way? Go home."

---

## 🔮 Future Backend Roadmap

The frontend data contracts in `client/src/data/*.ts` are structured to mirror future Mongoose document schemas (`_id`, `hostId`, `price`, `ratings`, `createdAt`). When ready to implement the Node/Express backend:

1. **Express REST API (`/server`):**
   - `GET /api/listings` (Search, pagination, destination & price filtering).
   - `GET /api/listings/:id` (Detailed stay documents with populated hosts).
   - `POST /api/bookings` (Reservation creation & availability checks).
   - `GET /api/experiences` & `GET /api/services`.
2. **MongoDB Database:**
   - Collections: `Users`, `Listings`, `Bookings`, `Reviews`, `Services`.
3. **Authentication:**
   - JWT or session-based authentication with OAuth (Google/Apple).
4. **Payment Gateway:**
   - Razorpay / Stripe integration for Indian Rupee (₹ INR) transactions.

---

## 📄 License & Authors

Designed and built by **Russell Sahoo** as a modern stay-booking frontend experience.  
Licensed under the [MIT License](LICENSE).
