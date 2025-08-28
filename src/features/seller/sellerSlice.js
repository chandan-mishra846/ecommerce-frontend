import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks for seller operations
export const getSellerProducts = createAsyncThunk(
  'seller/getSellerProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/seller/products');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSellerProduct = createAsyncThunk(
  'seller/createSellerProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/v1/seller/products', productData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSellerProduct = createAsyncThunk(
  'seller/updateSellerProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.put(`/api/v1/seller/products/${id}`, productData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSellerProduct = createAsyncThunk(
  'seller/deleteSellerProduct',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/seller/products/${id}`);
      return { data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSellerOrders = createAsyncThunk(
  'seller/getSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/seller/orders');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSellerStats = createAsyncThunk(
  'seller/getSellerStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/seller/stats');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    products: [],
    orders: [],
    stats: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get seller products
      .addCase(getSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(getSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create seller product
      .addCase(createSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product);
        state.success = true;
      })
      .addCase(createSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update seller product
      .addCase(updateSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
        state.success = true;
      })
      .addCase(updateSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete seller product
      .addCase(deleteSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload.id);
        state.success = true;
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get seller orders
      .addCase(getSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get seller stats
      .addCase(getSellerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(getSellerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearErrors, clearSuccess } = sellerSlice.actions;
export default sellerSlice.reducer;