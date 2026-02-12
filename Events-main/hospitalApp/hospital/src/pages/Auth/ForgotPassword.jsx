import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services'
import { ROUTES } from '../../utils'
import { useTranslation } from '../../hooks/useTranslation'
import './Auth.css'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            await authService.forgotPassword({ email })
            setSuccess(t('resetLinkSent'))
        } catch (err) {
            setError(err.message || t('failedToSendLink'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page auth-page--login">
            <video className="auth-video" autoPlay muted loop playsInline>
                <source src="/assets/home-video.mp4" type="video/mp4" />
            </video>
            <div className="auth-overlay" />
            <div className="auth-card auth-card--login">
                <h1>{t('forgotPasswordTitle')}</h1>
                {error && <div className="auth-message">{error}</div>}
                {success && <div className="auth-message success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="forgot-email">{t('emailLabel')}</label>
                        <input
                            id="forgot-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('emailPlaceholder')}
                            required
                        />
                    </div>
                    <div className="auth-actions auth-actions--login">
                        <button className="auth-primary auth-primary--login" type="submit" disabled={loading}>
                            {loading ? t('sending') : t('sendResetLink')}
                        </button>
                        <Link className="auth-secondary auth-secondary--login" to={ROUTES.LOGIN}>
                            {t('backToLogin')} <span>{t('loginLink')}</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword

