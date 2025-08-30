import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import userReducer from '../features/user/userSlice';
import sellerReducer from '../features/seller/sellerSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import orderReducer from '../features/orders/orderSlice';
import adminUsersReducer from '../features/admin/adminUsersSlice';

const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    seller: sellerReducer,
    analytics: analyticsReducer,
    order: orderReducer,
    adminUsers: adminUsersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
