import React, { useState } from 'react';
import '../componentStyles/Product.css';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Product({ product }) {
  const [rating, setRating] = useState(0);
  const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
      <rect width='100%' height='100%' fill='%23f3f4f6'/>
      <g fill='%239ca3af'>
        <circle cx='200' cy='120' r='40'/>
        <rect x='120' y='180' width='160' height='20' rx='4'/>
      </g>
    </svg>
  `)}`;

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    console.log(`rating changed to :${newRating}`);
  };

  return (
    <Link to={`/product/${product._id}`} className="product_id">
      <div className="product-card">
        <img
          src={product?.image?.[0]?.url || PLACEHOLDER_IMG}
          alt={product.name}
          className='product-image-card'
          loading="lazy"
        />
        <div className="product-details">
          <h3 className="product-title" title={product.name}>{product.name}</h3>

          <p className="home-price" aria-label="price">
            <span className="currency">₹</span>{Number(product.price).toLocaleString('en-IN')}
          </p>

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

          <button className="add-to-cart" type="button">View details</button>
        </div>
      </div>
    </Link>
  );
}

export default Product;