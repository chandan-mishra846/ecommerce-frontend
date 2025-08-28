import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerStats, clearErrors } from '../features/seller/sellerSlice';
import { toast } from 'react-toastify';
import SellerNavbar from '../components/SellerNavbar';
import Loader from '../components/Loader';
import '../pageStyles/SellerDashboard.css';

// Material UI Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

function SellerDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.seller);

  useEffect(() => {
    dispatch(getSellerStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  if (loading) {
    return <Loader />;
  }

  const statsCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <InventoryIcon />,
      color: '#3f51b5',
      bgColor: '#e8eaf6'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCartIcon />,
      color: '#4caf50',
      bgColor: '#e8f5e8'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue || 0}`,
      icon: <AttachMoneyIcon />,
      color: '#ff9800',
      bgColor: '#fff3e0'
    },
    {
      title: 'Delivered Orders',
      value: stats?.deliveredOrders || 0,
      icon: <TrendingUpIcon />,
      color: '#2196f3',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <PendingActionsIcon />,
      color: '#9c27b0',
      bgColor: '#f3e5f5'
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStockProducts || 0,
      icon: <WarningIcon />,
      color: '#f44336',
      bgColor: '#ffebee'
    }
  ];

  return (
    <div>
      <SellerNavbar />
      <div className="seller-content">
        <div className="seller-dashboard">
          <div className="dashboard-header">
            <h1>Seller Dashboard</h1>
            <p>Welcome to your seller portal. Here's an overview of your business.</p>
          </div>

          <div className="stats-grid">
            {statsCards.map((card, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ color: card.color, backgroundColor: card.bgColor }}>
                  {card.icon}
                </div>
                <div className="stat-content">
                  <h3>{card.value}</h3>
                  <p>{card.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-actions">
            <div className="action-card">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn primary">Add New Product</button>
                <button className="action-btn secondary">View All Orders</button>
                <button className="action-btn tertiary">Check Inventory</button>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <ShoppingCartIcon />
                  </div>
                  <div className="activity-content">
                    <p>New order received</p>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <InventoryIcon />
                  </div>
                  <div className="activity-content">
                    <p>Product stock updated</p>
                    <span>1 day ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <TrendingUpIcon />
                  </div>
                  <div className="activity-content">
                    <p>Revenue increased by 15%</p>
                    <span>3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
