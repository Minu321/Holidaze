const API_BASE_URL = 'https://v2.api.noroff.dev';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = localStorage.getItem('accessToken');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': import.meta.env.VITE_API_KEY,
  };

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'An error occurred');
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export const authApi = {
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

export const profileApi = {
  getProfile: (name) => apiRequest(`/holidaze/profiles/${name}`),
  updateProfile: (name, data) => apiRequest(`/holidaze/profiles/${name}`, { 
    method: 'PUT', 
    body: JSON.stringify(data)
  }),
  getUserVenues: (username) => apiRequest(`/holidaze/profiles/${username}/venues`),
};

export const venueApi = {
  getVenues: () => apiRequest('/holidaze/venues'),
  getVenue: (id) => apiRequest(`/holidaze/venues/${id}`),
  createVenue: async (data) => {
    try {
      const response = await apiRequest('/holidaze/venues', { 
        method: 'POST', 
        body: JSON.stringify(data)
      });
      
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating venue:', error);
      throw error;
    }
  },
  updateVenue: (id, data) => apiRequest(`/holidaze/venues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVenue: (id) => apiRequest(`/holidaze/venues/${id}`, { method: 'DELETE' }),
};

export const bookingApi = {
  getBookings: () => apiRequest('/holidaze/bookings'),
  createBooking: (data) => apiRequest('/holidaze/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getUserBookings: (username) => apiRequest(`/holidaze/profiles/${username}/bookings?_venue=true&_customer=true`),
};