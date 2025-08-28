import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import userReducer from '../features/user/userSlice';
import sellerReducer from '../features/seller/sellerSlice';

const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    seller: sellerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
