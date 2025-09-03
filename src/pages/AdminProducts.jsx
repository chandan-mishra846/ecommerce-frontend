import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminProducts.css';
import '../AdminStyles/ProductsList.css';

// Import Redux actions
import { getAdminProducts, removeErrors } from '../features/products/productSlice';

// Import Material UI icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function AdminProducts() {
  const dispatch = useDispatch();
  const { adminProducts, loading, error } = useSelector(state => state.product);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      console.error('Admin Products Error:', error);
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      // Delete product logic would go here
      alert(`Product ${productId} deleted`);
      
      // Update local state to reflect the deletion
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const getUniqueCategories = () => {
    if (!adminProducts) return ['all'];
    const categories = adminProducts.map(product => product.category);
    return ['all', ...new Set(categories)];
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    if (!adminProducts) return [];
    let filtered = [...adminProducts];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.seller && product.seller.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.user && product.user.name && product.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'stock-asc':
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock-desc':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.ratings - a.ratings);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-products-container">
          <div className="admin-page-header">
            <div>
              <h1>View All Products</h1>
              <p>View all products from database with categories</p>
            </div>
            <Link to="/admin/products/create" className="add-product-btn">
              <AddCircleIcon /> Add New Product
            </Link>
          </div>

          <div className="product-stats">
            <div className="stat-card">
              <h3>Total Products</h3>
              <p>{adminProducts ? adminProducts.length : 0}</p>
            </div>
            <div className="stat-card">
              <h3>Out of Stock</h3>
              <p>{adminProducts ? adminProducts.filter(product => product.stock === 0).length : 0}</p>
            </div>
            <div className="stat-card">
              <h3>Low Stock</h3>
              <p>{adminProducts ? adminProducts.filter(product => product.stock > 0 && product.stock < 10).length : 0}</p>
            </div>
          </div>

          <div className="admin-filters">
            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search products by name or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-options">
              <div className="category-filter">
                <label><FilterListIcon /> Category:</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="sort-filter">
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="stock-asc">Stock: Low to High</option>
                  <option value="stock-desc">Stock: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {loading || !adminProducts ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
              {error && <p style={{color: 'red'}}>Error: {error}</p>}
            </div>
          ) : adminProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found in the database.</p>
            </div>
          ) : (
            <div className="products-table-container">
              <div className="products-header">
                <div className="products-count">
                  <h3>All Products ({filteredProducts.length})</h3>
                </div>
              </div>
              
              <div className="table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Seller</th>
                      <th>Date Added</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <tr key={product._id} className="product-row">
                          <td className="product-info">
                            <img 
                              src={
                                (product.images && product.images.length > 0)
                                  ? (product.images[0].url || product.images[0])
                                  : (product.image && product.image.length > 0)
                                  ? (product.image[0].url || product.image[0])
                                  : '/images/products/backpack.jpg'
                              }
                              alt={product.name} 
                              className="product-thumbnail"
                              onError={(e) => {
                                e.target.src = '/images/products/backpack.jpg';
                              }}
                            />
                            <div className="product-details-table">
                              <h4 className="product-name-table">{product.name}</h4>
                              <span className="product-id">ID: {product._id.slice(-6)}</span>
                            </div>
                          </td>
                          <td className="product-category-cell">{product.category}</td>
                          <td className="product-price-cell">₹{product.price.toFixed(2)}</td>
                          <td className="product-stock-cell">
                            <span className={`stock-badge-table ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="product-rating-cell">
                            <div className="rating">
                              <span className="rating-value">⭐ {product.ratings ? product.ratings.toFixed(1) : '0.0'}</span>
                              <span className="review-count">({product.numOfReviews || 0} reviews)</span>
                            </div>
                          </td>
                          <td className="product-seller-cell">
                            {product.seller || (product.user ? product.user.name : 'Unknown')}
                          </td>
                          <td className="product-date-cell">
                            {formatDate(product.createdAt)}
                          </td>
                          <td className="product-actions-cell">
                            <div className="actions">
                              <Link to={`/admin/product/update/${product._id}`} className="action-btn-table edit-btn" title="Edit Product">
                                Update
                              </Link>
                              <button 
                                className="action-btn-table delete-btn" 
                                onClick={() => handleDeleteProduct(product._id)}
                                title="Delete Product"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-products-row">
                          <p>No products match your current filters.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
