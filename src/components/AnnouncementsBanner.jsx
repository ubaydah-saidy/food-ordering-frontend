import React, { useState, useEffect } from 'react';
import { Megaphone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';

// Shows admin-posted "matangazo" (announcements) at the top of the customer
// food dashboard. Automatically refreshes whenever the admin posts a new one.
export const AnnouncementsBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const load = () => {
    setAnnouncements(restaurantService.getAnnouncements());
  };

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener('restaurant_db_updated', handleUpdate);
    return () => window.removeEventListener('restaurant_db_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (index >= announcements.length) setIndex(0);
  }, [announcements, index]);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[index];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white p-4 sm:p-5 shadow-lg shadow-purple-800/20 border border-purple-500/30">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-5 h-5 text-amber-300" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-purple-950">
              {current.badge || 'ANNOUNCEMENT'}
            </span>
            {announcements.length > 1 && (
              <span className="text-[10px] font-bold text-purple-200">
                {index + 1} / {announcements.length}
              </span>
            )}
          </div>
          <h4 className="font-black text-sm sm:text-base leading-snug truncate">{current.title}</h4>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed mt-0.5 line-clamp-2">
            {current.message}
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition flex-shrink-0"
          title="Dismiss / Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {announcements.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={() => setIndex((i) => (i - 1 + announcements.length) % announcements.length)}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition ${i === index ? 'bg-amber-400' : 'bg-white/30'}`}
            />
          ))}
          <button
            onClick={() => setIndex((i) => (i + 1) % announcements.length)}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
