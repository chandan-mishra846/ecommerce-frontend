import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ------------------------
// Async Thunks for API Calls
// ------------------------

// 1️⃣ Register
export const register = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/v1/register', userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed. Please try again later');
    }
  }
);

// 2️⃣ Login
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/v1/login', { email, password }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed. Please try again later');
    }
  }
);

// 3️⃣ Load User
export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/profile');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load user profile');
    }
  }
);

// 4️⃣ Logout
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/logout');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// 5️⃣ Update Profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.put('/api/v1/profile/update', userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Profile update failed');
    }
  }
);

// 6️⃣ Update Password
export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (formData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.put('/api/v1/password/update', formData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Password update failed');
    }
  }
);

// 7️⃣ Forgot Password
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (emailData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/v1/password/forgot', emailData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Forgot password failed');
    }
  }
);

// 8️⃣ Reset Password
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, userData }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.put(`/api/v1/password/reset/${token}`, userData, config); // PUT matches backend
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Password reset failed');
    }
  }
);

// ------------------------
// Slice
// ------------------------
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
    message: null,
  },
  reducers: {
    removeErrors: (state) => { state.error = null; },
    removeSuccess: (state) => { state.success = false; },
  },
  extraReducers: (builder) => {

    // Register
    builder.addCase(register.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.success = action.payload.success;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Registration failed';
    });

    // Login
    builder.addCase(login.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.success = action.payload.success;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Login failed';
    });

    // Load User
    builder.addCase(loadUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
    builder.addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Load user failed';
      state.user = null;
      state.isAuthenticated = false;
    });

    // Logout
    builder.addCase(logout.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Logout failed';
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.success = action.payload.success;
      state.message = action.payload.message;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Profile update failed';
    });

    // Update Password
    builder.addCase(updatePassword.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Password update failed';
    });

    // Forgot Password
    builder.addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Forgot password failed';
    });

    // Reset Password
    builder.addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Password reset failed';
    });

  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;