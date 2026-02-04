import React, { createContext, useContext, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../utils'

const UserAuthContext = createContext(null)

export const useUserAuth = () => {
    const context = useContext(UserAuthContext)
    if (!context) {
        throw new Error('useUserAuth must be used within a UserAuthProvider')
    }
    return context
}

export const UserAuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        () => localStorage.getItem(STORAGE_KEYS.USER_TOKEN) || ''
    )
    const [username, setUsername] = useState(
        () => localStorage.getItem(STORAGE_KEYS.USER_NAME) || ''
    )
    const [role, setRole] = useState(
        () => localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'User'
    )

    const login = ({ token: newToken, username: newUsername, role: newRole }) => {
        localStorage.setItem(STORAGE_KEYS.USER_TOKEN, newToken)
        localStorage.setItem(STORAGE_KEYS.USER_NAME, newUsername || '')
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, newRole || 'User')
        setToken(newToken)
        setUsername(newUsername || '')
        setRole(newRole || 'User')
    }

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.USER_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_NAME)
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE)
        localStorage.removeItem('userProfileCache')
        setToken('')
        setUsername('')
        setRole('User')
    }

    const value = useMemo(
        () => ({
            token,
            username,
            role,
            isAuthenticated: Boolean(token),
            login,
            logout,
        }),
        [token, username, role]
    )

    return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
}

