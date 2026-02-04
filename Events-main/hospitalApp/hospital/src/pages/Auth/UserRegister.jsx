import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services'
import { ROUTES } from '../../utils'
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
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        const phoneRegex = /^\+?\d{9,15}$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const finCodeLength = 7

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (!emailRegex.test(email)) {
            setError('Invalid email format')
            return
        }
        if (!phoneRegex.test(phone)) {
            setError('Invalid phone format. Example: +994501234567')
            return
        }
        if (finCode.trim().length !== finCodeLength) {
            setError('FIN must be 7 characters')
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
                finCode
            })
            setSuccess('Account created! Redirecting to login...')
            setTimeout(() => navigate(ROUTES.LOGIN), 1200)
        } catch (err) {
            setError(err.message || 'Registration failed')
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
                <h1>Qeydiyyatdan Keçin</h1>
                {error && <div className="auth-message">{error}</div>}
                {success && <div className="auth-message success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="auth-grid">
                        <div className="auth-field">
                            <label htmlFor="register-first-name">Ad</label>
                            <input
                                id="register-first-name"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Adınızı daxil edin"
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-last-name">Soyad</label>
                            <input
                                id="register-last-name"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Soyadınızı daxil edin"
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-email">Email</label>
                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-mailinizi daxil edin"
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-phone">Telefon</label>
                            <input
                                id="register-phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Telefon nömrənizi daxil edin"
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-position">Vəzifəsi</label>
                            <input
                                id="register-position"
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                placeholder="Vəzifənizi daxil edin"
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-fin-code">FIN kodu</label>
                            <input
                                id="register-fin-code"
                                type="text"
                                value={finCode}
                                onChange={(e) => setFinCode(e.target.value)}
                                placeholder="Şəxsiyyət vəsiqənizin FIN kodunu daxil edin"
                                maxLength={7}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-password">Şifrə</label>
                            <input
                                id="register-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifrənizi daxil edin"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="register-confirm">Şifrəni təsdiqləyin</label>
                            <input
                                id="register-confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Şifrənizi daxil edin"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                    <div className="auth-actions auth-actions--register">
                        <button className="auth-primary auth-primary--register" type="submit" disabled={loading}>
                            {loading ? 'Qeydiyyat...' : 'Qeydiyyatdan Keçin'}
                        </button>
                        <Link className="auth-secondary auth-secondary--register" to={ROUTES.LOGIN}>
                            Hesabınız var? <span>Daxil olun</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserRegister

