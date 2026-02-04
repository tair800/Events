import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../context'
import { userService } from '../../services'
import AccountProfileCard from './AccountProfileCard'
import './Account.css'

const AccountEvents = () => {
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

    const [expandedRows, setExpandedRows] = useState([true, true, true, true, true])

    const toggleExpanded = (index) => {
        setExpandedRows((prev) => prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)))
    }

    return (
        <div className="account-page">
            <div className="account-content">
                <AccountProfileCard profile={profile} />
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

                        <div className="account-events-row">
                            <span className="events-name">
                                <button
                                    className="events-arrow-btn"
                                    type="button"
                                    onClick={() => toggleExpanded(0)}
                                    aria-expanded={expandedRows[0]}
                                >
                                    <span className="events-arrow">{expandedRows[0] ? '▼' : '▶'}</span>
                                </button>
                                HPB Carrahiyyə Hallarının Klinik Təhlili
                            </span>
                            <span className="events-date">Jan 25, 2026<br />17:00</span>
                            <span className="events-location">Baku Cristal hall</span>
                            <span className="events-price">20 ₼</span>
                            <button className="events-status" type="button">Gözləmədə</button>
                        </div>

                        <div className={`account-events-row expanded ${expandedRows[0] ? 'is-open' : ''}`}>
                            <div className="events-doc">
                                <span className="events-doc-icon">
                                    <img src="/assets/Download.svg" alt="" />
                                </span>
                                <div>
                                    <div className="events-doc-title">HPB Carrahiyyə Hallarının Klinik Təhlili</div>
                                    <div className="events-doc-date">12 Jan 2026</div>
                                </div>
                            </div>
                            <div className="events-doc-action">
                                <img src="/assets/download.svg" alt="" />
                            </div>
                        </div>

                        <div className="account-events-row">
                            <span className="events-name">
                                <button
                                    className="events-arrow-btn"
                                    type="button"
                                    onClick={() => toggleExpanded(1)}
                                    aria-expanded={expandedRows[1]}
                                >
                                    <span className="events-arrow">{expandedRows[1] ? '▼' : '▶'}</span>
                                </button>
                                HPB Carrahiyyə Hallarının Klinik Təhlili
                            </span>
                            <span className="events-date">Jan 25, 2026<br />17:00</span>
                            <span className="events-location">Baku Cristal hall</span>
                            <span className="events-price">20 ₼</span>
                            <button className="events-status" type="button">Gözləmədə</button>
                        </div>

                        <div className={`account-events-row expanded ${expandedRows[1] ? 'is-open' : ''}`}>
                            <div className="events-doc">
                                <span className="events-doc-icon">
                                    <img src="/assets/Download.svg" alt="" />
                                </span>
                                <div>
                                    <div className="events-doc-title">HPB Carrahiyyə Hallarının Klinik Təhlili</div>
                                    <div className="events-doc-date">12 Jan 2026</div>
                                </div>
                            </div>
                            <div className="events-doc-action">
                                <img src="/assets/download.svg" alt="" />
                            </div>
                        </div>

                        <div className="account-events-row">
                            <span className="events-name">
                                <button
                                    className="events-arrow-btn"
                                    type="button"
                                    onClick={() => toggleExpanded(2)}
                                    aria-expanded={expandedRows[2]}
                                >
                                    <span className="events-arrow">{expandedRows[2] ? '▼' : '▶'}</span>
                                </button>
                                HPB Carrahiyyə Hallarının Klinik Təhlili
                            </span>
                            <span className="events-date">Jan 05, 2026<br />17:00</span>
                            <span className="events-location">Baku Cristal hall</span>
                            <span className="events-price">20 ₼</span>
                            <button className="events-status">Bitdi</button>
                        </div>

                        <div className={`account-events-row expanded ${expandedRows[2] ? 'is-open' : ''}`}>
                            <div className="events-doc">
                                <span className="events-doc-icon">
                                    <img src="/assets/Download.svg" alt="" />
                                </span>
                                <div>
                                    <div className="events-doc-title">HPB Carrahiyyə Hallarının Klinik Təhlili</div>
                                    <div className="events-doc-date">12 Jan 2026</div>
                                </div>
                            </div>
                            <div className="events-doc-action">
                                <img src="/assets/download.svg" alt="" />
                            </div>
                        </div>

                        <div className="account-events-row">
                            <span className="events-name">
                                <button
                                    className="events-arrow-btn"
                                    type="button"
                                    onClick={() => toggleExpanded(3)}
                                    aria-expanded={expandedRows[3]}
                                >
                                    <span className="events-arrow">{expandedRows[3] ? '▼' : '▶'}</span>
                                </button>
                                HPB Carrahiyyə Hallarının Klinik Təhlili
                            </span>
                            <span className="events-date">Jan 25, 2026<br />17:00</span>
                            <span className="events-location">Baku Cristal hall</span>
                            <span className="events-price">20 ₼</span>
                            <button className="events-status">Bitdi</button>
                        </div>

                        <div className={`account-events-row expanded ${expandedRows[3] ? 'is-open' : ''}`}>
                            <div className="events-doc">
                                <span className="events-doc-icon">
                                    <img src="/assets/Download.svg" alt="" />
                                </span>
                                <div>
                                    <div className="events-doc-title">HPB Carrahiyyə Hallarının Klinik Təhlili</div>
                                    <div className="events-doc-date">12 Jan 2026</div>
                                </div>
                            </div>
                            <div className="events-doc-action">
                                <img src="/assets/download.svg" alt="" />
                            </div>
                        </div>

                        <div className="account-events-row">
                            <span className="events-name">
                                <button
                                    className="events-arrow-btn"
                                    type="button"
                                    onClick={() => toggleExpanded(4)}
                                    aria-expanded={expandedRows[4]}
                                >
                                    <span className="events-arrow">{expandedRows[4] ? '▼' : '▶'}</span>
                                </button>
                                HPB Carrahiyyə Hallarının Klinik Təhlili
                            </span>
                            <span className="events-date">Jan 25, 2026<br />17:00</span>
                            <span className="events-location">Baku Cristal hall</span>
                            <span className="events-price">20 ₼</span>
                            <button className="events-status">Bitdi</button>
                        </div>

                        <div className={`account-events-row expanded ${expandedRows[4] ? 'is-open' : ''}`}>
                            <div className="events-doc">
                                <span className="events-doc-icon">
                                    <img src="/assets/Download.svg" alt="" />
                                </span>
                                <div>
                                    <div className="events-doc-title">HPB Carrahiyyə Hallarının Klinik Təhlili</div>
                                    <div className="events-doc-date">12 Jan 2026</div>
                                </div>
                            </div>
                            <div className="events-doc-action">
                                <img src="/assets/download.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountEvents

