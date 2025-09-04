import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import '../pageStyles/OutOfStockProducts.css';

// Material UI Icons
import WarningIcon from '@mui/icons-material/Warning';
import RestoreIcon from '@mui/icons-material/Restore';
import EditIcon from '@mui/icons-material/Edit';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function OutOfStockProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [restockingProduct, setRestockingProduct] = useState(null);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchOutOfStockProducts();
  }, []);

  const fetchOutOfStockProducts = async () => {
    try {
      const response = await axios.get('/api/v1/seller/products/out-of-stock');

      if (response.data.success) {
        setProducts(response.data.products || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch out of stock products');
      }
    } catch (error) {
      console.error('Error fetching out of stock products:', error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleRestockProduct = async (productId, productName) => {
    const newStock = prompt(`Enter new stock quantity for "${productName}":`);
    if (!newStock || newStock <= 0) return;

    setRestockingProduct(productId);
    
    try {
      const response = await axios.put(`/api/v1/seller/product/${productId}`, {
        stock: parseInt(newStock)
      });

      if (response.data.success) {
        toast.success('Product restocked successfully!');
        fetchOutOfStockProducts(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to restock product');
      }
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Error restocking product');
    } finally {
      setRestockingProduct(null);
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
      case 'date-newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'date-oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))];

  // Check if user is seller
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
      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
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
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          padding: '30px',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <WarningIcon style={{ fontSize: '2.5rem', color: '#fbbf24' }} />
              <div>
                <h1 style={{
                  margin: '0 0 10px 0',
                  fontSize: '2.5rem',
                  fontWeight: '700'
                }}>Out of Stock Products</h1>
                <p style={{
                  margin: 0,
                  opacity: '0.9',
                  fontSize: '1.1rem'
                }}>Products that need immediate restocking</p>
              </div>
            </div>
            <Link 
              to="/seller/products" 
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
              View All Products
            </Link>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              border: '2px solid rgba(251, 191, 36, 0.3)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Critical Items</h3>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>
                {products.length}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Revenue Lost</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                {formatPrice(products.reduce((total, p) => total + p.price, 0))}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Action Required</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>
                URGENT
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
              borderTop: '4px solid #dc2626',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '20px', color: '#64748b' }}>Loading out of stock products...</p>
          </div>
        ) : (
          <div style={{ padding: '30px' }}>
            {products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                <h2 style={{ 
                  marginBottom: '10px',
                  color: '#059669'
                }}>All Products In Stock!</h2>
                <p style={{ marginBottom: '30px' }}>Great news! All your products are currently in stock.</p>
                <Link 
                  to="/seller/products" 
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  View All Products
                </Link>
              </div>
            ) : (
              <>
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
                    placeholder="Search out of stock products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      flex: '1',
                      minWidth: '250px',
                      padding: '12px 16px',
                      border: '2px solid #fecaca',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                    onBlur={(e) => e.target.style.borderColor = '#fecaca'}
                  />
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      border: '2px solid #fecaca',
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
                      border: '2px solid #fecaca',
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
                    <option value="date-newest">Newest First</option>
                    <option value="date-oldest">Oldest First</option>
                  </select>
                </div>

                {filteredProducts.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#64748b'
                  }}>
                    <h2>No products match your search</h2>
                    <p>Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #fecaca'
                  }}>
                    <div style={{
                      overflowX: 'auto'
                    }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                      }}>
                        <thead style={{
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
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
                              width: '30%'
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
                            }}>Status</th>
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
                            }}>Added</th>
                            <th style={{
                              padding: '20px 15px',
                              textAlign: 'center',
                              fontWeight: '700',
                              fontSize: '0.95rem',
                              color: 'white',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              border: 'none',
                              width: '20%'
                            }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr 
                              key={product._id} 
                              style={{
                                transition: 'all 0.3s ease',
                                borderBottom: '1px solid #fecaca',
                                background: '#fef2f2'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.15)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#fef2f2';
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
                                      border: '2px solid #fecaca'
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
                                      maxWidth: '250px',
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
                                  padding: '6px 16px',
                                  borderRadius: '20px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  width: 'fit-content'
                                }}>
                                  <WarningIcon style={{ fontSize: '14px' }} />
                                  OUT
                                </span>
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
                                    onClick={() => handleRestockProduct(product._id, product.name)}
                                    disabled={restockingProduct === product._id}
                                    style={{
                                      background: restockingProduct === product._id 
                                        ? '#94a3b8' 
                                        : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                      color: 'white',
                                      border: 'none',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      cursor: restockingProduct === product._id ? 'not-allowed' : 'pointer',
                                      fontSize: '0.85rem',
                                      fontWeight: '600',
                                      transition: 'all 0.3s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      minWidth: '90px',
                                      justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => {
                                      if (restockingProduct !== product._id) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)';
                                      }
                                    }}
                                    onMouseOut={(e) => {
                                      if (restockingProduct !== product._id) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                      }
                                    }}
                                  >
                                    <RestoreIcon style={{ fontSize: '14px' }} />
                                    {restockingProduct === product._id ? 'Restocking...' : 'Restock'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      window.location.href = `/seller/products/${product._id}/edit`;
                                    }}
                                    style={{
                                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                                      e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                                    }}
                                    onMouseOut={(e) => {
                                      e.target.style.transform = 'translateY(0)';
                                      e.target.style.boxShadow = 'none';
                                    }}
                                  >
                                    <EditIcon style={{ fontSize: '14px' }} />
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutOfStockProducts;
