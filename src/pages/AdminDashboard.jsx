import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/Dashboard.css';

// Import Redux actions
import { fetchDashboardAnalytics } from '../features/analytics/analyticsSlice';
import { getAllOrders } from '../features/orders/orderSlice';

// Material UI Icons
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function AdminDashboard() {
  const { user } = useSelector(state => state.user);
  const { dashboardData, loading, error } = useSelector(state => state.analytics);
  const { orders } = useSelector(state => state.order);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Process low stock products when dashboardData is available
  useEffect(() => {
    if (dashboardData && dashboardData.productsData) {
      // For now we'll use dummy data for low stock products
      // In a real implementation, you might add this to your backend API
      setLowStockProducts([
        { id: 'PRD-001', name: 'Wireless Headphones', stock: 5, category: 'Electronics' },
        { id: 'PRD-002', name: 'Smart Watch', stock: 3, category: 'Electronics' },
        { id: 'PRD-003', name: 'Running Shoes', stock: 7, category: 'Sports' }
      ]);
    }
  }, [dashboardData]);

  // Navigation handlers for quick action buttons
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status class for order status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-dashboard">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin portal. Manage your entire e-commerce platform.</p>
          </div>

          {loading ? (
            <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              <div className="admin-stats-grid">
                <div className="admin-stat-card" onClick={() => handleNavigate('/admin/users')}>
                  <div className="stat-icon users-icon">
                    <PersonIcon />
                  </div>
                  <div className="stat-content">
                    <h3>Total Users</h3>
                    <p className="stat-number">{dashboardData?.usersData?.total || 0}</p>
                    <p className="stat-action">View all users →</p>
                  </div>
                </div>
                <div className="admin-stat-card" onClick={() => handleNavigate('/admin/sellers')}>
                  <div className="stat-icon sellers-icon">
                    <StorefrontIcon />
                  </div>
                  <div className="stat-content">
                    <h3>Total Sellers</h3>
                    <p className="stat-number">{dashboardData?.sellersData?.total || 0}</p>
                    <p className="stat-action">View all sellers →</p>
                  </div>
                </div>
                <div className="admin-stat-card" onClick={() => handleNavigate('/admin/products')}>
                  <div className="stat-icon products-icon">
                    <InventoryIcon />
                  </div>
                  <div className="stat-content">
                    <h3>Total Products</h3>
                    <p className="stat-number">{dashboardData?.productsData?.total || 0}</p>
                    <p className="stat-action">View all products →</p>
                  </div>
                </div>
                <div className="admin-stat-card" onClick={() => handleNavigate('/admin/orders')}>
                  <div className="stat-icon orders-icon">
                    <ShoppingCartIcon />
                  </div>
                  <div className="stat-content">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{dashboardData?.ordersData?.total || 0}</p>
                    <p className="stat-action">View all orders →</p>
                  </div>
                </div>
              </div>

              <div className="admin-quick-actions">
                <h3>Quick Actions</h3>
                <div className="admin-action-buttons">
                  <button 
                    className="admin-action-btn"
                    onClick={() => handleNavigate('/admin/users')}
                  >
                    <PersonIcon /> Manage Users
                  </button>
                  <button 
                    className="admin-action-btn"
                    onClick={() => handleNavigate('/admin/sellers')}
                  >
                    <StorefrontIcon /> Manage Sellers
                  </button>
                  <button 
                    className="admin-action-btn"
                    onClick={() => handleNavigate('/admin/products')}
                  >
                    <InventoryIcon /> View All Products
                  </button>
                  <button 
                    className="admin-action-btn"
                    onClick={() => handleNavigate('/admin/orders')}
                  >
                    <ShoppingCartIcon /> Process Orders
                  </button>
                  <button 
                    className="admin-action-btn"
                    onClick={() => handleNavigate('/admin/analytics')}
                  >
                    <BarChartIcon /> View Analytics
                  </button>
                  <button 
                    className="admin-action-btn"
                    onClick={() => handleNavigate('/admin/products/create')}
                  >
                    <AddCircleIcon /> Add New Product
                  </button>
                </div>
              </div>
              
              <div className="dashboard-sections">
                <div className="dashboard-section recent-orders">
                  <h3>Recent Orders</h3>
                  {orders && orders.length > 0 ? (
                    <div className="orders-table-container">
                      <table className="orders-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 3).map(order => (
                            <tr key={order._id}>
                              <td>{order._id.substring(0, 8)}</td>
                              <td>{order.user?.name || 'N/A'}</td>
                              <td>{formatCurrency(order.totalPrice || 0)}</td>
                              <td>
                                <span className={`order-status ${getStatusClass(order.orderStatus || 'Processing')}`}>
                                  {order.orderStatus || 'Processing'}
                                </span>
                              </td>
                              <td>{formatDate(order.createdAt)}</td>
                              <td>
                                <button 
                                  className="view-details-btn"
                                  onClick={() => handleNavigate(`/admin/order/update/${order._id}`)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button 
                        className="view-all-btn"
                        onClick={() => handleNavigate('/admin/orders')}
                      >
                        View All Orders
                      </button>
                    </div>
                  ) : (
                    <p className="no-data">No recent orders found</p>
                  )}
                </div>
                
                <div className="dashboard-section low-stock">
                  <h3>Low Stock Products</h3>
                  {lowStockProducts.length > 0 ? (
                    <div className="products-table-container">
                      <table className="products-table">
                        <thead>
                          <tr>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Stock</th>
                            <th>Category</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStockProducts.map(product => (
                            <tr key={product.id}>
                              <td>{product.id}</td>
                              <td>{product.name}</td>
                              <td className="low-stock-count">
                                <WarningIcon className="warning-icon" /> {product.stock}
                              </td>
                              <td>{product.category}</td>
                              <td>
                                <button 
                                  className="view-details-btn"
                                  onClick={() => handleNavigate(`/admin/product/update/${product.id}`)}
                                >
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button 
                        className="view-all-btn"
                        onClick={() => handleNavigate('/admin/products')}
                      >
                        View All Products
                      </button>
                    </div>
                  ) : (
                    <p className="no-data">No low stock products found</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
