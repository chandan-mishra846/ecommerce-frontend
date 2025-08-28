import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import '../pageStyles/TotalProfit.css';

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
      const response = await fetch(`/api/v1/seller/profit?period=${selectedPeriod}`, {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setProfitData(result.data || {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          monthlyBreakdown: [],
          topProducts: []
        });
      } else {
        toast.error(result.message || 'Failed to fetch profit data');
      }
    } catch (error) {
      console.error('Error fetching profit data:', error);
      toast.error('Error fetching profit data');
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
    <>
      <div className="profit-container">
        <div className="profit-header">
          <h1>Total Profit Analytics</h1>
          <p>Track your revenue and business performance</p>
        </div>

        <div className="period-selector">
          <div className="period-buttons">
            {[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' }
            ].map(period => (
              <button
                key={period.value}
                className={`period-btn ${selectedPeriod === period.value ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="profit-overview">
          <div className="profit-card primary">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Revenue</h3>
              <div className="amount">{formatCurrency(profitData.totalRevenue)}</div>
              <div className="growth positive">
                ↗ {getGrowthPercentage(profitData.totalRevenue, profitData.previousRevenue)}% from last period
              </div>
            </div>
          </div>

          <div className="profit-card">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <h3>Total Orders</h3>
              <div className="number">{profitData.totalOrders}</div>
              <div className="growth positive">
                ↗ {getGrowthPercentage(profitData.totalOrders, profitData.previousOrders)}% growth
              </div>
            </div>
          </div>

          <div className="profit-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Average Order Value</h3>
              <div className="amount">{formatCurrency(profitData.averageOrderValue)}</div>
              <div className="growth">
                ↗ {getGrowthPercentage(profitData.averageOrderValue, profitData.previousAOV)}% improvement
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-section">
            <h3>Revenue Breakdown</h3>
            <div className="breakdown-chart">
              {profitData.monthlyBreakdown?.length > 0 ? (
                profitData.monthlyBreakdown.map((month, index) => (
                  <div key={index} className="breakdown-item">
                    <div className="month-label">{month.period}</div>
                    <div className="revenue-bar">
                      <div 
                        className="revenue-fill" 
                        style={{width: `${(month.revenue / Math.max(...profitData.monthlyBreakdown.map(m => m.revenue))) * 100}%`}}
                      ></div>
                    </div>
                    <div className="revenue-amount">{formatCurrency(month.revenue)}</div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <div className="no-data-icon">📈</div>
                  <p>No revenue data available for this period</p>
                </div>
              )}
            </div>
          </div>

          <div className="analytics-section">
            <h3>Top Performing Products</h3>
            <div className="top-products">
              {profitData.topProducts?.length > 0 ? (
                profitData.topProducts.map((product, index) => (
                  <div key={product._id} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <div className="product-stats">
                        <span className="sales">Sales: {product.totalSold}</span>
                        <span className="revenue">{formatCurrency(product.totalRevenue)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <div className="no-data-icon">🏆</div>
                  <p>No product performance data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profit-summary">
          <h3>Performance Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Highest Revenue Month:</span>
              <span className="value">
                {profitData.highestMonth || 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Best Selling Product:</span>
              <span className="value">
                {profitData.topProducts?.[0]?.name || 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Growth Rate:</span>
              <span className="value positive">
                {getGrowthPercentage(profitData.totalRevenue, profitData.previousRevenue)}%
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Customer Satisfaction:</span>
              <span className="value">
                {profitData.averageRating || 'N/A'} ⭐
              </span>
            </div>
          </div>
        </div>

        <div className="export-section">
          <h3>Export Reports</h3>
          <p>Download detailed reports for accounting and analysis</p>
          <div className="export-buttons">
            <button className="export-btn pdf">
              📄 Export as PDF
            </button>
            <button className="export-btn excel">
              📊 Export as Excel
            </button>
            <button className="export-btn csv">
              📋 Export as CSV
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TotalProfit;
