import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  Navigation,
  Crosshair,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface LocationPickerProps {
  lat: number;
  lng: number;
  city: string;
  state: string;
  area: string;
  onChange: (update: {
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    area?: string;
  }) => void;
}

export const POPULAR_DESTINATIONS = [
  { city: 'Goa', state: 'Goa', lat: 15.4909, lng: 73.8278, area: 'Anjuna / Assagao' },
  { city: 'Coorg', state: 'Karnataka', lat: 12.3375, lng: 75.8069, area: 'Madikeri Hills' },
  { city: 'Manali', state: 'Himachal Pradesh', lat: 32.2396, lng: 77.1887, area: 'Old Manali' },
  { city: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, area: 'Lake Pichola' },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, area: 'Bandra West' },
  { city: 'Alibaug', state: 'Maharashtra', lat: 18.6414, lng: 72.8722, area: 'Awas Beach' },
  { city: 'Kerala', state: 'Kerala', lat: 9.9312, lng: 76.2673, area: 'Alleppey Backwaters' },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, area: 'Civil Lines' },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, area: 'Indiranagar' },
  { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, area: 'Hauz Khas' },
];

// Custom marker for host creation
const createHostMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-pin-container',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 64px; height: 64px; pointer-events: auto;">
        <!-- Pulsing radar halo -->
        <div style="position: absolute; width: 64px; height: 64px; border-radius: 9999px; background: rgba(255, 90, 95, 0.4);" class="map-radar-ring"></div>
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(255, 90, 95, 0.35);"></div>
        
        <!-- Pin Marker Badge -->
        <div style="position: relative; z-index: 10; width: 44px; height: 44px; border-radius: 9999px; background: linear-gradient(135deg, #FF385C 0%, #E00B41 50%, #FF7A59 100%); border: 3px solid #ffffff; box-shadow: 0 6px 22px rgba(255, 56, 92, 0.8); display: flex; align-items: center; justify-content: center; cursor: grab;">
          <svg style="width: 24px; height: 24px; color: #ffffff;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div style="position: absolute; bottom: 0px; background: #0f172a; color: #ffffff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          Drag Me
        </div>
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 48],
  });
};

// Map click listener to place the pin
const MapEventsHandler: React.FC<{
  onSelect: (lat: number, lng: number) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Map auto-panner when coordinates change
const MapPanner: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 1 });
      setTimeout(() => map.invalidateSize(), 150);
    }
  }, [lat, lng, map]);
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  lat,
  lng,
  city,
  state,
  area,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const markerRef = useRef<any>(null);

  const safeLat = lat != null && !isNaN(lat) && lat !== 0 ? lat : 15.4909;
  const safeLng = lng != null && !isNaN(lng) && lng !== 0 ? lng : 73.8278;

  // Search address using OpenStreetMap Nominatim
  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);

        const addr = result.address || {};
        const detectedCity = addr.city || addr.town || addr.village || addr.county || city;
        const detectedState = addr.state || state;
        const detectedArea = addr.suburb || addr.neighbourhood || addr.residential || area;

        onChange({
          lat: newLat,
          lng: newLng,
          city: detectedCity,
          state: detectedState,
          area: detectedArea,
        });
      } else {
        setSearchError('Location not found. Try searching with city or neighborhood.');
      }
    } catch (err) {
      setSearchError('Could not reach map search. You can click anywhere on the map to pin.');
    } finally {
      setIsSearching(false);
    }
  };

  // Get current GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        onChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve current location. Please allow location permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Draggable marker event
  const handleMarkerDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const pos = marker.getLatLng();
      onChange({ lat: pos.lat, lng: pos.lng });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Address Search Bar & GPS Locate Button */}
      <form onSubmit={handleSearchLocation} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address, landmark or city (e.g. Madikeri Coorg, Anjuna Goa)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5"
        >
          {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>Locate</span>
        </button>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          title="Use my current GPS location"
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-sunset-coral" /> : <Crosshair className="w-3.5 h-3.5 text-sunset-coral" />}
          <span className="hidden sm:inline">My GPS</span>
        </button>
      </form>

      {searchError && (
        <p className="text-xs text-rose-500 font-medium">{searchError}</p>
      )}

      {/* 2. Popular Preset Destination Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">
            Quick Destinations in India
          </span>
          <span className="text-[11px] text-slate-400">Click to jump map</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_DESTINATIONS.map((dest) => {
            const isMatch = city.toLowerCase() === dest.city.toLowerCase();
            return (
              <button
                key={dest.city}
                type="button"
                onClick={() =>
                  onChange({
                    lat: dest.lat,
                    lng: dest.lng,
                    city: dest.city,
                    state: dest.state,
                    area: dest.area,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isMatch
                    ? 'bg-sunset-gradient text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10'
                }`}
              >
                {dest.city}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Leaflet Map for Pinpoint Selection */}
      <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 shadow-lg">
        {/* Floating Instruction Banner */}
        <div className="absolute top-3 left-3 z-[400] pointer-events-auto bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-medium shadow-md border border-white/10 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-sunset-coral" />
          <span>Click anywhere or drag the pin to place property</span>
        </div>

        <MapContainer
          key={`${safeLat}-${safeLng}`}
          center={[safeLat, safeLng]}
          zoom={14}
          scrollWheelZoom={true}
          zoomControl={true}
          className="w-full h-full relative"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <Marker
            ref={markerRef}
            position={[safeLat, safeLng]}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
            icon={createHostMarkerIcon()}
          />

          <MapEventsHandler
            onSelect={(newLat, newLng) => onChange({ lat: newLat, lng: newLng })}
          />

          <MapPanner lat={safeLat} lng={safeLng} />
        </MapContainer>
      </div>

      {/* 4. Verified Coordinates Status Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              Point of Location Set:
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              {safeLat.toFixed(5)}° N, {safeLng.toFixed(5)}° E
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sunset-coral bg-sunset-coral/10 px-2 py-0.5 rounded-full">
            Neighborhood Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
