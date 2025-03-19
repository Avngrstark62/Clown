import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import socketReducer from './socketSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
  },
});

export default store;