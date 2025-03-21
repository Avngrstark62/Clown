import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, initiateRegister, verifyAndRegister, resendOTP, logout, user } from '../api/api';

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

// Updated registration thunks
export const initiateUserRegistration = createAsyncThunk('auth/initiateRegister', async (formData, { rejectWithValue }) => {
  try {
    const response = await initiateRegister(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const verifyOtpAndRegister = createAsyncThunk('auth/verifyRegister', async (verificationData, { rejectWithValue }) => {
  try {
    const response = await verifyAndRegister(verificationData);
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const resendRegistrationOTP = createAsyncThunk('auth/resendOTP', async (tokenData, { rejectWithValue }) => {
  try {
    const response = await resendOTP(tokenData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Existing thunks
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
  initialState: { 
    user: loadUserFromLocalStorage(), 
    loading: false, 
    error: null, 
    message: null,
    registrationToken: null,
    registrationEmail: null
  },
  reducers: {
    clearRegistrationState: (state) => {
      state.registrationToken = null;
      state.registrationEmail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle initiate registration
      .addCase(initiateUserRegistration.fulfilled, (state, action) => {
        state.registrationToken = action.payload.token;
        state.registrationEmail = action.payload.email || action.meta.arg.email;
        state.message = action.payload.message;
        state.loading = false;
      })
      // Handle OTP verification and final registration
      .addCase(verifyOtpAndRegister.fulfilled, (state, action) => {
        state.registrationToken = null;
        state.registrationEmail = null;
        state.message = action.payload;
        state.loading = false;
      })
      // Handle OTP resend
      .addCase(resendRegistrationOTP.fulfilled, (state, action) => {
        state.registrationToken = action.payload.token;
        state.message = action.payload.message;
        state.loading = false;
      })
      // Existing cases
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

export const { clearRegistrationState } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { login, register, logout, user } from '../api/api';

// const loadUserFromLocalStorage = () => {
//   const user = localStorage.getItem('user');
//   return user ? JSON.parse(user) : null;
// };

// const saveUserToLocalStorage = (user) => {
//   localStorage.setItem('user', JSON.stringify(user));
// };

// const clearUserFromLocalStorage = () => {
//   localStorage.removeItem('user');
// };

// export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
//   try {
//     const response = await register(formData);
//     return response.data.message;
//   } catch (error) {
//     return rejectWithValue(error.response.data.message);
//   }
// });

// export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
//   try {
//     const response = await login(formData);
//     return response.data.message;
//   } catch (error) {
//     return rejectWithValue(error.response.data.message);
//   }
// });

// export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
//   try {
//     const response = await logout();
//     return response.data.message;
//   } catch (error) {
//     return rejectWithValue(error.response.data.message);
//   }
// });

// export const fetchUser = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
//   try {
//     const response = await user();
//     return response.data.user;
//   } catch (error) {
//     return rejectWithValue(error.response.data.message);
//   }
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: { user: loadUserFromLocalStorage(), loading: false, error: null, message: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.message = action.payload;
//         state.loading = false;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.message = action.payload;
//         state.loading = false;
//       })
//       .addCase(logoutUser.fulfilled, (state, action) => {
//         state.user = null;
//         clearUserFromLocalStorage();
//         state.message = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.user = action.payload;
//         saveUserToLocalStorage(action.payload);
//         state.loading = false;
//       })
//       .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
//         state.loading = true;
//         state.error = null;
//         state.message = null;
//       })
//       .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default authSlice.reducer;