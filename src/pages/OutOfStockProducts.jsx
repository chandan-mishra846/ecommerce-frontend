import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import '../pageStyles/OutOfStockProducts.css';

function OutOfStockProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchOutOfStockProducts();
  }, []);

  const fetchOutOfStockProducts = async () => {
    try {
      const response = await fetch('/api/v1/seller/products/out-of-stock', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setProducts(result.products || []);
      } else {
        toast.error(result.message || 'Failed to fetch out of stock products');
      }
    } catch (error) {
      console.error('Error fetching out of stock products:', error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleRestockProduct = async (productId) => {
    const newStock = prompt('Enter new stock quantity:');
    if (!newStock || newStock <= 0) return;

    try {
      const response = await fetch(`/api/v1/seller/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ stock: parseInt(newStock) }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Product restocked successfully!');
        fetchOutOfStockProducts(); // Refresh the list
      } else {
        toast.error(result.message || 'Failed to restock product');
      }
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Error restocking product');
    }
  };

  // Check if user is seller
  if (!user || user.role !== 'seller') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need to be a registered seller to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="out-of-stock-container">
        <div className="out-of-stock-header">
          <h1>Out of Stock Products</h1>
          <p>Products that need immediate restocking</p>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">✅</div>
            <h2>All Products In Stock!</h2>
            <p>Great news! All your products are currently in stock.</p>
          </div>
        ) : (
          <>
            <div className="products-stats">
              <div className="stat-card urgent">
                <h3>Out of Stock</h3>
                <div className="stat-number">{products.length}</div>
              </div>
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card urgent">
                  <div className="product-image">
                    <img
                      src={product.images?.[0]?.url || '/images/default-product.png'}
                      alt={product.name}
                    />
                    <div className="product-badges">
                      <span className="badge out-of-stock">Out of Stock</span>
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">
                      {product.description?.substring(0, 100)}...
                    </p>

                    <div className="product-details">
                      <div className="price-stock">
                        <span className="price">₹{product.price}</span>
                        <span className="stock urgent">Stock: {product.stock}</span>
                      </div>

                      <div className="product-stats">
                        <span>Rating: {product.ratings || 0}/5</span>
                        <span>Reviews: {product.numOfReviews || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="restock-btn"
                      onClick={() => handleRestockProduct(product._id)}
                    >
                      🔄 Restock Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default OutOfStockProducts;
