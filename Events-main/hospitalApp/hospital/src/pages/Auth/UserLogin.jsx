import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services'
import { useUserAuth } from '../../context'
import { ROUTES } from '../../utils'
import './Auth.css'

const UserLogin = () => {
    const [username, setUsername] = useState('')
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
            const response = await authService.login({ username, password })
            login({ token: response.token, username, role: 'User' })
            navigate(ROUTES.HOME)
        } catch (err) {
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>User Login</h1>
                {error && <div className="auth-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-actions">
                        <button className="auth-primary" type="submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                        <Link className="auth-secondary" to={ROUTES.REGISTER}>
                            Create an account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserLogin

