import React, { useCallback, useEffect, useState } from 'react'
import { useUserAuth } from '../../context'
import { userService } from '../../services'
import AccountProfileCard from './AccountProfileCard'
import './Account.css'

const AccountEvents = () => {
    const { token, username } = useUserAuth()
    const [profile, setProfile] = useState(null)
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [basketSynced, setBasketSynced] = useState(false)

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

    const fetchUserEvents = useCallback(async () => {
        if (!token) {
            setEvents([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const response = await fetch('https://localhost:5000/api/users/me/events', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error('Failed to load events')
            }
            const data = await response.json()
            setEvents(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Failed to load user events:', err)
            setError(err.message || 'Failed to load events')
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        fetchUserEvents()
    }, [fetchUserEvents])

    const getBasketKey = () => {
        if (!token) return null
        const identity = username || token
        return identity ? `homeBasket:${identity}` : null
    }

    useEffect(() => {
        const syncBasketToAttendees = async () => {
            if (!token || basketSynced) return

            const key = getBasketKey()
            if (!key) {
                setBasketSynced(true)
                return
            }

            const stored = localStorage.getItem(key)
            if (!stored) {
                setBasketSynced(true)
                return
            }

            let items = []
            try {
                const parsed = JSON.parse(stored)
                items = Array.isArray(parsed) ? parsed : []
            } catch (err) {
                console.error('Failed to parse basket:', err)
                setBasketSynced(true)
                return
            }

            if (items.length === 0) {
                setBasketSynced(true)
                return
            }

            try {
                await Promise.all(items.map((item) => (
                    fetch(`https://localhost:5000/api/events/${item.id}/attendees`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )))
            } catch (err) {
                console.error('Failed to sync basket attendees:', err)
            } finally {
                setBasketSynced(true)
                await fetchUserEvents()
            }
        }

        syncBasketToAttendees()
    }, [basketSynced, fetchUserEvents, token, username])

    const [expandedRows, setExpandedRows] = useState([])

    useEffect(() => {
        setExpandedRows(events.map(() => false))
    }, [events])

    const toggleExpanded = (index) => {
        setExpandedRows((prev) => prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)))
    }

    const formatDate = (dateString) => {
        if (!dateString) return '—'
        const date = new Date(dateString)
        if (Number.isNaN(date.getTime())) return '—'
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        })
    }

    const formatTime = (dateString) => {
        if (!dateString) return '—'
        const date = new Date(dateString)
        if (Number.isNaN(date.getTime())) return '—'
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    const formatPrice = (event) => {
        if (!event) return '—'
        const priceValue = event.paidPrice ?? event.discountedPrice ?? event.price
        if (priceValue === 0 || priceValue === '0' || priceValue === null || priceValue === undefined) return '—'
        const symbols = { USD: '$', EUR: '€', GBP: '£', AZN: '₼' }
        const currency = event.paidCurrency || event.currency
        const symbol = symbols[currency]
        if (!symbol) return `${priceValue} ${event.currency || ''}`.trim()
        if (currency === 'USD' || currency === 'EUR' || currency === 'GBP') {
            return `${symbol}${priceValue}`
        }
        return `${priceValue} ${symbol}`
    }

    const resolveCertificateUrl = (fileName) => {
        if (!fileName) return null
        const cleaned = String(fileName).split('?')[0]
        if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
            return cleaned
        }
        if (cleaned.startsWith('/uploads/')) {
            return `https://localhost:5000${cleaned}`
        }
        const baseName = cleaned.split('/').pop()
        return baseName ? `https://localhost:5000/api/ImageUpload/pdf/${baseName}` : null
    }

    const handleDownload = async (fileName) => {
        const url = resolveCertificateUrl(fileName)
        if (!url) return
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Failed to download certificate')
            }
            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = String(fileName).split('/').pop() || 'certificate.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
            console.error('Certificate download failed:', error)
            window.open(url, '_blank', 'noopener')
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
                <div className="account-card account-events-card">
                    <div className="account-events-header">
                        <span className="account-card-page">Tədbirlər</span>
                        <h1>Tədbirlərim</h1>
                    </div>

                    <div className="account-events-table">
                        <div className="account-events-head">
                            <span>Events name</span>
                            <span>Events date</span>
                            <span>Locations</span>
                            <span>Price</span>
                            <button className="account-events-status-btn" type="button">
                                Status <span className="caret">▾</span>
                            </button>
                        </div>
                        {loading ? (
                            <div className="account-events-row">
                                <span>Loading...</span>
                            </div>
                        ) : error ? (
                            <div className="account-events-row">
                                <span>{error}</span>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="account-events-row">
                                <span>No events found</span>
                            </div>
                        ) : (
                            events.map((event, index) => {
                                const isEnded = new Date(event.eventDate) < new Date()
                                const canDownload = Boolean(event.certificateFileName)
                                return (
                                    <React.Fragment key={event.eventId}>
                                        <div className="account-events-row">
                                            <span className="events-name">
                                                <button
                                                    className="events-arrow-btn"
                                                    type="button"
                                                    onClick={() => toggleExpanded(index)}
                                                    aria-expanded={expandedRows[index]}
                                                >
                                                    <span className="events-arrow">{expandedRows[index] ? '▼' : '▶'}</span>
                                                </button>
                                                {event.title}
                                            </span>
                                            <span className="events-date">{formatDate(event.eventDate)}<br />{formatTime(event.eventDate)}</span>
                                            <span className="events-location">{event.venue || '—'}</span>
                                            <span className="events-price">{formatPrice(event)}</span>
                                            <button className="events-status" type="button">{isEnded ? 'Bitdi' : 'Gözləmədə'}</button>
                                        </div>

                                        <div className={`account-events-row expanded ${expandedRows[index] ? 'is-open' : ''}`}>
                                            <div className="events-doc">
                                                <span className="events-doc-icon">
                                                    <img src="/assets/pdf.svg" alt="" />
                                                </span>
                                                <div>
                                                    <div className="events-doc-title">{event.title}</div>
                                                    <div className="events-doc-date">{formatDate(event.eventDate)}</div>
                                                </div>
                                            </div>
                                            <button
                                                className={`events-doc-action${canDownload ? '' : ' is-disabled'}`}
                                                type="button"
                                                onClick={() => handleDownload(event.certificateFileName)}
                                                disabled={!canDownload}
                                                aria-label="Download certificate"
                                            >
                                                <img src="/assets/download.svg" alt="" />
                                            </button>
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountEvents

