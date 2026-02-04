import React, { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
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
                localStorage.setItem('userProfileCache', JSON.stringify(data))
            } catch (error) {
                console.error('Failed to load profile:', error)
            }
        }
        if (token) {
            loadProfile()
        }
    }, [token])

    const handleToggleMembership = async () => {
        if (!profile) return
        const nextIsMember = !profile.isMember
        try {
            const updated = await userService.updateProfile({
                isMember: nextIsMember
            })
            setProfile((prev) => ({
                ...prev,
                ...updated,
                isMember: updated?.isMember ?? nextIsMember
            }))
            localStorage.setItem('userProfileCache', JSON.stringify({
                ...profile,
                ...updated,
                isMember: updated?.isMember ?? nextIsMember
            }))
            window.dispatchEvent(new Event('profile-updated'))
            Swal.fire({
                title: 'Uğurlu',
                text: nextIsMember ? 'Üzvlük aktiv edildi.' : 'Üzvlük deaktiv edildi.',
                icon: 'success',
                heightAuto: false,
                returnFocus: false
            })
        } catch (error) {
            console.error('Failed to update membership:', error)
            Swal.fire({
                title: 'Xəta',
                text: error.message || 'Üzvlük yenilənmədi.',
                icon: 'error',
                heightAuto: false,
                returnFocus: false
            })
        }
    }

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
                        <button className="account-cta-btn" type="button" onClick={handleToggleMembership}>
                            {profile?.isMember ? 'Üzvlükdən çıx' : 'Üzv ol'}
                        </button>
                    </div>
                    <div className="account-notifications">
                        <div className="account-notifications-header">
                            <h2>Notifications</h2>
                            <button className="account-notifications-action" type="button" aria-label="Play">
                                ▶
                            </button>
                        </div>
                        <div className="account-notifications-list">
                            <div className="account-notifications-row header">
                                <span>Title</span>
                                <span>Price</span>
                                <span>Date</span>
                                <span>Status</span>
                            </div>
                            <div className="account-notifications-row">
                                <span className="notification-title">#Membership</span>
                                <span className="notification-price">—</span>
                                <span className="notification-date">Jan 25, 2026</span>
                                <button className="notification-chip" type="button">Gözləmədə</button>
                            </div>
                            <div className="account-notifications-row">
                                <span className="notification-title">HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="notification-price">23 azn</span>
                                <span className="notification-date">Jan 25, 2026</span>
                                <button className="notification-chip" type="button">View more</button>
                            </div>
                            <div className="account-notifications-row">
                                <span className="notification-title">HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="notification-price">23 azn</span>
                                <span className="notification-date">Jan 25, 2026</span>
                                <button className="notification-chip" type="button">View more</button>
                            </div>
                            <div className="account-notifications-row">
                                <span className="notification-title">HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="notification-price">23 azn</span>
                                <span className="notification-date">Jan 25, 2026</span>
                                <button className="notification-chip" type="button">View more</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account

