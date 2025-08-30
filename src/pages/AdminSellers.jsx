import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminSellers.css';

// Import Redux actions
import { 
  getSellersOnly, 
  deleteUser, 
  updateUserRole,
  clearErrors,
  resetDeleteStatus
} from '../features/admin/adminUsersSlice';

// Import Material UI icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';

function AdminSellers() {
  const dispatch = useDispatch();
  const { sellersOnly, loading, error, isDeleted } = useSelector(state => state.adminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  useEffect(() => {
    dispatch(getSellersOnly());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    
    if (isDeleted) {
      toast.success('Seller deleted successfully');
      dispatch(resetDeleteStatus());
    }
  }, [error, isDeleted, dispatch]);

  const handleUpdateSellerStatus = async (sellerId, newRole) => {
    if (window.confirm(`Are you sure you want to update this seller's role to ${newRole}?`)) {
      dispatch(updateUserRole({ id: sellerId, role: newRole }));
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      dispatch(deleteUser(sellerId));
    }
  };

  // Filter and sort sellers
  const getFilteredSellers = () => {
    let filtered = sellersOnly ? [...sellersOnly] : [];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(seller => 
        seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
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

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-sellers-container">
          <div className="admin-page-header">
            <h1>Manage Sellers</h1>
            <p>View and manage users with role 'Seller' only</p>
          </div>

          <div className="seller-stats">
            <div className="stat-card">
              <h3>Total Sellers</h3>
              <p>{sellersOnly ? sellersOnly.length : 0}</p>
            </div>
          </div>

          <div className="admin-filters">
            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search sellers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-options">
              <div className="sort-filter">
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest Sellers</option>
                  <option value="oldest">Oldest Sellers</option>
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
                    <th>Email</th>
                    <th>Role</th>
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
                          </div>
                        </td>
                        <td>{seller.email}</td>
                        <td>
                          <select
                            className={`role-select ${seller.role}`}
                            value={seller.role}
                            onChange={(e) => handleUpdateSellerStatus(seller._id, e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>{formatDate(seller.createdAt)}</td>
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
                      <td colSpan="5" className="no-results">
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
