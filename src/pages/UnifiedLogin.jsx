import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeErrors, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../UserStyles/Form.css';

function UnifiedLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: ''
  });
  const [loginType, setLoginType] = useState('user'); // 'user', 'seller', 'admin'
  
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
    
    if (loginType === 'admin') {
      // Validate admin code
      if (formData.adminCode !== 'ADMIN_SECRET_2024') {
        toast.error('Invalid admin access code!', { position: 'top-center', autoClose: 3000 });
        return;
      }
      // Admin login
      dispatch(login({ 
        email: formData.email, 
        password: formData.password, 
        adminLogin: true,
        adminAccessCode: formData.adminCode
      }));
    } else {
      // Regular user/seller login
      dispatch(login({ email: formData.email, password: formData.password }));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate("/admin/dashboard");
      } else if (user.role === 'seller') {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (success) {
      toast.success("Login successful!", { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  return (
    <>
      <PageTitle title="Login - ShopEasy" />
      <Navbar />
      <div className="form-container container">
        <div className="form-content">
          <form className="form" onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
              Sign in to access your account
            </p>
            
            {/* Login Type Selection */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
              gap: '8px',
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '6px'
            }}>
              {[
                { key: 'user', label: 'Customer', icon: '👤' },
                { key: 'seller', label: 'Seller', icon: '🏪' },
                { key: 'admin', label: 'Admin', icon: '⚙️' }
              ].map(type => (
                <button
                  key={type.key}
                  type="button"
                  className={`login-type-btn ${loginType === type.key ? 'active' : ''}`}
                  onClick={() => setLoginType(type.key)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: loginType === type.key 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'transparent',
                    color: loginType === type.key ? 'white' : '#666',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>

            {/* Email Field */}
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            {/* Password Field */}
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Admin Code Field - Only for Admin Login */}
            {loginType === 'admin' && (
              <div className="input-group">
                <input
                  type="password"
                  name="adminCode"
                  placeholder="Admin Access Code"
                  value={formData.adminCode}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    background: '#fef2f2'
                  }}
                />
                <small style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'block',
                  textAlign: 'center'
                }}>
                  🔒 Enter the special admin access code
                </small>
              </div>
            )}

            {/* Submit Button */}
            <button 
              className="authBtn" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loginType === 'admin' 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing In...' : `Sign In as ${loginType === 'user' ? 'Customer' : loginType === 'seller' ? 'Seller' : 'Admin'}`}
            </button>
            
            {/* Additional Links */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <p className="form-links">
                Forgot your password? <Link to="/password/forgot">Reset here</Link>
              </p>
              <p className="form-links">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            
            {/* Admin Warning */}
            {loginType === 'admin' && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '1rem',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#dc2626',
                  fontSize: '12px',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  ⚠️ Admin access is restricted. Only authorized personnel should use this option.
                </p>
              </div>
            )}

            {/* Login Type Information */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '1rem',
              fontSize: '12px',
              color: '#64748b'
            }}>
              <strong>Login as:</strong>
              <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                <li><strong>Customer:</strong> Browse and purchase products</li>
                <li><strong>Seller:</strong> Manage your store and products</li>
                <li><strong>Admin:</strong> Full system administration access</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UnifiedLogin;
