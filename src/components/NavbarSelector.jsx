import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import SellerNavbar from './SellerNavbar';
import AdminNavbar from './AdminNavbar';

function NavbarSelector() {
  const { user, isAuthenticated } = useSelector(state => state.user);
  const location = useLocation();

  // Check if we're on a seller route
  const isSellerRoute = location.pathname.startsWith('/seller');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If user is not authenticated, show regular navbar
  if (!isAuthenticated || !user) {
    return <Navbar />;
  }

  // Show seller navbar only on seller routes for seller users
  if (isSellerRoute && user.role === 'seller') {
    return <SellerNavbar />;
  }

  // Show admin navbar only on admin routes for admin users
  if (isAdminRoute && user.role === 'admin') {
    return <AdminNavbar />;
  }

  // For all other routes (home, products, profile, etc.), show regular navbar
  return <Navbar />;
}

export default NavbarSelector;
