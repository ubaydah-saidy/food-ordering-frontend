import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Lock, 
  KeyRound, 
  Mail, 
  Phone, 
  Check, 
  AlertCircle, 
  Camera, 
  RefreshCw,
  ShieldCheck,
  Navigation,
  UserCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PersonalInfo = () => {
  const { user, saveOrUpdateProfile, detectedLocation, detectLocation } = useAuth();

  // Clean empty inputs - NO hardcoded dummy person name or photo!
  const [username, setUsername] = useState(user?.username || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Tafadhali jaza Jina lako Kamili (Full Name).');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Tafadhali jaza Namba yako ya Simu (Phone Number).');
      return;
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setErrorMsg('Nenosiri jipya na uthibitisho havilingani!');
        return;
      }
      if (newPassword.length < 4) {
        setErrorMsg('Nenosiri jipya lazima liwe na angalau herufi 4.');
        return;
      }
    }

    setIsSaving(true);

    try {
      const res = saveOrUpdateProfile({
        username: username.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar,
        oldPassword,
        newPassword
      });

      if (!res.success) {
        throw new Error(res.error || 'Hitilafu imetokea wakati wa kuhifadhi.');
      }

      setSuccessMsg(res.message || 'Taarifa zako zimehifadhiwa kwa mafanikio!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header matching Page 7 sketch: "Personal Information" */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Jaza taarifa zako binafsi za mteja, anwani iliyogunduliwa na GPS, na nenosiri lako.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          Ukurasa wa 7
        </span>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold animate-fade-in">
          <Check className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        
        {/* Profile Circle & "Change profile" matching sketch: Clean Neutral Placeholder without dummy person's picture! */}
        <div className="flex flex-col items-center justify-center space-y-3 pb-6 border-b border-slate-100">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-dashed border-amber-300 flex items-center justify-center text-slate-400 shadow-inner">
                <UserCircle2 className="w-16 h-16 text-slate-300" />
              </div>
            )}
            <label 
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow cursor-pointer transition"
              title="Weka picha yako"
            >
              <Camera className="w-4 h-4" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setAvatar(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div className="text-center space-y-0.5">
            <p className="text-sm font-bold text-slate-800">Change profile</p>
            <p className="text-[11px] text-slate-400">
              {avatar ? 'Picha imewekwa' : 'Hujaweka picha (hiari - bofya kamera kuchagua picha yako)'}
            </p>
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar('')}
                className="text-[10px] text-red-600 underline font-semibold mt-1"
              >
                Ondoa picha
              </button>
            )}
          </div>
        </div>

        {/* Form Inputs matching sketch Page 7 - ALL EMPTY FOR USER TO FILL */}
        <div className="space-y-4">
          
          {/* @Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              @Username :
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-bold">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Weka username yako (mfano: john2026)"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full name : <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Weka jina lako kamili"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
            />
          </div>

          {/* Email (Optional as instructed: "email yake ikiwa anayo kama hana sio lazima") */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Email :
              </label>
              <span className="text-[10px] text-slate-400 font-medium">(Sio lazima kama huna)</span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Weka barua pepe yako (hiari)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone : <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Weka namba yako ya simu (mfano: 0712 345 678 au 0754...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Address / GPS Auto-detected Location (STRICTLY LOCKED READ-ONLY AS REQUESTED) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Address (GPS Location) :</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                <Lock className="w-3 h-3" /> Imefungwa (Read-only)
              </span>
            </div>

            {/* Readonly locked input */}
            <div className="relative">
              <input
                type="text"
                readOnly
                disabled
                value={detectedLocation.address || 'Inagundua eneo lako kwa GPS...'}
                className="w-full pl-4 pr-24 py-2.5 rounded-xl border-2 border-rose-200 bg-rose-50/50 text-slate-900 font-medium text-xs sm:text-sm cursor-not-allowed select-none"
              />
              <button
                type="button"
                onClick={detectLocation}
                disabled={detectedLocation.loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50 transition shadow-xs"
                title="Bofya ili kutambua GPS upya"
              >
                <RefreshCw className={`w-3 h-3 ${detectedLocation.loading ? 'animate-spin' : ''}`} />
                <span>Detect</span>
              </button>
            </div>

            <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-rose-700 bg-rose-50/80 p-2.5 rounded-xl border border-rose-200">
              <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Kumbuka:</strong> Eneo hili linatambuliwa na GPS kiotomatiki na huwezi kulibadilisha kwa mkono, ili kuhakikisha chakula kinakufikia mahali ulipo kwa uhakika 100%.
              </span>
            </div>

            {/* Coordinates Badge */}
            {detectedLocation.coords && (
              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <Navigation className="w-3 h-3 text-slate-400" />
                <span>Lat: {detectedLocation.coords.lat?.toFixed(5)}</span>
                <span>•</span>
                <span>Lng: {detectedLocation.coords.lng?.toFixed(5)}</span>
              </div>
            )}
          </div>

        </div>

        {/* Password Section matching sketch Page 7 */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Password :
            </h3>
          </div>

          <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-amber-200">
            {user && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Old Password :
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Weka nenosiri la sasa (kama unataka kubadilisha)"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
                />
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New password :
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Weka nenosiri"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm password :
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Thibitisha nenosiri"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Action Button: [ SAVE ] exactly as drawn on Page 7 sketch */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-10 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 font-black text-sm text-white shadow-lg shadow-amber-500/25 transition disabled:opacity-50"
          >
            {isSaving ? 'Inahifadhi...' : 'SAVE'}
          </button>
        </div>

      </form>

    </div>
  );
};
