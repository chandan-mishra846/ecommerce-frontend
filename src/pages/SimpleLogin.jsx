import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeErrors, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../UserStyles/SimpleLogin.css';

function SimpleLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { error, loading, success, isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: formData.email, password: formData.password }));
  };

  // Handle authentication success
  useEffect(() => {
    if (isAuthenticated && user) {
      // Auto-redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error, { 
        position: 'top-center', 
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      toast.success(success, { 
        position: 'top-center', 
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  return (
    <>
      <PageTitle title="Login - ShopEasy" />
      <Navbar />
      
      <div className="simple-login-page">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back!</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Sign In'}
            </button>
          </form>

          <div className="login-links">
            <p>
              Forgot your password? 
              <Link to="/forgot-password" className="link">Reset here</Link>
            </p>
            <p>
              Don't have an account? 
              <Link to="/register" className="link">Register</Link>
            </p>
          </div>

          <div className="info-section">
            <div className="info-card">
              <h3>✨ One Login for All</h3>
              <p>Customers, Sellers, and Admins - everyone uses the same login page!</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SimpleLogin;
