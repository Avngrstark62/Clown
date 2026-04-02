/**
 * Data Slice
 * Manages cached data with TTL (time-to-live)
 * Used by custom hooks to reduce redundant API calls
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {},
  followingList: {},
  followersList: {},
  timestamp: {
    userData: {},
    followingList: {},
    followersList: {},
  },
};

// Helper to check if cache is still valid
const isCacheValid = (cacheTime, cacheTTL) => {
  if (!cacheTime) return false;
  return Date.now() - cacheTime < cacheTTL;
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { username, data } = action.payload;
      state.userData[username] = data;
      state.timestamp.userData[username] = Date.now();
    },
    
    setFollowingList: (state, action) => {
      const { username, data } = action.payload;
      state.followingList[username] = data;
      state.timestamp.followingList[username] = Date.now();
    },
    
    setFollowersList: (state, action) => {
      const { username, data } = action.payload;
      state.followersList[username] = data;
      state.timestamp.followersList[username] = Date.now();
    },
    
    clearUserData: (state, action) => {
      const { username } = action.payload;
      delete state.userData[username];
      delete state.timestamp.userData[username];
    },
    
    clearAllCache: (state) => {
      state.userData = {};
      state.followingList = {};
      state.followersList = {};
      state.timestamp = {
        userData: {},
        followingList: {},
        followersList: {},
      };
    },
  },
});

export const {
  setUserData,
  setFollowingList,
  setFollowersList,
  clearUserData,
  clearAllCache,
} = dataSlice.actions;

// Selectors with cache validation
export const selectUserData = (state, username, cacheTTL) => {
  const cached = state.data.userData[username];
  const cacheTime = state.data.timestamp.userData[username];
  
  if (cached && isCacheValid(cacheTime, cacheTTL)) {
    return cached;
  }
  return null;
};

export const selectFollowingList = (state, username, cacheTTL) => {
  const cached = state.data.followingList[username];
  const cacheTime = state.data.timestamp.followingList[username];
  
  if (cached && isCacheValid(cacheTime, cacheTTL)) {
    return cached;
  }
  return null;
};

export const selectFollowersList = (state, username, cacheTTL) => {
  const cached = state.data.followersList[username];
  const cacheTime = state.data.timestamp.followersList[username];
  
  if (cached && isCacheValid(cacheTime, cacheTTL)) {
    return cached;
  }
  return null;
};

export default dataSlice.reducer;
