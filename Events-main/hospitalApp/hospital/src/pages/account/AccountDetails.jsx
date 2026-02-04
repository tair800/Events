import React, { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { useUserAuth } from '../../context'
import { userService } from '../../services'
import AccountProfileCard from './AccountProfileCard'
import './Account.css'

const decodeTokenPayload = (token) => {
    if (!token) return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    try {
        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=')
        const json = atob(padded)
        return JSON.parse(json)
    } catch (error) {
        return null
    }
}

const AccountDetails = () => {
    const { token } = useUserAuth()
    const tokenPayload = useMemo(() => decodeTokenPayload(token), [token])
    const [profile, setProfile] = useState(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        finCode: ''
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await userService.getProfile()
                setProfile(data)
                localStorage.setItem('userProfileCache', JSON.stringify(data))
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || tokenPayload?.email || '',
                    phone: data.phone || '',
                    position: data.position || '',
                    finCode: data.finCode || ''
                })
            } catch (error) {
                console.error('Failed to load profile:', error)
                setFormData((prev) => ({
                    ...prev,
                    email: tokenPayload?.email || prev.email
                }))
            }
        }
        if (token) {
            loadProfile()
        }
    }, [token, tokenPayload?.email])

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    }

    const handlePasswordChange = (field) => (event) => {
        setPasswordData((prev) => ({ ...prev, [field]: event.target.value }))
    }

    const validateProfile = () => {
        const nextErrors = {}
        const phoneRegex = /^\+?\d{9,15}$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const finCodeLength = 7

        if (!formData.email || !emailRegex.test(formData.email)) {
            nextErrors.email = 'Email formatı düzgün deyil.'
        }

        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            nextErrors.phone = 'Telefon formatı düzgün deyil. Nümunə: +994501234567'
        }

        if (!formData.finCode || formData.finCode.trim().length !== finCodeLength) {
            nextErrors.finCode = 'FIN kodu 7 simvol olmalıdır.'
        }

        return nextErrors
    }

    const validatePassword = () => {
        const nextErrors = {}
        const hasAny = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword
        if (!hasAny) {
            return nextErrors
        }

        if (!passwordData.currentPassword) {
            nextErrors.currentPassword = 'Cari şifrəni daxil edin.'
        }

        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            nextErrors.newPassword = 'Yeni şifrə ən azı 6 simvol olmalıdır.'
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            nextErrors.confirmPassword = 'Şifrələr uyğun deyil.'
        }

        return nextErrors
    }

    const handleSave = async () => {
        try {
            const profileErrors = validateProfile()
            const passwordErrors = validatePassword()
            const nextErrors = { ...profileErrors, ...passwordErrors }
            setErrors(nextErrors)
            if (Object.keys(nextErrors).length > 0) {
                return
            }

            setSaving(true)
            const updated = await userService.updateProfile({
                firstName: formData.firstName?.trim(),
                lastName: formData.lastName?.trim(),
                phone: formData.phone?.trim(),
                position: formData.position?.trim(),
                finCode: formData.finCode?.trim()
            })
            setProfile(updated)
            localStorage.setItem('userProfileCache', JSON.stringify({
                ...profile,
                ...updated
            }))
            window.dispatchEvent(new Event('profile-updated'))

            const hasPasswordUpdate = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword
            if (hasPasswordUpdate) {
                await userService.updatePassword({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
                Swal.fire({
                    title: 'Uğurlu',
                    text: 'Profil və şifrə yeniləndi.',
                    icon: 'success',
                    heightAuto: false,
                    returnFocus: false
                })
            } else {
                Swal.fire({
                    title: 'Uğurlu',
                    text: 'Profil yeniləndi.',
                    icon: 'success',
                    heightAuto: false,
                    returnFocus: false
                })
            }
        } catch (error) {
            console.error('Failed to update profile:', error)
            Swal.fire({
                title: 'Xəta',
                text: error.message || 'Məlumatlar yenilənmədi.',
                icon: 'error',
                heightAuto: false,
                returnFocus: false
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="account-page">
            <div className="account-content">
                <AccountProfileCard profile={profile} />
                <div className="account-card account-details-card">
                    <div className="account-details-header">
                        <span className="account-card-page">Hesab məlumatları</span>
                        <h1>Profil məlumatları</h1>
                        <button className="account-save-btn" type="button" onClick={handleSave} disabled={saving}>
                            {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
                        </button>
                    </div>

                    <div className="account-details-grid">
                        <div className="account-field">
                            <label>Ad</label>
                            <input type="text" placeholder="Adınızı daxil edin" value={formData.firstName} onChange={handleChange('firstName')} />
                        </div>
                        <div className="account-field">
                            <label>Soyad</label>
                            <input type="text" placeholder="Soyadınızı daxil edin" value={formData.lastName} onChange={handleChange('lastName')} />
                        </div>
                        <div className="account-field">
                            <label>Email</label>
                            <input type="email" placeholder="E-mailinizi daxil edin" value={formData.email} disabled />
                            {errors.email && <span className="account-field-error">{errors.email}</span>}
                        </div>
                        <div className="account-field">
                            <label>Telefon</label>
                            <input type="text" placeholder="Telefon nömrənizi daxil edin" value={formData.phone} onChange={handleChange('phone')} />
                            {errors.phone && <span className="account-field-error">{errors.phone}</span>}
                        </div>
                        <div className="account-field">
                            <label>Vəzifəsi</label>
                            <input type="text" placeholder="Vəzifənizi daxil edin" value={formData.position} onChange={handleChange('position')} />
                        </div>
                        <div className="account-field">
                            <label>FIN kodu</label>
                            <input type="text" placeholder="Şəxsiyyət vəsiqənizin FIN kodunu daxil edin" value={formData.finCode} onChange={handleChange('finCode')} maxLength={7} />
                            {errors.finCode && <span className="account-field-error">{errors.finCode}</span>}
                        </div>
                    </div>

                    <div className="account-details-subtitle">Şifrəni yenilə</div>
                    <div className="account-details-grid account-details-grid--password">
                        <div className="account-field">
                            <label>Cari şifrə</label>
                            <input type="password" placeholder="********" value={passwordData.currentPassword} onChange={handlePasswordChange('currentPassword')} />
                            {errors.currentPassword && <span className="account-field-error">{errors.currentPassword}</span>}
                        </div>
                        <div className="account-field">
                            <label>Yeni şifrə</label>
                            <input type="password" placeholder="********" value={passwordData.newPassword} onChange={handlePasswordChange('newPassword')} />
                            {errors.newPassword && <span className="account-field-error">{errors.newPassword}</span>}
                        </div>
                        <div className="account-field">
                            <label>Yeni şifrəni təsdiqləyin</label>
                            <input type="password" placeholder="********" value={passwordData.confirmPassword} onChange={handlePasswordChange('confirmPassword')} />
                            {errors.confirmPassword && <span className="account-field-error">{errors.confirmPassword}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountDetails

