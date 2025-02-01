import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const UserRoutes = () => {

    //get user information
    const user = JSON.parse(localStorage.getItem('user'))

    return user != null ? <Outlet />
        : <Navigate to={'/login'} />
}

export default UserRoutes
