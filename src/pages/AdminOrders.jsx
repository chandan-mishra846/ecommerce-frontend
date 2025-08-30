import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminOrders.css';
import '../AdminStyles/OrdersList.css';

// Import Redux actions
import { 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder, 
  clearErrors 
} from '../features/orders/orderSlice';

// Import Material UI icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const dispatch = useDispatch();
  const { orders, loading, error, totalAmount, isDeleted, isUpdated } = useSelector(state => state.order);
  
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success('Order deleted successfully');
      dispatch(getAllOrders());
    }

    if (isUpdated) {
      toast.success('Order status updated successfully');
      dispatch(getAllOrders());
    }
  }, [error, isDeleted, isUpdated, dispatch]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    dispatch(deleteOrder(orderId));
  };

  // Filter and sort orders
  const getFilteredOrders = () => {
    if (!orders) return [];
    
    let filtered = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === filterStatus);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'order-asc':
        filtered.sort((a, b) => a._id.localeCompare(b._id));
        break;
      case 'order-desc':
        filtered.sort((a, b) => b._id.localeCompare(a._id));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <InventoryIcon className="status-icon processing" />;
      case 'Shipped':
        return <LocalShippingIcon className="status-icon shipped" />;
      case 'Delivered':
        return <CheckCircleIcon className="status-icon delivered" />;
      case 'Cancelled':
        return <CancelIcon className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const getTotalOrdersValue = () => {
    if (!orders || orders.length === 0) return '0.00';
    return orders
      .filter(order => order.orderStatus !== 'Cancelled')
      .reduce((total, order) => total + (order.totalPrice || 0), 0)
      .toFixed(2);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-orders-container">
          <div className="admin-page-header">
            <h1>Order Management</h1>
            <p>View, update, and manage all customer orders</p>
          </div>

          <div className="order-stats">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p>{orders.length}</p>
            </div>
            <div className="stat-card">
              <h3>Processing</h3>
              <p>{orders.filter(order => order.orderStatus === 'Processing').length}</p>
            </div>
            <div className="stat-card">
              <h3>Shipped</h3>
              <p>{orders.filter(order => order.orderStatus === 'Shipped').length}</p>
            </div>
            <div className="stat-card">
              <h3>Delivered</h3>
              <p>{orders.filter(order => order.orderStatus === 'Delivered').length}</p>
            </div>
            <div className="stat-card total-value">
              <h3>Total Value</h3>
              <p>${getTotalOrdersValue()}</p>
            </div>
          </div>

          <div className="admin-filters">
            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search by order number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-options">
              <div className="status-filter">
                <label><FilterListIcon /> Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="sort-filter">
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="order-asc">Order #: Ascending</option>
                  <option value="order-desc">Order #: Descending</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <tr key={order._id}>
                        <td>{order._id.substring(0, 8)}</td>
                        <td className="customer-info">
                          <div className="customer-name">{order.user?.name || 'User'}</div>
                          <div className="customer-email">{order.user?.email || 'No email'}</div>
                        </td>
                        <td className="order-items">
                          <div className="item-count">{order.orderItems?.length || 0} item(s)</div>
                          <div className="item-thumbnails">
                            {order.orderItems && order.orderItems.slice(0, 3).map((item, index) => (
                              <img 
                                key={item._id || index} 
                                src={item.image || '/public/vite.svg'} 
                                alt={item.name || 'Product'} 
                                className="item-thumbnail" 
                                title={item.name || 'Product'}
                              />
                            ))}
                            {order.orderItems && order.orderItems.length > 3 && (
                              <div className="more-items">+{order.orderItems.length - 3}</div>
                            )}
                          </div>
                        </td>
                        <td className="order-total">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                        <td className="order-status">
                          <div className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                            {getStatusIcon(order.orderStatus)}
                            <span>{order.orderStatus}</span>
                          </div>
                          <select
                            className="status-select"
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="order-date">
                          <div>Ordered: {formatDate(order.createdAt)}</div>
                          {order.deliveredAt && (
                            <div className="delivered-date">Delivered: {formatDate(order.deliveredAt)}</div>
                          )}
                        </td>
                        <td className="actions">
                          <Link to={`/admin/order/update/${order._id}`} className="view-btn" title="View Order Details">
                            <VisibilityIcon />
                          </Link>
                          <Link to={`/admin/order/update/${order._id}`} className="edit-btn" title="Edit Order">
                            <EditIcon />
                          </Link>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteOrder(order._id)}
                            title="Delete Order"
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        No orders found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
