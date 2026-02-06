import React, { useEffect, useMemo, useState } from 'react'
import './AdminUsers.css'

function AdminUsers() {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://localhost:5000/api/users')
                if (!response.ok) {
                    throw new Error('Failed to fetch users')
                }
                const data = await response.json()
                setUsers(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Error fetching users:', err)
                setError(err.message || 'Failed to load users')
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return users
        return users.filter((user) => {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
            const haystack = [
                user.username,
                fullName,
                user.email,
                user.phone,
                user.position,
                user.finCode
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
            return haystack.includes(query)
        })
    }, [users, search])

    const formatName = (user) => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
        return fullName || user.username || '—'
    }

    return (
        <div className="admin-users-page">
            <div className="admin-users-container">
                <div className="admin-users-header">
                    <h1>Users</h1>
                    <div className="admin-users-header-actions">
                        <div className="admin-users-search-container">
                            <input
                                type="text"
                                className="admin-users-search-input"
                                placeholder="Search users..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-users-loading">Loading...</div>
                ) : error ? (
                    <div className="admin-users-error">{error}</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="admin-users-empty">No users found</div>
                ) : (
                    <div className="admin-users-table">
                        <div className="admin-users-row header">
                            <span>Name</span>
                            <span>Email</span>
                            <span>Phone</span>
                            <span>Position</span>
                            <span>FIN</span>
                            <span>Member</span>
                        </div>
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="admin-users-row">
                                <span>{formatName(user)}</span>
                                <span>{user.email || '—'}</span>
                                <span>{user.phone || '—'}</span>
                                <span>{user.position || '—'}</span>
                                <span>{user.finCode || '—'}</span>
                                <span className={user.isMember ? 'member-yes' : 'member-no'}>
                                    {user.isMember ? 'Yes' : 'No'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminUsers

