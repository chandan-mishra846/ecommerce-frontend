import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import SellerNavbar from './SellerNavbar';
import AdminNavbar from './AdminNavbar';

function NavbarSelector() {
  const { user, isAuthenticated } = useSelector(state => state.user);

  // If user is not authenticated, show regular navbar
  if (!isAuthenticated || !user) {
    return <Navbar />;
  }

  // Show appropriate navbar based on user role
  switch (user.role) {
    case 'seller':
      return <SellerNavbar />;
    case 'admin':
      return <AdminNavbar />;
    default:
      return <Navbar />;
  }
}

export default NavbarSelector;
