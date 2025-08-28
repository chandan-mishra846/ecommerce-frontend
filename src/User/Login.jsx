import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeErrors, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';

function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const { error, loading, success, isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSubmit = (e) => {
    e.preventDefault();
    
    if (isAdminLogin) {
      // Check admin code
      if (adminCode !== 'ADMIN_SECRET_2024') {
        toast.error('Invalid admin access code!', { position: 'top-center', autoClose: 3000 });
        return;
      }
      // Send admin login request
      dispatch(login({ email: loginEmail, password: loginPassword, adminLogin: true }));
    } else {
      // Regular user/seller login
      dispatch(login({ email: loginEmail, password: loginPassword }));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(()=>{
    if(isAuthenticated && user){
      // Redirect based on user role
      if(user.role === 'admin') {
        navigate("/admin/dashboard");
      } else if(user.role === 'seller') {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    }
  },[isAuthenticated, user, navigate]);

  useEffect(()=>{
    if(success){
    toast.success("Login successful!", { position: 'top-center', autoClose: 3000 });
    dispatch(removeSuccess)
  }
  },[dispatch,success])

  

  return (
    <div className="form-container container">
      <div className="form-content">
        <form className="form" onSubmit={loginSubmit}>
          <h2>{isAdminLogin ? 'Admin Login' : 'User/Seller Login'}</h2>
          
          {/* Login Type Toggle */}
          <div className="login-type-toggle">
            <button
              type="button"
              className={`toggle-btn ${!isAdminLogin ? 'active' : ''}`}
              onClick={() => setIsAdminLogin(false)}
            >
              User/Seller
            </button>
            <button
              type="button"
              className={`toggle-btn ${isAdminLogin ? 'active' : ''}`}
              onClick={() => setIsAdminLogin(true)}
            >
              Admin
            </button>
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>

          {/* Admin Code Field - Only show for admin login */}
          {isAdminLogin && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Admin Access Code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
              />
              <small className="admin-code-hint">
                🔒 Enter the special admin access code
              </small>
            </div>
          )}

          <button className="authBtn" disabled={loading}>
            {loading ? 'Logging in...' : `Sign In ${isAdminLogin ? 'as Admin' : ''}`}
          </button>
          
          <p className="form-links">Forgot your password? <Link to="/password/forgot">Reset here</Link></p>
          <p className="form-links">Don't have an account? <Link to="/register">Register</Link></p>
          
          {isAdminLogin && (
            <div className="admin-warning">
              ⚠️ Admin access is restricted. Only authorized personnel should use this option.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
