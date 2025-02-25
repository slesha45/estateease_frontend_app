import React from 'react'
import { FaBook, FaDoorOpen, FaHome, FaUser, FaUserAlt } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const AdminNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    //logout function
    const handleLogout = () => {
        localStorage.removeItem('user')
        window.location.href = '/login'
    }
    return (
        <>
            <div className='container-fluid' >
                <nav className="navbar navbar-expand-lg " style={{ backgroundColor: '#AB875F' }} >
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand">
                            <img src="/assets/images/logo.png" alt="Logo" style={{ width: '80px', marginRight: '50px' }} />
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className='nav-item'>
                                    <Link to="/admin/dashboard" className="nav-link" style={{ color: 'white' }}> <FaHome/> My Dashboard</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to="/admin/booking_list" className="nav-link" style={{ color: 'white' }}> <FaBook/> Booking list</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to="/admin/view_contact" className='nav-link' style={{ color: 'white' }}> <FaMessage/> Contact</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to="/admin/users" className='nav-link' style={{ color: 'white' }}> <FaUser/> Users</Link>
                                </li>


                            </ul>
                            <form className="d-flex" role="search">

                                {
                                    user ? (<>
                                        <div class="dropdown">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: '#AB875F', borderColor: 'white' }}>
                                                <FaUser size={20} /> Welcome, {user.firstName}!
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="/user/profile"> <FaUserAlt /> My Profile</a></li>
                                                <li><button onClick={handleLogout} class="dropdown-item" href="#"> <FaDoorOpen /> Logout</button></li>
                                            </ul>
                                        </div>

                                    </>)
                                        : (<>
                                            <Link to={'/login'} className="btn btn-secondary" style={{ backgroundColor: '#AB875F', borderColor: 'white' }} type="submit">Login</Link>
                                            <Link to={'/register'} className="btn btn-secondary ms-2" style={{ backgroundColor: '#AB875F', borderColor: 'white' }} type="submit">Register</Link>
                                        </>)
                                }

                            </form>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default AdminNavbar
