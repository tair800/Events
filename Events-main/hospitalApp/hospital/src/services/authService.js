import { API_CONFIG } from '../utils'

const authRequest = async (endpoint, payload) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await response.json() : null

    if (!response.ok) {
        throw new Error(data?.message || 'Request failed')
    }

    return data
}

export const authService = {
    login: (payload) => authRequest('/login', payload),
    register: (payload) => authRequest('/register', payload),
    forgotPassword: (payload) => authRequest('/forgot-password', payload),
    resetPassword: (payload) => authRequest('/reset-password', payload),
}

