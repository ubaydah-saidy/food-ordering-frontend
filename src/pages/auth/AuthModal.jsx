import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  UserPlus,
  LogIn,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, initialRole = 'customer', onLoginSuccess }) => {
  if (!isOpen) return null;

  const { login, registerCustomer, registerDeliveryStaff, detectedLocation } = useAuth();
  const [activeRole, setActiveRole] = useState(initialRole); // 'customer', 'delivery', 'admin'
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Common Login form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Customer Register form states
  const [custFullName, setCustFullName] = useState('');
  const [custUsername, setCustUsername] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');

  // Delivery Staff Register form states (Requirement 3: phoneNumber, fullName, Email [MANDATORY], password, Address)
  const [staffFullName, setStaffFullName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffAddress, setStaffAddress] = useState('');
  const [staffVehicle, setStaffVehicle] = useState('Motorcycle (Boxer MC / TVS)');

  // Loading & alerts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(loginIdentifier, loginPassword, activeRole);
    setLoading(false);

    if (res.success) {
      if (onLoginSuccess) onLoginSuccess(activeRole);
      onClose();
    } else {
      setError(res.error || 'Invalid login credentials. Please verify and try again.');
    }
  };

  // Handle Customer Self-Registration
  const handleCustomerRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (custPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);

    const res = await registerCustomer({
      fullName: custFullName,
      username: custUsername,
      phone: custPhone,
      email: custEmail,
      password: custPassword
    });

    setLoading(false);
    if (res.success) {
      setSuccessMsg('Congratulations! Customer account registered successfully. You are now logged in.');
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess('customer');
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to complete registration.');
    }
  };

  // Handle Delivery Staff Self-Registration
  const handleStaffRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (staffPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Strict validation: Email is strictly mandatory!
    if (!staffEmail.trim()) {
      setError('Email Address is MANDATORY for Delivery Staff registration.');
      return;
    }

    setLoading(true);
    const res = await registerDeliveryStaff({
      fullName: staffFullName,
      phone: staffPhone,
      email: staffEmail,
      password: staffPassword,
      address: staffAddress,
      vehicle: staffVehicle
    });

    setLoading(false);
    if (res.success) {
      setSuccessMsg('Congratulations! Delivery Staff account registered successfully.');
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess('delivery');
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to complete registration.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 my-6">
        
        {/* Header - ENGLISH LANGUAGE ONLY (Requirement 5) */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1 text-center">
            <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
              OUR RESTAURANT AUTHENTICATION
            </span>
            <h3 className="text-xl font-black">
              {isRegisterMode 
                ? (activeRole === 'delivery' ? 'Register Delivery Staff' : 'Customer Sign Up')
                : (activeRole === 'admin' ? 'Secure Admin Gateway' : `Sign In: ${activeRole.toUpperCase()}`)
              }
            </h3>
            <p className="text-xs text-slate-300">
              {isRegisterMode 
                ? 'Create your account to access our food platform'
                : 'Select your designated portal to continue'
              }
            </p>
          </div>

          {/* Role Tabs: IN REGISTRATION, ONLY CUSTOMER AND DELIVERY ARE ALLOWED (Requirement 3) */}
          <div className="mt-5">
            {isRegisterMode ? (
              <div className="grid grid-cols-2 gap-2 bg-white/10 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setActiveRole('customer'); setError(''); }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    activeRole === 'customer'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer Sign Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole('delivery'); setError(''); }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    activeRole === 'delivery'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delivery Sign Up</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5 bg-white/10 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setActiveRole('customer'); setError(''); }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                    activeRole === 'customer'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>CUSTOMER</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole('delivery'); setError(''); }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                    activeRole === 'delivery'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>DELIVERY</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveRole('admin'); setLoginIdentifier(''); setLoginPassword(''); setError(''); }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                    activeRole === 'admin'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="flex items-center gap-0.5">
                    <span>ADMIN</span>
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body - ENGLISH LANGUAGE ONLY (Requirement 5) */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ---------------- 1. HIGH SECURITY ADMIN GATEWAY (Requirement 1 & 3) ---------------- */}
          {activeRole === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/5 border-2 border-purple-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-xs">
                    <ShieldAlert className="w-4 h-4 text-purple-700" />
                    <span>RESTRICTED ACCESS PORTAL</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-200 text-purple-900">
                    LEVEL 5 SECURITY
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  This gateway is restricted to provisioned administrators. Public registration is disabled.
                </p>
                <div className="pt-1 flex items-center justify-between border-t border-purple-200/80">
                  <span className="text-[11px] font-mono text-purple-900 font-bold">Authorized administrators only</span>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admin Username:</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Admin username"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Security Password:</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{loading ? 'Authenticating...' : 'Authorize & Enter Admin Panel'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ---------------- 2. CUSTOMER PORTAL (SIGN IN OR SIGN UP) ---------------- */}
          {activeRole === 'customer' && (
            <>
              {!isRegisterMode ? (
                /* Customer Sign In */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Username or Phone Number:
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your username or phone"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password:
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Signing In...' : 'Sign In as Customer'}</span>
                    <LogIn className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsRegisterMode(true); setError(''); }}
                        className="font-bold text-amber-600 hover:underline"
                      >
                        Sign Up Here
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* Customer Self-Registration Form */
                <form onSubmit={handleCustomerRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Peter"
                      value={custFullName}
                      onChange={(e) => setCustFullName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Username: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="john2026"
                        value={custUsername}
                        onChange={(e) => setCustUsername(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="At least 8 characters"
                        maxLength={100}
                        value={custPassword}
                        onChange={(e) => setCustPassword(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0712 345 678"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700">Email Address:</label>
                      <span className="text-[10px] text-slate-400">(Optional)</span>
                    </div>
                    <input
                      type="email"
                      placeholder="john@example.com (optional)"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Auto-detected GPS location preview */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    <span className="font-bold flex items-center gap-1 text-slate-800">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      Active GPS Location (Auto-detected):
                    </span>
                    <span className="font-mono text-slate-600 truncate block mt-0.5">
                      {detectedLocation.address}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition mt-2 flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{loading ? 'Registering...' : 'Complete Customer Sign Up'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsRegisterMode(false); setError(''); }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      ← Already have an account? Sign In
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ---------------- 3. DELIVERY STAFF PORTAL (SIGN IN OR REGISTER) ---------------- */}
          {activeRole === 'delivery' && (
            <>
              {!isRegisterMode ? (
                /* Delivery Staff Sign In */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email, Phone or Username:
                    </label>
                    <div className="relative">
                      <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Enter email or phone number"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password:
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Signing In...' : 'Sign In as Delivery Staff'}</span>
                    <LogIn className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Are you a new delivery driver?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsRegisterMode(true); setError(''); }}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Register as Delivery Staff
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* Delivery Staff Registration:
                   phoneNumber, fullName, Email (MANDATORY), password, Address, vehicle (Requirement 3) */
                <form onSubmit={handleStaffRegister} className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 font-medium">
                    Official Delivery Personnel Registration. All credentials will be verified.
                  </div>

                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name (fullName): <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Ally"
                      value={staffFullName}
                      onChange={(e) => setStaffFullName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 2. Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (phoneNumber): <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0754 889 900"
                      value={staffPhone}
                      onChange={(e) => setStaffPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 3. Email (MANDATORY FOR DELIVERY STAFF) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Email Address: <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        Mandatory
                      </span>
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="david.delivery@example.com (Required)"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 4. Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 8 characters"
                      maxLength={100}
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 5. Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Residential / Base Address: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mwenge, Dar es Salaam"
                      value={staffAddress}
                      onChange={(e) => setStaffAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 6. Vehicle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vehicle Type & Plate Number:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Boxer MC - MC 432 ABC"
                      value={staffVehicle}
                      onChange={(e) => setStaffVehicle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition mt-2 flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{loading ? 'Submitting...' : 'Register Delivery Staff Account'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsRegisterMode(false); setError(''); }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      ← Already registered? Sign In
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
