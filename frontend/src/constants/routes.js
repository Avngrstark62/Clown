/**
 * Route paths
 * Single source of truth for all route definitions
 */

export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Authenticated routes
  HOME: '/',
  SEARCH: '/search',
  CHAT: '/chat',
  CHAT_WITH_USER: (recipientId) => `/chat/${recipientId}`,
  
  // Profile routes
  PROFILE: (username) => `/profile/${username}`,
  EDIT_PROFILE: '/edit-profile',
  CONNECTIONS: (username, type) => `/profile/${username}/connections/${type}`,
  
  // Post routes
  CREATE_POST: '/create/post',
  CREATE_STORY: '/create/story',
  VIEW_POST: (postId) => `/post/${postId}`,
};

// Connection types
export const CONNECTION_TYPES = {
  FOLLOWERS: 'followers',
  FOLLOWING: 'following',
};
