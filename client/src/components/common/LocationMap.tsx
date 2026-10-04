import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  lat: number;
  lng: number;
  city: string;
  area: string;
  distanceDesc: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  lat,
  lng,
  city,
  area,
  distanceDesc,
}) => {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={[lat, lng]}
          radius={10}
          pathOptions={{
            color: '#ffffff',
            fillColor: '#e4572e',
            fillOpacity: 1,
            weight: 4,
          }}
        >
          <Popup>
            <div className="text-center">
              <strong>{city}</strong>
              <br />
              <span>{area}</span>
              <br />
              <small>{distanceDesc}</small>
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
};