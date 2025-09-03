import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminUsers.css';


// Import Redux actions
import { 
  getUsersOnly, 
  deleteUser, 
  updateUserRole,
  clearErrors,
  resetDeleteStatus
} from '../features/admin/adminUsersSlice';

// Import Material UI icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

function AdminUsers() {
  const dispatch = useDispatch();
  const { usersOnly, loading, error, isDeleted } = useSelector(state => state.adminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(getUsersOnly());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    
    if (isDeleted) {
      toast.success('User deleted successfully');
      dispatch(resetDeleteStatus());
    }
  }, [error, isDeleted, dispatch]);

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Are you sure you want to update this user's role to ${newRole}?`)) {
      dispatch(updateUserRole({ id: userId, role: newRole }));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  const filteredUsers = usersOnly && usersOnly.length > 0 ? usersOnly.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) : [];

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
        <div className="admin-users-container">
          <div className="admin-page-header">
            <h1>Manage Users</h1>
            <p>View and manage users with role 'User' only</p>
          </div>

          <div className="admin-filters">
            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="users-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{usersOnly ? usersOnly.length : 0}</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="users-table-container" style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(226, 232, 240, 0.5)',
              marginTop: '20px'
            }}>
              <div className="users-header">
                <h3>All Users ({filteredUsers.length})</h3>
              </div>
              
              <div className="table-wrapper" style={{
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                background: 'white',
                overflow: 'hidden'
              }}>
                <table className="users-table" style={{
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
                      }}>User</th>
                      <th style={{
                        padding: '20px 15px',
                        textAlign: 'left',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        border: 'none',
                        width: '30%'
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
                        width: '15%'
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
                        width: '15%'
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
                        width: '20%'
                      }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user._id}>
                          <td className="user-info" style={{
                            padding: '20px 15px 20px 30px',
                            verticalAlign: 'middle',
                            border: 'none',
                            width: '20%'
                          }}>
                            <div className="user-details-table" style={{
                              paddingLeft: '20px',
                              marginLeft: '10px'
                            }}>
                              <h4 className="user-name-table" style={{
                                margin: '0 0 5px 0',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                color: '#334155',
                                paddingLeft: '10px'
                              }}>{user.name}</h4>
                              <span className="user-id" style={{
                                fontSize: '0.8rem',
                                color: '#64748b',
                                fontStyle: 'italic',
                                paddingLeft: '10px'
                              }}>ID: {user._id.slice(-6)}</span>
                            </div>
                          </td>
                          <td className="user-email-cell">{user.email}</td>
                          <td className="user-role-cell">
                            <select
                              className={`role-select ${user.role}`}
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            >
                              <option value="user">User</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="user-date-cell">{formatDate(user.createdAt)}</td>
                          <td className="user-actions-cell">
                            <div className="actions">
                              <Link to={`/admin/user/update/${user._id}`} className="action-btn-table edit-btn" title="Edit User">
                                Update
                              </Link>
                              <button 
                                className="action-btn-table delete-btn"
                                onClick={() => handleDeleteUser(user._id)}
                                title="Delete User"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-users-row">
                          <p>No users found matching your search criteria</p>
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

export default AdminUsers;
