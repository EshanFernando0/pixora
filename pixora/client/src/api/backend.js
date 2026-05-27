const BASE_URL = 'http://localhost:5000/api';
/* eslint-disable no-unused-vars */

// Helper function to get the token securely from local storage
const getToken = () => localStorage.getItem('pixora_token');

export const backendAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    } catch (err) {
      return { error: "Cannot connect to server" };
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      return await response.json();
    } catch (err) {
      return { error: "Cannot connect to server" };
    }
  },

  anonymousLogin: async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/anonymous`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    } catch (err) {
      return { error: "Cannot connect to server" };
    }
  },

  // --- SECURED REQUESTS (Sending the Authorization Header) ---

  getWatchlist: async () => {
    const token = getToken();
    if (!token) return [];
    try {
      const response = await fetch(`${BASE_URL}/watchlist`, {
        headers: { 'Authorization': token }
      });
      return await response.json();
    } catch (err) {
      return [];
    }
  },

  addToWatchlist: async (tmdb_id, media_type) => {
    const token = getToken();
    if (!token) return { error: "Not logged in" };
    try {
      const response = await fetch(`${BASE_URL}/watchlist`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        },
        body: JSON.stringify({ tmdb_id, media_type })
      });
      return await response.json();
    } catch (err) {
      return { error: "Network error" };
    }
  },

  removeFromWatchlist: async (tmdb_id) => {
    const token = getToken();
    if (!token) return { error: "Not logged in" };
    try {
      const response = await fetch(`${BASE_URL}/watchlist/${tmdb_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      return await response.json();
    } catch (err) {
      return { error: "Network error" };
    }
  }
};