import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Utensils, 
  ClipboardList, 
  ShoppingCart, 
  UserCheck, 
  MoreHorizontal, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Sidebar = ({ currentTab, setCurrentTab, onOpenAuthModal }) => {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();

  // Menu items exactly as drawn in sketch Page 3
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'my-bill',
      label: 'My bill',
      icon: Receipt,
      badge: null
    },
    {
      id: 'foods-drinks-snacks',
      label: 'Foods & Drinks & Snacks',
      icon: Utensils,
      badge: null
    },
    {
      id: 'my-orders',
      label: 'My Orders',
      icon: ClipboardList,
      badge: null
    },
    {
      id: 'updates-orders',
      label: 'Updates orders',
      icon: ShoppingCart,
      badge: totalCount > 0 ? totalCount : null
    },
    {
      id: 'personal-info',
      label: 'Personal information',
      icon: UserCheck,
      badge: null
    },
    {
      id: 'others',
      label: 'Others',
      icon: MoreHorizontal,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-7rem)] p-5 flex flex-col justify-between shadow-xs">
      <div className="space-y-6">
        
        {/* Sketch Title Box: "MENU:" */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="text-xs font-black tracking-widest text-slate-500 uppercase">
            MENU:
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-500" /> Fresh Cuisine
          </span>
        </div>

        {/* Primary Sketch Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive 
                    ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/25 translate-x-1' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive ? 'bg-white text-amber-700' : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Logout button (matching Page 3: "Log out") */}
      <div className="pt-4 border-t border-slate-200">
        {user ? (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenAuthModal('customer')}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-sm bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition"
          >
            <span>Sign In / Log in</span>
          </button>
        )}
      </div>

    </aside>
  );
};
