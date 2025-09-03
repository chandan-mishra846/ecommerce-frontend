import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL || ''}/api/v1`;

// Get all users (admin)
export const getAllUsers = createAsyncThunk(
  'adminUsers/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/users`, {
        withCredentials: true
      });
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
      const { data } = await axios.get(`${BASE_URL}/admin/users-only`, {
        withCredentials: true
      });
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
      const { data } = await axios.get(`${BASE_URL}/admin/sellers-only`, {
        withCredentials: true
      });
      return data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch sellers'
      );
    }
  }
);

// Get user details (admin)
export const getUserDetails = createAsyncThunk(
  'adminUsers/getUserDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/user/${id}`, {
        withCredentials: true
      });
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
      const { data } = await axios.put(
        `${BASE_URL}/admin/user/${id}`,
        { role },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      return data;
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
      const { data } = await axios.delete(`${BASE_URL}/admin/user/${id}`, {
        withCredentials: true
      });
      return { id, message: data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

const initialState = {
  users: [],
  usersOnly: [],
  sellersOnly: [],
  user: null,
  loading: false,
  success: false,
  error: null,
  isDeleted: false,
  isUpdated: false
};

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
    builder
      // Get All Users (Admin)
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Users Only
      .addCase(getUsersOnly.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsersOnly.fulfilled, (state, action) => {
        state.loading = false;
        state.usersOnly = action.payload;
      })
      .addCase(getUsersOnly.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Sellers Only
      .addCase(getSellersOnly.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSellersOnly.fulfilled, (state, action) => {
        state.loading = false;
        state.sellersOnly = action.payload;
      })
      .addCase(getSellersOnly.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Details
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = true;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = true;
        state.users = state.users.filter(user => user._id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearErrors, resetUpdateStatus, resetDeleteStatus } = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
