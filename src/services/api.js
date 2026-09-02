const API_BASE_URL = '/api';

export const getAuthHeader = () => {
  const userStr = localStorage.getItem('goldmart_user');
  if (!userStr) return {};
  try {
    const user = JSON.parse(userStr);
    return user.token ? { Authorization: `Bearer ${user.token}` } : {};
  } catch (e) {
    return {};
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  // If formData is sent, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API Request failed');
    }
    return data;
  } catch (err) {
    console.warn(`[API] ${endpoint} fetch warning:`, err.message);
    throw err;
  }
};
