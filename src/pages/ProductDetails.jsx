import React, { useEffect, useState } from 'react';
import '../pageStyles/ProductDetails.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductDetails, removeErrors as removeProductErrors, createReviewforProduct } from '../features/products/productSlice';
import { addToCartAPI, fetchCart, removeErrors as removeUserErrors } from '../features/user/userSlice';
import { toast } from 'react-toastify';

function ProductDetails() {
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();

  const { loading, error, product } = useSelector((state) => state.product);
  const { loading: cartLoading, error: cartError, isAuthenticated, user, cart: userCart } = useSelector(
    (state) => state.user
  );

  const [isFetchingCart, setIsFetchingCart] = useState(false); // Local state to manage if cart is currently being fetched

  // fetch product details
  useEffect(() => {
    if (id) dispatch(getProductDetails(id));
    return () => dispatch(removeProductErrors());
  }, [dispatch, id]);

  // Handle product-related errors
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Something went wrong!', {
        position: 'top-center',
        autoClose: 3000,
      });
      dispatch(removeProductErrors());
    }
  }, [dispatch, error]);

  // Handle review success
  useEffect(() => {
    if (reviewSubmitted && product && product.reviews && product.reviews.length > 0) {
      console.log('Product reviews updated:', product.reviews);
      toast.success('Review submitted successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });
      setReviewSubmitted(false);
    }
  }, [product, reviewSubmitted]);

  // Effect to fetch cart if authenticated and not already fetching
  useEffect(() => {
    if (isAuthenticated && !isFetchingCart) {
      setIsFetchingCart(true);
      dispatch(fetchCart())
        .finally(() => setIsFetchingCart(false));
    }
  }, [dispatch, isAuthenticated]);

  const handleRatingChange = (newRating) => {
    console.log('Rating change called with:', newRating);
    setUserRating(newRating);
    console.log(`Rating changed to: ${newRating}`);
  };

  if (loading || !product || !product.image || !product.image[0]) {
    return (
      <>
        <PageTitle title="Loading..." />
        <Navbar />
        <div className="product-details-container" style={{ padding: '50px', textAlign: 'center' }}>
          Loading product details...
        </div>
        <Footer />
      </>
    );
  }

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error('Quantity cannot be less than one', { 
        position: 'top-center', 
        autoClose: 3000 
      });
      return;
    }
    setQuantity((prevQuantity) => prevQuantity - 1);
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      toast.error('Cannot exceed available stock', { position: 'top-center', autoClose: 3000 });
      return;
    }
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    if (product.stock <= 0) {
      toast.error('Sorry, product is out of stock!', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} units available!`, {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    dispatch(addToCartAPI({ productId: product._id, quantity }))
      .unwrap()
      .then(() => {
        toast.success('Product added to cart successfully!', {
          position: 'top-center',
          autoClose: 3000,
        });
        dispatch(fetchCart()); // Refetch cart to update global state and UI
      })
      .catch((error) => {
        toast.error(error?.message || 'Failed to add to cart', {
          position: 'top-center',
          autoClose: 3000,
        });
        dispatch(removeUserErrors()); // Clear user/cart errors after showing toast
      });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    console.log('Current userRating:', userRating);
    console.log('Current comment:', comment);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Current user:', user);
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
    
    if (userRating === 0) {
      toast.error('Please select a rating', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please write a review comment', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
    
    const reviewData = {
      rating: userRating,
      comment: comment.trim(),
      productId: id
    };
    
    console.log('Submitting review data:', reviewData);
    setReviewSubmitted(true);
    dispatch(createReviewforProduct(reviewData));
    
    // Reset form
    setUserRating(0);
    setComment('');
  };

  return (
    <>
      <PageTitle title={product.name || 'Product Details'} />
      <Navbar />

      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img
              src={product.image[0].url.replace('./', '/')}
              alt={product.name}
              className="product-detail-image"
              onError={(e) => {
                // Updated default image path to include 'variations'
                if (e.target.src.indexOf('/images/products/variations/adults-plain-cotton-tshirt-2-pack-black.jpg') === -1) {
                  e.target.src = '/images/products/variations/adults-plain-cotton-tshirt-2-pack-black.jpg';
                }
              }}
            />
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹{product.price}</p>

            <div className="product-rating">
              <Rating value={product.ratings} disabled={true} />
              <span className="productCardSpan">({product.numberOfReviews} Reviews)</span>
            </div>

            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="quantity-controls">
              <span className="quantity-label">Quantity:</span>
              <button className="quantity-button" onClick={decreaseQuantity}>
                -
              </button>
              <input type="text" value={quantity} className="quantity-value" readOnly />
              <button className="quantity-button" onClick={increaseQuantity}>
                +
              </button>
            </div>

            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || cartLoading}
            >
              {cartLoading ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <form onSubmit={handleSubmitReview} className="review-form">
              <h3>Write a Review</h3>
              {!isAuthenticated ? (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                  Please login to submit a review
                </div>
              ) : (
                <>
                  <Rating value={userRating} disabled={false} onChange={handleRatingChange} />
                  <textarea 
                    placeholder="Write your review here" 
                    className="review-input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="submit-review-btn">Submit Review</button>
                </>
              )}
            </form>
          </div>
        </div>

        <div className="reviews-container">
          <h3>Customer Reviews</h3>
          <div className="reviews-section">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div className="review-item" key={idx}>
                  <div className="review-header">
                    <Rating value={review.rating} disabled={true} />
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-name">By {review.name}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductDetails;