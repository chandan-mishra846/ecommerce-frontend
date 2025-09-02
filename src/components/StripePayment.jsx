import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

// Initialize Stripe
let stripePromise;

const getStripe = async () => {
  if (!stripePromise) {
    try {
      const { data } = await axios.get('/api/v1/payment/stripe/key');
      // Only load Stripe if we have a real publishable key (not test mode)
      if (data.publishableKey && !data.publishableKey.includes('test_pk_')) {
        stripePromise = loadStripe(data.publishableKey);
      } else {
        // For test mode, return a mock stripe object to prevent API calls
        console.log('🧪 Test Mode: Using mock Stripe to prevent API errors');
        stripePromise = Promise.resolve({
          createPaymentMethod: async (options) => {
            // Simulate card validation for test cards
            const testCards = [
              '4242424242424242',
              '4000002760003184', 
              '4000000000000002'
            ];
            const cardNumber = options.card?.number || '';
            const cleanCard = cardNumber.replace(/\s/g, '');
            
            if (testCards.includes(cleanCard)) {
              return {
                paymentMethod: {
                  id: 'pm_test_' + Date.now(),
                  card: { last4: cleanCard.slice(-4) }
                }
              };
            } else {
              return {
                error: { 
                  message: 'Your card number is invalid.' 
                }
              };
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading Stripe key:', error);
      toast.error('Error loading payment system');
    }
  }
  return stripePromise;
};

// Card Element Options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

// Payment Form Component
const StripePaymentForm = ({ 
  orderInfo, 
  onPaymentSuccess, 
  onPaymentError,
  loading,
  setLoading 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          '/api/v1/payment/stripe/create-payment-intent',
          {
            amount: orderInfo.totalPrice,
            currency: 'usd',
            metadata: {
              orderId: orderInfo.orderId || 'temp-order',
              userId: orderInfo.userId,
            },
          }
        );

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setPaymentError('Failed to initialize payment. Please try again.');
        onPaymentError(error.response?.data?.message || 'Payment initialization failed');
      }
    };

    if (orderInfo.totalPrice) {
      createPaymentIntent();
    }
  }, [orderInfo, onPaymentError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setPaymentError('');

    const cardElement = elements.getElement(CardElement);

    // Validate card details even in test mode
    if (!cardElement) {
      setPaymentError('Card details not found. Please refresh and try again.');
      setLoading(false);
      return;
    }

    // Check if card is complete
    const cardResult = await cardElement.ready;
    if (!cardResult) {
      setPaymentError('Please enter valid card details.');
      setLoading(false);
      return;
    }

    // Check if this is test mode (mock client secret)
    if (clientSecret && clientSecret.includes('test_')) {
      console.log('🧪 Test Mode: Validating card and simulating payment');
      
      // Validate card details even in test mode
      try {
        // Create payment method to validate card
        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: orderInfo.shippingInfo.name || 'Test Customer',
            email: orderInfo.userEmail || 'test@example.com',
          },
        });

        if (paymentMethodError) {
          setPaymentError(paymentMethodError.message);
          setLoading(false);
          return;
        }

        // If card validation passes, simulate payment processing
        console.log('✅ Card validation passed, processing test payment...');
        
        setTimeout(async () => {
          try {
            // Extract payment intent ID from client secret
            const paymentIntentId = clientSecret.replace('_secret_', '_pi_');
            await verifyPaymentAndCreateOrder(paymentIntentId);
          } catch (error) {
            console.error('Test payment error:', error);
            setPaymentError('Test payment failed. Please try again.');
            onPaymentError('Test payment failed. Please try again.');
            setLoading(false);
          }
        }, 2000); // 2 second delay to simulate processing
        
      } catch (error) {
        console.error('Card validation error:', error);
        setPaymentError('Please enter valid card details.');
        setLoading(false);
      }
      
      return;
    }

    if (!clientSecret) {
      setPaymentError('Payment not initialized. Please refresh and try again.');
      setLoading(false);
      return;
    }

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: orderInfo.shippingInfo.name || 'Customer',
            email: orderInfo.userEmail || '',
            address: {
              line1: orderInfo.shippingInfo.address,
              city: orderInfo.shippingInfo.city,
              state: orderInfo.shippingInfo.state,
              postal_code: orderInfo.shippingInfo.pinCode,
              country: orderInfo.shippingInfo.country,
            },
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
        onPaymentError(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Verify payment with backend and create order
        await verifyPaymentAndCreateOrder(paymentIntent.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('Payment failed. Please try again.');
      onPaymentError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const verifyPaymentAndCreateOrder = async (paymentIntentId) => {
    try {
      const orderData = {
        paymentIntentId,
        shippingInfo: orderInfo.shippingInfo,
        orderItems: orderInfo.orderItems,
        PaymentInfo: {
          id: paymentIntentId,
          status: 'succeeded',
        },
        itemPrice: orderInfo.itemPrice,
        taxPrice: orderInfo.taxPrice,
        shippingPrice: orderInfo.shippingPrice,
        totalPrice: orderInfo.totalPrice,
      };

      const { data } = await axios.post(
        '/api/v1/payment/stripe/verify',
        orderData
      );

      toast.success('Payment successful! Order placed.');
      onPaymentSuccess(data);
    } catch (error) {
      console.error('Order creation error:', error);
      setPaymentError('Payment successful but order creation failed. Please contact support.');
      onPaymentError(error.response?.data?.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="payment-section">
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
        
        <div className="card-element-container">
          <CardElement options={cardElementOptions} />
        </div>
        
        {paymentError && (
          <div className="payment-error">
            {paymentError}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !clientSecret}
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

// Main Stripe Payment Component
const StripePayment = ({ orderInfo, onPaymentSuccess, onPaymentError }) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStripeInstance = async () => {
      try {
        await getStripe();
        setStripeLoaded(true);
      } catch (error) {
        console.error('Failed to load Stripe:', error);
        onPaymentError('Failed to load payment system');
      }
    };

    loadStripeInstance();
  }, [onPaymentError]);

  if (!stripeLoaded) {
    return (
      <div className="stripe-loading">
        <div className="loader"></div>
        <p>Loading payment system...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm
        orderInfo={orderInfo}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        loading={loading}
        setLoading={setLoading}
      />
    </Elements>
  );
};

export default StripePayment;
