import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Phone, 
  MapPin, 
  RefreshCw, 
  X,
  ChefHat,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { restaurantService } from '../../services/restaurantApi';

export const MyOrders = ({ onNavigateToMenu }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    const filter = user?.id ? { customerId: user.id } : {};
    try {
      setOrders(await restaurantService.getOrders(filter));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> Imelipwa (Inasubiri Dereva)
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Truck className="w-3.5 h-3.5" /> Imepangiwa Dereva
          </span>
        );
      case 'In Preparation':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
            <ChefHat className="w-3.5 h-3.5" /> Inatayarishwa Jikoni
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 animate-pulse">
            <Truck className="w-3.5 h-3.5" /> Iko Njiani (Out for Delivery)
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Imefikishwa (Delivered)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-500" />
            <span>My Orders</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Orodha na hali ya oda zako za vyakula na vinywaji.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sasisha (Refresh)</span>
        </button>
      </div>

      {/* Sketch Page 4: Orders Table matching columns Foods, Dates, Time, Updates */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-semibold">Bado hujaweka oda yoyote ya chakula.</p>
            <button
              onClick={onNavigateToMenu}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition"
            >
              Angalia Menu & Weka Oda Sasa
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">Foods / Items</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Gharama</th>
                  <th className="p-4">Hali (Status)</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {orders.map((order, idx) => (
                  <tr key={order.id} className="hover:bg-amber-50/30 transition">
                    <td className="p-4 text-center font-bold text-slate-400">
                      {idx + 1}.
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 line-clamp-1">
                        {order.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Oda #{order.id}</span>
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap text-xs font-medium">
                      {order.date}
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap text-xs font-medium">
                      {order.time}
                    </td>
                    <td className="p-4 font-black text-slate-900 whitespace-nowrap text-xs">
                      TSh {order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {/* Button labeled "Update" exactly as sketched in Page 4 */}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition"
                      >
                        Update / Angalia
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Order Timeline & Staff Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600">Oda #{selectedOrder.id}</span>
                <h3 className="text-xl font-black text-slate-900">Ufuatiliaji wa Oda (Order Status)</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Progress Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mwenendo wa Oda (Live Tracking):
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      1. {selectedOrder.paymentStatus === 'DEMO_SUCCEEDED' ? 'Demo checkout (hakuna malipo halisi)' : 'Malipo Yamethibitishwa'}
                    </p>
                    <p className="text-[11px] text-slate-500">Kupitia {selectedOrder.paymentMethod} (TSh {selectedOrder.totalAmount?.toLocaleString()})</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedOrder.assignedStaff ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {selectedOrder.assignedStaff ? '✓' : '2'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">2. Msimamizi Kumgawia Dereva</p>
                    <p className="text-[11px] text-slate-500">
                      {selectedOrder.assignedStaff 
                        ? `Imekabidhiwa kwa dereva ${selectedOrder.assignedStaff.fullName}` 
                        : 'Inasubiri Admin akabidhi dereva'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedOrder.orderStatus === 'Out for Delivery' || selectedOrder.orderStatus === 'Delivered'
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {selectedOrder.orderStatus === 'Out for Delivery' || selectedOrder.orderStatus === 'Delivered' ? '✓' : '3'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">3. Iko Njiani (Out for Delivery)</p>
                    <p className="text-[11px] text-slate-500">Chakula kimeshatayarishwa na kinasafirishwa kwenda eneo lako</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedOrder.orderStatus === 'Delivered' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {selectedOrder.orderStatus === 'Delivered' ? '✓' : '4'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">4. Imefikishwa (Delivered)</p>
                    <p className="text-[11px] text-slate-500">Mteja amepokea chakula chake salama</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Assigned Delivery Staff details if assigned */}
            {selectedOrder.assignedStaff && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-blue-900">Taarifa za Msafirishaji (Delivery Staff):</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    {selectedOrder.assignedStaff.vehicle || 'Pikipiki'}
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-700">
                  <p><span className="font-semibold">Dereva:</span> {selectedOrder.assignedStaff.fullName}</p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Mawasiliano:</span> 
                    <a 
                      href={`tel:${selectedOrder.assignedStaff.phone}`} 
                      className="text-blue-700 font-bold underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {selectedOrder.assignedStaff.phone}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Items list */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-400">Vyakula Vilivyomo:</h4>
              <div className="space-y-1 divide-y divide-slate-100">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5">
                    <span className="font-medium text-slate-800">{item.name} × {item.quantity}</span>
                    <span className="font-bold text-slate-900">TSh {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t font-black text-sm text-slate-900">
                <span>Jumla Iliyolipwa:</span>
                <span className="text-emerald-600">TSh {selectedOrder.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Destination Location Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1 text-slate-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Eneo la Mteja (GPS Lililofungwa):</span>
              </div>
              <p className="font-mono text-slate-700">{selectedOrder.customer.address}</p>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Funga
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
