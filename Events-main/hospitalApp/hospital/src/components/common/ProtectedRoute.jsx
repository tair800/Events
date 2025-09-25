import React from 'react'
import { Navigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../../utils'

function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true'

    return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute
