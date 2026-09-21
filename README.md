# Wayfound — Find your way to stay.

A premium, cinematic stay-booking web app inspired by Airbnb's structure with an editorial identity, warm palette, sunset gradients, and micro-interactions.

## Features
- **Cinematic Video Hero:** Fullscreen video background with tropical aerial coastline drone footage, floating glass search bar, and autocomplete popovers.
- **Curated Stays Across India:** 24+ handpicked villas, chalets, havelis, and star domes across Goa, Manali, Udaipur, Kerala, Ladakh, and more.
- **Split-Screen Search & Live Map:** Interactive styled map with price markers and hover stay previews alongside card listings.
- **Editorial Stay Details:** Photo mosaic, fullscreen lightbox, verified Superhost profiles, sleeping arrangements, amenities, and dynamic pricing calculator.
- **Stacked Photo Wishlists:** Interactive 3-card tilt wishlists with persistent storage.
- **Immersive Experiences:** Curated masterclasses, night-sky expeditions, and wild adventures with booking modal and celebration confetti.
- **Concierge & Luxury Services:** Private in-villa chefs, Ayurvedic spa sessions, and chauffeur airport transfers.
- **Host on Wayfound:** Real-time earnings estimator calculator, 3-step onboarding guide, WayfoundCover breakdown, and FAQ accordion.
- **Circular Theme Transition:** Radial expansion dark/light mode toggle with native View Transitions API.

## Project Structure
```
├── client/          # React 18 + Vite + TypeScript frontend
│   ├── public/      # Static assets (hero videos, images)
│   └── src/
│       ├── components/ # Common, layout, home, search, ui
│       ├── data/       # Typed mock stays, experiences, services, hosts
│       ├── hooks/      # useTheme, useWishlist, useLenis
│       └── pages/      # Home, Search, StayDetail, Wishlists, Checkout, Host, Experiences, Services
└── server/          # Backend placeholder (Express + Mongoose)
```

## Quick Start
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
