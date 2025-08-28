import React from 'react';
import '../UserStyles/UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout as logoutUser, removeSuccess } from '../features/user/userSlice';
import { useState } from 'react';

function UserDashboard({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  function toggleMeu() {
    setMenuVisible(!menuVisible);
  }

  function orders() {
    navigate('/order/user');
  }

  function profile() {
    navigate('/profile');
  }

  function logout() {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success('Logout successfully', { position: 'top-center', autoClose: 3000 });
        dispatch(removeSuccess());
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error.message || 'Logout Failed', { position: 'top-center', autoClose: 3000 });
      });
  }

  function dashboard() {
    navigate('/admin/dashboard');
  }

  // Ensure 'user' is not null before accessing its properties
  const baseOptions = [
    { name: 'Orders', funcName: orders },
    { name: 'Account', funcName: profile },
    { name: 'Logout', funcName: logout },
  ];

  const options = user && user.role === 'admin' // Check if user exists before accessing role
    ? [{ name: 'Admin Dashboard', funcName: dashboard }, ...baseOptions]
    : baseOptions;

  // Only render if user exists to prevent errors
  if (!user) {
    return null; // Or a loading spinner, or a placeholder if user is null
  }

  return (
    <>
      {/* Corrected className and onClick placement */}
      <div className={`overlay ${menuVisible ? 'show' : ''}`} onClick={toggleMeu}></div>
      
      <div className="dashboard-container">
        <div className="profile-header" onClick={toggleMeu}>
          {/* Use optional chaining for avatar url */}
          <img
            src={user?.avatar?.url || '/images/jony-dep.png'}
            alt="User Avatar"
            className="profile-avatar"
            />
          <span className="profile-name">{user.name || 'User'}</span>
        </div>
        { menuVisible && <div className="menu-options">
          {options.map((item, index) => (
              <button key={index} className="menu-option-btn" onClick={item.funcName}>
              {item.name}
            </button>
          ))}
        </div>}
      </div>
    </>
  );
}

export default UserDashboard;