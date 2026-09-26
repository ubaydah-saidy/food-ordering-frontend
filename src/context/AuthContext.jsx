import React, { createContext, useContext, useState, useEffect } from 'react';
import { restaurantService } from '../services/restaurantApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load initial user: No dummy users! If old 'amina' or 'juma' found, clear it.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('restaurant_user_v2');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('restaurant_user');
      return null;
    } catch {
      return null;
    }
  });

  // Global detected location state (locked GPS)
  const [detectedLocation, setDetectedLocation] = useState({
    loading: false,
    coords: null,
    address: '',
    accuracy: null,
    detectedAt: null,
    error: null
  });

  // Detect GPS Location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    restaurantService.currentUser()
      .then((sessionUser) => {
        setUser(sessionUser);
        localStorage.setItem('restaurant_user_v2', JSON.stringify(sessionUser));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('restaurant_user_v2');
      });
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setDetectedLocation(prev => ({
        ...prev,
        error: 'Kifaa chako hakiruhusu utambuzi wa GPS moja kwa moja.'
      }));
      return;
    }

    setDetectedLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        let resolvedAddress = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || '';
            const road = addr.road || '';
            const city = addr.city || addr.town || addr.state || 'Dar es Salaam';
            const parts = [road, suburb, city].filter(Boolean);
            if (parts.length > 0) {
              resolvedAddress = parts.join(', ');
            } else if (data.display_name) {
              resolvedAddress = data.display_name.split(',').slice(0, 3).join(', ');
            }
          }
        } catch {
          resolvedAddress = `Eneo la GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        }

        const newLocation = {
          loading: false,
          coords: { lat, lng },
          address: resolvedAddress,
          accuracy,
          detectedAt: new Date().toLocaleTimeString(),
          error: null
        };

        setDetectedLocation(newLocation);

        if (user && user.role === 'customer') {
          const updatedUser = { ...user, address: resolvedAddress, coords: { lat, lng } };
          setUser(updatedUser);
          localStorage.setItem('restaurant_user_v2', JSON.stringify(updatedUser));
        }
      },
      (err) => {
        console.warn('GPS location fallback used:', err.message);
        setDetectedLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Tafadhali ruhusu Location kwenye kivinjari chako ili GPS itambue eneo lako kiotomatiki.'
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const login = async (usernameOrPhone, password, role) => {
    const res = await restaurantService.login(usernameOrPhone, password, role);
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('restaurant_user_v2', JSON.stringify(res.user));
    }
    return res;
  };

  const registerCustomer = async (formData) => {
    const res = await restaurantService.registerCustomer({
      ...formData,
      address: detectedLocation.address,
      coords: detectedLocation.coords
    });
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('restaurant_user_v2', JSON.stringify(res.user));
    }
    return res;
  };

  const registerDeliveryStaff = async (formData) => {
    const res = await restaurantService.registerDeliveryStaff(formData);
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('restaurant_user_v2', JSON.stringify(res.user));
    }
    return res;
  };

  const saveOrUpdateProfile = async (profileData) => {
    const res = await restaurantService.saveOrUpdateCustomerProfile(user?.id, {
      ...profileData,
      address: detectedLocation.address,
      coords: detectedLocation.coords
    });
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('restaurant_user_v2', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    await restaurantService.logout();
    setUser(null);
    localStorage.removeItem('restaurant_user_v2');
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      registerCustomer,
      registerDeliveryStaff,
      saveOrUpdateProfile,
      logout,
      detectedLocation,
      detectLocation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
