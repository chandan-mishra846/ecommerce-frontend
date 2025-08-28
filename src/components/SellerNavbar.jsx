import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';
import '../componentStyles/SellerNavbar.css';

// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function SellerNavbar() {
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
      <nav className="seller-navbar">
        <div className="seller-navbar-container">
          <div className="seller-navbar-brand">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Link to="/seller/dashboard" className="brand-link">
              <h2>Seller Portal</h2>
            </Link>
          </div>

          <div className="seller-navbar-user">
            <span className="user-welcome">Welcome, {user?.name}</span>
            <div className="user-avatar">
              <img src={user?.avatar?.url || '/images/profile.png'} alt="Profile" />
            </div>
          </div>
        </div>
      </nav>

      <div className={`seller-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Seller Dashboard</h3>
        </div>

        <div className="sidebar-menu">
          <div className="menu-section">
            <h4>Overview</h4>
            <Link to="/seller/dashboard" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <DashboardIcon className="menu-icon" />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Products</h4>
            <Link to="/seller/products" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <InventoryIcon className="menu-icon" />
              <span>My Products</span>
            </Link>
            <Link to="/seller/products/out-of-stock" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <WarningIcon className="menu-icon" />
              <span>Out of Stock</span>
            </Link>
            <Link to="/seller/products/create" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <InventoryIcon className="menu-icon" />
              <span>Add Product</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Orders</h4>
            <Link to="/seller/orders" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <ShoppingCartIcon className="menu-icon" />
              <span>All Orders</span>
            </Link>
            <Link to="/seller/orders/history" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <HistoryIcon className="menu-icon" />
              <span>Order History</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Analytics</h4>
            <Link to="/seller/profits" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
              <AttachMoneyIcon className="menu-icon" />
              <span>Total Profit</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Account</h4>
            <Link to="/seller/profile" className="menu-item" onClick={() => setIsSidebarOpen(false)}>
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

export default SellerNavbar;
