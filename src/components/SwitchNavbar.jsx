import React, { useState, useEffect } from 'react'
import AdminNavbar from './AdminNavbar'
import Navbar from './Navbar'

const getUserFromLocalStorage =()=> {
    const user = localStorage.getItem('user')

    if (user && user!=='undefined') {
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }
    }
    return null;
}

const SwitchNavbar = () => {
    const [user, setUser] = useState(getUserFromLocalStorage());

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(getUserFromLocalStorage());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return user && user.isAdmin? <AdminNavbar/> : <Navbar/>
}

export default SwitchNavbar
