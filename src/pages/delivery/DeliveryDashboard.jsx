import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  RefreshCw, 
  ExternalLink,
  ChefHat
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { restaurantService } from '../../services/restaurantApi';

export const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const loadAssigned = async () => {
    try {
      setAssignedOrders(await restaurantService.getAssignedOrders());
    } catch {
      setAssignedOrders([]);
    }
  };

  useEffect(() => {
    loadAssigned();
  }, [user]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setStatusUpdatingId(orderId);
    try {
      await restaurantService.updateOrderStatus(orderId, newStatus);
      await loadAssigned();
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-300" /> DASHIBODI YA USAFIRISHAJI (DELIVERY STAFF)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Dereva: {user?.fullName || 'Juma Ally'}
          </h2>
          <p className="text-blue-200 text-xs sm:text-sm mt-1">
            Tazama oda ulizogawiwa na Admin, wasiliana na mteja, na fungua GPS ramani kufikisha chakula.
          </p>
        </div>

        <button
          onClick={loadAssigned}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sasisha Oda</span>
        </button>
      </div>

      {/* Assigned Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span>Oda Ulizopangiwa (Assigned Orders)</span>
          </h3>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {assignedOrders.length} Oda Zako
          </span>
        </div>

        {assignedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">Hakuna oda mpya uliyogawiwa kwa sasa.</p>
            <p className="text-xs text-slate-400">Admin akishapokea malipo na kukukabidhi oda, itaonekana hapa moja kwa moja.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedOrders.map((order) => {
              const isUpdating = statusUpdatingId === order.id;
              const isDelivered = order.orderStatus === 'Delivered';
              
              const mapUrl = order.customer.coords 
                ? `https://www.google.com/maps/dir/?api=1&destination=${order.customer.coords.lat},${order.customer.coords.lng}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customer.address)}`;

              return (
                <div 
                  key={order.id} 
                  className={`bg-white rounded-2xl border-2 transition-all shadow-sm flex flex-col justify-between overflow-hidden ${
                    isDelivered ? 'border-slate-200 opacity-80' : 'border-blue-400 shadow-blue-500/10'
                  }`}
                >
                  <div className="p-5 space-y-4">
                    
                    {/* Header: Order ID & Status */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-black text-blue-700">#{order.id}</span>
                        <span className="text-[11px] text-slate-400 block font-sans">{order.date} • {order.time}</span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isDelivered 
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Out for Delivery'
                          ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* 1. Customer Information Section (Required) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Taarifa za Mteja (Customer):</span>
                        <span className="text-emerald-700 font-bold">
                          {order.paymentStatus === 'DEMO_SUCCEEDED' ? 'Demo payment (no charge)' : `Malipo: ${order.paymentStatus}`}
                        </span>
                      </div>

                      <div className="font-extrabold text-sm text-slate-900">{order.customer.fullName}</div>

                      {/* Phone & Communication buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Piga Simu ({order.customer.phone})</span>
                        </a>

                        <a
                          href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold text-xs border border-emerald-300 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {/* Active Customer Location (Requirement 6) */}
                      <div className="pt-2 border-t border-slate-200 space-y-1.5 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-[11px]">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                            </span>
                            <span>ACTIVE CUSTOMER LOCATION:</span>
                          </span>

                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] flex items-center gap-1 shadow-xs transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Navigate (Live GPS)</span>
                          </a>
                        </div>
                        <p className="font-bold text-slate-900 leading-snug">{order.customer.address}</p>
                        {order.customer.coords && (
                          <p className="text-[10px] font-mono text-emerald-900 font-semibold">
                            GPS Coordinates: {order.customer.coords.lat?.toFixed(5)}, {order.customer.coords.lng?.toFixed(5)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 2. Order Details Section (Required) */}
                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">Vyakula & Vinywaji Vilivyoagizwa:</span>
                      <div className="space-y-1.5 divide-y divide-slate-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-1">
                            <span className="font-medium text-slate-800">
                              {item.name} <strong className="text-amber-700">× {item.quantity}</strong>
                            </span>
                            <span className="font-bold text-slate-900">
                              TSh {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between pt-2 border-t border-slate-200 text-xs font-black">
                        <span>Jumla ya Risiti:</span>
                        <span className="text-emerald-700">TSh {order.totalAmount.toLocaleString()} ({order.paymentMethod})</span>
                      </div>
                    </div>

                  </div>

                  {/* 3. Status Action Controls */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
                    {order.orderStatus === 'Assigned' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'In Preparation')}
                        disabled={isUpdating}
                        className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Chukua Oda Jikoni</span>
                      </button>
                    )}

                    {(order.orderStatus === 'Assigned' || order.orderStatus === 'In Preparation') && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                        disabled={isUpdating}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Anza Safari (Out for Delivery)</span>
                      </button>
                    )}

                    {order.orderStatus === 'Out for Delivery' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Nimempa Mteja Chakula (Delivered)</span>
                      </button>
                    )}

                    {isDelivered && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" /> Oda Imekamilika
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
