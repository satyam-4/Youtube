import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!document.cookie.split('; ').find(row => row.startsWith('access_token'))

    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }
  
    return children
}

export default ProtectedRoute