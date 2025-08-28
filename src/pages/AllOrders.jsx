import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';
import '../pageStyles/AllOrders.css';

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/v1/seller/orders', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setOrders(result.orders || []);
      } else {
        toast.error(result.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/v1/seller/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Order status updated successfully!');
        fetchOrders(); // Refresh the list
      } else {
        toast.error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'shipped':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus?.toLowerCase() === filter;
  });

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.orderStatus?.toLowerCase() === 'pending').length,
      processing: orders.filter(o => o.orderStatus?.toLowerCase() === 'processing').length,
      shipped: orders.filter(o => o.orderStatus?.toLowerCase() === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus?.toLowerCase() === 'delivered').length,
    };
    return stats;
  };

  // Check if user is seller
  if (!user || user.role !== 'seller') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need to be a registered seller to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  const stats = getOrderStats();

  return (
    <>

      <div className="all-orders-container">
        <div className="all-orders-header">
          <h1>All Orders</h1>
          <p>Manage and track all your customer orders</p>
        </div>

        <div className="orders-stats">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <div className="stat-number">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="stat-number" style={{color: '#f59e0b'}}>{stats.pending}</div>
          </div>
          <div className="stat-card">
            <h3>Processing</h3>
            <div className="stat-number" style={{color: '#3b82f6'}}>{stats.processing}</div>
          </div>
          <div className="stat-card">
            <h3>Delivered</h3>
            <div className="stat-number" style={{color: '#10b981'}}>{stats.delivered}</div>
          </div>
        </div>

        <div className="orders-filter">
          <h3>Filter Orders:</h3>
          <div className="filter-buttons">
            {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No Orders Found</h2>
            <p>
              {filter === 'all' 
                ? "You haven't received any orders yet." 
                : `No ${filter} orders found.`}
            </p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">Order #{order._id?.slice(-8)}</div>
                  <div 
                    className="order-status"
                    style={{ 
                      backgroundColor: getStatusColor(order.orderStatus) + '20',
                      color: getStatusColor(order.orderStatus)
                    }}
                  >
                    {order.orderStatus}
                  </div>
                </div>

                <div className="order-details">
                  <div className="customer-info">
                    <h4>Customer: {order.user?.name || 'Unknown'}</h4>
                    <p>Email: {order.user?.email || 'N/A'}</p>
                  </div>

                  <div className="order-items">
                    <h4>Items ({order.orderItems?.length || 0}):</h4>
                    {order.orderItems?.slice(0, 2).map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.name}</span>
                        <span>₹{item.price} × {item.quantity}</span>
                      </div>
                    ))}
                    {order.orderItems?.length > 2 && (
                      <p className="more-items">+{order.orderItems.length - 2} more items</p>
                    )}
                  </div>

                  <div className="order-summary">
                    <div className="order-total">
                      <strong>Total: ₹{order.totalPrice || 0}</strong>
                    </div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AllOrders;
