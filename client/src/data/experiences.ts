export interface ExperienceReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ExperienceItineraryStep {
  step: number;
  title: string;
  time: string;
  description: string;
}

export interface Experience {
  _id: string;
  title: string;
  tagline: string;
  category: 'Culinary' | 'Adventure' | 'Culture' | 'Nature' | 'Wellness';
  location: string;
  duration: string;
  groupSize: string;
  pricePerPerson: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  hostName: string;
  hostAvatar: string;
  hostBio: string;
  venueName: string;
  venueType: string;
  venueDescription: string;
  highlights: string[];
  included: string[];
  itinerary: ExperienceItineraryStep[];
  reviewsList: ExperienceReview[];
}

export const mockExperiences: Experience[] = [
  {
    _id: 'exp-1',
    title: 'Mewari Royal Culinary Masterclass',
    tagline: 'Cook 200-year-old royal recipes inside a private Lake Pichola haveli kitchen',
    category: 'Culinary',
    location: 'Udaipur, Rajasthan',
    duration: '3.5 hours',
    groupSize: 'Max 6 guests',
    pricePerPerson: 3500,
    rating: 4.98,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Step behind the sandstone jharokhas of a 19th-century royal haveli overlooking Lake Pichola. In this intimate, hands-on masterclass, you will learn the secrets of Mewari royal gastronomy handed down through five generations of palace chefs. From slow-roasted Laal Maas infused with Mathania chillies to delicately fragrant ker sangri and saffron baati, every dish is cooked in authentic hand-hammered brass vessels over slow embers.',
    hostName: 'Maharani Gayatri Singh',
    hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    hostBio: 'Born into the Sisodia lineage of Mewar, Gayatri has spent 20 years reviving lost royal palace recipes and culinary treatises. She has hosted ambassadors, food historians, and Michelin-starred chefs in her family haveli.',
    venueName: 'Haveli Karni Vilas',
    venueType: 'Heritage Lakefront Haveli',
    venueDescription: 'Built in 1842, Haveli Karni Vilas features courtyards paved with white Makrana marble, stained-glass arches, and a restored royal hearth kitchen that opens onto a private lakefront terrace.',
    highlights: [
      'Traditional hand-hammered brass cooking vessels',
      '5-course royal banquet dinner paired with organic wines',
      'Secret family spice blends gifted in sealed copper jars',
      'Private rooftop sunset tasting overlooking Lake Pichola',
    ],
    included: [
      'All heirloom cooking ingredients and organic spices',
      'Welcome cold-pressed almond thandai on arrival',
      'Full multi-course seated banquet dinner',
      'Custom engraved recipe booklet & spice starter box',
      'Apron and brass tasting spoon',
    ],
    itinerary: [
      {
        step: 1,
        title: 'Heritage Courtyard Welcome & Herbal Infusions',
        time: '30 mins',
        description: 'Gather in the marble courtyard for introductions, rose-water hand wash, and freshly brewed cardamom thandai while exploring antique spice mortars.',
      },
      {
        step: 2,
        title: 'Spice Grinding & Slow-Ember Simmering',
        time: '1 hour 45 mins',
        description: 'Stone-grind fiery Mathania chillies, temper hand-pressed mustard oils in heavy brass deghchis, and master the art of slow dum cooking.',
      },
      {
        step: 3,
        title: 'Royal Terrace Banquet & Lake Pichola Dusk',
        time: '1 hour 15 mins',
        description: 'Ascend to the torch-lit lakefront terrace to savor your 5-course royal creations under the stars with curated regional wine pairings.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-e1',
        author: 'Priya Narayanan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'October 2026',
        comment: 'Without doubt the highlight of our Rajasthan journey. Gayatri is captivating, and cooking inside this ancestral haveli feels like stepping into a royal museum. The Laal Maas was extraordinary!',
      },
      {
        id: 'rev-e2',
        author: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'September 2026',
        comment: 'Incredible setting overlooking the lake. The brass cookware, the rooftop dining, and the warmth of the hospitality made this unforgettable. Highly recommend!',
      },
    ],
  },
  {
    _id: 'exp-2',
    title: 'Nubra Celestial Astrophotography & Stargazing',
    tagline: 'Track the Milky Way core with automated 14-inch Schmidt-Cassegrain telescopes',
    category: 'Adventure',
    location: 'Nubra Valley, Ladakh',
    duration: '4 hours',
    groupSize: 'Max 8 guests',
    pricePerPerson: 4200,
    rating: 4.99,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'At an altitude of 10,000 feet with Class 1 Bortle dark skies, the Nubra desert is one of the most pristine celestial viewing windows on Earth. Join local astrophysicist Stanzin Dorje at his private high-altitude star camp. Using computerized motorized telescopes and cooled astrophotography sensors, you will capture the swirling spiral arms of the Andromeda Galaxy and the radiant dust lanes of the Milky Way.',
    hostName: 'Stanzin Dorje',
    hostAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    hostBio: 'National Geographic grantee and Himalayan astronomy advocate. Stanzin set up Ladakh’s first village-level community observatories and has documented celestial wonders for over 12 years.',
    venueName: 'Nubra Celestial Star Dome Sanctuary',
    venueType: 'High-Altitude Glass Observatory & Yurt',
    venueDescription: 'Perched in the sand dunes of Hunder with zero ambient artificial light, featuring an insulated wooden heating yurt and outdoor observation pads.',
    highlights: [
      'Bortle Class 1 dark sky with zero light pollution',
      '14-inch motorized Schmidt-Cassegrain telescope views',
      'Raw RAW+JPEG astrophotography captures delivered on SSD',
      'Yak-wool blankets & steaming Kashmiri kahwa in a heated yurt',
    ],
    included: [
      'High-altitude telescope access and laser pointer navigation',
      'DSLR adapter rings for your own camera or use of observatory sensors',
      'Continuous hot Kashmiri kahwa and yak-cheese snacks',
      'Heated yurt lounge access with oxygen concentrator available',
    ],
    itinerary: [
      {
        step: 1,
        title: 'Twilight Constellation Walk & Sky Map Calibration',
        time: '45 mins',
        description: 'Observe twilight over the snow-capped Karakoram range while learning Ladakhi ancient nomadic celestial lore and calibrating star charts.',
      },
      {
        step: 2,
        title: 'Deep-Space Telescope Tracking & Nebula Viewing',
        time: '2 hours',
        description: 'Peer through specialized oculars to inspect Saturn’s rings, the Orion Nebula, and distant star clusters millions of light-years away.',
      },
      {
        step: 3,
        title: 'Astrophotography Exposure & Warm Yurt Debrief',
        time: '1 hour 15 mins',
        description: 'Set long-exposure sensors to capture your personal Milky Way portraits, then warm up by the bukhari wood stove with hot kahwa.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-e3',
        author: 'Arjun Mehta',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'November 2026',
        comment: 'Seeing Saturn’s rings so sharply through Stanzin’s telescope literally brought tears to my eyes. The photos we received are stunning desktop wallpapers. A once-in-a-lifetime experience.',
      },
    ],
  },
  {
    _id: 'exp-3',
    title: 'Sunrise Dolphin & Bioluminescence Kayaking',
    tagline: 'Paddle through calm Chapora river estuaries into the open Arabian sea',
    category: 'Nature',
    location: 'Morjim, Goa',
    duration: '2.5 hours',
    groupSize: 'Max 10 guests',
    pricePerPerson: 2200,
    rating: 4.95,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Launch your lightweight sea kayak into the tranquil waters of Morjim before first light. As your paddle cuts the glass-smooth estuary, bioluminescent plankton glows in glowing emerald ripples. Break through the gentle sandbar into the Arabian Sea just as the sun sets the Goan horizon on fire, with pods of wild Indo-Pacific humpback dolphins surfacing nearby.',
    hostName: 'Aarav Desai',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    hostBio: 'Certified ACA Coastal Kayak Instructor and lifelong Goan marine naturalist committed to low-impact mangrove conservation and sustainable ecotourism.',
    venueName: 'Morjim Estuary Boathouse & Sandbar',
    venueType: 'Private Coastal Estuary Launch',
    venueDescription: 'A private thatched boathouse tucked away along the Chapora mangrove banks with direct tidal water access and private changing facilities.',
    highlights: [
      'Pre-dawn bioluminescent paddle through pristine mangrove creeks',
      'Wild humpback dolphin encounters in open waters',
      'Freshly baked Goan poi breakfast and organic fruit on a secluded sandbar',
      'GoPro 4K video clips of your paddle provided',
    ],
    included: [
      'Top-tier composite sea kayaks, lightweight paddles, and USCG life jackets',
      'Waterproof dry bags for phones and cameras',
      'Artisanal Goan breakfast (choriz/cheese poi, fresh tropical fruit, coconut water)',
      'High-resolution photos & video taken by your guide',
    ],
    itinerary: [
      {
        step: 1,
        title: 'Moonlit Estuary Briefing & Safety Launch',
        time: '30 mins',
        description: 'Meet at the quiet Morjim boathouse, gear up, and practice basic stroke technique before sliding into glassy waters glowing with bioluminescence.',
      },
      {
        step: 2,
        title: 'Open-Sea Dolphin Tracking at Sunrise',
        time: '1 hour 15 mins',
        description: 'Paddle past the sandbar as dawn breaks. Float in peaceful stillness as local dolphin pods surface to hunt in the early morning calm.',
      },
      {
        step: 3,
        title: 'Sandbar Breakfast & Mangrove Return',
        time: '45 mins',
        description: 'Pull up onto a tide-formed sandbar for warm poi, tender coconuts, and a refreshing swim before a relaxed cruise back through mangrove creeks.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-e4',
        author: 'Sneha Kapadia',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'December 2026',
        comment: 'We saw at least eight dolphins playing within 15 meters of our kayaks! Aarav is wonderful, patient, and knowledgeable. The poi breakfast on the sandbar was heavenly.',
      },
    ],
  },
  {
    _id: 'exp-4',
    title: 'First-Flush Tea Sommelier & Forest Foraging',
    tagline: 'Walk 150-year-old terraced tea gardens and taste rare single-estate flushes',
    category: 'Culture',
    location: 'Kurseong, Darjeeling',
    duration: '3 hours',
    groupSize: 'Max 8 guests',
    pricePerPerson: 2800,
    rating: 4.96,
    reviewCount: 86,
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Immerse yourself in misty Himalayan valleys with third-generation tea master Tenzing Norbu. Wander through bio-dynamic tea bushes established in 1859, learn the delicate art of two leaves and a bud, and visit the heritage wood-fired drying lofts. Conclude with a cupping session of prized Muscatel and Silver Needle teas overlooking Mount Kanchenjunga.',
    hostName: 'Tenzing Norbu',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    hostBio: 'Master Tea Taster certified by the Darjeeling Planters Association with 25 years of tea estate craftsmanship across Kurseong and Mirik valleys.',
    venueName: 'Makaibari Heritage Tea Bungalow',
    venueType: 'Colonial Tea Estate Bungalow',
    venueDescription: 'A preserved 1880s teakwood colonial bungalow with wrap-around verandas facing pine-clad Himalayan ridges and organic tea slopes.',
    highlights: [
      'Plucking masterclass with veteran estate pickers',
      'Factory cupping session tasting 6 single-estate flushes',
      'Curated tasting flight paired with Himalayan cheeses',
      'Exclusive 100g gift canister of rare moonlight-plucked tea',
    ],
    included: [
      'Private guided estate walk and factory processing tour',
      'Professional ISO tea cupping session with 6 tea varieties',
      'Traditional Lepcha tea-time pastries and artisanal honey',
      'Handcrafted gift tin of single-estate white tea',
    ],
    itinerary: [
      {
        step: 1,
        title: 'Misty Garden Walk & Plucking Practice',
        time: '1 hour',
        description: 'Walk through organic high-altitude slopes as mountain mist rises. Strap on traditional bamboo baskets to learn delicate plucking techniques.',
      },
      {
        step: 2,
        title: 'Heritage Factory Roasting & Rolling',
        time: '45 mins',
        description: 'Follow fresh green tea leaves through withering, rolling tables, oxidation chambers, and wood-fired ovens emitting rich floral aromas.',
      },
      {
        step: 3,
        title: 'Sommelier Cupping & Tasting Flight',
        time: '1 hour 15 mins',
        description: 'Slurp, swirl, and savor rare imperial first-flush teas in porcelain cupping bowls, identifying notes of Muscat grape, peach, and mountain wildflower.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-e5',
        author: 'Rohan Deshmukh',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'August 2026',
        comment: 'Tenzing’s deep knowledge of tea terroir rivals the finest French wine sommeliers. The views of the valley from the tasting room are breathtaking.',
      },
    ],
  },
  {
    _id: 'exp-5',
    title: 'Vembanad Backwaters Village Canoe & Fishing',
    tagline: 'Glide through untouched narrow waterways on a non-motorized wooden canoe',
    category: 'Nature',
    location: 'Alleppey, Kerala',
    duration: '3 hours',
    groupSize: 'Max 4 guests',
    pricePerPerson: 1900,
    rating: 4.94,
    reviewCount: 167,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Leave the loud motorized houseboats behind and step aboard an authentic hand-carved anjili wood canoe. Gently punted through quiet village waterways overhung with wild ferns, hibiscus, and coconut palms, you will discover traditional duck farming, coir rope spinning, and the ancient art of casting Chinese fishing nets at dusk.',
    hostName: 'Capt. Thomas Kurien',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    hostBio: 'Born and raised in the Kuttanad wetlands. Captain Thomas has navigated the Vembanad delta for 35 years and is dedicated to preserving non-motorized heritage waterway access.',
    venueName: 'Kuttanad Water Heritage Landing',
    venueType: 'Traditional Kerala Nalukettu & Water Docks',
    venueDescription: 'A 100-year-old timber Nalukettu home situated where three quiet village canals converge, surrounded by lotus ponds and paddy fields below sea level.',
    highlights: [
      'Silent non-motorized canoe exploration into narrow canals',
      'Hands-on Chinese fishing net lifting',
      'Fresh steamed banana leaf Kerala lunch & sweet coconut water',
      'Village coir weaving and pottery demonstrations',
    ],
    included: [
      'Private canoe and experienced local boatman',
      'All fishing tackle and net demonstration fees',
      'Homestyle Kerala meal (steamed rice, fish moilee or veg stew, pazham pori)',
      'Tender coconut refreshment and spice tea',
    ],
    itinerary: [
      {
        step: 1,
        title: 'Nalukettu Welcome & Canal Boarding',
        time: '30 mins',
        description: 'Sip fresh tender coconut water on the riverside porch before boarding a cushioned, shade-canopied wooden canoe.',
      },
      {
        step: 2,
        title: 'Silent Canal Meander & Chinese Net Lifting',
        time: '1 hour 45 mins',
        description: 'Glide silently under arched bridges while kingfishers dive. Help local fishermen lower and haul enormous cantilevered Chinese nets.',
      },
      {
        step: 3,
        title: 'Homestead Banana Leaf Feast',
        time: '45 mins',
        description: 'Disembark at the family homestead to feast on fragrant spiced fish curry, red rice, and crispy appams served on fresh plantain leaves.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-e6',
        author: 'Ananya Nair',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'July 2026',
        comment: 'So much better than being on a huge diesel houseboat! Quiet, peaceful, and authentic. Captain Thomas’s family made the most delicious meal of our entire Kerala vacation.',
      },
    ],
  },
  {
    _id: 'exp-6',
    title: 'Rishikesh Ganga Aarti & Sound Bowl Bath',
    tagline: 'Private sunset sound bowl resonance meditation on quiet white river sandbanks',
    category: 'Wellness',
    location: 'Tapovan, Rishikesh',
    duration: '2 hours',
    groupSize: 'Max 12 guests',
    pricePerPerson: 1600,
    rating: 4.97,
    reviewCount: 190,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Escape the crowded main ghats and gather on a secluded white sandbank where the jade-green Ganges emerges from the Himalayan foothills. Led by certified sound therapist Devika Singhal, experience the deep acoustic vibrations of 7 full-chakra Tibetan singing bowls, tuned gongs, and Vedic mantras as dusk turns the water to liquid silver.',
    hostName: 'Devika Singhal',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    hostBio: 'Sound meditation practitioner certified by the International Academy of Sound Healing with a decade of retreat facilitation in Rishikesh and Dharamshala.',
    venueName: 'Ganga White Sandbank Ashram Sanctuary',
    venueType: 'Riverside Meditation Shala & River Beach',
    venueDescription: 'A private riverside stone ashram with steps leading directly to pristine white sandbars along the crystal-clear upper Ganges.',
    highlights: [
      'Deep resonance sound immersion with 7 bronze Tibetan singing bowls',
      'Gentle pranayama breathwork guided by the river breeze',
      'Personal brass diya floating ceremony with marigolds on the Ganges',
      'Warm Ayurvedic tulsi-ginger herbal infusion by lantern light',
    ],
    included: [
      'High-density yoga mats, organic cotton bolsters, and warm shawls',
      'Brass diya offering plate and organic marigold flowers',
      'Steaming herbal tulsi tea and organic jaggery sweets',
      'Curated sound frequency recording sent after the session',
    ],
    itinerary: [
      {
        step: 1,
        title: 'Riverside Grounding & Breath Alignment',
        time: '30 mins',
        description: 'Settle onto cushioned mats on the white river beach. Center your mind with Nadi Shodhana breathwork attuned to the sound of flowing water.',
      },
      {
        step: 2,
        title: 'Chakra Sound Bowl Immersion',
        time: '1 hour',
        description: 'Recline as vibrating bronze bowls are positioned around you. Let pure harmonics wash away physical tension and quiet the nervous system.',
      },
      {
        step: 3,
        title: 'Sunset Diya Floating & Chanting Ceremony',
        time: '30 mins',
        description: 'Light a floral brass diya, make a personal wish, and float it across the twilight waters of the Ganges while chanting peace mantras.',
      },
    ],
    reviewsList: [
      {
        id: 'rev-e7',
        author: 'Siddharth Roy',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'September 2026',
        comment: 'One of the most profound, tranquil moments of my life. Away from all the commercial tourist noise, hearing those bowls by the gentle river at sunset is unforgettable.',
      },
    ],
  },
];
