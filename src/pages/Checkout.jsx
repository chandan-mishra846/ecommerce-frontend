import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { fetchCart, removeFromCartAPI } from '../features/user/userSlice';
import '../pageStyles/Checkout.css';
import '../componentStyles/StripePayment.css';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated, cart } = useSelector(state => state.user);
  const { selectedItems } = location.state || { selectedItems: [] };
  
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    phoneNo: ''
  });

  if (!isAuthenticated) return null;
  if (!selectedItems || selectedItems.length === 0) return null;

  const checkoutItems = cart?.filter(item => selectedItems.includes(item._id)) || [];
  
  const subtotal = checkoutItems.reduce((t, i) => t + (i.price * i.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (isAuthenticated && (!cart || cart.length === 0)) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleContinueToPayment = () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || shippingInfo.pinCode.length !== 6 || shippingInfo.phoneNo.length !== 10) {
      alert('Please fill in all required shipping information');
      return;
    }
    setCurrentStep(2);
  };

  const handlePaymentSuccess = async (data) => {
    if (processing) return;
    setProcessing(true);

    try {
      navigate('/order-success', { 
        state: { orderId: data.order._id, paymentId: data.paymentId }, 
        replace: true 
      });

      setTimeout(async () => {
        try {
          await Promise.all(selectedItems.map(itemId => dispatch(removeFromCartAPI(itemId)).unwrap()));
        } catch (error) {
          console.log('Cart cleanup error:', error);
        }
      }, 100);
    } catch (error) {
      alert('Payment successful but redirect failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <PageTitle title="Checkout - ShopEasy" />
      <Navbar />
      
      <div className="checkout-container">
        {/* Progress Steps */}
        <div className="checkout-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="progress-step-circle">1</div>
            <span className="progress-step-label">Shipping</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="progress-step-circle">2</div>
            <span className="progress-step-label">Payment</span>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {currentStep === 1 && (
              <div className="shipping-section">
                <h2>Shipping Information</h2>
                <form className="shipping-form">
                  <div className="form-group">
                    <label>Address *</label>
                    <textarea name="address" value={shippingInfo.address} onChange={handleInputChange} rows="3" placeholder="Enter your complete address" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="Enter city" />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input name="state" value={shippingInfo.state} onChange={handleInputChange} placeholder="Enter state" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>PIN Code *</label>
                      <input name="pinCode" value={shippingInfo.pinCode} onChange={handleInputChange} maxLength="6" placeholder="6-digit PIN code" />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input name="country" value={shippingInfo.country} disabled />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input name="phoneNo" value={shippingInfo.phoneNo} onChange={handleInputChange} maxLength="10" placeholder="10-digit phone number" />
                  </div>
                  <button type="button" className="continue-btn" onClick={handleContinueToPayment}>Continue to Payment</button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="payment-section">
                <h2>Payment</h2>
                <PaymentMethodSelector
                  orderInfo={{
                    orderId: `temp-order-${Date.now()}`,
                    userId: user?._id,
                    userEmail: user?.email,
                    shippingInfo,
                    orderItems: checkoutItems.map(i => ({
                      name: i.product?.name || i.name,
                      price: i.price,
                      quantity: i.quantity,
                      image: i.product?.image?.[0]?.url || i.image,
                      product: i.product?._id
                    })),
                    itemPrice: subtotal,
                    taxPrice: tax,
                    shippingPrice: shipping,
                    totalPrice: total,
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={err => alert(err)}
                />
                <div className="payment-actions">
                  <button className="back-btn" onClick={() => setCurrentStep(1)}>Back to Shipping</button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <aside className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="order-items">
                {checkoutItems.map(item => (
                  <div key={item._id} className="order-item">
                    <img src={item.product?.image?.[0]?.url || item.image} alt={item.name} />
                    <div>
                      <h4>{item.product?.name || item.name}</h4>
                      <span>₹{item.price} × {item.quantity}</span>
                    </div>
                    <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <div><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div><span>Tax (18%):</span><span>₹{tax.toFixed(2)}</span></div>
                <div><span>Shipping:</span><span>₹{shipping.toFixed(2)}</span></div>
                <div className="total-final"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Checkout;
