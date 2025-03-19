// store/socketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    isInitialized: false, // Track if the socket is initialized
    isConnected: false,
    socketId: null,
  },
  reducers: {
    setSocketInitialized: (state) => {
      state.isInitialized = true;
    },
    setSocketConnected: (state, action) => {
      state.isConnected = true;
      state.socketId = action.payload;
    },
    setSocketDisconnected: (state) => {
      state.isConnected = false;
      state.socketId = null;
    },
  },
});

export const { setSocketInitialized, setSocketConnected, setSocketDisconnected } = socketSlice.actions;
export default socketSlice.reducer;