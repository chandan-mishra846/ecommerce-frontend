import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import '../OrderStyles/OrderHistory.css';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch('/api/v1/seller/orders/history', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setOrders(result.orders || []);
      } else {
        toast.error(result.message || 'Failed to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
      toast.error('Error fetching order history');
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByDate = (orders) => {
    if (dateFilter === 'all') return orders;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateFilter) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        return orders.filter(order => new Date(order.createdAt) >= filterDate);
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        return orders.filter(order => new Date(order.createdAt) >= filterDate);
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        return orders.filter(order => new Date(order.createdAt) >= filterDate);
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        return orders.filter(order => new Date(order.createdAt) >= filterDate);
      default:
        return orders;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  const calculateTotalRevenue = (orders) => {
    return orders
      .filter(order => order.orderStatus?.toLowerCase() === 'delivered')
      .reduce((total, order) => total + (order.totalPrice || 0), 0);
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

  const filteredOrders = filterOrdersByDate(orders);
  const totalRevenue = calculateTotalRevenue(filteredOrders);

  return (
    <>
      <div className="order-history-container">
        <div className="order-history-header">
          <h1>Order History</h1>
          <p>Complete history of all your orders</p>
        </div>

        <div className="history-stats">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <div className="stat-number">{filteredOrders.length}</div>
          </div>
          <div className="stat-card revenue">
            <h3>Total Revenue</h3>
            <div className="stat-number">₹{totalRevenue}</div>
          </div>
        </div>

        <div className="history-filter">
          <h3>Filter by Date:</h3>
          <div className="filter-buttons">
            {[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last Week' },
              { value: 'month', label: 'Last Month' },
              { value: 'year', label: 'Last Year' }
            ].map(option => (
              <button
                key={option.value}
                className={`filter-btn ${dateFilter === option.value ? 'active' : ''}`}
                onClick={() => setDateFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-history">
            <div className="no-history-icon">📋</div>
            <h2>No Order History</h2>
            <p>No orders found for the selected time period.</p>
          </div>
        ) : (
          <div className="history-timeline">
            {filteredOrders.map((order) => (
              <div key={order._id} className="timeline-item">
                <div className="timeline-marker">
                  <span className="status-icon">
                    {getStatusIcon(order.orderStatus)}
                  </span>
                </div>
                
                <div className="timeline-content">
                  <div className="order-info">
                    <div className="order-header">
                      <h4>Order #{order._id?.slice(-8)}</h4>
                      <span className={`status-badge ${order.orderStatus?.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    
                    <div className="order-meta">
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="order-amount">₹{order.totalPrice}</span>
                    </div>
                    
                    <div className="customer-details">
                      <strong>Customer:</strong> {order.user?.name || 'Unknown'}
                    </div>
                    
                    <div className="order-items-summary">
                      <strong>Items:</strong> {order.orderItems?.length || 0} product(s)
                      {order.orderItems?.slice(0, 2).map((item, index) => (
                        <div key={index} className="item-summary">
                          • {item.name} × {item.quantity}
                        </div>
                      ))}
                      {order.orderItems?.length > 2 && (
                        <div className="more-items">
                          ... and {order.orderItems.length - 2} more items
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default OrderHistory;
