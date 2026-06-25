const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fetchClient = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;
  
  const headers = {
    'x-requested-with': 'XMLHttpRequest',
    ...options.headers,
  };

  if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
          headers['Authorization'] = `Bearer ${token}`;
      }
  }

  // If the body is FormData, DO NOT set Content-Type manually.
  // The browser will automatically set it to multipart/form-data with the correct boundary.
  if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
  } else if (options.body instanceof FormData) {
      // Remove manual Content-Type if present to let the browser handle the boundary
      if (headers['Content-Type']) {
          delete headers['Content-Type'];
      }
      // axios often passes headers with lowercase keys in user code, handle that as well
      if (headers['content-type']) {
          delete headers['content-type'];
      }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // equivalent to withCredentials: true
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null; // Some endpoints might not return JSON
  }

  if (!response.ok) {
    const error = new Error(data?.message || response.statusText);
    error.response = { status: response.status, data };
    throw error;
  }

  return { data, status: response.status, headers: response.headers };
};

const api = {
  get: (url, config) => fetchClient(url, { method: 'GET', ...config }),
  post: (url, data, config) => fetchClient(url, { method: 'POST', body: data, ...config }),
  put: (url, data, config) => fetchClient(url, { method: 'PUT', body: data, ...config }),
  delete: (url, config) => fetchClient(url, { method: 'DELETE', ...config }),
};

export default api;
