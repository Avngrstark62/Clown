/**
 * API Endpoints
 * Single source of truth for all API endpoints
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER_INITIATE: '/api/auth/register/initiate',
    REGISTER_VERIFY: '/api/auth/register/verify',
    REGISTER_RESEND_OTP: '/api/auth/register/resend-otp',
    USER: '/api/auth/user',
  },
  
  // Profile
  PROFILE: {
    GET_USER_DATA: (username) => `/api/profile/${username}`,
    UPDATE: '/api/profile/update',
  },
  
  // Search
  SEARCH: {
    USERS: '/api/search/users',
  },
  
  // Connections
  CONNECTION: {
    FOLLOW: '/api/connection/follow',
    UNFOLLOW: '/api/connection/unfollow',
    GET_FOLLOWERS: (username) => `/api/connection/followers/${username}`,
    GET_FOLLOWING: (username) => `/api/connection/following/${username}`,
  },
  
  // Posts
  POST: {
    CREATE: '/api/post/create',
    USER_POSTS: (username) => `/api/post/user-posts/${username}`,
    DELETE: '/api/post/delete',
    LIKE: '/api/post/like',
    GET_POST_AND_COMMENTS: (postId) => `/api/post/${postId}`,
    CREATE_COMMENT: '/api/post/comment/create',
    DELETE_COMMENT: '/api/post/comment/delete',
    HOME_POSTS: '/api/home/posts',
  },
  
  // AI Service
  AI: {
    GENERATE_CAPTIONS: '/api/ai-service/generate_captions',
  },
  
  // Chat
  CHAT: {
    HISTORY: (recipientId) => `/api/chat/history/${recipientId}`,
  },
};
