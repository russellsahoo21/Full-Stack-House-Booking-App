export interface ServiceOffering {
  title: string;
  subtitle: string;
  description: string;
  price: string;
}

export interface ServiceStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  villa: string;
}

export interface Service {
  _id: string;
  title: string;
  category: 'Culinary' | 'Wellness' | 'Concierge' | 'Transport';
  tagline: string;
  description: string;
  priceTag: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  providerName: string;
  providerAvatar: string;
  providerBio: string;
  features: string[];
  included: string[];
  offerings: ServiceOffering[];
  howItWorks: ServiceStep[];
  reviewsList: ServiceReview[];
}

export const mockServices: Service[] = [
  {
    _id: 'srv-1',
    title: 'Private In-Villa Chef & Banquet',
    category: 'Culinary',
    tagline: 'Multi-course regional feasts prepared and plated directly in your sanctuary kitchen',
    description: 'Transform your private dining room or seaside veranda into an exclusive culinary theater. Our master chefs arrive equipped with farm-fresh organic produce, artisanal spices, and specialized copper cookware. Whether you crave a royal Mewari thali with slow-cooked dal baati, fragrant coastal Goan sea-bass coconut curries, or wood-fired Mediterranean tapas, each meal is designed exclusively around your dietary preferences and schedule. Seamless table service, wine pairing suggestions, and spotless kitchen restoration are entirely taken care of.',
    priceTag: 'From ₹3,500 / meal + groceries',
    basePrice: 3500,
    rating: 4.97,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    ],
    providerName: 'Chef Kabir & Artisanal Culinary Guild',
    providerAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80',
    providerBio: 'Trained at Le Cordon Bleu and seasoned through 14 years across boutique luxury heritage palaces in Udaipur and Goa. Passionate about hyper-local heirloom ingredients and private sanctuary dining.',
    features: ['Custom curated menus', 'Organic local market sourcing', 'Table dressing and post-meal cleanup'],
    included: [
      'Pre-meal consultation & tailored menu design',
      'Chef and kitchen assistant arriving 90 mins prior',
      'Professional table setting & curated banquet plating',
      'Dietary accommodations (Vegan, Jain, Gluten-free)',
      'Spotless kitchen clean-up and appliance sanitization',
      'Fresh botanical table centerpieces',
    ],
    offerings: [
      {
        title: 'Imperial Heritage Banquet',
        subtitle: '4 Courses · Regional Indian Royal Cuisine',
        description: 'Featuring saffron-scented biryanis, slow-simmered smoked curries, clay-pot breads, and artisanal rabri.',
        price: '₹4,500 / session',
      },
      {
        title: 'Coastal Seafood Platter & Grill',
        subtitle: '3 Courses · Fresh Catch of the Day',
        description: 'Locally caught pomfret, king prawns, butter-garlic calamari, and fragrant coconut coriander rice.',
        price: '₹3,800 / session',
      },
      {
        title: 'Mediterranean Poolside Sundowner',
        subtitle: 'Tapas & Mezze Banquet',
        description: 'Artisanal burrata, wood-charred flatbreads, grilled halloumi skewers, citrus dips, and olive oils.',
        price: '₹3,500 / session',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Select Date & Dietary Preferences',
        description: 'Share your villa location, party size, dietary preferences, and preferred dining time.',
      },
      {
        step: 2,
        title: 'Bespoke Menu Customization',
        description: 'Chef Kabir connects with you directly via WhatsApp to curate the evening tasting sequence.',
      },
      {
        step: 3,
        title: 'Fresh Market Sourcing & Setup',
        description: 'The culinary team sources the morning catch and arrives 90 minutes before dining with all gear.',
      },
      {
        step: 4,
        title: 'Dinner & Spotless Kitchen Restoration',
        description: 'Sit back, savor every course, and return to an immaculate, sparkling-clean kitchen.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-1',
        author: 'Arjun & Sanjana Singhania',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'October 2026',
        comment: 'Chef Kabir made our anniversary dinner at Villa Mar Azul genuinely unforgettable. The slow-cooked Goan prawn balchão was the best we have ever had in India.',
        villa: 'Villa Mar Azul, Anjuna',
      },
      {
        id: 'rev-2',
        author: 'Dr. Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'September 2026',
        comment: 'Spotless clean kitchen, discrete and polished hospitality, and the kids loved their custom pasta courses while we enjoyed the coastal banquet.',
        villa: 'Casa Saffron, North Goa',
      },
      {
        id: 'rev-3',
        author: 'Pooja Venkatesh',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'August 2026',
        comment: 'We booked for 8 guests for a family reunion in Udaipur. Everything was executed with five-star precision. Highly recommended!',
        villa: 'Haveli Pichola, Udaipur',
      },
    ],
  },
  {
    _id: 'srv-2',
    title: 'Traditional Ayurvedic Spa & Abhyanga',
    category: 'Wellness',
    tagline: 'Certified Ayurvedic practitioners bringing warm herbal oils and brass vessels to you',
    description: 'Immerse your senses in profound therapeutic restoration without leaving your villa sanctuary. Trained practitioners from certified Kerala wellness centers arrive with teak therapy accessories, warm brass dispensers, and bespoke herbal decoctions. Sessions blend traditional Abhyanga synchronized strokes, warm Shirodhara forehead oil flow, and botanical floral rinses designed to balance your dosha constitution after long travel or high-stress work weeks.',
    priceTag: 'From ₹2,800 / 60 min session',
    basePrice: 2800,
    rating: 4.99,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1512290900672-1f028e3b3e23?auto=format&fit=crop&w=1200&q=85',
    ],
    providerName: 'Vaidya Ananya & Kerala Wellness Sanstha',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    providerBio: 'Certified Bachelor of Ayurvedic Medicine & Surgery (BAMS) from Kottakkal. 11 years leading holistic mind-body wellness retreats across Kerala and the Western Ghats.',
    features: ['Customized dosha consultation', 'Wild-harvested herbal oils', 'Portable luxury therapy beds'],
    included: [
      'Pre-treatment dosha assessment (Vata, Pitta, Kapha)',
      'High-grade organic cold-pressed sesame and brahmi oils',
      'Sanitized portable plush therapy table with warm linens',
      'Herbal face mist and hot towel rejuvenation',
      'Aromatherapeutic natural room diffuser setup',
      'Complimentary post-therapy herbal digestive tea',
    ],
    offerings: [
      {
        title: 'Full-Body Abhyanga & Marma Therapy',
        subtitle: '75 Minutes · Complete Rejuvenation',
        description: 'Rhythmic warm herbal oil strokes targeted at vital pressure points to stimulate lymphatic drainage.',
        price: '₹2,800 / person',
      },
      {
        title: 'Royal Shirodhara & Scalp Elixir',
        subtitle: '60 Minutes · Deep Neurological Calm',
        description: 'A soothing continuous stream of warm medicated oil across the third eye chakra to dissolve anxiety.',
        price: '₹3,400 / person',
      },
      {
        title: 'Couples Sanctuary Retreat Package',
        subtitle: '90 Minutes · Two Therapists',
        description: 'Side-by-side synchronized body treatments followed by botanical facial mask and herbal foot reflexology.',
        price: '₹5,800 / couple',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Reserve Preferred Session',
        description: 'Choose your desired time and villa setting (poolside, garden patio, or master suite).',
      },
      {
        step: 2,
        title: 'Therapist Arrival & Setup',
        description: 'Practitioners arrive 20 minutes early with warm oils, linen, ambient music, and portable massage tables.',
      },
      {
        step: 3,
        title: 'Dosha Alignment & Therapy',
        description: 'Unwind completely as therapeutic strokes release tension, restore circulation, and calm the mind.',
      },
      {
        step: 4,
        title: 'Herbal Infusion & Post-Care',
        description: 'Conclude with a warm digestive tonic and herbal guidance for lasting relaxation during your stay.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-w1',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'October 2026',
        comment: 'The Shirodhara session on our villa veranda listening to the ocean was pure bliss. Ananya and her assistant are authentic Ayurvedic masters.',
        villa: 'Cliffside Nirvana, Goa',
      },
      {
        id: 'rev-w2',
        author: 'Rohan Mehra',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'September 2026',
        comment: 'After a 7-hour drive from Bangalore, this was the greatest relief. Professional, hygienic, and completely rejuvenating.',
        villa: 'Misty Pines Chalet, Coorg',
      },
    ],
  },
  {
    _id: 'srv-3',
    title: 'Executive Chauffeur & Airport Concierge',
    category: 'Transport',
    tagline: 'Flawless airport meet-and-greet and dedicated luxury sedan transfers',
    description: 'Leave the stress of airport queues, erratic luggage transfers, and unfamiliar roads behind. Your dedicated chauffeur awaits your arrival right outside the terminal gate with an identification placard, chilled lemongrass towels, and premium bottled spring water. Travel in pristine Mercedes, BMW, or high-end electric executive sedans outfitted with Wi-Fi, smartphone chargers, and climate-controlled comfort directly to your villa doorstep.',
    priceTag: 'From ₹2,200 / airport transfer',
    basePrice: 2200,
    rating: 4.98,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=85',
    ],
    providerName: 'Wayfound Executive Mobility Fleet',
    providerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    providerBio: 'Premium licensed fleet service with 100% background-checked, multilingual chauffeurs trained in executive guest protocol and defensive driving.',
    features: ['Flight tracking for delays', 'Premium electric and luxury sedans', 'Child seats available upon request'],
    included: [
      'Real-time flight tracking & zero fee for delayed arrivals',
      'Terminal gate meet & greet with luggage handling',
      'Chilled mineral water & refreshing organic wet wipes',
      'High-speed in-cabin Wi-Fi & multi-device fast chargers',
      'Toll charges, airport parking fees & fuel included',
      'Complimentary booster or baby seat on request',
    ],
    offerings: [
      {
        title: 'One-Way Airport Arrival Transfer',
        subtitle: 'Airport to Villa Sanctuary',
        description: 'Door-to-door VIP escort from runway arrival straight to your villa check-in.',
        price: '₹2,200 flat rate',
      },
      {
        title: 'Full-Day Dedicated Chauffeur Service',
        subtitle: '8 Hours / 80 Kilometers',
        description: 'Dedicated luxury car and chauffeur at your beck and call for shopping, cafes, and sightseeing.',
        price: '₹4,900 / day',
      },
      {
        title: 'Roundtrip Airport Package',
        subtitle: 'Arrival & Departure Escort',
        description: 'Complete peace of mind covering both your arrival welcome and scheduled departure drop-off.',
        price: '₹3,900 bundle',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Provide Flight & Villa Details',
        description: 'Input your flight number, arrival time, and destination stay in your reservation.',
      },
      {
        step: 2,
        title: 'Chauffeur Assigned & Flight Monitored',
        description: 'We track your flight live. Your chauffeur contacts you via SMS/WhatsApp with vehicle details.',
      },
      {
        step: 3,
        title: 'Terminal Gate Welcome',
        description: 'Step past baggage claim to find your chauffeur holding your custom Wayfound name board.',
      },
      {
        step: 4,
        title: 'Smooth Luxury Transit',
        description: 'Relax in air-conditioned leather seating and arrive refreshed at your villa property.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-t1',
        author: 'Vikram & Natasha Sethi',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'October 2026',
        comment: 'Our flight to Goa was delayed by 2 hours at midnight, but our driver Rajesh was waiting right on time with a warm smile and cold drinks. Phenomenal service.',
        villa: 'Villa Azure, Candolim',
      },
      {
        id: 'rev-t2',
        author: 'Alistair Campbell',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'September 2026',
        comment: 'Pristine vehicle, child seat installed safely for our toddler, and silky smooth driving through the hills of Manali.',
        villa: 'Cedar View Lodge, Manali',
      },
    ],
  },
  {
    _id: 'srv-4',
    title: 'Pre-Arrival Pantry & Bar Provisioning',
    category: 'Concierge',
    tagline: 'Step into a refrigerator fully stocked with your favorite artisanal essentials',
    description: 'Nothing surpasses unlocking your holiday villa and finding the refrigerator chilling your favorite sparkling wines, the counters laden with fresh sourdough, ripe avocados, local organic mangoes, and artisanal cheese boards. Our concierge team personally curates your grocery order from verified organic markets and local gourmet purveyors, arranging everything neatly into pantry and fridge hours before you turn the front key.',
    priceTag: '₹950 service fee + grocery receipts',
    basePrice: 950,
    rating: 4.95,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1550989460-0adc9554f529?auto=format&fit=crop&w=1200&q=85',
    ],
    providerName: 'Wayfound In-Villa Pantry Curators',
    providerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    providerBio: 'Local sourcing specialists connected with organic farms, bakeries, and fine importers across Goa, Rajasthan, and Himachal.',
    features: ['Specialty dietary curation', 'Chilled beverages on arrival', 'Itemized store receipts provided'],
    included: [
      'Personal grocery shopper dedicated to your list',
      'Cold-chain transport to ensure dairy and meats remain fresh',
      'Beautiful fridge and pantry arrangement prior to check-in',
      'Fresh fruit basket on the dining table as welcome gesture',
      '100% itemized store and farm receipts provided with zero markup',
      'Emergency restocking service available during your stay',
    ],
    offerings: [
      {
        title: 'Artisanal Breakfast Basket',
        subtitle: 'Sourdough, Eggs, Butter & Jams',
        description: 'Fresh local sourdough loaf, organic free-range eggs, farm butter, artisanal guava jam, and French roast coffee.',
        price: '₹1,200 + grocery cost',
      },
      {
        title: 'Sundowner Wine & Gourmet Cheese Board',
        subtitle: 'Curated Aperitivo Setup',
        description: 'Chilled prosecco or chosen vintage, aged smoked cheddar, truffle gouda, mixed nuts, grapes, and crackers.',
        price: '₹1,500 + grocery cost',
      },
      {
        title: 'Full Villa Pantry Restock',
        subtitle: 'Up to 30 Custom Grocery Items',
        description: 'Complete custom shopping list covering snacks, sodas, baby food, fruits, cereals, and organic veggies.',
        price: '₹950 flat fee + receipts',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Submit Your Grocery Wishlist',
        description: 'Send us your custom grocery list or pick from our curated starter baskets.',
      },
      {
        step: 2,
        title: 'Local Farm & Purveyor Sourcing',
        description: 'Our shopper visits local organic markets, bakeries, and specialty merchants on check-in day.',
      },
      {
        step: 3,
        title: 'Villa Access & Neat Stocking',
        description: 'Coordinated directly with the property host to chill beverages and stage the pantry prior to your arrival.',
      },
      {
        step: 4,
        title: 'Receipts & Zero Hassle Check-In',
        description: 'Walk in, pour a chilled drink, and find original merchant receipts waiting on the counter.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-p1',
        author: 'Sameer & Gayatri Kapoor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'October 2026',
        comment: 'Arriving at 11 PM with two cranky toddlers and finding organic milk, fresh bread, and cold beers already in the fridge was worth 10 times the fee.',
        villa: 'Villa Sienna, Assagao',
      },
      {
        id: 'rev-p2',
        author: 'Jessica Miller',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'August 2026',
        comment: 'The fruit basket and cheese selection were out of this world. Super professional and transparent receipts.',
        villa: 'Royal Lake Pavilion, Udaipur',
      },
    ],
  },
];
