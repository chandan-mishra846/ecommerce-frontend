import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerStats, clearErrors } from '../features/seller/sellerSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

// Material UI Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function SellerDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.seller);

  useEffect(() => {
    dispatch(getSellerStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  if (loading) {
    return <Loader />;
  }

  const statsCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <InventoryIcon />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#667eea'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCartIcon />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: '#f5576c'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <AttachMoneyIcon />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      textColor: '#4facfe'
    },
    {
      title: 'Delivered Orders',
      value: stats?.deliveredOrders || 0,
      icon: <CheckCircleIcon />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      textColor: '#43e97b'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <PendingActionsIcon />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      textColor: '#fa709a'
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStockProducts || 0,
      icon: <WarningIcon />,
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      textColor: '#ff6b6b'
    }
  ];

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
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '10px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              <TrendingUpIcon style={{ fontSize: '2rem' }} />
            </div>
            <div>
              <h1 style={{
                margin: '0 0 10px 0',
                fontSize: '3rem',
                fontWeight: '700',
                letterSpacing: '-0.02em'
              }}>Seller Dashboard</h1>
              <p style={{
                margin: 0,
                opacity: '0.9',
                fontSize: '1.2rem'
              }}>Welcome to your seller portal. Here's an overview of your business.</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            {statsCards.map((card, index) => (
              <div 
                key={index} 
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '25px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: card.gradient,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.8rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }}>
                  {card.icon}
                </div>
                <div>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '2.2rem',
                    fontWeight: '700',
                    color: card.textColor,
                    letterSpacing: '-0.02em'
                  }}>
                    {card.value}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '1rem',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    {card.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions and Activity Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
            gap: '30px'
          }}>
            {/* Quick Actions */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <AddIcon />
                </div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>Quick Actions</h3>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <Link 
                  to="/seller/products/create" 
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    border: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <AddIcon />
                  Add New Product
                </Link>
                
                <Link 
                  to="/seller/orders" 
                  style={{
                    background: '#f8fafc',
                    color: '#475569',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    border: '2px solid #e2e8f0'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#e2e8f0';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <VisibilityIcon />
                  View All Orders
                </Link>
                
                <Link 
                  to="/seller/products" 
                  style={{
                    background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    border: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(250, 112, 154, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <InventoryIcon />
                  Check Inventory
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <AccessTimeIcon />
                </div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>Recent Activity</h3>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <ShoppingCartIcon />
                  </div>
                  <div>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b'
                    }}>New order received</p>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#64748b'
                    }}>2 hours ago</span>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <InventoryIcon />
                  </div>
                  <div>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b'
                    }}>Product stock updated</p>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#64748b'
                    }}>1 day ago</span>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <TrendingUpIcon />
                  </div>
                  <div>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b'
                    }}>Revenue increased by 15%</p>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#64748b'
                    }}>3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
