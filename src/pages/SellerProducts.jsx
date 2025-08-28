import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../pageStyles/SellerProducts.css';

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/v1/seller/products', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setProducts(result.products);
      } else {
        toast.error(result.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      setDeleteLoading(productId);
      
      try {
        const response = await fetch(`/api/v1/seller/products/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const result = await response.json();

        if (result.success) {
          toast.success('Product deleted successfully');
          setProducts(products.filter(product => product._id !== productId));
        } else {
          toast.error(result.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product');
      }
      
      setDeleteLoading(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need to be a registered seller to view this page.</p>
      </div>
    );
  }

  return (
    <>
      <div className="seller-products-container">
        <div className="seller-products-header">
          <div className="header-content">
            <h1>My Products</h1>
            <p>Manage your product inventory</p>
          </div>
          <Link to="/seller/products/create" className="add-product-btn">
            <span className="btn-icon">+</span>
            Add Product
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your products...</p>
          </div>
        ) : (
          <>
            <div className="products-stats">
              <div className="stat-card">
                <h3>Total Products</h3>
                <span className="stat-number">{products.length}</span>
              </div>
              <div className="stat-card">
                <h3>In Stock</h3>
                <span className="stat-number">
                  {products.filter(p => p.stock > 0).length}
                </span>
              </div>
              <div className="stat-card">
                <h3>Out of Stock</h3>
                <span className="stat-number">
                  {products.filter(p => p.stock === 0).length}
                </span>
              </div>
              <div className="stat-card">
                <h3>Total Value</h3>
                <span className="stat-number">
                  {formatPrice(products.reduce((total, p) => total + (p.price * p.stock), 0))}
                </span>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h2>No Products Yet</h2>
                <p>You haven't added any products to your store yet.</p>
                <Link to="/seller/products/create" className="get-started-btn">
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img 
                        src={product.image?.[0]?.url || '/images/placeholder.png'} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                      <div className="product-badges">
                        {product.stock === 0 && (
                          <span className="badge out-of-stock">Out of Stock</span>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                          <span className="badge low-stock">Low Stock</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">
                        {product.description.length > 100 
                          ? `${product.description.substring(0, 100)}...` 
                          : product.description
                        }
                      </p>
                      
                      <div className="product-details">
                        <div className="price-stock">
                          <span className="price">{formatPrice(product.price)}</span>
                          <span className="stock">Stock: {product.stock}</span>
                        </div>
                        
                        <div className="product-stats">
                          <span className="rating">
                            ⭐ {product.ratings?.toFixed(1) || '0.0'} 
                            ({product.numberOfReviews || 0} reviews)
                          </span>
                          <span className="created-date">
                            Added: {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="product-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => {
                          // Navigate to edit product page
                          window.location.href = `/seller/products/${product._id}/edit`;
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                        disabled={deleteLoading === product._id}
                      >
                        {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SellerProducts;
