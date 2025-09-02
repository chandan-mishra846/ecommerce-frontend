import React, { useState } from 'react';
import StripePayment from '../components/StripePayment';
import { toast } from 'react-toastify';
import '../pageStyles/PaymentTestPage.css';

const StripeTestPage = () => {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Test order information
  const testOrderInfo = {
    orderId: 'test-stripe-order-123',
    userId: 'test-user-123',
    userEmail: 'test@example.com',
    shippingInfo: {
      name: 'Test User',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      country: 'US',
      pinCode: '12345',
      phoneNo: '1234567890',
    },
    orderItems: [
      {
        name: 'Test Product 1',
        price: 25.99,
        quantity: 1,
        image: 'https://via.placeholder.com/150',
        product: 'test-product-1',
      },
      {
        name: 'Test Product 2',
        price: 15.99,
        quantity: 2,
        image: 'https://via.placeholder.com/150',
        product: 'test-product-2',
      },
    ],
    itemPrice: 57.97,
    taxPrice: 5.80,
    shippingPrice: 10.00,
    totalPrice: 73.77,
  };

  const handlePaymentSuccess = (data) => {
    console.log('✅ Test Payment successful:', data);
    setOrderData(data);
    setPaymentComplete(true);
    toast.success('🎉 Test Payment completed successfully!');
  };

  const handlePaymentError = (error) => {
    console.error('❌ Test Payment error:', error);
    toast.error(`❌ Test Payment failed: ${error}`);
  };

  const resetTest = () => {
    setPaymentComplete(false);
    setOrderData(null);
  };

  if (paymentComplete) {
    return (
      <div className="payment-success-page">
        <div className="success-container">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>🎉 Test Payment Successful!</h2>
          <p>Your test payment has been processed successfully.</p>
          
          <div className="order-details">
            <h3>📄 Test Order Details</h3>
            <p><strong>Order ID:</strong> {orderData?.order?._id}</p>
            <p><strong>Payment ID:</strong> {orderData?.paymentId}</p>
            <p><strong>Total Amount:</strong> ${testOrderInfo.totalPrice}</p>
            <p><strong>Status:</strong> {orderData?.order?.PaymentInfo?.status}</p>
            <p><strong>Payment Method:</strong> Stripe (Test Mode)</p>
          </div>

          <button className="btn-primary" onClick={resetTest}>
            🔄 Test Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-test-page">
      <div className="container">
        <h1>🧪 Stripe Payment Test</h1>
        
        <div className="test-instructions">
          <h2>🎯 Test Instructions</h2>
          <div className="instruction-grid">
            <div className="instruction-card">
              <h3>✅ Successful Payment</h3>
              <p><strong>Card:</strong> 4242 4242 4242 4242</p>
              <p><strong>Expiry:</strong> Any future date</p>
              <p><strong>CVC:</strong> Any 3 digits</p>
            </div>
            <div className="instruction-card">
              <h3>🔐 3D Secure Test</h3>
              <p><strong>Card:</strong> 4000 0027 6000 3184</p>
              <p><strong>Expiry:</strong> Any future date</p>
              <p><strong>CVC:</strong> Any 3 digits</p>
            </div>
            <div className="instruction-card">
              <h3>❌ Declined Payment</h3>
              <p><strong>Card:</strong> 4000 0000 0000 0002</p>
              <p><strong>Expiry:</strong> Any future date</p>
              <p><strong>CVC:</strong> Any 3 digits</p>
            </div>
          </div>
        </div>
        
        <div className="order-summary">
          <h2>📦 Test Order Summary</h2>
          <div className="order-items">
            {testOrderInfo.orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">Qty: {item.quantity}</span>
                <span className="item-price">${item.price}</span>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${testOrderInfo.itemPrice}</span>
            </div>
            <div className="total-row">
              <span>Tax:</span>
              <span>${testOrderInfo.taxPrice}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>${testOrderInfo.shippingPrice}</span>
            </div>
            <div className="total-row total-final">
              <span><strong>Total:</strong></span>
              <span><strong>${testOrderInfo.totalPrice}</strong></span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <StripePayment
            orderInfo={testOrderInfo}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default StripeTestPage;
