import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminUsers.css';
import '../AdminStyles/UsersList.css';

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
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td className="user-info">
                          <img 
                            src={user.avatar?.url || '/images/profile.png'} 
                            alt={user.name} 
                            className="user-avatar" 
                          />
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>
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
                        <td>{formatDate(user.createdAt)}</td>
                        <td className="actions">
                          <Link to={`/admin/user/${user._id}`} className="view-btn">
                            <PersonIcon />
                          </Link>
                          <Link to={`/admin/user/update/${user._id}`} className="edit-btn">
                            <EditIcon />
                          </Link>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-results">
                        No users found matching your search criteria
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

export default AdminUsers;
