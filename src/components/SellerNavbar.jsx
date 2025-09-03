import React, { useState, useEffect } from 'react';
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

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    closeSidebar();
  };

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

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
        </div>
      </nav>

      <div className={`seller-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Seller Dashboard</h3>
        </div>

        <div className="sidebar-menu">
          <div className="menu-section">
            <h4>Overview</h4>
            <Link to="/seller/dashboard" className="menu-item" onClick={closeSidebar}>
              <DashboardIcon className="menu-icon" />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Products</h4>
            <Link to="/seller/products" className="menu-item" onClick={closeSidebar}>
              <InventoryIcon className="menu-icon" />
              <span>My Products</span>
            </Link>
            <Link to="/seller/products/out-of-stock" className="menu-item" onClick={closeSidebar}>
              <WarningIcon className="menu-icon" />
              <span>Out of Stock</span>
            </Link>
            <Link to="/seller/products/create" className="menu-item" onClick={closeSidebar}>
              <InventoryIcon className="menu-icon" />
              <span>Add Product</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Orders</h4>
            <Link to="/seller/orders" className="menu-item" onClick={closeSidebar}>
              <ShoppingCartIcon className="menu-icon" />
              <span>All Orders</span>
            </Link>
            <Link to="/seller/orders/history" className="menu-item" onClick={closeSidebar}>
              <HistoryIcon className="menu-icon" />
              <span>Order History</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Analytics</h4>
            <Link to="/seller/profit" className="menu-item" onClick={closeSidebar}>
              <AttachMoneyIcon className="menu-icon" />
              <span>Total Profit</span>
            </Link>
          </div>

          <div className="menu-section">
            <h4>Account</h4>
            <button className="menu-item logout-btn" onClick={handleLogout}>
              <LogoutIcon className="menu-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} 
          onClick={closeSidebar}
          role="button"
          aria-label="Close sidebar"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              closeSidebar();
            }
          }}
        />
      )}
    </>
  );
}

export default SellerNavbar;
