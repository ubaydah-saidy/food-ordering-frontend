import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Utensils, 
  ClipboardList, 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  X,
  UserCheck,
  Power,
  Megaphone,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { restaurantService } from '../../services/restaurantService';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'foods', 'users', 'announcements'

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Assignment states
  const [selectedStaffForOrder, setSelectedStaffForOrder] = useState({});
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Food modal state (Add / Edit)
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '',
    category: 'Foods',
    price: '',
    description: '',
    image: '',
    available: true
  });

  // Announcement modal state
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annForm, setAnnForm] = useState({
    title: '',
    message: '',
    badge: 'OFA MAALUM'
  });

  // New staff modal state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    address: '',
    vehicle: 'Boxer MC - MC 123 ABC'
  });

  const loadAllData = () => {
    setStats(restaurantService.getAdminStats());
    setOrders(restaurantService.getOrders());
    setFoods(restaurantService.getFoods());
    setStaffList(restaurantService.getDeliveryStaff());
    setCustomersList(restaurantService.getCustomers());
    setAnnouncements(restaurantService.getAnnouncements());
  };

  useEffect(() => {
    loadAllData();
    const handleUpdate = () => loadAllData();
    window.addEventListener('restaurant_db_updated', handleUpdate);
    return () => window.removeEventListener('restaurant_db_updated', handleUpdate);
  }, []);

  // Handle Assigning Order to Delivery Staff
  const handleAssignOrder = (orderId) => {
    const staffId = selectedStaffForOrder[orderId];
    if (!staffId) {
      setActionErrorMsg('Tafadhali chagua dereva kabla ya kubonyeza Assign.');
      setTimeout(() => setActionErrorMsg(''), 3000);
      return;
    }

    const res = restaurantService.assignOrder(orderId, staffId);
    if (!res.success) {
      setActionErrorMsg(res.error || 'Imeshindwa kumkabidhi dereva.');
      setTimeout(() => setActionErrorMsg(''), 4000);
      return;
    }

    setActionSuccessMsg(res.message);
    setTimeout(() => setActionSuccessMsg(''), 4000);
    loadAllData();
  };

  // Handle Food Submit (Add or Edit)
  const handleFoodSubmit = (e) => {
    e.preventDefault();
    let res;
    if (editingFood) {
      res = restaurantService.updateFood(editingFood.id, foodForm);
    } else {
      res = restaurantService.addFood(foodForm);
    }

    if (!res.success) {
      setActionErrorMsg(res.error);
      setTimeout(() => setActionErrorMsg(''), 3000);
      return;
    }

    setShowFoodModal(false);
    setEditingFood(null);
    setFoodForm({ name: '', category: 'Foods', price: '', description: '', image: '', available: true });
    setActionSuccessMsg(res.message);
    setTimeout(() => setActionSuccessMsg(''), 3000);
    loadAllData();
  };

  // Handle Food Delete
  const handleDeleteFood = (foodId) => {
    if (!window.confirm('Una uhakika unataka kufuta chakula hiki kwenye menu?')) return;
    const res = restaurantService.deleteFood(foodId);
    if (res.success) {
      setActionSuccessMsg(res.message);
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadAllData();
    }
  };

  // Handle Admin creating Staff
  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffForm.email.trim()) {
      setActionErrorMsg('Barua Pepe (Email) ni LAZIMA kwa Delivery Staff.');
      return;
    }

    const res = restaurantService.registerDeliveryStaff(staffForm);
    if (!res.success) {
      setActionErrorMsg(res.error);
      setTimeout(() => setActionErrorMsg(''), 3000);
      return;
    }

    setShowStaffModal(false);
    setStaffForm({ fullName: '', username: '', password: '', phone: '', email: '', address: '', vehicle: 'Boxer MC - MC 123 ABC' });
    setActionSuccessMsg(res.message);
    setTimeout(() => setActionSuccessMsg(''), 3000);
    loadAllData();
  };

  // Delete User (Customer or Delivery Staff)
  const handleDeleteUser = (userId, userName) => {
    if (!window.confirm(`Una uhakika unataka kufuta akaunti ya "${userName}"?`)) return;
    const res = restaurantService.deleteUser(userId);
    if (res.success) {
      setActionSuccessMsg(res.message);
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadAllData();
    }
  };

  // Toggle Staff Status
  const handleToggleStaffStatus = (staffId) => {
    const res = restaurantService.toggleStaffStatus(staffId);
    if (res.success) {
      setActionSuccessMsg(`Hali ya dereva imebadilishwa kuwa: ${res.status}`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadAllData();
    }
  };

  // Handle Announcement Submit
  const handleAnnSubmit = (e) => {
    e.preventDefault();
    if (!annForm.title.trim() || !annForm.message.trim()) {
      setActionErrorMsg('Tafadhali jaza kichwa cha habari na maelezo ya tangazo.');
      setTimeout(() => setActionErrorMsg(''), 3000);
      return;
    }
    const res = restaurantService.addAnnouncement(annForm);
    if (res.success) {
      setShowAnnModal(false);
      setAnnForm({ title: '', message: '', badge: 'OFA MAALUM' });
      setActionSuccessMsg(res.message);
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadAllData();
    }
  };

  // Handle Announcement Delete
  const handleDeleteAnn = (id) => {
    if (!window.confirm('Una uhakika unataka kufuta tangazo hili?')) return;
    const res = restaurantService.deleteAnnouncement(id);
    if (res.success) {
      setActionSuccessMsg(res.message);
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadAllData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" /> MFUMO WA MSIMAMIZI (ADMIN)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Msimamizi: {user?.fullName || 'ABDALLAH SAIDY'}
          </h2>
          <p className="text-purple-200 text-xs sm:text-sm mt-1">
            Dhibiti vyakula vya mgahawa, thibitisha malipo, na mgaie dereva (Delivery Staff) kila oda ya mteja.
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sasisha Takwimu</span>
        </button>
      </div>

      {/* Action alerts */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}
      {actionErrorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{actionErrorMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Jumla ya Mauzo</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              TSh {stats.totalSales.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">Kutoka kwenye oda zilizolipwa</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Zinazosubiri Dereva</span>
            <div className="text-xl sm:text-2xl font-black text-amber-500">
              {stats.pendingAssignment}
            </div>
            <span className="text-[11px] text-amber-700 font-semibold">Zinahitaji Admin kumteua dereva</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ziko Barabarani</span>
            <div className="text-xl sm:text-2xl font-black text-blue-600">
              {stats.activeDeliveries}
            </div>
            <span className="text-[11px] text-slate-500">Zinazoendelea kusafirishwa</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Wateja & Staff</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {stats.totalCustomers} / {stats.totalStaff}
            </div>
            <span className="text-[11px] text-slate-500">{stats.totalCustomers} Wateja • {stats.totalStaff} Madereva</span>
          </div>
        </div>
      )}

      {/* Tab Navigation Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Oda & Kumgawia Dereva (Orders & Assign)</span>
          {stats?.pendingAssignment > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-900">
              {stats.pendingAssignment}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('foods')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'foods'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Kusimamia Vyakula (Manage Menu)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Dhibiti Wateja & Delivery Staff</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>Matangazo & Marquee ({announcements.length})</span>
        </button>
      </div>

      {/* ----------------- TAB 1: ORDERS & ASSIGNMENT ----------------- */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Usimamizi wa Oda & Kugawa Dereva (Assign Order)
              </h3>
              <p className="text-xs text-slate-500">
                Baada ya mteja kulipa, Admin anachagua Delivery Staff wa kupeleka oda hiyo.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {orders.length} Oda Jumla
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Bado hakuna oda zilizowekwa. Wateja wakishaweka oda, zitatokea hapa mara moja.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4">Oda ID</th>
                    <th className="p-4">Mteja & Simu</th>
                    <th className="p-4">Vyakula Vilivyoagizwa</th>
                    <th className="p-4">Malipo & Njia</th>
                    <th className="p-4">Location (GPS)</th>
                    <th className="p-4">Hali (Status)</th>
                    <th className="p-4">Gawia Dereva (Assign Staff)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-mono font-bold text-purple-700 whitespace-nowrap">
                        #{order.id}
                        <span className="block text-[10px] text-slate-400 font-sans">{order.date} {order.time}</span>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">{order.customer.fullName}</div>
                        <a 
                          href={`tel:${order.customer.phone}`}
                          className="text-amber-700 font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" /> {order.customer.phone}
                        </a>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="font-medium text-slate-800 line-clamp-2">
                          {order.items.map(it => `${it.name} (${it.quantity})`).join(', ')}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} items
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="font-black text-slate-900 text-sm">
                          TSh {order.totalAmount.toLocaleString()}
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ✓ {order.paymentMethod}
                        </span>
                      </td>

                      <td className="p-4 max-w-sm">
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-900">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            ACTIVE CUSTOMER LOCATION
                          </span>
                          {order.customer.coords && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${order.customer.coords.lat},${order.customer.coords.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 underline flex items-center gap-0.5"
                            >
                              <span>Live GPS</span>
                            </a>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                          {order.customer.address}
                        </p>
                        {order.customer.coords && (
                          <p className="text-[10px] font-mono text-slate-500">
                            Lat: {order.customer.coords.lat.toFixed(4)}, Lng: {order.customer.coords.lng.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Out for Delivery'
                            ? 'bg-indigo-100 text-indigo-800'
                            : order.orderStatus === 'Assigned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* ASSIGNMENT CONTROLS */}
                      <td className="p-4 whitespace-nowrap">
                        {order.assignedStaff ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-blue-800 font-bold">
                              <Truck className="w-3.5 h-3.5" />
                              <span>{order.assignedStaff.fullName}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block font-mono">{order.assignedStaff.phone}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {staffList.length === 0 ? (
                              <span className="text-[11px] text-slate-400 italic">
                                Hakuna dereva aliyesajiliwa bado
                              </span>
                            ) : (
                              <>
                                <select
                                  value={selectedStaffForOrder[order.id] || ''}
                                  onChange={(e) => setSelectedStaffForOrder(prev => ({ ...prev, [order.id]: e.target.value }))}
                                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="">-- Chagua Dereva --</option>
                                  {staffList.map(st => (
                                    <option key={st.id} value={st.id}>
                                      {st.fullName} ({st.vehicle})
                                    </option>
                                  ))}
                                </select>

                                <button
                                  onClick={() => handleAssignOrder(order.id)}
                                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition"
                                >
                                  Assign Dereva
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 2: MANAGE FOODS ----------------- */}
      {activeTab === 'foods' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Kusimamia Vyakula, Vitafunwa na Vinywaji
              </h3>
              <p className="text-xs text-slate-500">
                Ongeza chakula kipya chenye picha na bei, rekebisha taarifa au ufute kwenye menu.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingFood(null);
                setFoodForm({ name: '', category: 'Foods', price: '', description: '', image: '', available: true });
                setShowFoodModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Ongeza Chakula Kipya</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {foods.map((food) => (
              <div key={food.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <img src={food.image} alt={food.name} className="h-36 w-full object-cover" />
                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">{food.category}</span>
                    <h4 className="font-bold text-slate-900 text-sm truncate">{food.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{food.description}</p>
                    <span className="font-black text-sm text-slate-900 block pt-1">TSh {food.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-slate-100 flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setEditingFood(food);
                      setFoodForm({
                        name: food.name,
                        category: food.category,
                        price: food.price,
                        description: food.description,
                        image: food.image,
                        available: food.available
                      });
                      setShowFoodModal(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                    title="Rekebisha"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                    title="Futa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: CUSTOMERS & DELIVERY STAFF MANAGEMENT ----------------- */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Delivery Staff Management (Requirement 2 & 3) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base uppercase tracking-tight flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Delivery Staff ({staffList.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Madereva waliojisajili au waliosajiliwa na Admin
                </p>
              </div>

              <button
                onClick={() => setShowStaffModal(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Sajili Dereva
              </button>
            </div>

            {staffList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl space-y-1">
                <Truck className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">Hakuna Delivery Staff aliyesajiliwa bado.</p>
                <p className="text-[11px] text-slate-400">
                  Madereva wanapojisajili wenyewe kwenye mfumo, taarifa zao zitaonekana hapa moja kwa moja.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {staffList.map((st) => (
                  <div key={st.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{st.fullName}</h4>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" /> {st.phone}
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-blue-600" /> {st.email}
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" /> {st.address}
                        </p>
                        <span className="text-[10px] text-slate-500 block font-mono">Chombo: {st.vehicle}</span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => handleToggleStaffStatus(st.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                            st.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          }`}
                          title="Bofya kubadilisha hali"
                        >
                          {st.status || 'Available'}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(st.id, st.fullName)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Futa dereva huyu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registered Customers Management (Requirement 2) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base uppercase tracking-tight flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Wateja Waliojisajili ({customersList.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Wateja wote waliojisajili wenyewe kwenye mfumo
                </p>
              </div>
            </div>

            {customersList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl space-y-1">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">Bado hakuna mteja aliyejisajili.</p>
                <p className="text-[11px] text-slate-400">
                  Mteja yeyote anapojisajili kwenye mfumo au kujaza taarifa zake, atatokea hapa.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customersList.map((cust) => (
                  <div key={cust.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{cust.fullName}</h4>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" /> {cust.phone}
                      </p>
                      {cust.email && (
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-blue-600" /> {cust.email}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate max-w-xs mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                        {cust.address}
                      </p>
                      <span className="text-[10px] font-mono text-amber-800 font-bold block mt-1">
                        @{cust.username}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteUser(cust.id, cust.fullName)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Futa mteja huyu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ----------------- TAB 4: ANNOUNCEMENTS & MARQUEE PROMOTIONS ----------------- */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-purple-600" />
                  <span>Kusimamia Matangazo na Marquee ya Juu</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Matangazo unayoweka hapa yanatokea mara moja kwenye mkanda wa maandishi unaotembea juu (Top Marquee) na kwenye banner ya dashibodi ya mteja.
                </p>
              </div>

              <button
                onClick={() => {
                  setAnnForm({ title: '', message: '', badge: 'OFA MAALUM' });
                  setShowAnnModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Weka Tangazo Jipya</span>
              </button>
            </div>

            {/* Live Marquee Preview */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
              <span className="text-[11px] font-extrabold uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Muonekano wa Sasa Kwenye Top Marquee Ticker:
              </span>
              <div className="p-3 bg-white rounded-lg border border-amber-300 shadow-xs text-xs font-bold text-slate-800 flex items-center gap-2 overflow-x-auto">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black uppercase whitespace-nowrap">
                  LIVE TICKER
                </span>
                <span className="text-slate-600 whitespace-nowrap">
                  {announcements.length > 0 
                    ? announcements.map(a => `[${a.badge}] ${a.title}: ${a.message}`).join(' • ')
                    : 'Hakuna tangazo la ziada lililowekwa (Inaonyesha matangazo msingi ya mgahawa).'}
                </span>
              </div>
            </div>

            {/* Announcements Grid */}
            {announcements.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs border border-dashed rounded-xl space-y-2">
                <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">Hakuna matangazo yaliyowekwa kwa sasa.</p>
                <p className="text-slate-400">Bonyeza "Weka Tangazo Jipya" ili kuweka ofa au taarifa kwa wateja.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-sm transition">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                          {ann.badge || 'TANGAZO'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {ann.date}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base leading-snug">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ann.message}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Inaonekana Moja kwa Moja
                      </span>

                      <button
                        onClick={() => handleDeleteAnn(ann.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-1 border border-red-200"
                        title="Futa tangazo hili"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Futa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT FOOD ITEM */}
      {showFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase">
                {editingFood ? 'Rekebisha Chakula' : 'Ongeza Chakula Kipya'}
              </h3>
              <button onClick={() => setShowFoodModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFoodSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jina la Chakula / Kinywaji:</label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Biryani ya Kuku"
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategoria:</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Foods">Foods (Chakula)</option>
                    <option value="Snacks">Snacks (Vitafunwa)</option>
                    <option value="Drinks">Drinks (Vinywaji)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bei (TSh):</label>
                  <input
                    type="number"
                    required
                    placeholder="12000"
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Picha URL:</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={foodForm.image}
                  onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Maelezo Mafupi:</label>
                <textarea
                  rows={2}
                  placeholder="Viungo, uzuri wake..."
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowFoodModal(false)}
                  className="px-4 py-2 rounded-xl border font-bold text-slate-600 hover:bg-slate-50"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  Hifadhi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW DELIVERY STAFF (ADMIN FORM) */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase">
                Sajili Delivery Staff Mpya
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jina Kamili (fullName): <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Rashid Kassim"
                  value={staffForm.fullName}
                  onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Namba ya Simu (phoneNumber): <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="0754 889 900"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Barua Pepe (Email - LAZIMA): <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="rashid@example.com"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Anwani ya Makazi (Address): <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Kariakoo, Dar es Salaam"
                  value={staffForm.address}
                  onChange={(e) => setStaffForm({ ...staffForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nenosiri (password): <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    required
                    placeholder="••••••"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chombo cha Usafiri:</label>
                  <input
                    type="text"
                    placeholder="Boxer MC - MC 123 ABC"
                    value={staffForm.vehicle}
                    onChange={(e) => setStaffForm({ ...staffForm, vehicle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 rounded-xl border font-bold text-slate-600 hover:bg-slate-50"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Sajili Dereva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WEKA TANGAZO JIPYA (ANNOUNCEMENT) */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-600" />
                <span>Weka Tangazo Jipya (Announcement)</span>
              </h3>
              <button
                onClick={() => setShowAnnModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAnnSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Aina ya Kibandiko (Badge):</label>
                <div className="flex flex-wrap gap-2">
                  {['OFA MAALUM', 'TAARIFA MUHIMU', 'CHAKULA KIPYA', 'PUNGUZO LA BEI', 'HUDUMA'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setAnnForm({ ...annForm, badge: b })}
                      className={`px-3 py-1.5 rounded-lg font-extrabold text-[10px] tracking-wider transition ${
                        annForm.badge === b
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kichwa cha Habari (Title): <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: OFA YA PILAU NA BIRYANI WIKI HII!"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Maelezo ya Tangazo (Message): <span className="text-red-500">*</span></label>
                <textarea
                  rows="3"
                  required
                  placeholder="Mfano: Pata punguzo la 20% kwa oda zote zinazozidi TSh 25,000 leo! Usafirishaji wa haraka kwa GPS popote ulipo."
                  value={annForm.message}
                  onChange={(e) => setAnnForm({ ...annForm, message: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-4 py-2 rounded-xl border font-bold text-slate-600 hover:bg-slate-50"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  Chapisha Tangazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
