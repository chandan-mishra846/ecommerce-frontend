import React, { useState } from 'react';
import '../componentStyles/Product.css';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Product({ product }) {
  const [rating, setRating] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
      <rect width='100%' height='100%' fill='%23e5e7eb'/>
      <g fill='%236b7280'>
        <circle cx='200' cy='120' r='40'/>
        <rect x='120' y='180' width='160' height='20' rx='4'/>
      </g>
      <text x='200' y='250' text-anchor='middle' fill='%234b5563' font-family='Arial' font-size='14'>No Image</text>
    </svg>
  `)}`;

  // Debug: Log product image structure for ALL products to see what's happening
  console.log(`Product "${product.name}" image structure:`, product.image);
  console.log(`Image URL being used for "${product.name}":`, product?.image?.[0]?.url || 'PLACEHOLDER');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    console.log(`rating changed to :${newRating}`);
  };

  const handleImageError = () => {
    console.log(`Image failed to load for product: ${product.name}`);
    setImageError(true);
  };

  const getImageUrl = () => {
    if (imageError) return PLACEHOLDER_IMG;
    return product?.image?.[0]?.url || PLACEHOLDER_IMG;
  };

  return (
    <Link to={`/product/${product._id}`} className="product_id">
     <div className='chandan'>
        <img
          src={getImageUrl()}
          alt={product.name}
          className='product-image-card'
          loading="lazy"
          onError={handleImageError}
        />
        <div >
          <h3 className="product-title" title={product.name}>{product.name}</h3>

          <div className="rating_container">
            <Rating
              value={product.ratings}
              onRatingChange={handleRatingChange}
              disabled={true}
            />
            <span className='productCardSpan'>
              {product.numberOfReviews} {product.numberOfReviews===1?"Review":"Reviews"}
            </span>
          </div>

          <p className="home-price" aria-label="price">
            <span className="currency">₹</span>{Number(product.price).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Product;