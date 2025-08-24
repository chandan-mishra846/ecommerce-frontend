import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector(state => state.user);

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
