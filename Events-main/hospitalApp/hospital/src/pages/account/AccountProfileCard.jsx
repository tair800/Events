import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../utils'
import './Account.css'

const AccountProfileCard = ({ profile }) => {
    const cachedProfile = useMemo(() => {
        try {
            const raw = localStorage.getItem('userProfileCache')
            return raw ? JSON.parse(raw) : null
        } catch (error) {
            return null
        }
    }, [])
    const displayProfile = profile || cachedProfile
    const navigate = useNavigate()
    const fullName = [displayProfile?.firstName, displayProfile?.lastName].filter(Boolean).join(' ')
    const displayName = fullName || displayProfile?.username || 'Raul Mirzayev'
    const displayRole = displayProfile?.position || 'Position'

    return (
        <div className="account-profile-card">
            <div className="profile-avatar">
                <img src="/assets/employee1.png" alt="Profile" />
            </div>
            <h2 className="profile-name">{displayName}</h2>
            <span className="profile-role">{displayRole}</span>
            <button
                className="profile-edit-btn"
                type="button"
                onClick={() => navigate(ROUTES.ACCOUNT_DETAILS)}
            >
                Profilə düzəliş et
            </button>
            <div className="profile-contacts">
                <div className="profile-contact-item">
                    <img src="/assets/account-phone.svg" alt="" />
                    <span>{displayProfile?.phone || '+(994) 50 xxx xx xx'}</span>
                </div>
                <div className="profile-contact-item">
                    <img src="/assets/account-wp.svg" alt="" />
                    <span>{displayProfile?.phone || '+(994) 50 xxx xx xx'}</span>
                </div>
                <div className="profile-contact-item">
                    <img src="/assets/account-mail.svg" alt="" />
                    <span>{displayProfile?.email || 'examplegmail.com'}</span>
                </div>
                <div className="profile-contact-item">
                    <img src="/assets/account-location.svg" alt="" />
                    <span>Bakı, Azərbaycan</span>
                </div>
            </div>
        </div>
    )
}

export default AccountProfileCard

