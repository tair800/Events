import React, { useMemo } from 'react'
import { useUserAuth } from '../../context'
import './Account.css'

const decodeTokenPayload = (token) => {
    if (!token) return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    try {
        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=')
        const json = atob(padded)
        return JSON.parse(json)
    } catch (error) {
        return null
    }
}

const Account = () => {
    const { username, role, token } = useUserAuth()
    const tokenPayload = useMemo(() => decodeTokenPayload(token), [token])

    return (
        <div className="account-page">
            <div className="account-card">
                <h1>Account Details</h1>
                <div className="account-row">
                    <span className="account-label">Username</span>
                    <span className="account-value">{username || '—'}</span>
                </div>
                <div className="account-row">
                    <span className="account-label">Role</span>
                    <span className="account-value">{role || 'User'}</span>
                </div>
                <div className="account-row">
                    <span className="account-label">Email</span>
                    <span className="account-value">{tokenPayload?.email || '—'}</span>
                </div>
                <div className="account-row">
                    <span className="account-label">User ID</span>
                    <span className="account-value">{tokenPayload?.nameid || '—'}</span>
                </div>
            </div>
        </div>
    )
}

export default Account

