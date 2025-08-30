import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminProducts.css';
import '../AdminStyles/ProductsList.css';

// Import Material UI icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// This would normally come from a Redux slice
// Replace with actual API call implementation
const fetchProducts = () => {
  // Mock data for demonstration
  return [
    {
      _id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      category: 'Electronics',
      stock: 50,
      seller: 'TechStore',
      ratings: 4.5,
      numOfReviews: 120,
      images: [{ url: '/public/images/products/headphones.jpg' }],
      createdAt: '2023-05-15T10:30:00Z'
    },
    {
      _id: '2',
      name: 'Running Shoes',
      price: 79.99,
      category: 'Sports',
      stock: 35,
      seller: 'SportyGear',
      ratings: 4.2,
      numOfReviews: 85,
      images: [{ url: '/public/images/products/shoes.jpg' }],
      createdAt: '2023-06-20T14:45:00Z'
    },
    {
      _id: '3',
      name: 'Coffee Maker',
      price: 149.99,
      category: 'Home Appliances',
      stock: 20,
      seller: 'HomeEssentials',
      ratings: 4.8,
      numOfReviews: 200,
      images: [{ url: '/public/images/products/coffee-maker.jpg' }],
      createdAt: '2023-04-10T09:15:00Z'
    },
    {
      _id: '4',
      name: 'Laptop Backpack',
      price: 59.99,
      category: 'Fashion',
      stock: 100,
      seller: 'BagWorld',
      ratings: 4.0,
      numOfReviews: 150,
      images: [{ url: '/public/images/products/backpack.jpg' }],
      createdAt: '2023-07-05T11:20:00Z'
    },
  ];
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    // In a real app, this would dispatch an action to fetch products
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const productData = fetchProducts();
        setProducts(productData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

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
    const categories = products.map(product => product.category);
    return ['all', ...new Set(categories)];
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1>Product Management</h1>
              <p>View, edit, and manage all products in the system</p>
            </div>
            <Link to="/admin/products/create" className="add-product-btn">
              <AddCircleIcon /> Add New Product
            </Link>
          </div>

          <div className="product-stats">
            <div className="stat-card">
              <h3>Total Products</h3>
              <p>{products.length}</p>
            </div>
            <div className="stat-card">
              <h3>Out of Stock</h3>
              <p>{products.filter(product => product.stock === 0).length}</p>
            </div>
            <div className="stat-card">
              <h3>Low Stock</h3>
              <p>{products.filter(product => product.stock > 0 && product.stock < 10).length}</p>
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

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Seller</th>
                    <th>Rating</th>
                    <th>Added On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <tr key={product._id}>
                        <td className="product-info">
                          <img 
                            src={product.images[0]?.url || '/public/vite.svg'} 
                            alt={product.name} 
                            className="product-thumbnail" 
                          />
                          <span>{product.name}</span>
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.category}</td>
                        <td className={`stock ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : ''}`}>
                          {product.stock}
                        </td>
                        <td>{product.seller}</td>
                        <td className="rating">
                          <span className="rating-value">{product.ratings.toFixed(1)}</span>
                          <span className="review-count">({product.numOfReviews} reviews)</span>
                        </td>
                        <td>{formatDate(product.createdAt)}</td>
                        <td className="actions">
                          <Link to={`/product/${product._id}`} className="view-btn" title="View Product">
                            <VisibilityIcon />
                          </Link>
                          <Link to={`/admin/product/update/${product._id}`} className="edit-btn" title="Edit Product">
                            <EditIcon />
                          </Link>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteProduct(product._id)}
                            title="Delete Product"
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-results">
                        No products found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
