import React, { useState, useEffect } from 'react';
import { getAllUsersApi } from '../../../apis/Api';
import { toast } from 'react-toastify';
import { FaSearch, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import './Users.css'; // Ensure this CSS file is updated accordingly
 
const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
 
  const fetchUsers = async () => {
    try {
      const response = await getAllUsersApi();
      if (response.status === 200 && response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setLoading(false);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
      setError(true);
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchUsers();
  }, []);
 
  // Handler for search input changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  };
 
  // Modal handlers
  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };
 
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };
 
  if (loading) {
    return (
      <div className="users-page">
        <div className="users-container">
          <h2>Users</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="users-page">
        <div className="users-container">
          <h2>Users</h2>
          <p>Error fetching users.</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="users-page">
      <div className="users-container container mt-5">
        <h2 className="mb-4 text-center">User Management</h2>
       
        {/* Search Bar */}
        <div className="search-bar mb-4">
          <div className="input-group">
            <span className="input-group-text" id="search-icon">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by First Name, Last Name, or Email"
              aria-label="Search"
              aria-describedby="search-icon"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
 
        {/* Users Table */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle" aria-label="Users Table">
            <thead>
              <tr>
                <th scope="col">#</th> {/* Index Column */}
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">Reset Password OTP</th>
                <th scope="col">OTP Expires</th>
                <th scope="col">Login Attempts</th>
                <th scope="col">Lock Until</th>
                <th scope="col">Status</th> {/* isLoggedIn Status */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} onClick={() => openModal(user)} style={{ cursor: 'pointer' }}>
                    <th scope="row">{index + 1}</th>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.resetPasswordOTP || 'N/A'}</td>
                    <td>{user.resetPasswordExpires ? new Date(user.resetPasswordExpires).toLocaleString() : 'N/A'}</td>
                    <td>{user.loginAttempts}</td>
                    <td>{user.lockUntil ? new Date(user.lockUntil).toLocaleString() : 'N/A'}</td>
                    <td>
                      {user.isLoggedIn ? (
                        <span className="badge bg-success d-flex align-items-center">
                          <FaUserCheck className="me-1" /> Online
                        </span>
                      ) : (
                        <span className="badge bg-secondary d-flex align-items-center">
                          <FaUserTimes className="me-1" /> Offline
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
 
        {/* Modal for User Details */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="User Details"
          className="modal"
          overlayClassName="overlay"
        >
          {selectedUser && (
            <div>
              <h2>{selectedUser.firstName} {selectedUser.lastName}</h2>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Login Attempts:</strong> {selectedUser.loginAttempts}</p>
              <p><strong>Lock Until:</strong> {selectedUser.lockUntil ? new Date(selectedUser.lockUntil).toLocaleString() : 'N/A'}</p>
              {/* Add more details as needed */}
              <button onClick={closeModal} className="btn btn-secondary mt-3">Close</button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
 
export default Users;