import React, { useState } from 'react';
import axios from 'axios';
import '../componentStyles/StripePayment.css';

const TestModePayment = ({ 
  orderInfo, 
  onPaymentSuccess, 
  onPaymentError
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isProcessed, setIsProcessed] = useState(false); // Prevent multiple submissions
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: orderInfo.shippingInfo?.name || ''
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = () => {
    const cleanNumber = cardData.number.replace(/\s/g, '');
    const testCards = {
      '4242424242424242': 'success',
      '4000002760003184': '3d_secure', 
      '4000000000000002': 'declined'
    };

    if (!cleanNumber) {
      return { valid: false, message: 'Please enter a card number' };
    }

    if (cleanNumber.length < 16) {
      return { valid: false, message: 'Card number is too short' };
    }

    if (!cardData.expiry || cardData.expiry.length < 5) {
      return { valid: false, message: 'Please enter a valid expiry date' };
    }

    if (!cardData.cvc || cardData.cvc.length < 3) {
      return { valid: false, message: 'Please enter a valid CVC' };
    }

    if (!cardData.name.trim()) {
      return { valid: false, message: 'Please enter the cardholder name' };
    }

    const cardType = testCards[cleanNumber];
    if (!cardType) {
      return { valid: false, message: 'Please use a valid test card number' };
    }

    if (cardType === 'declined') {
      return { valid: false, message: 'Your card was declined' };
    }

    return { valid: true, cardType };
  };

  const verifyPaymentAndCreateOrder = async (paymentIntentId) => {
    try {
      const orderData = {
        shippingInfo: {
          address: orderInfo.shippingInfo.address,
          city: orderInfo.shippingInfo.city,
          state: orderInfo.shippingInfo.state,
          country: orderInfo.shippingInfo.country,
          pincode: parseInt(orderInfo.shippingInfo.pinCode) || parseInt(orderInfo.shippingInfo.pincode),
          phoneNumber: parseInt(orderInfo.shippingInfo.phoneNo) || parseInt(orderInfo.shippingInfo.phoneNumber)
        },
        orderItems: orderInfo.orderItems || orderInfo.orderedItems,
        PaymentInfo: {
          id: paymentIntentId,
          status: 'succeeded'
        },
        user: orderInfo.userId,
        paidAt: new Date(),
        itemPrice: orderInfo.itemPrice || 0,
        taxPrice: orderInfo.taxPrice || 0,
        shippingPrice: orderInfo.shippingPrice || 0,
        totalPrice: orderInfo.totalPrice
      };

      console.log('🔍 Order data being sent:', orderData);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post('/api/v1/new/order', orderData, config);
      
      if (data.success) {
        // Prevent duplicate success handling
        if (!isProcessed) {
          setIsProcessed(true);
          console.log('Order created successfully:', data.order._id);
          onPaymentSuccess({ order: data.order });
        }
      } else {
        throw new Error(data.message || 'Order creation failed');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Prevent multiple submissions
    if (loading || isProcessed) return;
    
    setLoading(true);
    setPaymentError('');

    const validation = validateCard();
    if (!validation.valid) {
      setPaymentError(validation.message);
      setLoading(false);
      return;
    }

    try {
      console.log('🧪 Processing test payment...');
      
      // Simulate payment processing delay
      setTimeout(async () => {
        try {
          const paymentIntentId = 'pi_test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          await verifyPaymentAndCreateOrder(paymentIntentId);
        } catch (error) {
          console.error('Payment processing error:', error);
        } finally {
          setLoading(false);
        }
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvc') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 3);
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="payment-container">
        <h3>Payment Information</h3>
        
        {/* Test Mode Banner */}
        <div className="test-mode-banner">
          <h4>🧪 Test Mode - Use These Test Cards:</h4>
          <div className="test-cards">
            <div className="test-card">
              <strong>✅ Success:</strong> 4242 4242 4242 4242
            </div>
            <div className="test-card">
              <strong>🔐 3D Secure:</strong> 4000 0027 6000 3184
            </div>
            <div className="test-card">
              <strong>❌ Declined:</strong> 4000 0000 0000 0002
            </div>
            <div className="test-card-note">
              <small>Use any future expiry date (e.g., 12/25) and any 3-digit CVC</small>
            </div>
          </div>
        </div>

        {/* Test Card Form */}
        <div className="test-card-form">
          <div className="card-field">
            <label>Card Number</label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="card-input"
            />
          </div>

          <div className="card-row">
            <div className="card-field">
              <label>Expiry Date</label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => handleInputChange('expiry', e.target.value)}
                placeholder="MM/YY"
                maxLength="5"
                className="card-input"
              />
            </div>
            <div className="card-field">
              <label>CVC</label>
              <input
                type="text"
                value={cardData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value)}
                placeholder="123"
                maxLength="3"
                className="card-input"
              />
            </div>
          </div>

          <div className="card-field">
            <label>Cardholder Name</label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              className="card-input"
            />
          </div>
        </div>
        
        {paymentError && (
          <div className="payment-error">
            {paymentError}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`pay-button ${loading ? 'processing' : ''}`}
        >
          {loading ? 'Processing...' : `Pay $${orderInfo.totalPrice} (Test Mode)`}
        </button>
        
        <div className="payment-info">
          <p>
            <i className="fas fa-lock"></i>
            Test payment - No real money will be charged
          </p>
        </div>
      </div>
    </form>
  );
};

export default TestModePayment;
