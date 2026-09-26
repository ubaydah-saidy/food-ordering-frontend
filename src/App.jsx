import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TopMarquee } from './components/TopMarquee';
import { BackendConnectionStatus } from './components/BackendConnectionStatus';

// Customer pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MyBills } from './pages/customer/MyBills';
import { FoodsDrinksSnacks } from './pages/customer/FoodsDrinksSnacks';
import { MyOrders } from './pages/customer/MyOrders';
import { UpdateOrdersCart } from './pages/customer/UpdateOrdersCart';
import { PersonalInfo } from './pages/customer/PersonalInfo';
import { OthersPage } from './pages/customer/OthersPage';

// Admin & Delivery Dashboards
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';

// English Auth Modal with Admin High Security Gateway
import { AuthModal } from './pages/auth/AuthModal';

function MainApp() {
  const { user } = useAuth();
  
  // 3 Primary Portals at the TOP (Requirement 4)
  const [currentPortal, setCurrentPortal] = useState('customer'); // 'customer' | 'delivery' | 'admin'
  
  // Tab within customer portal (sketch Page 3)
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('customer');

  const openAuthModal = (role = 'customer') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (role) => {
    if (role === 'admin') {
      setCurrentPortal('admin');
    } else if (role === 'delivery') {
      setCurrentPortal('delivery');
    } else {
      setCurrentPortal('customer');
      setCurrentTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <BackendConnectionStatus />
      
      {/* 1. TOP ATTRACTIVE RUNNING MARQUEE TICKER (Requirement 7) */}
      <TopMarquee />

      {/* 2. TOP HEADER WITH ALL 3 PORTALS: CUSTOMER, DELIVERY, ADMIN (Requirement 4) */}
      <Navbar 
        currentPortal={currentPortal}
        setCurrentPortal={setCurrentPortal}
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenAuthModal={openAuthModal} 
      />

      {/* 3. CONDITIONAL MAIN BODY */}
      
      {/* A. ISOLATED ADMIN PORTAL (Requirement 1: Admin on dedicated dashboard alone) */}
      {currentPortal === 'admin' ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
          <AdminDashboard />
        </div>
      ) : currentPortal === 'delivery' ? (
        /* B. DELIVERY STAFF PORTAL */
        <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
          <DeliveryDashboard />
        </div>
      ) : (
        /* C. CUSTOMER PORTAL WITH PAGE 3 SKETCH SIDEBAR */
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          
          {/* Left Sidebar matching sketch Page 3 MENU */}
          <Sidebar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            onOpenAuthModal={openAuthModal} 
          />

          {/* Dynamic Page Content for Customer */}
          <main className="flex-1 p-6 lg:p-8 min-w-0">
            
            {/* Dashboard (Page 3) */}
            {currentTab === 'dashboard' && (
              <CustomerDashboard onNavigateToCart={() => setCurrentTab('updates-orders')} />
            )}

            {/* My Bills (Page 6) */}
            {currentTab === 'my-bill' && (
              <MyBills 
                onOrderSuccess={() => setCurrentTab('my-orders')}
                onCancel={() => setCurrentTab('dashboard')}
              />
            )}

            {/* Foods & Drinks & Snacks Catalog */}
            {currentTab === 'foods-drinks-snacks' && (
              <FoodsDrinksSnacks />
            )}

            {/* My Orders (Page 4) */}
            {currentTab === 'my-orders' && (
              <MyOrders onNavigateToMenu={() => setCurrentTab('dashboard')} />
            )}

            {/* Updates orders / Carts (Page 5) */}
            {currentTab === 'updates-orders' && (
              <UpdateOrdersCart 
                onProceedToBills={() => setCurrentTab('my-bill')}
                onNavigateToOrders={() => setCurrentTab('my-orders')}
              />
            )}

            {/* Personal Information (Page 7) */}
            {currentTab === 'personal-info' && (
              <PersonalInfo />
            )}

            {/* Others (Page 8) */}
            {currentTab === 'others' && (
              <OthersPage />
            )}

          </main>
        </div>
      )}

      {/* 4. ENGLISH-ONLY AUTH MODAL WITH ADMIN SECURITY GATEWAY (Requirement 3 & 5) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
