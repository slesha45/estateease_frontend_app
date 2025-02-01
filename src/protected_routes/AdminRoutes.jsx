import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoutes = () => {
    //get user information
    const user = JSON.parse(localStorage.getItem('user'))
    
    return user != null && user.isAdmin ? <Outlet />
        : <Navigate to={'/login'} />
}

export default AdminRoutes
