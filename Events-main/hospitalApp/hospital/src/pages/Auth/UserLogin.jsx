import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services'
import { useUserAuth } from '../../context'
import { ROUTES } from '../../utils'
import './Auth.css'

const UserLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useUserAuth()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await authService.login({ username: email, password })
            login({ token: response.token, username: email, role: 'User' })
            navigate(ROUTES.HOME)
        } catch (err) {
            setError(err.message || 'Login failed')
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
                <h1>Daxil olun</h1>
                {error && <div className="auth-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mailinizi daxil edin"
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="login-password">Şifrə</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Şifrənizi daxil edin"
                            required
                        />
                    </div>
                    <div className="auth-login-row">
                        <span className="auth-login-forgot">Şifrənizi unutmusunuz?</span>
                    </div>
                    <div className="auth-actions auth-actions--login">
                        <button className="auth-primary auth-primary--login" type="submit" disabled={loading}>
                            {loading ? 'Daxil olunur...' : 'Daxil ol'}
                        </button>
                        <Link className="auth-secondary auth-secondary--login" to={ROUTES.REGISTER}>
                            Hesabınız yoxdur? <span>Qeydiyyatdan keçin</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserLogin

