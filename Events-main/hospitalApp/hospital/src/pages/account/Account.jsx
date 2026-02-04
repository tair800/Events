import React, { useEffect, useMemo, useState } from 'react'
import { useUserAuth } from '../../context'
import { userService } from '../../services'
import AccountProfileCard from './AccountProfileCard'
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
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await userService.getProfile()
                setProfile(data)
            } catch (error) {
                console.error('Failed to load profile:', error)
            }
        }
        if (token) {
            loadProfile()
        }
    }, [token])

    return (
        <div className="account-page">
            <div className="account-content">
                <AccountProfileCard profile={profile} />
                <div className="account-card">
                    <div className="account-card-header">
                        <div className="account-card-title">
                            <span className="account-card-page">İdarəetmə paneli</span>
                            <h1>Xoş gəlmisiniz, {username || 'istifadəçi'}!</h1>
                        </div>
                        <button className="account-cta-btn" type="button">Üzv ol</button>
                    </div>
                    <div className="account-card-section-title">Account Details</div>
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
        </div>
    )
}

export default Account

