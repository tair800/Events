import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services'
import { ROUTES } from '../../utils'
import './Auth.css'

const UserRegister = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            await authService.register({ username, email, password, role: 'User' })
            setSuccess('Account created! Redirecting to login...')
            setTimeout(() => navigate(ROUTES.LOGIN), 1200)
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                {error && <div className="auth-message">{error}</div>}
                {success && <div className="auth-message success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="register-username">Username</label>
                        <input
                            id="register-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="register-confirm">Confirm Password</label>
                        <input
                            id="register-confirm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="auth-actions">
                        <button className="auth-primary" type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Register'}
                        </button>
                        <Link className="auth-secondary" to={ROUTES.LOGIN}>
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserRegister

