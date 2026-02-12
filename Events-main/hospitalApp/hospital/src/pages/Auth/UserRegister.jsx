import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services'
import { ROUTES } from '../../utils'
import { useTranslation } from '../../hooks/useTranslation'
import './Auth.css'

const UserRegister = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [position, setPosition] = useState('')
    const [finCode, setFinCode] = useState('')
    const [location, setLocation] = useState('')
    const [clinic, setClinic] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        const phoneRegex = /^\+?\d{9,15}$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const finCodeLength = 7

        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'))
            return
        }
        if (!emailRegex.test(email)) {
            setError(t('invalidEmailFormat'))
            return
        }
        if (!phoneRegex.test(phone)) {
            setError(t('invalidPhoneFormat'))
            return
        }
        if (finCode.trim().length !== finCodeLength) {
            setError(t('finMustBe7Chars'))
            return
        }
        if (!location.trim()) {
            setError(t('locationRequired'))
            return
        }

        setLoading(true)
        try {
            const resolvedUsername = email
            await authService.register({
                username: resolvedUsername,
                email,
                password,
                role: 'User',
                firstName,
                lastName,
                phone,
                position,
                finCode,
                location: location.trim(),
                clinic: clinic.trim() || null
            })
            setSuccess(t('accountCreated'))
            setTimeout(() => navigate(ROUTES.LOGIN), 1200)
        } catch (err) {
            setError(err.message || t('registrationFailed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page auth-page--register">
            <video className="auth-video" autoPlay muted loop playsInline>
                <source src="/assets/home-video.mp4" type="video/mp4" />
            </video>
            <div className="auth-overlay" />
            <div className="auth-card auth-card--register">
                <h1>{t('registerTitle')}</h1>
                {error && <div className="auth-message">{error}</div>}
                {success && <div className="auth-message success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="auth-grid">
                        <div className="auth-field">
                            <label htmlFor="register-first-name">{t('firstNameLabel')}</label>
                            <input
                                id="register-first-name"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder={t('firstNamePlaceholder')}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-last-name">{t('lastNameLabel')}</label>
                            <input
                                id="register-last-name"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder={t('lastNamePlaceholder')}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-email">{t('emailLabel')}</label>
                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('emailPlaceholder')}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-phone">{t('phoneLabel')}</label>
                            <input
                                id="register-phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder={t('phonePlaceholder')}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-position">{t('positionLabel')}</label>
                            <input
                                id="register-position"
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                placeholder={t('positionPlaceholder')}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-fin-code">{t('finCodeLabel')}</label>
                            <input
                                id="register-fin-code"
                                type="text"
                                value={finCode}
                                onChange={(e) => setFinCode(e.target.value)}
                                placeholder={t('finCodePlaceholder')}
                                maxLength={7}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-location">{t('locationLabel')}</label>
                            <input
                                id="register-location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={t('locationPlaceholder')}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-clinic">{t('clinicLabel')}</label>
                            <input
                                id="register-clinic"
                                type="text"
                                value={clinic}
                                onChange={(e) => setClinic(e.target.value)}
                                placeholder={t('clinicPlaceholder')}
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-password">{t('passwordLabel')}</label>
                            <input
                                id="register-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('passwordPlaceholder')}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-confirm">{t('passwordConfirmLabel')}</label>
                            <input
                                id="register-confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t('passwordConfirmPlaceholder')}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                    <div className="auth-actions auth-actions--register">
                        <button className="auth-primary auth-primary--register" type="submit" disabled={loading}>
                            {loading ? t('registering') : t('registerTitle')}
                        </button>
                        <Link className="auth-secondary auth-secondary--register" to={ROUTES.LOGIN}>
                            {t('haveAccount')} <span>{t('loginLink')}</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserRegister

