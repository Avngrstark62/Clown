import { io } from 'socket.io-client';
import store from '../redux/store.js';
import { setSocketInitialized, setSocketConnected, setSocketDisconnected } from '../redux/socketSlice.js';
import { production } from './api.js';

let socket;

const baseURL = production ? "https://clownapp.fun" : "http://localhost:8000";

export const initializeSocket = () => {
  if (socket) {
    return socket;
  }

  socket = io(baseURL, {
    withCredentials: true,
    path: production ? "/api/socket.io" : "/socket.io",
    transports: ["websocket"],
  });

  socket.on('connect', () => {
    console.log('Socket connected!');
    store.dispatch(setSocketConnected(socket.id));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected!');
    store.dispatch(setSocketDisconnected());
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  store.dispatch(setSocketInitialized());
  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    store.dispatch(setSocketDisconnected());
  }
};
