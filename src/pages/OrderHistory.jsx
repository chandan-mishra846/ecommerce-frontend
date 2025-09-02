import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getMyOrders, clearErrors } from '../features/orders/orderSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import PageTitle from '../components/PageTitle';
import '../OrderStyles/OrderHistory.css';

function OrderHistory() {
  const dispatch = useDispatch();
  const [dateFilter, setDateFilter] = useState('all');
  const { orders, loading, error } = useSelector((state) => state.order);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyOrders());
    }
    
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, isAuthenticated]);

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

  const calculateTotalSpent = (orders) => {
    return orders
      .filter(order => order.orderStatus?.toLowerCase() !== 'cancelled')
      .reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <>
        <PageTitle title="My Orders" />
        <Navbar />
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Please login to view your orders.</p>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageTitle title="My Orders" />
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  const filteredOrders = filterOrdersByDate(orders || []);
  const totalSpent = calculateTotalSpent(filteredOrders);

  return (
    <>
      <PageTitle title="My Orders - ShopEasy" />
      <Navbar />
      <div className="order-history-container">
        <div className="order-history-header">
          <h1>My Orders</h1>
          <p>Track all your orders and purchase history</p>
        </div>

        <div className="history-stats">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <div className="stat-number">{filteredOrders.length}</div>
          </div>
          <div className="stat-card revenue">
            <h3>Total Spent</h3>
            <div className="stat-number">₹{totalSpent.toFixed(2)}</div>
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
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
            <button 
              className="shop-now-btn"
              onClick={() => window.location.href = '/'}
            >
              Start Shopping
            </button>
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
                      <span 
                        className={`status-badge ${order.orderStatus?.toLowerCase()}`}
                        style={{ 
                          backgroundColor: getStatusColor(order.orderStatus) + '20',
                          color: getStatusColor(order.orderStatus)
                        }}
                      >
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
                    
                    <div className="shipping-details">
                      <strong>Shipped to:</strong> 
                      <div className="address">
                        {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pincode}
                      </div>
                    </div>
                    
                    <div className="order-items-summary">
                      <strong>Items:</strong> {order.orderItems?.length || 0} product(s)
                      {order.orderItems?.slice(0, 3).map((item, index) => (
                        <div key={index} className="item-summary">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="item-image"
                            onError={(e) => {
                              e.target.src = '/images/products/variations/adults-plain-cotton-tshirt-2-pack-black.jpg';
                            }}
                          />
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-qty">Qty: {item.quantity}</span>
                            <span className="item-price">₹{item.price}</span>
                          </div>
                        </div>
                      ))}
                      {order.orderItems?.length > 3 && (
                        <div className="more-items">
                          ... and {order.orderItems.length - 3} more items
                        </div>
                      )}
                    </div>

                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Items Total:</span>
                        <span>₹{order.itemPrice}</span>
                      </div>
                      <div className="summary-row">
                        <span>Tax:</span>
                        <span>₹{order.taxPrice}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping:</span>
                        <span>₹{order.shippingPrice}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total:</span>
                        <span>₹{order.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OrderHistory;
