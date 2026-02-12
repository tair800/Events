import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authService } from '../../services'
import { ROUTES } from '../../utils'
import { useTranslation } from '../../hooks/useTranslation'
import './Auth.css'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setError(t('invalidResetToken'))
        }
    }, [token, t])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'))
            return
        }

        if (password.length < 6) {
            setError(t('passwordMinLength'))
            return
        }

        if (!token) {
            setError(t('invalidResetToken'))
            return
        }

        setLoading(true)
        try {
            await authService.resetPassword({ token, password })
            setSuccess(t('passwordResetSuccess'))
            setTimeout(() => navigate(ROUTES.LOGIN), 2000)
        } catch (err) {
            setError(err.message || t('resetPasswordFailed'))
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
                <h1>{t('resetPasswordTitle')}</h1>
                {error && <div className="auth-message">{error}</div>}
                {success && <div className="auth-message success">{success}</div>}
                {token ? (
                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="reset-password">{t('newPasswordLabel')}</label>
                            <input
                                id="reset-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('newPasswordPlaceholder')}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="reset-confirm">{t('confirmPasswordLabel')}</label>
                            <input
                                id="reset-confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t('confirmPasswordPlaceholder')}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="auth-actions auth-actions--login">
                            <button className="auth-primary auth-primary--login" type="submit" disabled={loading}>
                                {loading ? t('resetting') : t('resetPasswordButton')}
                            </button>
                            <Link className="auth-secondary auth-secondary--login" to={ROUTES.LOGIN}>
                                {t('backToLogin')} <span>{t('loginLink')}</span>
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="auth-actions auth-actions--login">
                        <Link className="auth-secondary auth-secondary--login" to={ROUTES.LOGIN}>
                            {t('backToLogin')} <span>{t('loginLink')}</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResetPassword

