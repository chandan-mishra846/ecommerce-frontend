import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/Dashboard.css';

function AdminDashboard() {
  const { user } = useSelector(state => state.user);

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-dashboard">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin portal. Manage your entire e-commerce platform.</p>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">150</p>
            </div>
            <div className="admin-stat-card">
              <h3>Total Sellers</h3>
              <p className="stat-number">25</p>
            </div>
            <div className="admin-stat-card">
              <h3>Total Products</h3>
              <p className="stat-number">500</p>
            </div>
            <div className="admin-stat-card">
              <h3>Total Orders</h3>
              <p className="stat-number">320</p>
            </div>
          </div>

          <div className="admin-quick-actions">
            <h3>Quick Actions</h3>
            <div className="admin-action-buttons">
              <button className="admin-action-btn">Manage Users</button>
              <button className="admin-action-btn">Manage Sellers</button>
              <button className="admin-action-btn">View All Products</button>
              <button className="admin-action-btn">Process Orders</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
