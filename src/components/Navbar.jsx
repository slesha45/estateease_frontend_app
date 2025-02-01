import React, { useState, useEffect } from 'react';
import { FaBook, FaDoorOpen, FaHeart, FaHome, FaUser, FaUserAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUserApi, getUserDetails } from '../apis/Api'; // Import logoutUserApi and getUserDetails
import { toast } from 'react-toastify';


const Navbar = () => {
    const navigate = useNavigate();

    // Get user data and token from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const [welcomeMessage, setWelcomeMessage] = useState('');

    useEffect(() => {
        if (user && user.id) { // Ensure user.id exists
            console.log("Fetching data for user ID:", user.id); // Log user ID
            const fetchUserData = async () => {
                try {
                    const response = await getUserDetails(user.id);
                    console.log("User details response:", response); // Log response
                    if (response.status === 200 && response.data.success) {
                        setWelcomeMessage(`Welcome back, ${response.data.user.firstName}!`);
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Failed to fetch user data', error);
                    setWelcomeMessage('');
                }
            };
            fetchUserData();
        }
    }, [user]);

    // Enhanced logout function
    const handleLogout = async () => {
        if (!token) {
            // If no token is present, simply remove user and navigate to login
            localStorage.removeItem('user');
            navigate('/login');
            return;
        }

        try {
            const response = await logoutUserApi(); // Ensure this API call includes the token
            console.log("Logout response:", response); // Log logout response
            if (response.status === 200 && response.data.success) {
                localStorage.removeItem('user');
                localStorage.removeItem('token'); // Remove token as well
                toast.success(response.data.message || 'Logged out successfully!');
                navigate('/login');
            } else {
                throw new Error(response.data.message || 'Logout failed');
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error('Failed to logout');
        }
    };

    return (
        <div className='container-fluid'>
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#AB875F' }}>
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        <img src="/assets/images/logo.png" alt="Logo" style={{ width: '80px', marginRight: '50px' }} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/homepage" className="nav-link" style={{ color: 'white' }}>
                                    <FaHome /> Home
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link to="/my_bookings" className='nav-link' style={{ color: 'white' }}>
                                    <FaBook /> My Bookings
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link to="/wishlist" className="nav-link" style={{ color: 'white' }}>
                                    <FaHeart /> Wishlist
                                </Link>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            {user ? (
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false" style={{ backgroundColor: '#AB875F', borderColor: 'white' }}>
                                        <FaUser size={20} /> {welcomeMessage || `Welcome, ${user.firstName}!`}
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link className="dropdown-item" to="/user/profile">
                                                <FaUserAlt /> My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={handleLogout} className="dropdown-item">
                                                <FaDoorOpen /> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <>
                                    <Link to='/login' className="btn btn-secondary" style={{ backgroundColor: '#AB875F', borderColor: 'white' }}>
                                        Login
                                    </Link>
                                    <Link to='/register' className="btn btn-secondary ms-2" style={{ backgroundColor: '#AB875F', borderColor: 'white' }}>
                                        Register
                                    </Link>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;

