import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import '../pageStyles/AllOrders.css';

// Material UI Icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import VisibilityIcon from '@mui/icons-material/Visibility';

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-newest');
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/seller/orders');

      console.log(`Fetch orders response status: ${response.status}`);

      if (response.data.success) {
        setOrders(response.data.orders || []);
        console.log('Fetched orders:', response.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      
      const response = await axios.put(`/api/v1/seller/orders/${orderId}/status`, {
        status: newStatus
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Update result:', result);

      if (result.success) {
        toast.success('Order status updated successfully!');
        // Update the local state immediately for better UX
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
        // Also refresh from server to ensure consistency
        fetchOrders();
      } else {
        toast.error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(`Error updating order status: ${error.message || 'Please try again.'}`);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: '#fef3c7', color: '#d97706', border: '#fbbf24' };
      case 'processing':
        return { bg: '#dbeafe', color: '#1d4ed8', border: '#3b82f6' };
      case 'shipped':
        return { bg: '#e9d5ff', color: '#7c3aed', border: '#8b5cf6' };
      case 'delivered':
        return { bg: '#d1fae5', color: '#047857', border: '#10b981' };
      case 'cancelled':
        return { bg: '#fee2e2', color: '#dc2626', border: '#ef4444' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', border: '#6b7280' };
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems?.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = filterStatus === 'all' || order.orderStatus?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date-newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'date-oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'amount-high':
        return (b.totalPrice || 0) - (a.totalPrice || 0);
      case 'amount-low':
        return (a.totalPrice || 0) - (b.totalPrice || 0);
      case 'customer-az':
        return (a.user?.name || '').localeCompare(b.user?.name || '');
      case 'customer-za':
        return (b.user?.name || '').localeCompare(a.user?.name || '');
      default:
        return 0;
    }
  });

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.orderStatus?.toLowerCase() === 'pending').length,
      processing: orders.filter(o => o.orderStatus?.toLowerCase() === 'processing').length,
      shipped: orders.filter(o => o.orderStatus?.toLowerCase() === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus?.toLowerCase() === 'delivered').length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    };
    return stats;
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

  const stats = getOrderStats();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
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
              <ShoppingCartIcon style={{ fontSize: '2.5rem' }} />
              <div>
                <h1 style={{
                  margin: '0 0 10px 0',
                  fontSize: '2.5rem',
                  fontWeight: '700'
                }}>All Orders</h1>
                <p style={{
                  margin: 0,
                  opacity: '0.9',
                  fontSize: '1.1rem'
                }}>Manage and track all your customer orders</p>
              </div>
            </div>
            <Link 
              to="/seller/dashboard" 
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
              Back to Dashboard
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
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Total Orders</h3>
              <span style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.total}</span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Pending</h3>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>
                {stats.pending}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Delivered</h3>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                {stats.delivered}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', opacity: '0.9' }}>Total Revenue</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                {formatPrice(stats.totalRevenue)}
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
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '20px', color: '#64748b' }}>Loading orders...</p>
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
                placeholder="Search orders by ID, customer, or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '300px',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
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
                <option value="date-newest">Newest First</option>
                <option value="date-oldest">Oldest First</option>
                <option value="amount-high">Amount High-Low</option>
                <option value="amount-low">Amount Low-High</option>
                <option value="customer-az">Customer A-Z</option>
                <option value="customer-za">Customer Z-A</option>
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#64748b'
              }}>
                {orders.length === 0 ? (
                  <>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
                    <h2 style={{ marginBottom: '10px' }}>No Orders Yet</h2>
                    <p style={{ marginBottom: '30px' }}>You haven't received any orders yet.</p>
                  </>
                ) : (
                  <>
                    <h2>No orders match your search</h2>
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
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
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
                          width: '15%'
                        }}>Order ID</th>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '20%'
                        }}>Customer</th>
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
                        }}>Items</th>
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
                        }}>Amount</th>
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
                        }}>Date</th>
                        <th style={{
                          padding: '20px 15px',
                          textAlign: 'center',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: 'none',
                          width: '15%'
                        }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const statusColors = getStatusColor(order.orderStatus);
                        return (
                          <tr 
                            key={order._id} 
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
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#334155'
                              }}>
                                #{order._id?.slice(-8)}
                              </div>
                            </td>
                            <td style={{
                              padding: '20px 15px',
                              verticalAlign: 'middle',
                              border: 'none'
                            }}>
                              <div>
                                <div style={{
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  color: '#334155',
                                  marginBottom: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}>
                                  <PersonIcon style={{ fontSize: '14px', color: '#64748b' }} />
                                  {order.user?.name || 'Unknown'}
                                </div>
                                <div style={{
                                  fontSize: '0.8rem',
                                  color: '#64748b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}>
                                  <EmailIcon style={{ fontSize: '12px' }} />
                                  {order.user?.email || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td style={{
                              padding: '20px 15px',
                              verticalAlign: 'middle',
                              border: 'none'
                            }}>
                              <div>
                                <div style={{
                                  fontSize: '0.85rem',
                                  color: '#475569',
                                  marginBottom: '4px',
                                  fontWeight: '600'
                                }}>
                                  {order.orderItems?.length || 0} item(s)
                                </div>
                                {order.orderItems?.slice(0, 2).map((item, index) => (
                                  <div key={index} style={{
                                    fontSize: '0.8rem',
                                    color: '#64748b',
                                    marginBottom: '2px'
                                  }}>
                                    {item.name} (×{item.quantity})
                                  </div>
                                ))}
                                {order.orderItems?.length > 2 && (
                                  <div style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    fontStyle: 'italic'
                                  }}>
                                    +{order.orderItems.length - 2} more
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{
                              padding: '20px 15px',
                              verticalAlign: 'middle',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: '#059669',
                              border: 'none'
                            }}>
                              {formatPrice(order.totalPrice || 0)}
                            </td>
                            <td style={{
                              padding: '20px 15px',
                              verticalAlign: 'middle',
                              fontSize: '0.9rem',
                              color: '#475569',
                              border: 'none'
                            }}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{
                              padding: '20px 15px',
                              verticalAlign: 'middle',
                              border: 'none',
                              textAlign: 'center'
                            }}>
                              <select
                                value={order.orderStatus}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                disabled={updatingOrder === order._id}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '20px',
                                  border: `2px solid ${statusColors.border}`,
                                  background: statusColors.bg,
                                  color: statusColors.color,
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  cursor: updatingOrder === order._id ? 'wait' : 'pointer',
                                  outline: 'none',
                                  minWidth: '120px'
                                }}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
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

export default AllOrders;
