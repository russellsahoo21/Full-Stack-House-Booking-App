import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { listingsApi } from '@/services/api';
import { LocationPicker } from '@/components/common/LocationPicker';
import {
  Home,
  Building,
  Warehouse,
  Coffee,
  Ship,
  Trees,
  Truck,
  Castle,
  Mountain,
  Flame,
  Check,
  Plus,
  Minus,
  Sparkles,
  Wifi,
  Tv,
  Car,
  Waves,
  Utensils,
  Wind,
  Shield,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

// Preset property types matching Airbnb screenshot
const PROPERTY_TYPES = [
  { id: 'House', label: 'House', icon: Home, description: 'Stand-alone residential home' },
  { id: 'Apartment', label: 'Flat/apartment', icon: Building, description: 'In a building or condominium' },
  { id: 'Barn', label: 'Barn', icon: Warehouse, description: 'Rustic, repurposed agricultural space' },
  { id: 'Bed & breakfast', label: 'Bed & breakfast', icon: Coffee, description: 'Hospitality with morning meals' },
  { id: 'Boat', label: 'Boat / Houseboat', icon: Ship, description: 'Floating stay on water' },
  { id: 'Cabin', label: 'Cabin', icon: Mountain, description: 'Wooded retreat in nature' },
  { id: 'Campervan', label: 'Campervan / Motorhome', icon: Truck, description: 'Mobile home with wheels' },
  { id: 'Villa', label: 'Villa', icon: Castle, description: 'Luxury estate or vacation mansion' },
  { id: 'Treehouse', label: 'Treehouse', icon: Trees, description: 'Elevated among forest canopy' },
  { id: 'Tent', label: 'Luxury Tent', icon: Flame, description: 'Glamping under the stars' },
  { id: 'Cottage', label: 'Cottage', icon: Home, description: 'Cozy country escape' },
  { id: 'Chalet', label: 'Chalet', icon: Mountain, description: 'Alpine style wooden lodge' },
];

const ROOM_TYPES = [
  {
    id: 'Entire place',
    title: 'An entire place',
    description: 'Guests have the whole place to themselves. Includes bedroom, bathroom, and kitchen.',
  },
  {
    id: 'Private room',
    title: 'A room',
    description: "Guests have their own private room for sleeping, plus access to shared spaces.",
  },
  {
    id: 'Shared room',
    title: 'A shared room',
    description: 'Guests sleep in a bedroom or common area that may be shared with others.',
  },
];

const POPULAR_DESTINATIONS = [
  { city: 'Goa', state: 'Goa', lat: 15.4909, lng: 73.8278, area: 'Anjuna / Assagao' },
  { city: 'Manali', state: 'Himachal Pradesh', lat: 32.2396, lng: 77.1887, area: 'Old Manali' },
  { city: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, area: 'Lake Pichola' },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, area: 'Bandra West' },
  { city: 'Alibaug', state: 'Maharashtra', lat: 18.6414, lng: 72.8722, area: 'Awas Beach' },
  { city: 'Coorg', state: 'Karnataka', lat: 12.3375, lng: 75.8069, area: 'Madikeri Hills' },
  { city: 'Kerala', state: 'Kerala', lat: 9.9312, lng: 76.2673, area: 'Alleppey Backwaters' },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, area: 'Civil Lines' },
];

const AMENITY_OPTIONS = [
  { id: 'Fast Wifi', label: 'Fast Wifi (100+ Mbps)', icon: Wifi },
  { id: 'Private Swimming Pool', label: 'Private Pool', icon: Waves },
  { id: 'Air Conditioning', label: 'Air Conditioning', icon: Wind },
  { id: 'Gourmet Kitchen', label: 'Fully Equipped Kitchen', icon: Utensils },
  { id: 'Free Parking', label: 'Free On-premise Parking', icon: Car },
  { id: 'Smart TV & Sound System', label: 'Smart TV with Netflix', icon: Tv },
  { id: 'Mountain View', label: 'Panoramic Mountain View', icon: Mountain },
  { id: 'Dedicated Workspace', label: 'Dedicated Workspace', icon: Building },
  { id: '24/7 Power Backup', label: 'Inverter / Generator Backup', icon: Flame },
  { id: 'Security Cameras', label: 'Security & Gated Guard', icon: Shield },
];

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
];

export const BecomeAHost: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();

  // Wizard state: Steps 1 to 10
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 10;

  // Form Data
  const [propertyType, setPropertyType] = useState<string>('House');
  const [roomType, setRoomType] = useState<string>('Entire place');
  const [city, setCity] = useState<string>('Goa');
  const [state, setState] = useState<string>('Goa');
  const [area, setArea] = useState<string>('Assagao');
  const [lat, setLat] = useState<number>(15.4909);
  const [lng, setLng] = useState<number>(73.8278);

  // Floor plan
  const [guests, setGuests] = useState<number>(4);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [beds, setBeds] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Fast Wifi',
    'Private Swimming Pool',
    'Air Conditioning',
    'Gourmet Kitchen',
    'Free Parking',
  ]);

  // Photos
  const [images, setImages] = useState<string[]>([SAMPLE_PHOTO_PRESETS[0], SAMPLE_PHOTO_PRESETS[1]]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');

  // Title & description
  const [title, setTitle] = useState<string>('Villa Solarium — Sunlit Sanctuary with Private Pool');
  const [tagline, setTagline] = useState<string>('Boutique architectural estate nestled amongst lush palm gardens');
  const [description, setDescription] = useState<string>(
    'Step into a carefully designed haven of calm and understated luxury. Boasting double-height ceilings, a serene private lap pool, and sun-drenched courtyards, Villa Solarium is designed for wanderers who value privacy, nature, and thoughtful architecture.'
  );

  // Pricing
  const [pricePerNight, setPricePerNight] = useState<number>(18500);
  const [cleaningFee, setCleaningFee] = useState<number>(1500);

  // Loading & submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Quick pick destination
  const handleSelectDestination = (dest: typeof POPULAR_DESTINATIONS[0]) => {
    setCity(dest.city);
    setState(dest.state);
    setArea(dest.area);
    setLat(dest.lat);
    setLng(dest.lng);
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleAddPhoto = () => {
    if (customPhotoUrl.trim()) {
      setImages((prev) => [...prev, customPhotoUrl.trim()]);
      setCustomPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitListing = async (status: 'Pending Approval' | 'Draft') => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        tagline,
        description,
        propertyType,
        roomType,
        category: ['villas'],
        vibe: city.toLowerCase().includes('goa') || city.toLowerCase().includes('alibaug') ? 'beach' : 'hills',
        location: {
          city,
          state,
          country: 'India',
          area,
          distanceDesc: `Located in prime ${area}`,
          lat,
          lng,
        },
        price: {
          perNight: pricePerNight,
          cleaningFee,
          serviceFeePercent: 12,
          currency: 'INR',
        },
        images: images.length > 0 ? images : [SAMPLE_PHOTO_PRESETS[0]],
        amenities: selectedAmenities,
        maxGuests: guests,
        bedrooms,
        beds,
        bathrooms,
        status, // 'Pending Approval' or 'Draft'
        availableDates: 'Available year-round',
        houseRules: [
          'No smoking indoors',
          'Quiet hours after 10:00 PM',
          'Care for the architecture with mindfulness',
        ],
      };

      const res = await listingsApi.createListing(payload);
      if (res.success || res.data) {
        setIsSuccess(true);
        // Refresh the user session so the user immediately gets the 'host' role and badge
        await refreshUser().catch((e) => console.warn('Could not refresh user role:', e));
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit listing. Please ensure you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0f17] flex flex-col justify-between font-sans text-slate-900 dark:text-slate-100">
      {/* 1. TOP AIRBNB-STYLE NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0e0f17]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-6 sm:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-sunset-gradient flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            wayfound<span className="text-sunset-coral font-light">.stay</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert('Wayfound Hosting Support is available 24/7 at support@wayfound.stay')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 dark:border-white/15 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Questions?</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Save your progress as Draft and exit?')) {
                handleSubmitListing('Draft').then(() => navigate('/'));
              }
            }}
            className="px-4 py-2 rounded-full border border-slate-300 dark:border-white/15 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            Save & exit
          </button>
        </div>
      </header>

      {/* 2. BODY / STEP CONTENT CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 sm:px-12 py-10 flex flex-col justify-center">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">{errorMessage}</div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* SUCCESS CONFIRMATION MODAL / SCREEN */}
        {/* ==================================================== */}
        {isSuccess ? (
          <div className="py-12 text-center max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-sunset-coral">
                Listing Under Review
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Your sanctuary has been submitted!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Thank you for submitting <strong>"{title}"</strong>. To maintain the highest architectural
                and guest standards across Wayfound, our curation admin team will review your property and
                publish it within <strong>24 hours</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                <span>Location:</span>
                <span>{area}, {city}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                <span>Base Rate:</span>
                <span>₹{pricePerNight.toLocaleString()}/night</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                <span>Current Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  Pending Approval
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-sunset-gradient text-white text-sm font-bold shadow-lg hover:shadow-glow-sunset hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Back to Wayfound Home
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin/properties')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-slate-300 dark:border-white/20 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Open Admin Review Queue →
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* STEP 1: WELCOME & OVERVIEW (MATCHING AIRBNB SCREENSHOT 4) */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
                <div className="md:col-span-6 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Step 1
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
                    Tell us about your place
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                    In this step, we’ll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.
                  </p>
                </div>
                <div className="md:col-span-6 flex justify-center">
                  <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/10 group">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                      alt="Modern architectural home"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                      <span className="text-white text-xs font-semibold tracking-wide">
                        Curated Boutiques & Homes on Wayfound
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROPERTY TYPE (MATCHING AIRBNB SCREENSHOT 5) */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Which of these best describes your place?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose the architectural category that accurately portrays your stay.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                  {PROPERTY_TYPES.map((type) => {
                    const IconComp = type.icon;
                    const isSelected = propertyType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPropertyType(type.id)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-32 hover:border-slate-900 dark:hover:border-white ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-white/10 shadow-md ring-1 ring-slate-900 dark:ring-white'
                            : 'border-slate-200 dark:border-white/10 hover:shadow-sm'
                        }`}
                      >
                        <IconComp className={`w-7 h-7 ${isSelected ? 'text-sunset-coral' : 'text-slate-700 dark:text-slate-300'}`} />
                        <div>
                          <div className="text-sm font-bold leading-tight">{type.label}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{type.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: SPACE / ROOM TYPE */}
            {currentStep === 3 && (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    What type of space will guests have?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Let guests know the degree of privacy they can expect.
                  </p>
                </div>

                <div className="space-y-3">
                  {ROOM_TYPES.map((room) => {
                    const isSelected = roomType === room.id;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setRoomType(room.id)}
                        className={`w-full p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all hover:border-slate-900 dark:hover:border-white ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-white/10 shadow-md ring-1 ring-slate-900 dark:ring-white'
                            : 'border-slate-200 dark:border-white/10 hover:shadow-sm'
                        }`}
                      >
                        <div className="pr-4 space-y-1">
                          <div className="text-base font-bold">{room.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{room.description}</div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: LOCATION (INTERACTIVE MAP & PINPOINT) */}
            {currentStep === 4 && (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Where's your place located?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pinpoint your exact location on the map so guests can accurately discover your neighborhood.
                  </p>
                </div>

                {/* Interactive Leaflet Map Pinpoint Picker */}
                <LocationPicker
                  lat={lat}
                  lng={lng}
                  city={city}
                  state={state}
                  area={area}
                  onChange={(update) => {
                    setLat(update.lat);
                    setLng(update.lng);
                    if (update.city) setCity(update.city);
                    if (update.state) setState(update.state);
                    if (update.area) setArea(update.area);
                  }}
                />

                {/* Fine-tune Address Fields */}
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                        placeholder="e.g. Coorg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                        placeholder="e.g. Karnataka"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Neighborhood / Area / Street
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                      placeholder="e.g. Madikeri Hills"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: FLOOR PLAN & CAPACITY */}
            {currentStep === 5 && (
              <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Share some basics about your place
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    You'll add more details later, like bed types and sleeping arrangements.
                  </p>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/10 space-y-2">
                  {[
                    { label: 'Guests', value: guests, set: setGuests, min: 1, max: 20 },
                    { label: 'Bedrooms', value: bedrooms, set: setBedrooms, min: 0, max: 12 },
                    { label: 'Beds', value: beds, set: setBeds, min: 1, max: 16 },
                    { label: 'Bathrooms', value: bathrooms, set: setBathrooms, min: 1, max: 12 },
                  ].map((item) => (
                    <div key={item.label} className="py-4 flex items-center justify-between">
                      <span className="text-base font-bold">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          disabled={item.value <= item.min}
                          onClick={() => item.set(item.value - 1)}
                          className="w-9 h-9 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-900 dark:hover:border-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{item.value}</span>
                        <button
                          type="button"
                          disabled={item.value >= item.max}
                          onClick={() => item.set(item.value + 1)}
                          className="w-9 h-9 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-900 dark:hover:border-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: AMENITIES */}
            {currentStep === 6 && (
              <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Tell guests what your place has to offer
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    You can add or update amenities anytime after publishing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const IconComp = amenity.icon;
                    const isSelected = selectedAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all hover:border-slate-900 dark:hover:border-white ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-white/10 ring-1 ring-slate-900 dark:ring-white'
                            : 'border-slate-200 dark:border-white/10'
                        }`}
                      >
                        <IconComp className={`w-5 h-5 ${isSelected ? 'text-sunset-coral' : 'text-slate-600'}`} />
                        <span className="text-sm font-semibold flex-1">{amenity.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 7: PHOTOS */}
            {currentStep === 7 && (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Add high-resolution photos
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    High quality photos showcase your design and attract the most mindful travelers.
                  </p>
                </div>

                {/* Photo Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden group shadow border border-slate-200 dark:border-white/10">
                      <img src={imgUrl} alt={`Stay photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                          Cover photo
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Photo Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="Paste image URL (e.g. https://...)"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={!customPhotoUrl.trim()}
                    className="px-5 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold disabled:opacity-40"
                  >
                    Add Photo
                  </button>
                </div>

                {/* Quick Presets Picker */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Or select curated architectural photos
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {SAMPLE_PHOTO_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => !images.includes(preset) && setImages((prev) => [...prev, preset])}
                        className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 hover:scale-105 transition-all"
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: TITLE & DESCRIPTION */}
            {currentStep === 8 && (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Now, let's give your place a title
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Short titles work best. Have fun with it — you can always change it later.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</label>
                    <input
                      type="text"
                      maxLength={120}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                      placeholder="e.g. Casa Serena — Cliffside Oceanfront Villa"
                    />
                    <div className="text-right text-[11px] text-slate-400">{title.length}/120</div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tagline</label>
                    <input
                      type="text"
                      maxLength={100}
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                      placeholder="e.g. Modernist pavilion with private infinity pool"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Create your description
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                      placeholder="Share what makes your place special..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: PRICING */}
            {currentStep === 9 && (
              <div className="max-w-lg mx-auto space-y-6 text-center animate-in fade-in duration-300">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Now, set your price
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    You can change it anytime. Similar stays in {city} charge between ₹12,000 and ₹28,000.
                  </p>
                </div>

                <div className="py-6 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-sunset-gradient">
                      ₹{pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">/ night</span>
                  </div>

                  <input
                    type="range"
                    min="3000"
                    max="100000"
                    step="500"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sunset-coral"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>₹3,000</span>
                    <span>₹50,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Guest Total (3 nights)</span>
                    <span className="font-bold">₹{(pricePerNight * 3 + cleaningFee).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Wayfound Host Fee (3%)</span>
                    <span className="font-bold text-emerald-600">-₹{Math.round(pricePerNight * 3 * 0.03).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-white/10 pt-2 flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>You Earn (approx.)</span>
                    <span>₹{Math.round(pricePerNight * 3 * 0.97 + cleaningFee).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 10: REVIEW & SUBMIT TO ADMIN REVIEW */}
            {currentStep === 10 && (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-sunset-coral">
                    Final Step
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Review your listing before submission
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Here's what guests will see. An admin will review and verify your listing before it goes live.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl bg-white dark:bg-[#151724]">
                  <div className="aspect-[16/9] w-full relative">
                    <img
                      src={images[0] || SAMPLE_PHOTO_PRESETS[0]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-md">
                      {propertyType} · {roomType}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {area}, {city}, {state}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-sunset-coral">
                          ₹{pricePerNight.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">per night</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 font-semibold">
                        {guests} guests
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 font-semibold">
                        {bedrooms} bedrooms
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 font-semibold">
                        {bathrooms} baths
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 font-semibold">
                        {selectedAmenities.length} amenities
                      </span>
                    </div>

                    {/* Notice about Admin Approval */}
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        <strong>Admin Approval Required:</strong> To protect our travelers, listings are initially marked as <strong>Pending Approval</strong>. Once an administrator validates the details, your stay will be published to the public search catalog.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 3. BOTTOM AIRBNB-STYLE FOOTER PROGRESS & ACTION BAR */}
      {!isSuccess && (
        <footer className="sticky bottom-0 z-40 bg-white/95 dark:bg-[#0e0f17]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 px-6 sm:px-12 py-4">
          <div className="max-w-5xl mx-auto flex flex-col gap-3">
            {/* Smooth Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-900 dark:bg-white h-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1.5 text-xs font-bold underline disabled:opacity-0 disabled:pointer-events-none hover:text-slate-600 dark:hover:text-slate-300 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                    className="px-8 py-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitListing('Pending Approval')}
                    className="px-8 py-3.5 rounded-xl bg-sunset-gradient text-white text-xs font-bold shadow-lg hover:shadow-glow-sunset hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit for Admin Review</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default BecomeAHost;
