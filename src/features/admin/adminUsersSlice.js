import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Get all users (admin)
export const getAllUsers = createAsyncThunk(
  'adminUsers/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/users');
      return data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

// Get users with role 'user' only
export const getUsersOnly = createAsyncThunk(
  'adminUsers/getUsersOnly',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/users-only');
      return data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

// Get users with role 'seller' only
export const getSellersOnly = createAsyncThunk(
  'adminUsers/getSellersOnly',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/sellers-only');
      return data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

// Get user details (admin)
export const getUserDetails = createAsyncThunk(
  'adminUsers/getUserDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/user/${id}`);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

// Update user role (admin)
export const updateUserRole = createAsyncThunk(
  'adminUsers/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/user/${id}`, { role });
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user role'
      );
    }
  }
);

// Delete user (admin)
export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

// Initial state
const initialState = {
  users: [],
  usersOnly: [],
  sellersOnly: [],
  currentUser: null,
  loading: false,
  error: null,
  isUpdated: false,
  isDeleted: false
};

// Admin users slice
const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetUpdateStatus: (state) => {
      state.isUpdated = false;
    },
    resetDeleteStatus: (state) => {
      state.isDeleted = false;
    }
  },
  extraReducers: (builder) => {
    // Get all users
    builder.addCase(getAllUsers.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get users only
    builder.addCase(getUsersOnly.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(getUsersOnly.fulfilled, (state, action) => {
      state.loading = false;
      state.usersOnly = action.payload;
    });
    builder.addCase(getUsersOnly.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get sellers only
    builder.addCase(getSellersOnly.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(getSellersOnly.fulfilled, (state, action) => {
      state.loading = false;
      state.sellersOnly = action.payload;
    });
    builder.addCase(getSellersOnly.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get user details
    builder.addCase(getUserDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update user role
    builder.addCase(updateUserRole.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.currentUser = action.payload;
    });
    builder.addCase(updateUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete user
    builder.addCase(deleteUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeleted = true;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { clearErrors, resetUpdateStatus, resetDeleteStatus } = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
