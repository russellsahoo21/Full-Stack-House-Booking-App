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
  hostName: string;
  hostAvatar: string;
  highlights: string[];
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
    hostName: 'Maharani Gayatri Singh',
    hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    highlights: ['Traditional brass cooking vessels', '5-course dinner included', 'Secret family spice blends'],
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
    hostName: 'Stanzin Dorje',
    hostAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    highlights: ['Zero light pollution sky', 'High-res raw DSLR files provided', 'Hot butter tea & blankets'],
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
    hostName: 'Aarav Desai',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    highlights: ['Sea kayak & safety gear provided', 'Wild dolphin sightings', 'Goan poi breakfast on sandbar'],
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
    hostName: 'Tenzing Norbu',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    highlights: ['Tea tasting flight of 6 varieties', 'Plucking technique workshop', 'Estate tea gift pack'],
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
    hostName: 'Capt. Thomas Kurien',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    highlights: ['Traditional Chinese net fishing', 'Village coconut toddy tasting', 'Quiet canal exploration'],
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
    hostName: 'Devika Singhal',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    highlights: ['Tibetan singing bowls', 'Pranayama breathing session', 'Organic herbal chai by the river'],
  },
];
