import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Headphones, 
  ChevronRight, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { restaurantService } from '../../services/restaurantService';

export const OthersPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);

  const loadNotifs = () => {
    const data = restaurantService.getNotifications(user?.id);
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifs();
    const handleUpdate = () => loadNotifs();
    window.addEventListener('restaurant_db_updated', handleUpdate);
    return () => window.removeEventListener('restaurant_db_updated', handleUpdate);
  }, [user]);

  const markAsRead = (id) => {
    restaurantService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header matching Page 8 sketch: "Others." */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Others.
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Arifa na Msaada kwa Wateja wetu (Page 8).
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          Ukurasa wa 8
        </span>
      </div>

      {/* Two Main Options Container matching Page 8 sketch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Option 1: Notification with Bell icon */}
        <button
          onClick={() => setActiveTab('notifications')}
          className={`p-5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
            activeTab === 'notifications'
              ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              activeTab === 'notifications' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Notification</h3>
              <p className="text-xs text-slate-500">Arifa za oda na malipo</p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${activeTab === 'notifications' ? 'text-amber-600' : 'text-slate-300'}`} />
        </button>

        {/* Option 2: Help & Support with Headphone icon */}
        <button
          onClick={() => setActiveTab('support')}
          className={`p-5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
            activeTab === 'support'
              ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              activeTab === 'support' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Help & Support</h3>
              <p className="text-xs text-slate-500">Msaada na mawasiliano</p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${activeTab === 'support' ? 'text-amber-600' : 'text-slate-300'}`} />
        </button>

      </div>

      {/* Content Area Based on Selected Tab */}
      {activeTab === 'notifications' ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Orodha ya Arifa Zako (Notifications)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {notifications.length} jumla
            </span>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Hakuna taarifa mpya kwa sasa.
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    notif.read
                      ? 'bg-slate-50/70 border-slate-200 opacity-75'
                      : 'bg-amber-50/40 border-amber-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.read ? 'bg-slate-300' : 'bg-amber-500 animate-ping'}`} />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{notif.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">{notif.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-500" />
              <span>Msaada na Huduma kwa Wateja (Help & Support)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tuko hapa kukuhudumia masaa 24/7 kwa maswali au changamoto ya kuagiza chakula.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* WhatsApp Support */}
            <a
              href="https://wa.me/255777123456"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">WhatsApp Moja kwa Moja</h4>
                <p className="text-xs text-emerald-800 font-semibold">+255 777 123 456</p>
              </div>
            </a>

            {/* Hotline Call */}
            <a
              href="tel:+255777123456"
              className="p-4 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Piga Simu ya Bure</h4>
                <p className="text-xs text-blue-800 font-semibold">+255 777 123 456</p>
              </div>
            </a>

            {/* Email Support */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Barua Pepe (Email)</h4>
                <p className="text-xs text-slate-600">support@ourrestaurant.co.tz</p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Masaa ya Kazi</h4>
                <p className="text-xs text-amber-800 font-semibold">Jumatatu - Jumapili (Saa 1:00 Asubuhi - 5:00 Usiku)</p>
              </div>
            </div>

          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Maswali Yanayoulizwa Mara kwa Mara (FAQs):</span>
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">1. Chakula kinachukua muda gani kufika?</p>
                <p className="text-slate-600">Ndani ya dakika 20 hadi 35 baada ya malipo kuthibitishwa na Admin kumgawia dereva oda yako.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">2. Kwa nini siwezi kubadilisha Location yangu kwa mikono?</p>
                <p className="text-slate-600">Mfumo unatumia GPS halisi ya kifaa chako ili kuepuka makosa ya anwani na kuhakikisha msafirishaji anafika moja kwa moja mahali ulipo bila kupotea.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">3. Nawezaje kulipia kwa njia nyingine?</p>
                <p className="text-slate-600">Mfumo wetu unakubali mitandao yote mikubwa ya Tanzania (Vodacom M-Pesa, TigoPesa, Airtel Money, Halopesa) pamoja na kadi za Benki (Visa na Mastercard).</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
