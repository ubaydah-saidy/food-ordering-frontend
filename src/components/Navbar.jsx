import React from 'react';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  MapPin, 
  User, 
  ShieldCheck, 
  Truck, 
  LogIn, 
  LogOut,
  RefreshCw,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({ currentPortal, setCurrentPortal, currentTab, setCurrentTab, onOpenAuthModal }) => {
  const { user, logout, detectedLocation, detectLocation } = useAuth();
  const { totalCount, totalAmount } = useCart();

  const handlePortalSwitch = (portal) => {
    if (portal === 'admin') {
      if (user && user.role === 'admin') {
        setCurrentPortal('admin');
      } else {
        onOpenAuthModal('admin');
      }
    } else if (portal === 'delivery') {
      if (user && user.role === 'delivery') {
        setCurrentPortal('delivery');
      } else {
        onOpenAuthModal('delivery');
      }
    } else {
      setCurrentPortal('customer');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Restaurant Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer flex-shrink-0" 
            onClick={() => { setCurrentPortal('customer'); setCurrentTab('dashboard'); }}
          >
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
              <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  OUR RESTAURANT
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-amber-700 tracking-wide">
                FOOD ORDERING MANAGEMENT SYSTEM
              </p>
            </div>
          </div>

          {/* ALL 3 DASHBOARDS PROMINENTLY POSITIONED AT THE TOP (Requirement 4) */}
          <div className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            
            {/* 1. CUSTOMER DASHBOARD */}
            <button
              onClick={() => handlePortalSwitch('customer')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                currentPortal === 'customer'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <User className="w-4 h-4" />
              <span>CUSTOMER</span>
            </button>

            {/* 2. DELIVERY STAFF DASHBOARD */}
            <button
              onClick={() => handlePortalSwitch('delivery')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                currentPortal === 'delivery'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>DELIVERY</span>
            </button>

            {/* 3. ADMIN DASHBOARD (Isolated & Secured) */}
            <button
              onClick={() => handlePortalSwitch('admin')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                currentPortal === 'admin'
                  ? 'bg-purple-900 text-white shadow-md shadow-purple-950/40 ring-2 ring-purple-500'
                  : 'text-purple-800 hover:text-purple-950 hover:bg-purple-100/70'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>ADMIN</span>
              <Lock className="w-3 h-3 text-amber-400 ml-0.5 opacity-80" />
            </button>

          </div>

          {/* Right Action Controls: Cart, GPS, Profile / Login */}
          <div className="flex items-center gap-3">
            
            {/* Quick Cart Button (Only in Customer mode) */}
            {currentPortal === 'customer' && (
              <button
                onClick={() => setCurrentTab('updates-orders')}
                className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition shadow-xs"
                title="View Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-amber-700" />
                  {totalCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-extrabold text-white bg-red-600 rounded-full ring-2 ring-white animate-bounce">
                      {totalCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block text-left text-xs font-semibold">
                  <span className="text-amber-800">Cart</span>
                  <span className="block text-[11px] text-amber-600 font-bold">TZS {totalAmount.toLocaleString()}</span>
                </div>
              </button>
            )}

            {/* Profile Avatar / Log In */}
            {user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <span className="block text-xs font-black text-slate-900 leading-tight">{user.fullName}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                    {user.role}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-2 border-amber-400 shadow-sm">
                  {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <button
                  onClick={logout}
                  title="Sign Out / Log out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuthModal(currentPortal === 'admin' ? 'admin' : currentPortal === 'delivery' ? 'delivery' : 'customer')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};
