import React, { useState } from 'react';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { toast } from 'react-toastify';
import '../pageStyles/PaymentTestPage.css';

const PaymentTestPage = () => {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Example order information
  const sampleOrderInfo = {
    orderId: 'test-order-123',
    userId: 'user-123',
    userEmail: 'customer@example.com',
    shippingInfo: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'US',
      pinCode: '10001',
      phoneNo: '1234567890',
    },
    orderItems: [
      {
        name: 'Sample Product 1',
        price: 29.99,
        quantity: 2,
        image: 'https://via.placeholder.com/150',
        product: 'product-id-1',
      },
      {
        name: 'Sample Product 2',
        price: 19.99,
        quantity: 1,
        image: 'https://via.placeholder.com/150',
        product: 'product-id-2',
      },
    ],
    itemPrice: 79.97,
    taxPrice: 7.99,
    shippingPrice: 5.00,
    totalPrice: 92.96,
  };

  const handlePaymentSuccess = (data) => {
    console.log('Payment successful:', data);
    setOrderData(data);
    setPaymentComplete(true);
    toast.success('Payment completed successfully!');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error(error || 'Payment failed. Please try again.');
  };

  const resetPayment = () => {
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
          <h2>Payment Successful!</h2>
          <p>Your order has been placed successfully.</p>
          
          <div className="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {orderData?.order?._id}</p>
            <p><strong>Payment ID:</strong> {orderData?.paymentId}</p>
            <p><strong>Total Amount:</strong> ${sampleOrderInfo.totalPrice}</p>
            <p><strong>Status:</strong> {orderData?.order?.PaymentInfo?.status}</p>
          </div>

          <button className="btn-primary" onClick={resetPayment}>
            Test Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-test-page">
      <div className="container">
        <h1>Payment Integration Test</h1>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {sampleOrderInfo.orderItems.map((item, index) => (
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
              <span>${sampleOrderInfo.itemPrice}</span>
            </div>
            <div className="total-row">
              <span>Tax:</span>
              <span>${sampleOrderInfo.taxPrice}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>${sampleOrderInfo.shippingPrice}</span>
            </div>
            <div className="total-row total-final">
              <span><strong>Total:</strong></span>
              <span><strong>${sampleOrderInfo.totalPrice}</strong></span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <PaymentMethodSelector
            orderInfo={sampleOrderInfo}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;
