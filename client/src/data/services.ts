export interface Service {
  _id: string;
  title: string;
  category: 'Culinary' | 'Wellness' | 'Concierge' | 'Transport';
  tagline: string;
  description: string;
  priceTag: string;
  image: string;
  features: string[];
}

export const mockServices: Service[] = [
  {
    _id: 'srv-1',
    title: 'Private In-Villa Chef & Banquet',
    category: 'Culinary',
    tagline: 'Multi-course regional feasts prepared and plated directly in your sanctuary kitchen',
    description: 'Enjoy freshly prepared Goan sea-bass curries, Kashmiri wazwan banquets, or Mediterranean tapas tailored to your dietary preferences, with table service and spotless cleanup included.',
    priceTag: 'From ₹3,500 / meal + groceries',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    features: ['Custom curated menus', 'Organic local market sourcing', 'Table dressing and post-meal cleanup'],
  },
  {
    _id: 'srv-2',
    title: 'Traditional Ayurvedic Spa & Abhyanga',
    category: 'Wellness',
    tagline: 'Certified Ayurvedic practitioners bringing warm herbal oils and brass vessels to you',
    description: 'Deep tissue body rejuvenation, warm sesame oil head massage (Shirodhara), and botanical facial therapies in the comfort and privacy of your stay’s veranda or poolside.',
    priceTag: 'From ₹2,800 / 60 min session',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    features: ['Customized dosha consultation', 'Wild-harvested herbal oils', 'Portable luxury therapy beds'],
  },
  {
    _id: 'srv-3',
    title: 'Executive Chauffeur & Airport Concierge',
    category: 'Transport',
    tagline: 'Flawless airport meet-and-greet and dedicated luxury sedan transfers',
    description: 'Avoid local taxi lines. A courteous, vetted private chauffeur meets you at the arrivals terminal with chilled towels, bottled sparkling water, and luggage assistance.',
    priceTag: 'From ₹2,200 / airport transfer',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
    features: ['Flight tracking for delays', 'Premium electric and luxury sedans', 'Child seats available upon request'],
  },
  {
    _id: 'srv-4',
    title: 'Pre-Arrival Pantry & Bar Provisioning',
    category: 'Concierge',
    tagline: 'Step into a refrigerator fully stocked with your favorite artisanal essentials',
    description: 'Arrive at midnight or after a long flight to a welcoming kitchen stocked with artisanal cheeses, sourdough bread, fresh tropical fruits, organic coffee, and chosen wines.',
    priceTag: '₹950 service fee + grocery receipts',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=85',
    features: ['Specialty dietary curation', 'Chilled beverages on arrival', 'Itemized store receipts provided'],
  },
];
