import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/ProcessOrder.css';

// Import Redux actions
import { 
  getOrderDetails, 
  updateOrderStatus, 
  resetUpdateStatus,
  clearErrors
} from '../features/orders/orderSlice';

// Import Material UI icons
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProcessOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Get order state from Redux
  const { order, loading, error, isUpdated } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.orderStatus);
    }
  }, [order]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success('Order status updated successfully');
      dispatch(resetUpdateStatus());
    }
  }, [error, isUpdated, dispatch]);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === order.orderStatus) {
      return;
    }

    dispatch(updateOrderStatus({ id, status: selectedStatus }));
  };

  const [processing, setProcessing] = useState(false);

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

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="admin-content">
          <div className="process-order-container">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <AdminNavbar />
        <div className="admin-content">
          <div className="process-order-container">
            <div className="error-message">
              <h2>Order Not Found</h2>
              <p>The requested order could not be found.</p>
              <button 
                className="back-btn"
                onClick={() => navigate('/admin/orders')}
              >
                <ArrowBackIcon /> Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="process-order-container">
          <div className="process-order-header">
            <div>
              <h1>Process Order #{order._id}</h1>
              <p>Update order status and manage fulfillment</p>
            </div>
            <button 
              className="back-btn"
              onClick={() => navigate('/admin/orders')}
            >
              <ArrowBackIcon /> Back to Orders
            </button>
          </div>

          <div className="order-process-content">
            <div className="order-details-section">
              <div className="order-info-card">
                <h2>Order Information</h2>
                <div className="info-grid">
                  <div className="info-group">
                    <label>Order ID:</label>
                    <span>{order._id}</span>
                  </div>
                  <div className="info-group">
                    <label>Order Date:</label>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="info-group">
                    <label>Payment ID:</label>
                    <span>{order.PaymentInfo ? order.PaymentInfo.id : 'N/A'}</span>
                  </div>
                  <div className="info-group">
                    <label>Payment Status:</label>
                    <span className={`payment-status ${order.PaymentInfo ? order.PaymentInfo.status : 'pending'}`}>
                      {order.PaymentInfo ? order.PaymentInfo.status : 'pending'}
                    </span>
                  </div>
                  <div className="info-group">
                    <label>Paid At:</label>
                    <span>{formatDate(order.paidAt)}</span>
                  </div>
                </div>
              </div>

              <div className="order-customer-card">
                <h2>Customer Information</h2>
                <div className="customer-details">
                  <div className="info-group">
                    <label>Name:</label>
                    <span>{order.user.name}</span>
                  </div>
                  <div className="info-group">
                    <label>Email:</label>
                    <span>{order.user.email}</span>
                  </div>
                </div>
              </div>

              <div className="order-shipping-card">
                <h2>Shipping Information</h2>
                <div className="shipping-details">
                  <div className="info-group">
                    <label>Address:</label>
                    <span>{order.shippingInfo.address}</span>
                  </div>
                  <div className="info-group">
                    <label>City:</label>
                    <span>{order.shippingInfo.city}</span>
                  </div>
                  <div className="info-group">
                    <label>State:</label>
                    <span>{order.shippingInfo.state}</span>
                  </div>
                  <div className="info-group">
                    <label>Country:</label>
                    <span>{order.shippingInfo.country}</span>
                  </div>
                  <div className="info-group">
                    <label>Postal Code:</label>
                    <span>{order.shippingInfo.pinCode}</span>
                  </div>
                  <div className="info-group">
                    <label>Phone:</label>
                    <span>{order.shippingInfo.phoneNo}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-items-section">
              <div className="order-items-card">
                <h2>Order Items</h2>
                <div className="order-items-list">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="item-image">
                        <img src={item.image || '/public/vite.svg'} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-meta">
                          <span className="item-price">${item.price.toFixed(2)}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </div>
                        <div className="item-total">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-summary-card">
                <h2>Order Summary</h2>
                <div className="summary-details">
                  <div className="summary-item">
                    <span>Items Subtotal:</span>
                    <span>${order.itemPric ? order.itemPric.toFixed(2) : (0).toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Shipping:</span>
                    <span>${order.shippingPrice ? order.shippingPrice.toFixed(2) : (0).toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Tax:</span>
                    <span>${order.taxPrice ? order.taxPrice.toFixed(2) : (0).toFixed(2)}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total:</span>
                    <span>${order.totalPrice ? order.totalPrice.toFixed(2) : (0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="order-status-card">
                <h2>Order Status</h2>
                <div className="current-status">
                  <label>Current Status:</label>
                  <div className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span>{order.orderStatus}</span>
                  </div>
                </div>
                
                <div className="update-status">
                  <h3>Update Status</h3>
                  <div className="status-form">
                    <div className="status-select-container">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="status-select"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      className={`update-status-btn ${loading ? 'processing' : ''}`}
                      onClick={handleUpdateStatus}
                      disabled={loading || selectedStatus === order.orderStatus}
                    >
                      {loading ? 'Updating...' : 'Update Status'}
                    </button>
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

export default ProcessOrder;
