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
            <div className="sellers-table-container" style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(226, 232, 240, 0.5)',
              marginTop: '20px'
            }}>
              <div className="sellers-header" style={{
                marginBottom: '25px',
                paddingBottom: '20px',
                borderBottom: '3px solid #f1f5f9'
              }}>
                <h3 style={{
                  color: '#1e293b',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  margin: '0',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>All Sellers ({filteredSellers.length})</h3>
              </div>
              
              <div className="table-wrapper" style={{
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                background: 'white',
                overflow: 'hidden'
              }}>
                <table className="sellers-table" style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0',
                  background: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  tableLayout: 'fixed',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: '2px solid #4f46e5'
                }}>
                <thead style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
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
                      width: '20%'
                    }}>Name</th>
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
                    }}>Email</th>
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
                    }}>Role</th>
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
                    }}>Joined</th>
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
                    }}>View</th>
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
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.length > 0 ? (
                    filteredSellers.map(seller => (
                      <tr key={seller._id} style={{
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
                      }}>
                        <td className="seller-name-only" style={{
                          padding: '20px 15px',
                          verticalAlign: 'middle',
                          fontSize: '0.9rem',
                          color: '#334155',
                          border: 'none',
                          fontWeight: '600',
                          width: '20%'
                        }}>
                          {seller.name}
                        </td>
                        <td style={{
                          padding: '20px 15px',
                          verticalAlign: 'middle',
                          fontSize: '0.9rem',
                          color: '#475569',
                          border: 'none',
                          width: '25%'
                        }}>{seller.email}</td>
                        <td style={{
                          padding: '20px 15px',
                          verticalAlign: 'middle',
                          border: 'none',
                          width: '12%'
                        }}>
                          <select
                            className={`role-select ${seller.role}`}
                            value={seller.role}
                            onChange={(e) => handleUpdateSellerStatus(seller._id, e.target.value)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '2px solid #e2e8f0',
                              background: seller.role === 'admin' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                                         seller.role === 'seller' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                         'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              minWidth: '80px'
                            }}
                          >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{
                          padding: '20px 15px',
                          verticalAlign: 'middle',
                          fontSize: '0.9rem',
                          color: '#475569',
                          border: 'none',
                          width: '13%'
                        }}>{formatDate(seller.createdAt)}</td>
                        <td className="view-column" style={{
                          padding: '20px 15px',
                          verticalAlign: 'middle',
                          border: 'none',
                          width: '15%'
                        }}>
                          <Link 
                            to={`/admin/seller/${seller._id}`} 
                            className="view-btn" 
                            title="View Seller Details"
                            style={{
                              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              minWidth: '70px',
                              justifyContent: 'center',
                              textDecoration: 'none'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            <VisibilityIcon style={{ fontSize: '14px' }} />
                            View
                          </Link>
                        </td>
                        <td className="actions" style={{
                          padding: '20px 15px',
                          verticalAlign: 'middle',
                          border: 'none',
                          width: '15%'
                        }}>
                          <div className="action-buttons" style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center'
                          }}>
                            <Link 
                              to={`/admin/seller/update/${seller._id}`} 
                              className="edit-btn" 
                              title="Edit Seller"
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                                minWidth: '40px',
                                textDecoration: 'none'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              <EditIcon style={{ fontSize: '14px' }} />
                            </Link>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteSeller(seller._id)}
                              title="Delete Seller"
                              style={{
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                                e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              <DeleteIcon style={{ fontSize: '14px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-results" style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        color: '#64748b',
                        fontStyle: 'italic',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        border: 'none'
                      }}>
                        No sellers found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSellers;
