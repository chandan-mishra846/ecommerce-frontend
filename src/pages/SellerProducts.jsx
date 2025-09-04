import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axios';
import '../pageStyles/SellerProducts.css';

// Material UI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/v1/seller/products');
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
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
        const response = await axios.delete(`/api/v1/seller/products/${productId}`);

        if (response.data.success) {
          toast.success('Product deleted successfully');
          setProducts(products.filter(product => product._id !== productId));
        } else {
          toast.error(response.data.message || 'Failed to delete product');
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

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'stock-asc':
        return a.stock - b.stock;
      case 'stock-desc':
        return b.stock - a.stock;
      default:
        return 0;
    }
  });

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))];

  if (!user || user.role !== 'seller') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need to be a registered seller to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
          padding: '30px',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div>
              <h1 style={{
                margin: '0 0 10px 0',
                fontSize: '2.5rem',
                fontWeight: '700'
              }}>My Products</h1>
              <p style={{
                margin: 0,
                opacity: '0.9',
                fontSize: '1.1rem'
              }}>Manage your product inventory</p>
            </div>
            <Link 
              to="/seller/products/create" 
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <AddIcon />
              Add Product
            </Link>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Total Products</h3>
              <span style={{ fontSize: '2rem', fontWeight: '700' }}>{products.length}</span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>In Stock</h3>
              <span style={{ fontSize: '2rem', fontWeight: '700' }}>
                {products.filter(p => p.stock > 0).length}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Out of Stock</h3>
              <span style={{ fontSize: '2rem', fontWeight: '700' }}>
                {products.filter(p => p.stock === 0).length}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Total Value</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                {formatPrice(products.reduce((total, p) => total + (p.price * p.stock), 0))}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #4f46e5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '20px', color: '#64748b' }}>Loading your products...</p>
          </div>
        ) : (
          <div style={{ padding: '30px' }}>
            {/* Search and Filter Section */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '30px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '250px',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  minWidth: '150px'
                }}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="stock-asc">Stock Low-High</option>
                <option value="stock-desc">Stock High-Low</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#64748b'
              }}>
                {products.length === 0 ? (
                  <>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
                    <h2 style={{ marginBottom: '10px' }}>No Products Yet</h2>
                    <p style={{ marginBottom: '30px' }}>You haven't added any products to your store yet.</p>
                    <Link 
                      to="/seller/products/create" 
                      style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                    >
                      Add Your First Product
                    </Link>
                  </>
                ) : (
                  <>
                    <h2>No products match your search</h2>
                    <p>Try adjusting your filters or search terms</p>
                  </>
                )}
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  overflowX: 'auto'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
                    }}>
                      <tr>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '25%'
                        }}>Product</th>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '15%'
                        }}>Category</th>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '12%'
                        }}>Price</th>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '10%'
                        }}>Stock</th>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '12%'
                        }}>Rating</th>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '13%'
                        }}>Created</th>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'center',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '13%'
                        }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr 
                          key={product._id} 
                          style={{
                            transition: 'all 0.3s ease',
                            borderBottom: '1px solid #e2e8f0',
                            background: 'white'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <td style={{
                            padding: '20px 15px',
                            verticalAlign: 'middle',
                            border: 'none'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '15px'
                            }}>
                              <img 
                                src={product.image?.[0]?.url || '/images/placeholder.png'} 
                                alt={product.name}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '2px solid #e2e8f0'
                                }}
                                onError={(e) => {
                                  e.target.src = '/images/placeholder.png';
                                }}
                              />
                              <div>
                                <h4 style={{
                                  margin: '0 0 5px 0',
                                  fontSize: '0.95rem',
                                  fontWeight: '600',
                                  color: '#334155'
                                }}>{product.name}</h4>
                                <p style={{
                                  margin: 0,
                                  fontSize: '0.8rem',
                                  color: '#64748b',
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td style={{
                            padding: '20px 15px',
                            verticalAlign: 'middle',
                            fontSize: '0.9rem',
                            color: '#475569',
                            border: 'none'
                          }}>{product.category}</td>
                          <td style={{
                            padding: '20px 15px',
                            verticalAlign: 'middle',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#059669',
                            border: 'none'
                          }}>{formatPrice(product.price)}</td>
                          <td style={{
                            padding: '20px 15px',
                            verticalAlign: 'middle',
                            border: 'none'
                          }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: product.stock === 0 ? '#fef2f2' : 
                                         product.stock <= 5 ? '#fef3c7' : '#f0fdf4',
                              color: product.stock === 0 ? '#dc2626' : 
                                     product.stock <= 5 ? '#d97706' : '#059669'
                            }}>
                              {product.stock}
                            </span>
                          </td>
                          <td style={{
                            padding: '20px 15px',
                            verticalAlign: 'middle',
                            fontSize: '0.9rem',
                            color: '#475569',
                            border: 'none'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              <span>⭐</span>
                              <span>{product.ratings?.toFixed(1) || '0.0'}</span>
                              <span style={{
                                fontSize: '0.8rem',
                                color: '#64748b'
                              }}>({product.numberOfReviews || 0})</span>
                            </div>
                          </td>
                          <td style={{
                            padding: '20px 15px',
                            verticalAlign: 'middle',
                            fontSize: '0.9rem',
                            color: '#475569',
                            border: 'none'
                          }}>
                            {new Date(product.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{
                            padding: '20px 15px',
                            verticalAlign: 'middle',
                            border: 'none',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              display: 'flex',
                              gap: '8px',
                              justifyContent: 'center'
                            }}>
                              <button
                                onClick={() => {
                                  window.location.href = `/seller/products/${product._id}/edit`;
                                }}
                                style={{
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: '40px'
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = 'none';
                                }}
                              >
                                <EditIcon style={{ fontSize: '14px' }} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id, product.name)}
                                disabled={deleteLoading === product._id}
                                style={{
                                  background: deleteLoading === product._id ? '#94a3b8' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  cursor: deleteLoading === product._id ? 'not-allowed' : 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: '40px'
                                }}
                                onMouseOver={(e) => {
                                  if (deleteLoading !== product._id) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if (deleteLoading !== product._id) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                  }
                                }}
                              >
                                <DeleteIcon style={{ fontSize: '14px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProducts;
