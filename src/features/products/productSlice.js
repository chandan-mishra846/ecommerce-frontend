import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Fetch All Products
export const getProduct = createAsyncThunk(
  'product/getProduct',
  async ({ keyword ,page=1}, { rejectWithValue }) => {
    try {
      const link = keyword
        ? `/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}`
        : `/api/v1/products?page=${page}`; // ✅ fixed encodeURIComponent typo

      console.log('Making API call to:', link);
      const { data } = await axios.get(link, { withCredentials: true });
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.log('API Error:', error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Fetch Product Details
export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const link = `/api/v1/products/${id}`;
      const { data } = await axios.get(link, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Create Review for Product
export const createReviewforProduct = createAsyncThunk(
  'product/createReviewforProduct',
  async (reviewData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.put('/api/v1/review', reviewData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create review');
    }
  }
);

// Get All Products for Admin (no pagination)
export const getAdminProducts = createAsyncThunk(
  'product/getAdminProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/products', { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch admin products');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    adminProducts: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
    resultPerPage:4,
    totalPage:0
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        console.log("Payload in fulfilled:", action.payload);
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.totalPage = action.payload.totalPage;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.products=[];
      })

      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      .addCase(createReviewforProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReviewforProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(createReviewforProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create review';
      })

      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.adminProducts = action.payload.products;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch admin products';
      });
  }
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;