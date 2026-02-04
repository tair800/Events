import React, { useEffect, useState } from 'react'
import { userService } from '../../services'
import { useTranslation } from '../../hooks/useTranslation'
import './Members.css'

const Members = () => {
    const { t } = useTranslation()
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await userService.getUsers()
                setMembers(data || [])
            } catch (err) {
                console.error('Failed to load members:', err)
                setError(err.message || 'Failed to load members')
            } finally {
                setLoading(false)
            }
        }

        fetchMembers()
    }, [])

    return (
        <div className="members-page">
            <div className="members-card">
                <div className="members-header">
                    <span>{t('membersListTitle')}</span>
                    <span>{t('membersPosition')}</span>
                    <span>{t('membersClinic')}</span>
                </div>

                {loading && <div className="members-row muted">{t('loading')}</div>}
                {error && !loading && <div className="members-row muted">{error}</div>}

                {!loading && !error && members.length === 0 && (
                    <div className="members-row muted">{t('membersEmpty')}</div>
                )}

                {!loading && !error && members.map(member => {
                    const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ')
                    return (
                        <div className="members-row" key={member.id}>
                            <span>{fullName || member.username}</span>
                            <span>{member.position || '—'}</span>
                            <span>{t('membersDefaultClinic')}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Members

