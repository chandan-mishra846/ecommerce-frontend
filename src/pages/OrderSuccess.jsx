import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../pageStyles/OrderSuccess.css';

// Material UI Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeIcon from '@mui/icons-material/Home';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orderId, paymentId } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return (
      <>
        <Navbar />
        <div className="order-success-container">
          <div className="error-message">
            <h2>Invalid Order</h2>
            <p>Order details not found.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Go to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar />
      <div className="order-success-container">
        <div className="success-content">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">
              <CheckCircleIcon />
            </div>
            <h1>Order Placed Successfully!</h1>
            <p className="success-subtitle">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="order-details-card">
            <div className="order-header">
              <h2>Order Details</h2>
              <div className="order-id">
                Order ID: <span>#{orderId.slice(-8).toUpperCase()}</span>
              </div>
            </div>

            <div className="order-info-grid">
              <div className="info-section">
                <h3>Order Information</h3>
                <div className="info-row">
                  <span>Order Date:</span>
                  <span>{formatDate(new Date())}</span>
                </div>
                <div className="info-row">
                  <span>Order Status:</span>
                  <span className="status-badge processing">Processing</span>
                </div>
                <div className="info-row">
                  <span>Payment Status:</span>
                  <span className="status-badge success">Paid</span>
                </div>
                {paymentId && (
                  <div className="info-row">
                    <span>Payment ID:</span>
                    <span className="payment-id">{paymentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="steps-grid">
              <div className="step-card">
                <ReceiptIcon />
                <h4>Order Confirmation</h4>
                <p>You'll receive an email confirmation with order details shortly.</p>
              </div>
              <div className="step-card">
                <LocalShippingIcon />
                <h4>Order Processing</h4>
                <p>Your order will be processed and shipped within 1-2 business days.</p>
              </div>
              <div className="step-card">
                <LocalShippingIcon />
                <h4>Track Your Order</h4>
                <p>Once shipped, you'll receive tracking information via email.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/orders')} 
              className="btn-secondary"
            >
              View Order History
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="btn-primary"
            >
              <HomeIcon />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderSuccess;
