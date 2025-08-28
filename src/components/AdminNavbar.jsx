import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';
import '../componentStyles/AdminNavbar.css';

// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import ReviewsIcon from '@mui/icons-material/Reviews';

function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <nav className="admin-navbar">
        <div className="admin-navbar-container">
          <div className="admin-navbar-brand">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Link to="/admin/dashboard" className="brand-link">
              <h2>Admin Portal</h2>
            </Link>
          </div>

          <div className="admin-navbar-user">
            <span className="user-welcome">Welcome, {user?.name}</span>
            <div className="user-avatar">
              <img src={user?.avatar?.url || '/images/profile.png'} alt="Profile" />
            </div>
          </div>
        </div>
      </nav>

      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Admin Dashboard</h3>
        </div>

        <div className="sidebar-menu">
          <div className="menu-section">
            <h4>Overview</h4>
            <Link to="/admin/dashboard" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <DashboardIcon className="menu-icon" />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/analytics" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <AnalyticsIcon className="menu-icon" />
              <span>Analytics</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>User Management</h4>
            <Link to="/admin/users" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <PeopleIcon className="menu-icon" />
              <span>All Users</span>
            </Link>
            <Link to="/admin/sellers" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <StorefrontIcon className="menu-icon" />
              <span>All Sellers</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Product Management</h4>
            <Link to="/admin/products" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <InventoryIcon className="menu-icon" />
              <span>All Products</span>
            </Link>
            <Link to="/admin/products/create" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <InventoryIcon className="menu-icon" />
              <span>Add Product</span>
            </Link>
            <Link to="/admin/products/stock" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <WarningIcon className="menu-icon" />
              <span>Stock Management</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Order Management</h4>
            <Link to="/admin/orders" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <ShoppingCartIcon className="menu-icon" />
              <span>All Orders</span>
            </Link>
            <Link to="/admin/orders/pending" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <ShoppingCartIcon className="menu-icon" />
              <span>Pending Orders</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Reviews & Feedback</h4>
            <Link to="/admin/reviews" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <ReviewsIcon className="menu-icon" />
              <span>All Reviews</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Account</h4>
            <Link to="/admin/profile" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <PersonIcon className="menu-icon" />
              <span>Profile</span>
            </Link>
            <button className="menu-item logout-btn" onClick={handleLogout}>
              <LogoutIcon className="menu-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default AdminNavbar;
