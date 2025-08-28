import React, { useState } from 'react';
import '../UserStyles/Form.css';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

function AdminRegister() {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    adminSecretKey: ''
  });
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('./images/profile.png');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      setAvatar(file);
    } else {
      setAdminData({ ...adminData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!adminData.name || !adminData.email || !adminData.password || !adminData.adminSecretKey) {
      toast.error('Please fill all fields', { position: 'top-center', autoClose: 3000 });
      setLoading(false);
      return;
    }

    if (!avatar) {
      toast.error('Please select an avatar', { position: 'top-center', autoClose: 3000 });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.set('name', adminData.name);
      formData.set('email', adminData.email);
      formData.set('password', adminData.password);
      formData.set('adminSecretKey', adminData.adminSecretKey);
      formData.set('avatar', avatar);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/v1/register/admin', formData, config);

      toast.success('Admin account created successfully!', { position: 'top-center', autoClose: 3000 });
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin registration failed', { 
        position: 'top-center', 
        autoClose: 3000 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container container">
      <div className="form-content">
        <form className="form" onSubmit={handleSubmit}>
          <h2>🔐 Admin Registration</h2>
          
          <div className="admin-warning">
            ⚠️ This page is for authorized admin registration only. 
            You need the special admin secret key to proceed.
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={adminData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={adminData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={adminData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Admin Secret Key"
              name="adminSecretKey"
              value={adminData.adminSecretKey}
              onChange={handleChange}
              required
            />
            <small className="admin-code-hint">
              🔑 Enter the super admin secret key
            </small>
          </div>

          <div className="input-group avatar-group">
            <input
              type="file"
              name="avatar"
              className="file-input"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <img src={avatarPreview} alt="Avatar Preview" className="avatar" />
          </div>

          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </button>

          <div className="admin-security-note">
            🛡️ <strong>Security Note:</strong> This registration creates a system administrator 
            with full access to all platform functions. Only authorized personnel should proceed.
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminRegister;
