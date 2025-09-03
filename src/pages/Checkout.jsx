import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { fetchCart, removeFromCartAPI } from '../features/user/userSlice';
import '../pageStyles/CheckoutClean.css';
import '../componentStyles/StripePayment.css';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated, cart } = useSelector(state => state.user);
  const { selectedItems } = location.state || { selectedItems: [] };
  
  const [processing, setProcessing] = useState(false);
  const [shippingComplete, setShippingComplete] = useState(false);
  
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

  const validateShipping = () => {
    return shippingInfo.address && 
           shippingInfo.city && 
           shippingInfo.state && 
           shippingInfo.pinCode.length === 6 && 
           shippingInfo.phoneNo.length === 10;
  };

  const handleShippingComplete = () => {
    if (validateShipping()) {
      setShippingComplete(true);
    } else {
      alert('Please fill in all required shipping information correctly');
    }
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
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Complete Your Purchase</h1>
          <p className="checkout-subtitle">Secure checkout powered by advanced encryption</p>
        </div>

        <div className="checkout-content">
          {/* Shipping and Payment in one view */}
          <div className="combined-sections">
            
            {/* Shipping Section */}
            <div className={`shipping-section ${shippingComplete ? 'completed' : ''}`}>
              <div className="section-header">
                <div className="section-number">1</div>
                <div className="section-info">
                  <h2>Shipping Information</h2>
                  <p>Where should we send your order?</p>
                </div>
                {shippingComplete && <div className="section-status">✓</div>}
              </div>
              
              <form className="shipping-form">
                <div className="form-group">
                  <label>Complete Address *</label>
                  <textarea 
                    name="address" 
                    value={shippingInfo.address} 
                    onChange={handleInputChange} 
                    rows="3" 
                    placeholder="House/Flat number, Street, Area, Landmark" 
                    disabled={shippingComplete}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input 
                      name="city" 
                      value={shippingInfo.city} 
                      onChange={handleInputChange} 
                      placeholder="Enter city" 
                      disabled={shippingComplete}
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input 
                      name="state" 
                      value={shippingInfo.state} 
                      onChange={handleInputChange} 
                      placeholder="Enter state" 
                      disabled={shippingComplete}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>PIN Code *</label>
                    <input 
                      name="pinCode" 
                      value={shippingInfo.pinCode} 
                      onChange={handleInputChange} 
                      maxLength="6" 
                      placeholder="6-digit PIN" 
                      disabled={shippingComplete}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input name="country" value={shippingInfo.country} disabled />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    name="phoneNo" 
                    value={shippingInfo.phoneNo} 
                    onChange={handleInputChange} 
                    maxLength="10" 
                    placeholder="10-digit mobile number" 
                    disabled={shippingComplete}
                  />
                </div>
                
                <div className="shipping-buttons">
                  {!shippingComplete ? (
                    <button type="button" className="section-btn" onClick={handleShippingComplete}>
                      Confirm Shipping Details
                    </button>
                  ) : (
                    <button type="button" className="edit-btn" onClick={() => setShippingComplete(false)}>
                      Edit Shipping Details
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Payment Section */}
            <div className={`payment-section ${shippingComplete ? 'enabled' : 'disabled'}`}>
              <div className="section-header">
                <div className="section-number">2</div>
                <div className="section-info">
                  <h2>Payment Method</h2>
                  <p>Choose how you'd like to pay</p>
                </div>
              </div>
              
              {shippingComplete ? (
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
              ) : (
                <div className="payment-disabled">
                  <p>📦 Complete shipping information first</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Checkout;
