import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

// Material UI Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function TotalProfit() {
  const [profitData, setProfitData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    monthlyBreakdown: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchProfitData();
  }, [selectedPeriod]);

  const fetchProfitData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/seller/profit?period=${selectedPeriod}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('Profit data response:', result);

      if (result.success) {
        setProfitData(result.data || {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          monthlyBreakdown: [],
          topProducts: [],
          previousRevenue: 0,
          previousOrders: 0,
          previousAOV: 0
        });
      } else {
        console.error('Profit data error:', result.message);
        toast.error(result.message || 'Failed to fetch profit data');
      }
    } catch (error) {
      console.error('Error fetching profit data:', error);
      toast.error('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGrowthPercentage = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
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
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
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
                <AttachMoneyIcon style={{ fontSize: '2rem' }} />
              </div>
              <div>
                <h1 style={{
                  margin: '0 0 10px 0',
                  fontSize: '3rem',
                  fontWeight: '700',
                  letterSpacing: '-0.02em'
                }}>Total Profit Analytics</h1>
                <p style={{
                  margin: 0,
                  opacity: '0.9',
                  fontSize: '1.2rem'
                }}>Track your revenue and business performance</p>
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

          {/* Period Selector */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' }
            ].map(period => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                style={{
                  background: selectedPeriod === period.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: selectedPeriod === period.value ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid rgba(255, 255, 255, 0.2)',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (selectedPeriod !== period.value) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedPeriod !== period.value) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '16px',
              padding: '30px',
              color: 'white',
              boxShadow: '0 10px 40px rgba(67, 233, 123, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <AttachMoneyIcon style={{ fontSize: '2rem' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', opacity: '0.9' }}>Total Revenue</h3>
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                {formatCurrency(profitData.totalRevenue || 0)}
              </div>
              <div style={{
                fontSize: '0.9rem',
                opacity: '0.8'
              }}>
                ↗ {getGrowthPercentage(profitData.totalRevenue, profitData.previousRevenue)}% from last period
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '30px',
              color: 'white',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <ShoppingCartIcon style={{ fontSize: '2rem' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', opacity: '0.9' }}>Total Orders</h3>
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                {profitData.totalOrders || 0}
              </div>
              <div style={{
                fontSize: '0.9rem',
                opacity: '0.8'
              }}>
                ↗ {getGrowthPercentage(profitData.totalOrders, profitData.previousOrders)}% growth
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '16px',
              padding: '30px',
              color: 'white',
              boxShadow: '0 10px 40px rgba(245, 87, 108, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <TrendingUpIcon style={{ fontSize: '2rem' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', opacity: '0.9' }}>Average Order Value</h3>
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                {formatCurrency(profitData.averageOrderValue || 0)}
              </div>
              <div style={{
                fontSize: '0.9rem',
                opacity: '0.8'
              }}>
                ↗ {getGrowthPercentage(profitData.averageOrderValue, profitData.previousAOV)}% improvement
              </div>
            </div>
          </div>

          {/* Analytics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {/* Revenue Breakdown */}
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
                  <BarChartIcon />
                </div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>Revenue Breakdown</h3>
              </div>

              {profitData.monthlyBreakdown?.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {profitData.monthlyBreakdown.map((month, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: index < profitData.monthlyBreakdown.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#475569',
                        minWidth: '100px'
                      }}>
                        {month.period}
                      </div>
                      <div style={{
                        flex: 1,
                        margin: '0 15px',
                        background: '#f1f5f9',
                        borderRadius: '6px',
                        height: '8px',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          borderRadius: '6px',
                          width: `${(month.revenue / Math.max(...profitData.monthlyBreakdown.map(m => m.revenue))) * 100}%`,
                          minWidth: month.revenue > 0 ? '2px' : '0'
                        }}></div>
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#059669',
                        minWidth: '100px',
                        textAlign: 'right'
                      }}>
                        {formatCurrency(month.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#64748b'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📈</div>
                  <p style={{ margin: 0 }}>No revenue data available for this period</p>
                </div>
              )}
            </div>

            {/* Top Performing Products */}
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
                  background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <EmojiEventsIcon />
                </div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>Top Performing Products</h3>
              </div>

              {profitData.topProducts?.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {profitData.topProducts.map((product, index) => (
                    <div key={product._id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      background: index % 2 === 0 ? '#f8fafc' : 'white',
                      borderRadius: '12px',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        width: '35px',
                        height: '35px',
                        background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '0.9rem'
                      }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          margin: '0 0 5px 0',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          {product.name}
                        </h4>
                        <div style={{
                          display: 'flex',
                          gap: '15px',
                          fontSize: '0.8rem',
                          color: '#64748b'
                        }}>
                          <span>Sales: {product.totalSold}</span>
                          <span style={{ color: '#059669', fontWeight: '600' }}>
                            {formatCurrency(product.totalRevenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#64748b'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏆</div>
                  <p style={{ margin: 0 }}>No product performance data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Export Section */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '16px',
            padding: '30px',
            border: '2px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FileDownloadIcon />
              </div>
              <div>
                <h3 style={{
                  margin: '0 0 5px 0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>Export Reports</h3>
                <p style={{
                  margin: 0,
                  color: '#64748b'
                }}>Download detailed reports for accounting and analysis</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'Export as PDF', icon: '📄', color: '#dc2626' },
                { label: 'Export as Excel', icon: '📊', color: '#16a34a' },
                { label: 'Export as CSV', icon: '📋', color: '#2563eb' }
              ].map((exportBtn, index) => (
                <button
                  key={index}
                  style={{
                    background: 'white',
                    color: exportBtn.color,
                    border: `2px solid ${exportBtn.color}`,
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = exportBtn.color;
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = exportBtn.color;
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span>{exportBtn.icon}</span>
                  {exportBtn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalProfit;
