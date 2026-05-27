/* eslint-disable no-unused-vars */
// MAKE SURE YOUR REAL API KEY IS HERE!
const API_KEY = '8fac7c1f77c2eb5602218e83bb6bf953'; 
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const tmdb = {
  getDetails: async (type, id) => {
    try {
      const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
      return await response.json();
    } catch (err) { return null; }
  },
  
  // Notice the new "page = 1" parameter and "&page=${page}" in the URLs below!
  search: async (query, type = 'movie', page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
      const data = await response.json();
      return data.results;
    } catch (err) { return []; }
  },
  getTrending: async (type = 'movie', page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}&page=${page}`);
      const data = await response.json();
      return data.results;
    } catch (err) { return []; }
  },
  getLatestMovies: async (page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`);
      const data = await response.json();
      return data.results;
    } catch (err) { return []; }
  },
  getLatestTv: async (page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=${page}`);
      const data = await response.json();
      return data.results;
    } catch (err) { return []; }
  },
  getAnime: async (page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_original_language=ja&page=${page}`);
      const data = await response.json();
      return data.results;
    } catch (err) { return []; }
  },
  // NEW: Fetch videos (trailers, teasers, etc.)
  getVideos: async (type, id) => {
    try {
      const response = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
      const data = await response.json();
      return data.results;
    } catch (err) { return []; }
  },
  getTopRated: async (page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
      const data = await response.json();
      return data.results;
    } catch (err) { return []; }
  }
};