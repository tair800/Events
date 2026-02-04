import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../context'
import { userService } from '../../services'
import AccountProfileCard from './AccountProfileCard'
import './Account.css'

const AccountBenefits = () => {
    const { token } = useUserAuth()
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

    return (
        <div className="account-page">
            <div className="account-content">
                <AccountProfileCard profile={profile} />
                <div className="account-card account-benefits-card">
                    <div className="account-benefits-header">
                        <span className="account-card-page">Membership benefits</span>
                        <h1>Elmi material</h1>
                    </div>

                    <div className="account-benefits-table">
                        <div className="account-benefits-head">
                            <span>Elmi material adı</span>
                            <span>Video link</span>
                            <span>Date</span>
                        </div>

                        <div className="account-benefits-row">
                            <span>HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                            <span className="benefits-link">
                                <img className="link-icon" src="/assets/linking.svg" alt="" />
                                https://www.youtube.com/watch?
                            </span>
                            <span>12.01.2026</span>
                        </div>
                        <div className="account-benefits-row">
                            <span>HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                            <span className="benefits-link">
                                <img className="link-icon" src="/assets/linking.svg" alt="" />
                                https://www.youtube.com/watch?
                            </span>
                            <span>12.01.2026</span>
                        </div>
                        <div className="account-benefits-row">
                            <span>HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                            <span className="benefits-link">
                                <img className="link-icon" src="/assets/linking.svg" alt="" />
                                https://www.youtube.com/watch?
                            </span>
                            <span>12.01.2026</span>
                        </div>
                        <div className="account-benefits-row">
                            <span>HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                            <span className="benefits-link">
                                <img className="link-icon" src="/assets/linking.svg" alt="" />
                                https://www.youtube.com/watch?
                            </span>
                            <span>12.01.2026</span>
                        </div>
                        <div className="account-benefits-row">
                            <span>HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                            <span className="benefits-link">
                                <img className="link-icon" src="/assets/linking.svg" alt="" />
                                https://www.youtube.com/watch?
                            </span>
                            <span>12.01.2026</span>
                        </div>
                        <div className="account-benefits-row">
                            <span>HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                            <span className="benefits-link">
                                <img className="link-icon" src="/assets/linking.svg" alt="" />
                                https://www.youtube.com/watch?
                            </span>
                            <span>12.01.2026</span>
                        </div>
                        <div className="account-benefits-row">
                            <span>HPB Carrahiyyə Hallarının Klinik Təhlili</span>
                            <span className="benefits-link">
                                <img className="link-icon" src="/assets/linking.svg" alt="" />
                                https://www.youtube.com/watch?
                            </span>
                            <span>12.01.2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountBenefits

