import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import socketReducer from './socketSlice';
import dataReducer from './dataSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    data: dataReducer,
  },
});

export default store;