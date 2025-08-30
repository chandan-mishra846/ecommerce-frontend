import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminSellers.css';

// Import Material UI icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';

// This would normally come from a Redux slice
// Replace with actual API call implementation
const fetchSellers = () => {
  // Mock data for demonstration
  return [
    {
      _id: '1',
      name: 'TechStore',
      email: 'contact@techstore.com',
      phone: '555-123-4567',
      description: 'Premier electronics and gadgets retailer',
      joinDate: '2023-01-15T10:30:00Z',
      status: 'Approved',
      totalProducts: 45,
      totalSales: 120,
      rating: 4.7,
      avatar: { url: '/images/profile.png' }
    },
    {
      _id: '2',
      name: 'SportyGear',
      email: 'info@sportygear.com',
      phone: '555-987-6543',
      description: 'High-quality sports equipment and apparel',
      joinDate: '2023-02-20T14:45:00Z',
      status: 'Approved',
      totalProducts: 78,
      totalSales: 95,
      rating: 4.2,
      avatar: { url: '/images/profile.png' }
    },
    {
      _id: '3',
      name: 'HomeEssentials',
      email: 'support@homeessentials.com',
      phone: '555-456-7890',
      description: 'Everything you need for your home',
      joinDate: '2023-03-10T09:15:00Z',
      status: 'Pending',
      totalProducts: 60,
      totalSales: 40,
      rating: 4.5,
      avatar: { url: '/images/profile.png' }
    },
    {
      _id: '4',
      name: 'BagWorld',
      email: 'sales@bagworld.com',
      phone: '555-789-0123',
      description: 'Specialists in bags, backpacks, and luggage',
      joinDate: '2023-04-05T11:20:00Z',
      status: 'Suspended',
      totalProducts: 30,
      totalSales: 65,
      rating: 3.8,
      avatar: { url: '/images/profile.png' }
    },
  ];
};

function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  
  useEffect(() => {
    // In a real app, this would dispatch an action to fetch sellers
    const loadSellers = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const sellerData = fetchSellers();
        setSellers(sellerData);
      } catch (error) {
        console.error('Failed to fetch sellers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSellers();
  }, []);

  const handleUpdateSellerStatus = async (sellerId, newStatus) => {
    try {
      // Update seller status logic would go here
      alert(`Seller ${sellerId} status updated to ${newStatus}`);
      
      // Update local state to reflect the change
      setSellers(sellers.map(seller => 
        seller._id === sellerId ? { ...seller, status: newStatus } : seller
      ));
    } catch (error) {
      console.error('Failed to update seller status:', error);
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) return;
    
    try {
      // Delete seller logic would go here
      alert(`Seller ${sellerId} deleted`);
      
      // Update local state to reflect the deletion
      setSellers(sellers.filter(seller => seller._id !== sellerId));
    } catch (error) {
      console.error('Failed to delete seller:', error);
    }
  };

  // Filter and sort sellers
  const getFilteredSellers = () => {
    let filtered = [...sellers];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(seller => 
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(seller => seller.status === filterStatus);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
        break;
      case 'products':
        filtered.sort((a, b) => b.totalProducts - a.totalProducts);
        break;
      case 'sales':
        filtered.sort((a, b) => b.totalSales - a.totalSales);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.rating - a.rating);
    }
    
    return filtered;
  };

  const filteredSellers = getFilteredSellers();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <VerifiedIcon className="status-icon approved" />;
      case 'Pending':
        return <PendingIcon className="status-icon pending" />;
      case 'Suspended':
        return <BlockIcon className="status-icon suspended" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-sellers-container">
          <div className="admin-page-header">
            <h1>Seller Management</h1>
            <p>View, approve, and manage sellers on the platform</p>
          </div>

          <div className="seller-stats">
            <div className="stat-card">
              <h3>Total Sellers</h3>
              <p>{sellers.length}</p>
            </div>
            <div className="stat-card">
              <h3>Approved</h3>
              <p>{sellers.filter(seller => seller.status === 'Approved').length}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p>{sellers.filter(seller => seller.status === 'Pending').length}</p>
            </div>
            <div className="stat-card">
              <h3>Suspended</h3>
              <p>{sellers.filter(seller => seller.status === 'Suspended').length}</p>
            </div>
          </div>

          <div className="admin-filters">
            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search sellers by name, email, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-options">
              <div className="status-filter">
                <label><FilterListIcon /> Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              
              <div className="sort-filter">
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Top Rated</option>
                  <option value="sales">Most Sales</option>
                  <option value="products">Most Products</option>
                  <option value="newest">Newest Sellers</option>
                  <option value="oldest">Oldest Sellers</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading sellers...</p>
            </div>
          ) : (
            <div className="sellers-table-container">
              <table className="sellers-table">
                <thead>
                  <tr>
                    <th>Seller</th>
                    <th>Products</th>
                    <th>Sales</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.length > 0 ? (
                    filteredSellers.map(seller => (
                      <tr key={seller._id}>
                        <td className="seller-info">
                          <img 
                            src={seller.avatar?.url || '/images/profile.png'} 
                            alt={seller.name} 
                            className="seller-avatar" 
                          />
                          <div>
                            <div className="seller-name">{seller.name}</div>
                            <div className="seller-email">{seller.email}</div>
                            <div className="seller-phone">{seller.phone}</div>
                          </div>
                        </td>
                        <td>{seller.totalProducts}</td>
                        <td>{seller.totalSales}</td>
                        <td className="seller-rating">
                          <div className="rating-stars">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <span 
                                key={index} 
                                className={`star ${index < Math.floor(seller.rating) ? 'filled' : ''} ${index === Math.floor(seller.rating) && seller.rating % 1 > 0 ? 'half-filled' : ''}`}
                              >★</span>
                            ))}
                          </div>
                          <div className="rating-value">{seller.rating.toFixed(1)}</div>
                        </td>
                        <td className="seller-status">
                          <div className={`status-badge ${seller.status.toLowerCase()}`}>
                            {getStatusIcon(seller.status)}
                            <span>{seller.status}</span>
                          </div>
                          <select
                            className="status-select"
                            value={seller.status}
                            onChange={(e) => handleUpdateSellerStatus(seller._id, e.target.value)}
                          >
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </td>
                        <td>{formatDate(seller.joinDate)}</td>
                        <td className="actions">
                          <Link to={`/admin/seller/${seller._id}`} className="view-btn" title="View Seller Details">
                            <VisibilityIcon />
                          </Link>
                          <Link to={`/admin/seller/update/${seller._id}`} className="edit-btn" title="Edit Seller">
                            <EditIcon />
                          </Link>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteSeller(seller._id)}
                            title="Delete Seller"
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        No sellers found matching your search criteria
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

export default AdminSellers;
