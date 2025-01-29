import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { getUserProfileApi, updateUserProfileApi } from '../../apis/Api';
import { toast } from 'react-toastify';

const UserProfile = () => {
    // State for storing user details
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Fetch user data from local storage on component mount
    useEffect(() => {
        getUserProfileApi()
            .then((res) => {
                setUser(res.data);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setPhone(res.data.phone);
            })
            .catch((error) => {
                console.error('Error fetching user data');
            });
    }, []);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateUserProfileApi({ firstName, lastName, phone, password })
            .then((res) => {
                toast.success('Profile updated successfully');
                setUser(res.data);
                setEditMode(false);
            })
            .catch((error) => {
                toast.error('Error updating profile');
            });
    };

    return (
        <>
            <div>
                <h1 align="center" style={{ margin: '20px 0' }}>My Profile</h1>
                <div className="dashboard-container">
                    <div className="profile-details">
                        <h3>Profile Details:</h3>
                        {!editMode ? (
                            <div className="profile-info">
                                <div className="profile-row">
                                    <label>First Name:</label>
                                    <p>{user.firstName}</p>
                                </div>
                                <div className="profile-row">
                                    <label>Last Name:</label>
                                    <p>{user.lastName}</p>
                                </div>
                                <div className="profile-row">
                                    <label>Email:</label>
                                    <p>{user.email}</p>
                                </div>
                                <div className="profile-row">
                                    <label>Phone:</label>
                                    <p>{user.phone}</p>
                                </div>
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="save-button"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                                <div className="form-group mb-4">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="save-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="mt-2 save-button"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
