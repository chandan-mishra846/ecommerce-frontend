import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminAnalytics.css';
import { fetchDashboardAnalytics, fetchFilteredAnalytics } from '../features/analytics/analyticsSlice';

function AdminAnalytics() {
  const dispatch = useDispatch();
  const { dashboardData, filteredData, loading, error } = useSelector((state) => state.analytics);
  const [timeRange, setTimeRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  useEffect(() => {
    if (timeRange !== 'monthly') {
      dispatch(fetchFilteredAnalytics(timeRange));
    }
  }, [dispatch, timeRange]);

  const analyticsData = dashboardData;

  // Simple bar chart component
  const BarChart = ({ data, dataKey, labelKey, color }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(item => item[dataKey])) * 1.1 || 1;
    
    return (
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={index} className="chart-item">
            <div className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${(item[dataKey] / maxValue) * 100}%`,
                  backgroundColor: color || '#4f46e5'
                }}
              ></div>
            </div>
            <div className="chart-label">{item[labelKey]}</div>
          </div>
        ))}
      </div>
    );
  };

  // Simple pie chart component
  const PieChart = ({ data, total }) => {
    if (!data || data.length === 0 || !total) return null;
    
    let startAngle = 0;
    
    return (
      <div className="pie-chart-container">
        <div className="pie-chart">
          {data.map((item, index) => {
            const percentage = (item.count / total) * 100;
            const degrees = (percentage / 100) * 360;
            const oldStartAngle = startAngle;
            startAngle += degrees;
            
            return (
              <div 
                key={index}
                className="pie-segment"
                style={{
                  '--start-angle': `${oldStartAngle}deg`,
                  '--end-angle': `${startAngle}deg`,
                  '--color': `hsl(${index * 60}, 70%, 60%)`,
                }}
              ></div>
            );
          })}
        </div>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
              ></div>
              <div className="legend-label">{item.name}</div>
              <div className="legend-value">{item.count}</div>
              <div className="legend-percentage">({((item.count / total) * 100).toFixed(1)}%)</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Format currency
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num || 0);
  };

  const renderOverviewTab = () => {
    if (!analyticsData) return null;
    
    return (
      <div className="analytics-overview">
        <div className="analytics-row">
          <div className="analytics-card revenue">
            <h3>Total Revenue</h3>
            <div className="metric">
              <span className="value">{formatCurrency(analyticsData.revenueData.total)}</span>
              <span className={`change ${analyticsData.revenueData.change >= 0 ? 'positive' : 'negative'}`}>
                {analyticsData.revenueData.change >= 0 ? '+' : ''}{analyticsData.revenueData.change}%
              </span>
            </div>
            <div className="chart-container">
              <BarChart 
                data={analyticsData.revenueData.monthly} 
                dataKey="revenue" 
                labelKey="month" 
                color="#4ade80"
              />
            </div>
          </div>
          
          <div className="analytics-card orders">
            <h3>Total Orders</h3>
            <div className="metric">
              <span className="value">{formatNumber(analyticsData.ordersData.total)}</span>
              <span className={`change ${analyticsData.ordersData.change >= 0 ? 'positive' : 'negative'}`}>
                {analyticsData.ordersData.change >= 0 ? '+' : ''}{analyticsData.ordersData.change}%
              </span>
            </div>
            <div className="chart-container">
              <BarChart 
                data={analyticsData.ordersData.monthly} 
                dataKey="orders" 
                labelKey="month" 
                color="#4f46e5"
              />
            </div>
          </div>
          
          <div className="analytics-card users">
            <h3>Total Users</h3>
            <div className="metric">
              <span className="value">{formatNumber(analyticsData.usersData.total)}</span>
              <span className="sub-metric">
                <span className="sub-label">New: </span>
                <span className="sub-value">{analyticsData.usersData.new}</span>
              </span>
            </div>
            <div className="chart-container">
              <BarChart 
                data={analyticsData.usersData.monthly} 
                dataKey="users" 
                labelKey="month" 
                color="#f97316"
              />
            </div>
          </div>
        </div>
        
        <div className="analytics-row">
          <div className="analytics-card order-status">
            <h3>Order Status</h3>
            <div className="status-grid">
              <div className="status-item processing">
                <div className="status-label">Processing</div>
                <div className="status-value">{analyticsData.ordersData.status.processing}</div>
              </div>
              <div className="status-item shipped">
                <div className="status-label">Shipped</div>
                <div className="status-value">{analyticsData.ordersData.status.shipped}</div>
              </div>
              <div className="status-item delivered">
                <div className="status-label">Delivered</div>
                <div className="status-value">{analyticsData.ordersData.status.delivered}</div>
              </div>
              <div className="status-item cancelled">
                <div className="status-label">Cancelled</div>
                <div className="status-value">{analyticsData.ordersData.status.cancelled}</div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card product-categories">
            <h3>Product Categories</h3>
            <PieChart 
              data={analyticsData.productsData.topCategories} 
              total={analyticsData.productsData.total} 
            />
          </div>
          
          <div className="analytics-card top-sellers">
            <h3>Top Sellers</h3>
            <table className="top-items-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.sellersData.topSellers.map((seller, index) => (
                  <tr key={index}>
                    <td>{seller.name}</td>
                    <td>{seller.sales}</td>
                    <td>{formatCurrency(seller.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderProductsTab = () => {
    if (!analyticsData) return null;
    
    return (
      <div className="products-analytics">
        <div className="analytics-row">
          <div className="analytics-card products-summary">
            <h3>Products Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-label">Total Products</div>
                <div className="stat-value">{formatNumber(analyticsData.productsData.total)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Out of Stock</div>
                <div className="stat-value">{analyticsData.productsData.outOfStock}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Low Stock</div>
                <div className="stat-value">{analyticsData.productsData.lowStock}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="analytics-row">
          <div className="analytics-card product-categories wide">
            <h3>Product Categories</h3>
            <PieChart 
              data={analyticsData.productsData.topCategories} 
              total={analyticsData.productsData.total} 
            />
          </div>
        </div>
        
        <div className="analytics-row">
          <div className="analytics-card top-products wide">
            <h3>Top Selling Products</h3>
            <table className="top-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.productsData.topSelling.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.sales}</td>
                    <td>{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSalesTab = () => {
    if (!analyticsData) return null;
    
    return (
      <div className="sales-analytics">
        <div className="analytics-row">
          <div className="analytics-card revenue-summary">
            <h3>Revenue Summary</h3>
            <div className="metric large">
              <span className="value">{formatCurrency(analyticsData.revenueData.total)}</span>
              <span className={`change ${analyticsData.revenueData.change >= 0 ? 'positive' : 'negative'}`}>
                {analyticsData.revenueData.change >= 0 ? '+' : ''}{analyticsData.revenueData.change}% from previous period
              </span>
            </div>
          </div>
          
          <div className="analytics-card orders-summary">
            <h3>Orders Summary</h3>
            <div className="metric large">
              <span className="value">{formatNumber(analyticsData.ordersData.total)}</span>
              <span className={`change ${analyticsData.ordersData.change >= 0 ? 'positive' : 'negative'}`}>
                {analyticsData.ordersData.change >= 0 ? '+' : ''}{analyticsData.ordersData.change}% from previous period
              </span>
            </div>
          </div>
        </div>
        
        <div className="analytics-row">
          <div className="analytics-card monthly-revenue wide">
            <h3>Monthly Revenue</h3>
            <div className="chart-container tall">
              <BarChart 
                data={analyticsData.revenueData.monthly} 
                dataKey="revenue" 
                labelKey="month" 
                color="#4ade80"
              />
            </div>
          </div>
        </div>
        
        <div className="analytics-row">
          <div className="analytics-card monthly-orders wide">
            <h3>Monthly Orders</h3>
            <div className="chart-container tall">
              <BarChart 
                data={analyticsData.ordersData.monthly} 
                dataKey="orders" 
                labelKey="month" 
                color="#4f46e5"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsersTab = () => {
    if (!analyticsData) return null;
    
    return (
      <div className="users-analytics">
        <div className="analytics-row">
          <div className="analytics-card users-summary">
            <h3>Users Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{formatNumber(analyticsData.usersData.total)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">New Users (30 days)</div>
                <div className="stat-value">{analyticsData.usersData.new}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Active Users</div>
                <div className="stat-value">{analyticsData.usersData.active}</div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card sellers-summary">
            <h3>Sellers Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-label">Total Sellers</div>
                <div className="stat-value">{formatNumber(analyticsData.sellersData.total)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">New Sellers (30 days)</div>
                <div className="stat-value">{analyticsData.sellersData.new}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Active Sellers</div>
                <div className="stat-value">{analyticsData.sellersData.active}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="analytics-row">
          <div className="analytics-card user-growth wide">
            <h3>User Growth</h3>
            <div className="chart-container tall">
              <BarChart 
                data={analyticsData.usersData.monthly} 
                dataKey="users" 
                labelKey="month" 
                color="#f97316"
              />
            </div>
          </div>
        </div>
        
        <div className="analytics-row">
          <div className="analytics-card top-sellers wide">
            <h3>Top Performing Sellers</h3>
            <table className="top-items-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.sellersData.topSellers.map((seller, index) => (
                  <tr key={index}>
                    <td>{seller.name}</td>
                    <td>{seller.sales}</td>
                    <td>{formatCurrency(seller.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Handle error display
  if (error) {
    return (
      <div>
        <AdminNavbar />
        <div className="admin-content">
          <div className="admin-analytics-container">
            <div className="error-container">
              <h2>Error Loading Analytics</h2>
              <p>{error}</p>
              <button onClick={() => dispatch(fetchDashboardAnalytics())}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-analytics-container">
          <div className="admin-page-header">
            <div>
              <h1>Analytics Dashboard</h1>
              <p>Track performance metrics and business insights</p>
            </div>
            <div className="time-range-selector">
              <label>Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="daily">Last 24 Hours</option>
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">Last 30 Days</option>
                <option value="yearly">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          <div className="analytics-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button 
              className={`tab-button ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </button>
            <button 
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users & Sellers
            </button>
          </div>

          {loading || !analyticsData ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading analytics data...</p>
            </div>
          ) : (
            <div className="analytics-content">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'products' && renderProductsTab()}
              {activeTab === 'sales' && renderSalesTab()}
              {activeTab === 'users' && renderUsersTab()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
