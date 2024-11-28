'use client'
import React, { ReactNode } from 'react'
import AuthProvider from '../../context/authContext'
interface AuthWrapperProps {
    children : ReactNode
}
const AuthWrapper = ({children} : AuthWrapperProps) => {

  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  )
}

export default AuthWrapper