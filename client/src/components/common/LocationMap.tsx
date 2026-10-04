import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation,
  Layers,
  MapPin,
  ExternalLink,
  Plus,
  Minus,
} from 'lucide-react';

interface LocationMapProps {
  lat: number;
  lng: number;
  city: string;
  area: string;
  distanceDesc?: string;
  title?: string;
}

// Controller component inside MapContainer to provide custom zoom, auto-recenter & style controls
const MapController: React.FC<{
  lat: number;
  lng: number;
  onToggleMapType: () => void;
}> = ({ lat, lng, onToggleMapType }) => {
  const map = useMap();

  // Auto-center the map whenever lat or lng change (e.g. when API data loads)
  React.useEffect(() => {
    if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], map.getZoom() || 14, { animate: true });
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [lat, lng, map]);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleRecenter = () => {
    map.flyTo([lat, lng], 14, { duration: 1.2 });
  };

  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-auto">
      {/* Map Style Toggle */}
      <button
        type="button"
        onClick={onToggleMapType}
        title="Switch Map Style (Dark / Street / Satellite)"
        className="w-10 h-10 rounded-xl bg-ink-900/85 hover:bg-ink-900 text-warm-200 hover:text-white backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <Layers className="w-4 h-4 text-sunset-coral" />
      </button>

      {/* Recenter Pin */}
      <button
        type="button"
        onClick={handleRecenter}
        title="Recenter Location"
        className="w-10 h-10 rounded-xl bg-ink-900/85 hover:bg-ink-900 text-warm-200 hover:text-white backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <Navigation className="w-4 h-4" />
      </button>

      {/* Zoom In/Out */}
      <div className="flex flex-col rounded-xl overflow-hidden bg-ink-900/85 backdrop-blur-md border border-white/10 shadow-lg">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-10 h-9 flex items-center justify-center text-warm-200 hover:text-white hover:bg-white/10 transition-colors border-b border-white/10"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-10 h-9 flex items-center justify-center text-warm-200 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Custom pulsing radar pin marker with modern gradient and robust inline styling
const createCustomMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-pin-container',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; pointer-events: auto;">
        <div style="position: absolute; width: 56px; height: 56px; border-radius: 9999px; background: rgba(255, 90, 95, 0.35);" class="map-radar-ring"></div>
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(255, 90, 95, 0.35);"></div>
        <div style="position: relative; z-index: 10; width: 42px; height: 42px; border-radius: 9999px; background: linear-gradient(135deg, #FF385C 0%, #E00B41 50%, #FF7A59 100%); border: 3px solid #ffffff; box-shadow: 0 4px 20px rgba(255, 56, 92, 0.8); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
          <svg style="width: 22px; height: 22px; color: #ffffff;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
    popupAnchor: [0, -28],
  });
};

export const LocationMap: React.FC<LocationMapProps> = ({
  lat,
  lng,
  city,
  area,
  distanceDesc,
  title,
}) => {
  const [mapType, setMapType] = useState<'dark' | 'streets' | 'satellite'>('dark');

  const toggleMapType = () => {
    setMapType((prev) => {
      if (prev === 'dark') return 'streets';
      if (prev === 'streets') return 'satellite';
      return 'dark';
    });
  };

  // 100% free, reliable, no-API-key required tile providers:
  // - dark: OpenStreetMap with custom hardware-accelerated dark UI styling
  // - streets: Standard OpenStreetMap raster tiles
  // - satellite: Esri ArcGIS World Imagery
  const getTileConfig = () => {
    switch (mapType) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Earthstar Geographics',
        };
      case 'streets':
      case 'dark':
      default:
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        };
    }
  };

  const tileConfig = getTileConfig();
  const safeLat = lat != null && !isNaN(lat) && lat !== 0 ? lat : 15.4909;
  const safeLng = lng != null && !isNaN(lng) && lng !== 0 ? lng : 73.8278;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${safeLat},${safeLng}`;

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden glass-panel border border-warm-200/80 dark:border-white/10 shadow-lg">
      {/* Floating Header Tag: Location Badge */}
      <div className="absolute top-4 left-4 z-[400] pointer-events-auto flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-full bg-ink-950/85 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sunset-coral animate-pulse" />
          <span className="truncate max-w-[170px] sm:max-w-none">{area}, {city}</span>
        </div>
        <button
          type="button"
          onClick={toggleMapType}
          className="px-2.5 py-1.5 rounded-full bg-ink-950/70 hover:bg-ink-900/90 backdrop-blur-md border border-white/15 text-warm-200 hover:text-white text-[11px] font-medium capitalize transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Layers className="w-3 h-3 text-sunset-coral" />
          <span>{mapType}</span>
        </button>
      </div>

      {/* External Map Directions link */}
      <div className="absolute bottom-4 left-4 z-[400] pointer-events-auto">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-ink-950/85 hover:bg-ink-900 text-white text-xs font-semibold backdrop-blur-md border border-white/15 shadow-xl hover:border-sunset-coral/50 hover:text-sunset-coral transition-all duration-200 group"
        >
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Open in Google Maps</span>
        </a>
      </div>

      <div className={`w-full h-full ${mapType === 'dark' ? 'leaflet-dark-tiles' : ''}`}>
        <MapContainer
          key={`${safeLat}-${safeLng}`}
          center={[safeLat, safeLng]}
          zoom={14}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full relative"
        >
          <TileLayer
            key={mapType}
            attribution={tileConfig.attribution}
            url={tileConfig.url}
            maxZoom={19}
          />

          <Marker position={[safeLat, safeLng]} icon={createCustomMarkerIcon()}>
            <Popup closeButton={false}>
              <div className="p-3.5 rounded-2xl bg-ink-900/95 text-white border border-white/15 backdrop-blur-xl shadow-2xl min-w-[210px] space-y-1.5">
                <div className="flex items-center gap-2 text-sunset-coral text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Exact Neighborhood</span>
                </div>
                {title && (
                  <p className="text-xs font-bold text-warm-100 line-clamp-1 leading-tight">
                    {title}
                  </p>
                )}
                <div className="text-[11px] text-warm-300">
                  <p className="font-semibold text-white">{area}, {city}</p>
                  {distanceDesc && (
                    <p className="text-warm-400 mt-0.5 flex items-center gap-1">
                      <span>•</span> {distanceDesc}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>

          <MapController
            lat={safeLat}
            lng={safeLng}
            onToggleMapType={toggleMapType}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationMap;