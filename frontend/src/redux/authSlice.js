import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as api from '../api/api';
import { login, register, logout, user } from '../api/api';
// import { initializeSocket } from '../api/socket';

const loadUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const saveUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const clearUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const response = await register(formData);
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const response = await login(formData);
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await logout();
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const fetchUser = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const response = await user();
    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: loadUserFromLocalStorage(), loading: false, error: null, message: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        clearUserFromLocalStorage();
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        saveUserToLocalStorage(action.payload);
        state.loading = false;
      })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;