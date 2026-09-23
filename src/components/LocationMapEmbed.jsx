import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

// Renders a small live map for a given lat/lng using OpenStreetMap's free embed
// (no API key required). Falls back gracefully if coords are missing.
export const LocationMapEmbed = ({ lat, lng, address, height = 160, zoomDelta = 0.006 }) => {
  if (typeof lat !== 'number' || typeof lng !== 'number' || Number.isNaN(lat) || Number.isNaN(lng)) {
    return (
      <div
        className="w-full flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-400 font-semibold"
        style={{ height }}
      >
        Eneo (GPS) bado halijagunduliwa
      </div>
    );
  }

  const bbox = `${lng - zoomDelta}%2C${lat - zoomDelta}%2C${lng + zoomDelta}%2C${lat + zoomDelta}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-emerald-200 shadow-sm">
      <iframe
        title={`Live location map${address ? ` - ${address}` : ''}`}
        src={embedSrc}
        style={{ width: '100%', height, border: 0 }}
        loading="lazy"
      />
      <div className="flex items-center justify-between bg-emerald-50/80 px-2.5 py-1.5 text-[10px] font-bold text-emerald-900">
        <span className="flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
          <span className="truncate">{address || 'Eneo la GPS'}</span>
        </span>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-0.5 text-blue-700 hover:underline flex-shrink-0 ml-2"
        >
          <span>Fungua Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
