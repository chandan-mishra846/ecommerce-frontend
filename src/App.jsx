import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import './index.css'; // Add this to include custom toast styles

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Register from './User/Register';
import AdminRegister from './User/AdminRegister';
import UpdateProfile from './User/UpdateProfile';
import UserDashboard from './User/UserDashboard';
import SimpleLogin from './pages/SimpleLogin';
import Profile from './User/Profile';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminProductCreate from './pages/AdminProductCreate';
import AdminUpdateProduct from './pages/AdminUpdateProduct';
import AdminOrders from './pages/AdminOrders';
import AdminSellers from './pages/AdminSellers';
import AdminAnalytics from './pages/AdminAnalytics';
import ProcessOrder from './pages/ProcessOrder';
import SellerProfile from './pages/SellerProfile';
import AddProduct from './pages/AddProduct';
import SellerProducts from './pages/SellerProducts';
import OutOfStockProducts from './pages/OutOfStockProducts';
import AllOrders from './pages/AllOrders';
import OrderHistory from './pages/OrderHistory';
import SellerOrderHistory from './pages/SellerOrderHistory';
import TotalProfit from './pages/TotalProfit';

// Corrected import path for loadUser
import { loadUser, fetchCart } from './features/user/userSlice'; 
import ProtectedRoute from './components/ProtectedRoute';
import NavbarSelector from './components/NavbarSelector';
import UpdatePassword from './User/UpdatePassword';
import ForgotPassword from './User/ForgotPassword'; // Corrected capitalization
import ResetPassword from './User/ResetPassword'; // Corrected capitalization
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Contact from './pages/Contact';


function App() {
  const { isAuthenticated, user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Load cart when user becomes authenticated and loading is complete
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      console.log('Loading cart for authenticated user:', user.email);
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated, user, loading]);

  return (
    <Router>
      <NavbarSelector />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/admin" element={<AdminRegister />} />
        <Route path="/login" element={<SimpleLogin />} />
        <Route path="/unified-login" element={<SimpleLogin />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword/>} />
        <Route path="/cart" element={<Cart />} />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-success" 
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } 
        />

        {/* Seller Routes */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/profile"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products/create"
          element={
            <ProtectedRoute requiredRole="seller">
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products/out-of-stock"
          element={
            <ProtectedRoute requiredRole="seller">
              <OutOfStockProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute requiredRole="seller">
              <AllOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders/history"
          element={
            <ProtectedRoute requiredRole="seller">
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/profit"
          element={
            <ProtectedRoute requiredRole="seller">
              <TotalProfit />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sellers"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminSellers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProductCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product/update/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUpdateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order/update/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <ProcessOrder />
            </ProtectedRoute>
          }
        />
        
      </Routes>

      {isAuthenticated && <UserDashboard user={user} />}

      {/* Temporarily disable ToastContainer */}
      {/* <ToastContainer 
        position="bottom-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        limit={1}
        toastClassName="custom-toast"
      /> */}
    </Router>
  );
}

export default App;