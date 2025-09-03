import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getMyOrders, clearErrors } from '../features/orders/orderSlice';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import PageTitle from '../components/PageTitle';

// Material UI Icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import HomeIcon from '@mui/icons-material/Home';

function OrderHistory() {
  const dispatch = useDispatch();
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-newest');
  const { orders, loading, error } = useSelector((state) => state.order);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyOrders());
    }
    
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, isAuthenticated]);

  const getFilteredOrders = () => {
    let filtered = [...(orders || [])];

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        default:
          break;
      }
    }

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderItems?.some(item => 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => 
        order.orderStatus?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Sort orders
    switch (sortBy) {
      case 'date-newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date-oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'amount-high':
        filtered.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
        break;
      case 'amount-low':
        filtered.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return <PendingIcon style={{ color: getStatusColor(status), fontSize: '20px' }} />;
      case 'shipped':
        return <LocalShippingIcon style={{ color: getStatusColor(status), fontSize: '20px' }} />;
      case 'delivered':
        return <CheckCircleIcon style={{ color: getStatusColor(status), fontSize: '20px' }} />;
      case 'cancelled':
        return <PendingIcon style={{ color: getStatusColor(status), fontSize: '20px' }} />;
      case 'pending':
        return <PendingIcon style={{ color: getStatusColor(status), fontSize: '20px' }} />;
      default:
        return <PendingIcon style={{ color: getStatusColor(status), fontSize: '20px' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FFA726'; // Orange
      case 'processing':
        return '#42A5F5'; // Blue
      case 'shipped':
        return '#AB47BC'; // Purple
      case 'delivered':
        return '#66BB6A'; // Green
      case 'cancelled':
        return '#EF5350'; // Red
      default:
        return '#757575'; // Gray
    }
  };

  const getTotalItems = (orderItems) => {
    return orderItems?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalSpent = (orders) => {
    return orders
      .filter(order => order.orderStatus?.toLowerCase() !== 'cancelled')
      .reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <>
        <PageTitle title="My Orders" />
        <Navbar />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          margin: '20px',
          color: 'white',
          textAlign: 'center',
          padding: '40px'
        }}>
          <PersonIcon style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.8 }} />
          <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: '600' }}>Please Log In</h2>
          <p style={{ margin: '0', fontSize: '16px', opacity: 0.9 }}>You need to be logged in to view your order history</p>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageTitle title="My Orders" />
        <Navbar />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          fontSize: '18px',
          color: '#667eea'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '3px solid #667eea',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading your orders...
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title="My Orders - ShopEasy" />
      <Navbar />
      <div style={{
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          color: 'white',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <ShoppingCartIcon style={{ fontSize: '32px' }} />
            <div>
              <h1 style={{ margin: '0', fontSize: '28px', fontWeight: '600' }}>My Orders</h1>
              <p style={{ margin: '0', opacity: 0.9, fontSize: '16px' }}>Track all your orders and purchase history</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
                {filteredOrders.length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Orders</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
                ₹{calculateTotalSpent(filteredOrders).toFixed(2)}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Spent</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <SearchIcon style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#667eea',
                fontSize: '20px'
              }} />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  background: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="date-newest">Newest First</option>
              <option value="date-oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>

          {/* Date Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last Week' },
              { value: 'month', label: 'Last Month' },
              { value: 'year', label: 'Last Year' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setDateFilter(option.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: dateFilter === option.value ? 'none' : '2px solid #e5e7eb',
                  background: dateFilter === option.value 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'white',
                  color: dateFilter === option.value ? 'white' : '#374151',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <ShoppingCartIcon style={{ 
              fontSize: '80px', 
              color: '#d1d5db', 
              marginBottom: '20px' 
            }} />
            <h2 style={{ 
              margin: '0 0 12px 0', 
              color: '#374151',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              No Orders Found
            </h2>
            <p style={{ 
              margin: '0 0 24px 0', 
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {searchTerm || filterStatus !== 'all' || dateFilter !== 'all' 
                ? "No orders match your current filters. Try adjusting your search criteria." 
                : "You haven't placed any orders yet. Start shopping to see your order history here!"
              }
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                outline: 'none'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <HomeIcon style={{ marginRight: '8px', fontSize: '18px' }} />
              Start Shopping
            </button>
          </div>
        ) : (
          /* Orders Table */
          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            {/* Table Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '16px 20px',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 120px 120px 140px 100px',
              gap: '16px',
              alignItems: 'center',
              minWidth: '1000px'
            }}>
              <div>Order ID</div>
              <div>Items</div>
              <div>Status</div>
              <div>Amount</div>
              <div>Items Count</div>
              <div>Date</div>
              <div>Action</div>
            </div>

            {/* Table Body */}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredOrders.map((order, index) => (
                <div
                  key={order._id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: index < filteredOrders.length - 1 ? '1px solid #f3f4f6' : 'none',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 120px 120px 140px 100px',
                    gap: '16px',
                    alignItems: 'center',
                    minWidth: '1000px',
                    background: index % 2 === 0 ? '#fafbfc' : 'white',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f7ff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? '#fafbfc' : 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Order ID */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#667eea',
                    fontFamily: 'monospace'
                  }}>
                    #{order._id?.slice(-8)}
                  </div>

                  {/* Items Preview */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {order.orderItems?.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '2px solid #e5e7eb',
                            flexShrink: 0
                          }}
                        >
                          <img 
                            src={item.image || '/images/placeholder.png'} 
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = '/images/placeholder.png';
                            }}
                          />
                        </div>
                      ))}
                      {order.orderItems?.length > 2 && (
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '500',
                          color: '#6b7280'
                        }}>
                          +{order.orderItems.length - 2}
                        </div>
                      )}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginLeft: '4px'
                    }}>
                      {order.orderItems?.slice(0, 1).map(item => item.name?.slice(0, 30) + (item.name?.length > 30 ? '...' : ''))}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {getStatusIcon(order.orderStatus)}
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      background: getStatusColor(order.orderStatus) + '20',
                      color: getStatusColor(order.orderStatus),
                      textTransform: 'capitalize'
                    }}>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Amount */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#059669'
                  }}>
                    ₹{order.totalPrice?.toFixed(2)}
                  </div>

                  {/* Items Count */}
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center'
                  }}>
                    {getTotalItems(order.orderItems)} items
                  </div>

                  {/* Date */}
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {formatDate(order.createdAt)}
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      onClick={() => window.location.href = `/order/${order._id}`}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        outline: 'none'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OrderHistory;
