import { API_CONFIG, STORAGE_KEYS } from '../utils'

const withAuthHeaders = () => {
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN)
    return token ? { Authorization: `Bearer ${token}` } : {}
}

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await response.json() : null
    if (!response.ok) {
        throw new Error(data?.message || 'Request failed')
    }
    return data
}

export const userService = {
    getProfile: async () => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/users/me`, {
            headers: {
                ...withAuthHeaders()
            }
        })
        return handleResponse(response)
    },
    updateProfile: async (payload) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...withAuthHeaders()
            },
            body: JSON.stringify(payload)
        })
        return handleResponse(response)
    },
    updatePassword: async (payload) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/users/me/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...withAuthHeaders()
            },
            body: JSON.stringify(payload)
        })
        return handleResponse(response)
    }
}

