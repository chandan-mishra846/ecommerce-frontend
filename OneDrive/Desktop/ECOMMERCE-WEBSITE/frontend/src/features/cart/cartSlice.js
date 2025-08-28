import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";  // Using configured axios instance

// Async Thunk for adding items
export const addItemsToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/products/${id}`);  // Fixed endpoint URL

      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image[0]?.url || "",
        stock: data.product.stock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to add item to cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        const item = action.payload;

        const existItem = state.cartItems.find(
          (i) => i.product === item.product
        );

        if (existItem) {
          state.cartItems = state.cartItems.map((i) =>
            i.product === existItem.product ? item : i
          );
        } else {
          state.cartItems.push(item);
        }

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));

        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = `${item.name} added to cart successfully!`;
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
        state.success = false;
      });
  },
});

export const { removeError, removeSuccess, removeItemFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
