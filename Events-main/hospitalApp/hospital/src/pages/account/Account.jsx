import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useUserAuth } from '../../context'
import { useTranslation } from '../../hooks/useTranslation'
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
    const navigate = useNavigate()
    const { username, role, token, isAuthenticated } = useUserAuth()
    const { t } = useTranslation()
    const tokenPayload = useMemo(() => decodeTokenPayload(token), [token])
    const [profile, setProfile] = useState(null)
    const [basketItems, setBasketItems] = useState([])
    const [userEvents, setUserEvents] = useState([])

    const basketStorageKey = useMemo(() => {
        if (!isAuthenticated) return null
        const identity = username || token
        return identity ? `homeBasket:${identity}` : null
    }, [isAuthenticated, username, token])

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

    useEffect(() => {
        if (!basketStorageKey) {
            setBasketItems([])
            return
        }
        try {
            const stored = localStorage.getItem(basketStorageKey)
            const parsed = stored ? JSON.parse(stored) : []
            setBasketItems(Array.isArray(parsed) ? parsed : [])
        } catch (error) {
            console.error('Failed to load basket:', error)
            setBasketItems([])
        }
    }, [basketStorageKey])

    useEffect(() => {
        const fetchUserEvents = async () => {
            if (!token) {
                setUserEvents([])
                return
            }
            try {
                const response = await fetch('https://localhost:5000/api/users/me/events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    return
                }
                const data = await response.json()
                setUserEvents(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Failed to load user events:', error)
            }
        }

        fetchUserEvents()
    }, [token])

    useEffect(() => {
        const syncPaidPrices = async () => {
            if (!token) return
            try {
                const response = await fetch('https://localhost:5000/api/users/me/events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (!response.ok) return
                const data = await response.json()
                if (!Array.isArray(data) || data.length === 0) return

                setBasketItems((prev) => prev.map((item) => {
                    const matched = data.find((event) => event.eventId === item.id)
                    if (!matched) return item
                    return {
                        ...item,
                        paidPrice: matched.paidPrice,
                        paidCurrency: matched.paidCurrency
                    }
                }))
            } catch (error) {
                console.error('Failed to sync paid prices:', error)
            }
        }

        syncPaidPrices()
    }, [token])

    const formatBasketPrice = (item) => {
        if (!item) return '—'
        const priceValue = item.paidPrice ?? item.discountedPrice ?? item.price
        if (priceValue === 0 || priceValue === '0' || priceValue === null || priceValue === undefined) return '—'
        const symbols = { USD: '$', EUR: '€', GBP: '£', AZN: '₼' }
        const currency = item.paidCurrency || item.currency
        const symbol = symbols[currency]
        if (!symbol) return `${priceValue} ${item.currency || ''}`.trim()
        if (currency === 'USD' || currency === 'EUR' || currency === 'GBP') {
            return `${symbol}${priceValue}`
        }
        return `${priceValue} ${symbol}`
    }

    const formatBasketDate = (dateString) => {
        if (!dateString) return '—'
        const date = new Date(dateString)
        if (Number.isNaN(date.getTime())) return '—'
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

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
                <AccountProfileCard 
                    profile={profile} 
                    onProfileUpdate={(updatedProfile) => {
                        setProfile(updatedProfile)
                        localStorage.setItem('userProfileCache', JSON.stringify(updatedProfile))
                    }}
                />
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
                            {userEvents.map((item) => (
                                <div key={item.id} className="account-notifications-row">
                                    <span className="notification-title">{item.title}</span>
                                    <span className="notification-price">{formatBasketPrice(item)}</span>
                                    <span className="notification-date">{formatBasketDate(item.eventDate)}</span>
                                    <button
                                        className="notification-chip"
                                        type="button"
                                        onClick={() => navigate(`/event/${item.eventId}`)}
                                    >
                                        {t('viewMore')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account

