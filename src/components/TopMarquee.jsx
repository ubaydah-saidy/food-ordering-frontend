import React, { useState, useEffect } from 'react';
import { Flame, Megaphone, Star, Truck, HeartHandshake } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';

export const TopMarquee = () => {
  const [announcements, setAnnouncements] = useState([]);

  const loadAnnouncements = () => {
    setAnnouncements(restaurantService.getAnnouncements());
  };

  useEffect(() => {
    loadAnnouncements();
    const handleUpdate = () => loadAnnouncements();
    window.addEventListener('restaurant_db_updated', handleUpdate);
    return () => window.removeEventListener('restaurant_db_updated', handleUpdate);
  }, []);

  const marqueeContent = (
    <div className="flex items-center gap-8 mx-4">
      {/* Dynamic Admin Announcements */}
      {announcements.map((ann) => (
        <span key={ann.id} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-black/20 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase text-[10px] tracking-wider border border-black/10">
            <Megaphone className="w-3.5 h-3.5 text-red-700 animate-bounce" /> {ann.badge || 'TANGAZO'}
          </span>
          <span className="text-slate-900 font-black tracking-wide">
            {ann.title}: <span className="font-bold text-slate-800">{ann.message}</span>
          </span>
        </span>
      ))}

      {/* Evergreen Promotional Messages */}
      <span className="inline-flex items-center gap-1.5 bg-black/15 px-2.5 py-0.5 rounded-full text-slate-900 font-extrabold uppercase tracking-wider">
        <Flame className="w-3.5 h-3.5 text-red-700 fill-red-600 animate-pulse" /> TODAY'S SPECIAL
      </span>
      <span className="text-slate-900 tracking-wide font-extrabold">
        🍲 WELCOME TO OUR RESTAURANT! Order Delicious Hot Foods & Chilled Beverages Instantly!
      </span>
      <span className="text-slate-800 flex items-center gap-1 font-bold">
        <Truck className="w-4 h-4 text-slate-950" /> Fast Doorstep Delivery Directly To Your Live GPS Location!
      </span>
      <span className="text-slate-900 font-bold">
        💳 Easy & Secure Payment via M-Pesa, TigoPesa, Airtel Money, Halopesa or Credit/Debit Card!
      </span>
      <span className="text-slate-800 flex items-center gap-1 font-extrabold">
        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-900" /> Special Chicken Biryani • Swahili Beef Pilau • Zege Chips Mayai • Coconut Fish Curry • Pure Fresh Juices!
      </span>
      <span className="text-slate-900 flex items-center gap-1 font-bold">
        <HeartHandshake className="w-4 h-4 text-emerald-900" /> Premium Quality & Reliable Food Ordering Service!
      </span>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-slate-950 font-bold text-xs py-2 px-4 shadow-sm border-b border-amber-600/30 overflow-hidden relative select-none">
      <div className="flex items-center whitespace-nowrap animate-marquee">
        {marqueeContent}
        {marqueeContent}
      </div>
    </div>
  );
};
