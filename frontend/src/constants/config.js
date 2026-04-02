/**
 * App Configuration
 * Environment-specific configuration
 */

export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? 'http://localhost:8000' : 'https://api.clownapp.fun'),
  
  // Pagination
  POSTS_PER_PAGE: 20,
  SEARCH_DEBOUNCE_MS: 300,
  
  // Cache TTL (in milliseconds)
  CACHE_TTL: {
    USER_DATA: 5 * 60 * 1000, // 5 minutes
    FOLLOWING_LIST: 10 * 60 * 1000, // 10 minutes
    FOLLOWERS_LIST: 10 * 60 * 1000, // 10 minutes
  },
  
  // Socket
  SOCKET_RECONNECT_INTERVAL: 5000,
  SOCKET_RECONNECT_DELAY_MAX: 5000,
  
  // Image upload
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // UI
  TOAST_DURATION: 3000, // milliseconds
  
  // Environment
  PRODUCTION: import.meta.env.PROD,
  DEVELOPMENT: import.meta.env.DEV,
};
