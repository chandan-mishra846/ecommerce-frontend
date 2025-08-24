import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Register from './User/Register';
import UpdateProfile from './User/UpdateProfile';
import UserDashboard from './User/UserDashboard';
import Login from './User/Login';
import Profile from './User/Profile';

import { loadUser } from './features/products/user/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
import UpdatePassword from './User/UpdatePassword';
import ForgotPassword from './User/forgotPassword';
import ResetPassword from './User/resetPassword';
import Cart from './pages/Cart';



function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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

        
      </Routes>

      {isAuthenticated && <UserDashboard user={user} />}
    </Router>
  );
}

export default App;