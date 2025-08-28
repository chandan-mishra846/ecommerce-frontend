import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCartAPI, updateCartItemAPI } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../pageStyles/Cart.css';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const cart = userState?.cart || [];
  const cartItems = userState?.cartItems || 0;
  const cartTotal = userState?.cartTotal || 0;
  const isAuthenticated = userState?.isAuthenticated || false;
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const subtotal = selectedItems.reduce((total, itemId) => {
    const item = cart.find(cartItem => cartItem._id === itemId);
    return total + (item ? item.price * item.quantity : 0);
  }, 0);

  const tax = subtotal * 0.18;
  const shipping = selectedItems.length > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (selectAll) {
      setSelectedItems(cart.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, cart]);

  useEffect(() => {
    if (selectedItems.length === cart.length && cart.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    const item = cart.find(cartItem => cartItem._id === productId);
    
    if (!item) return;

    if (newQuantity <= 0) {
      toast.error('Quantity cannot be less than 1', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`, {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
    dispatch(updateCartItemAPI({ itemId: item._id, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    const item = cart.find(cartItem => cartItem._id === productId);
    if (item) {
      dispatch(removeFromCartAPI(item._id));
      setSelectedItems(prev => prev.filter(id => id !== productId));
      toast.success('Item removed from cart', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  const handleItemSelect = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to proceed', {
        position: 'top-center',
      });
      return;
    }
    navigate('/checkout', { state: { selectedItems } });
  };

  if (!cart || cart.length === 0) {
    return (
      <>
        <PageTitle title="Your Cart" />
        <Navbar />
        <div className="cart-empty-container">
          <div className="cart-empty-content">
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added any products to your cart yet.</p>
                <button 
                  className="continue-shopping-btn"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
            <Footer />
          </>
        );
      }

      return (
        <>
          <PageTitle title="Your Cart" />
          <Navbar />
          
          <div className="cart-container">
            <div className="cart-content">
              <div className="cart-items-section">
                <h2>Your Cart</h2>
                <div className="select-all-container">
                  <label className="select-all-label">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => setSelectAll(e.target.checked)}
                    />
                    <span>Select All Items</span>
                  </label>
                </div>

                <div className="cart-table">
                  <div className="cart-table-header">
                    <div className="header-product">Product</div>
                    <div className="header-quantity">Quantity</div>
                    <div className="header-total">Item Total</div>
                    <div className="header-actions">Actions</div>
                  </div>

                  {cart.map((item) => (
                    <div key={item._id} className="cart-item">
                      <div className="item-product">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => handleItemSelect(item._id)}
                          className="item-checkbox"
                        />
                        <img 
                          src={item.product?.image?.[0]?.url?.replace('./', '/') || '/images/products/variations/adults-plain-cotton-tshirt-2-pack-black.jpg'} // Updated default image path
                          alt={item.name}
                          className="item-image"
                          onError={(e) => {
                            if (e.target.src.indexOf('/images/products/variations/adults-plain-cotton-tshirt-2-pack-black.jpg') === -1) {
                              e.target.src = '/images/products/variations/adults-plain-cotton-tshirt-2-pack-black.jpg';
                            }
                          }}
                        />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-price">Price: ₹{item.price}/-</p>
                          <p className="item-stock">Stock: {item.stock} available</p>
                        </div>
                      </div>

                      <div className="item-quantity">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                          className="quantity-input"
                          min="1"
                          max={item.stock}
                        />
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-total">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>

                      <div className="item-actions">
                        <button 
                          className="update-btn"
                          onClick={() => handleQuantityChange(item._id, item.quantity)}
                        >
                          Update
                        </button>
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="price-summary-section">
                <h3>Price Summary</h3>
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}/-</span>
                  </div>
                  <div className="price-row">
                    <span>Tax (18%):</span>
                    <span>₹{tax.toFixed(2)}/-</span>
                  </div>
                  <div className="price-row">
                    <span>Shipping:</span>
                    <span>₹{shipping.toFixed(2)}/-</span>
                  </div>
                  <div className="price-row total-row">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}/-</span>
                  </div>
                </div>
                
                <button 
                  className="checkout-btn"
                  onClick={handleProceedToCheckout}
                  disabled={selectedItems.length === 0}
                >
                  Proceed to Checkout
                </button>
                
                <button 
                  className="continue-shopping-btn"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          <Footer />
        </>
      );
    }

    export default Cart;