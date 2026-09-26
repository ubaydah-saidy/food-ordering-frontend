import React, { useEffect, useState } from 'react';
import { apiGet } from '../services/apiClient';

export const BackendConnectionStatus = () => {
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    apiGet('/health')
      .then(() => { if (active) setIsUnavailable(false); })
      .catch(() => { if (active) setIsUnavailable(true); });
    return () => { active = false; };
  }, []);

  if (!isUnavailable) return null;

  return (
    <div role="alert" className="border-b border-red-300 bg-red-50 px-4 py-2 text-center text-xs font-semibold text-red-800">
      Backend is unavailable. Start Spring Boot and check the MySQL connection to load menu, account, cart, and order data.
    </div>
  );
};