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
      const { data } = await axios.put(`/api/v1/password/reset/${token}`, userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Password reset failed');
    }
  }
);

// 9️⃣ Cart Operations
export const fetchCart = createAsyncThunk(
  'user/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/cart');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  'user/addToCartAPI',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/cart/add', { productId, quantity });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add item to cart');
    }
  }
);

export const updateCartItemAPI = createAsyncThunk(
  'user/updateCartItemAPI',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/cart/update/${itemId}`, { quantity });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update cart item');
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'user/removeFromCartAPI',
  async (itemId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/cart/remove/${itemId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove item from cart');
    }
  }
);

export const clearCartAPI = createAsyncThunk(
  'user/clearCartAPI',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete('/api/v1/cart/clear');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to clear cart');
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
    cart: [],
    cartItems: 0,
    cartTotal: 0,
  },
  reducers: {
    removeErrors: (state) => { state.error = null; },
    removeSuccess: (state) => { state.success = false; },
    
    // Cart Actions
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cart.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ ...product, quantity });
      }
      
      state.cartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
      state.cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter(item => item._id !== productId);
      state.cartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
      state.cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item._id === productId);
      if (item) {
        item.quantity = quantity;
        state.cartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        state.cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },
    
    clearCart: (state) => {
      state.cart = [];
      state.cartItems = 0;
      state.cartTotal = 0;
    },
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
      state.cart = [];
      state.cartItems = 0;
      state.cartTotal = 0;
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

    // Cart Operations
    builder.addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.cart && action.payload.cart.items) {
        state.cart = action.payload.cart.items.map(item => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          name: item.product.name,
          image: item.product.image,
          stock: item.product.stock
        }));
        state.cartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        state.cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Failed to fetch cart';
    });

    builder.addCase(addToCartAPI.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(addToCartAPI.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.cart && action.payload.cart.items) {
        state.cart = action.payload.cart.items.map(item => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          name: item.product.name,
          image: item.product.image,
          stock: item.product.stock
        }));
        state.cartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        state.cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    });
    builder.addCase(addToCartAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Failed to add item to cart';
    });

    builder.addCase(updateCartItemAPI.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(updateCartItemAPI.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.cart && action.payload.cart.items) {
        state.cart = action.payload.cart.items.map(item => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          name: item.product.name,
          image: item.product.image,
          stock: item.product.stock
        }));
        state.cartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        state.cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    });
    builder.addCase(updateCartItemAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Failed to update cart item';
    });

    builder.addCase(removeFromCartAPI.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(removeFromCartAPI.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.cart && action.payload.cart.items) {
        state.cart = action.payload.cart.items.map(item => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          name: item.product.name,
          image: item.product.image,
          stock: item.product.stock
        }));
        state.cartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        state.cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    });
    builder.addCase(removeFromCartAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Failed to remove item from cart';
    });

    builder.addCase(clearCartAPI.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(clearCartAPI.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = [];
      state.cartItems = 0;
      state.cartTotal = 0;
    });
    builder.addCase(clearCartAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || 'Failed to clear cart';
    });

  },
});

export const { 
  removeErrors, 
  removeSuccess, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart 
} = userSlice.actions;

export default userSlice.reducer;
