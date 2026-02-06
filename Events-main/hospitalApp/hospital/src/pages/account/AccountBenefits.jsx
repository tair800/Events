import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../context'
import { userService } from '../../services'
import { API_CONFIG } from '../../utils'
import { useTranslation } from '../../hooks/useTranslation'
import AccountProfileCard from './AccountProfileCard'
import './Account.css'

const AccountBenefits = () => {
    const { token } = useUserAuth()
    const { t } = useTranslation()
    const [profile, setProfile] = useState(null)
    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)

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
        const loadMaterials = async () => {
            if (!profile?.isMember) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await fetch(`${API_CONFIG.BASE_URL}/scientificmaterials`)
                if (response.ok) {
                    const data = await response.json()
                    setMaterials(Array.isArray(data) ? data : [])
                } else {
                    console.error('Failed to fetch materials')
                    setMaterials([])
                }
            } catch (error) {
                console.error('Error fetching materials:', error)
                setMaterials([])
            } finally {
                setLoading(false)
            }
        }

        if (profile) {
            loadMaterials()
        }
    }, [profile])

    const formatDate = (dateString) => {
        if (!dateString) return '—'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
    }

    if (!profile?.isMember) {
        return (
            <div className="account-page">
                <div className="account-content">
                    <AccountProfileCard 
                        profile={profile} 
                        onProfileUpdate={(updatedProfile) => {
                            // Profile update handled by parent if needed
                        }}
                    />
                    <div className="account-card account-benefits-card">
                        <div className="account-benefits-header">
                            <span className="account-card-page">Membership benefits</span>
                            <h1>Elmi material</h1>
                        </div>
                        <div className="account-benefits-membership-required">
                            <div className="membership-required-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2"/>
                                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" opacity="0.1"/>
                                </svg>
                            </div>
                            <h3 className="membership-required-title">{t('membershipRequiredMessage')}</h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="account-page">
            <div className="account-content">
                <AccountProfileCard profile={profile} />
                <div className="account-card account-benefits-card">
                    <div className="account-benefits-header">
                        <span className="account-card-page">Membership benefits</span>
                        <h1>Elmi material</h1>
                    </div>

                    {loading ? (
                        <div className="account-benefits-loading">{t('loadingMaterials')}</div>
                    ) : materials.length === 0 ? (
                        <div className="account-benefits-empty">
                            <p>{t('noScientificMaterials')}</p>
                        </div>
                    ) : (
                        <div className="account-benefits-table">
                            <div className="account-benefits-head">
                                <span>Elmi material adı</span>
                                <span>Video link</span>
                                <span>Date</span>
                            </div>

                            {materials.map((material) => (
                                <div key={material.id} className="account-benefits-row">
                                    <span>{material.name}</span>
                                    <span className="benefits-link">
                                        <img className="link-icon" src="/assets/linking.svg" alt="" />
                                        <a href={material.link} target="_blank" rel="noopener noreferrer">
                                            {material.link.length > 40 ? material.link.substring(0, 40) + '...' : material.link}
                                        </a>
                                    </span>
                                    <span>{formatDate(material.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AccountBenefits

