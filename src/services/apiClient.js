const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = data.details && typeof data.details === 'object'
      ? Object.entries(data.details)
          .map(([field, message]) => `${field}: ${message}`)
          .join('; ')
      : '';
    const message = data.error
      ? `${data.error}${details ? `: ${details}` : ''}`
      : `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data.details;
    throw error;
  }
  return data;
}

export const apiGet = (path) => apiRequest(path);
export const apiPost = (path, body) => apiRequest(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (path, body) => apiRequest(path, { method: 'PUT', body: JSON.stringify(body) });
export const apiPatch = (path, body) => apiRequest(path, { method: 'PATCH', body: JSON.stringify(body) });
export const apiDelete = (path) => apiRequest(path, { method: 'DELETE' });