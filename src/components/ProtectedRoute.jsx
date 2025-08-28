import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, user } = useSelector(state => state.user);

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/login" />;

  // If a specific role is required, check if user has that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on their actual role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === 'seller') {
      return <Navigate to="/seller/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return children;
}

export default ProtectedRoute;
