import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { requestService } from '../../services/requestService';
import { useTranslation } from '../../hooks/useTranslation';
import './RequestModal.css';

const RequestModal = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        gender: '',
        role: '',
        specialty: '',
        specialtyOther: '',
        sector: '',
        institution: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t('firstNameRequired');
        }

        if (!formData.surname.trim()) {
            newErrors.surname = t('lastNameRequired');
        }

        if (!formData.gender.trim()) {
            newErrors.gender = t('genderRequired');
        }

        if (!formData.role.trim()) {
            newErrors.role = t('roleRequired');
        }

        if (!formData.specialty.trim()) {
            newErrors.specialty = t('specialtyRequired');
        }

        if (formData.specialty === 'digər' && !formData.specialtyOther.trim()) {
            newErrors.specialtyOther = t('specialtyOtherRequired');
        }

        if (!formData.sector.trim()) {
            newErrors.sector = t('sectorRequired');
        }

        if (!formData.institution.trim()) {
            newErrors.institution = t('institutionRequired');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('invalidEmail');
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t('phoneRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data to send - only include specialtyOther if specialty is 'digər'
            const dataToSend = {
                ...formData,
                specialtyOther: formData.specialty === 'digər' ? formData.specialtyOther : ''
            };

            await requestService.createRequest(dataToSend);

            // Reset form
            setFormData({
                name: '',
                surname: '',
                gender: '',
                role: '',
                specialty: '',
                specialtyOther: '',
                sector: '',
                institution: '',
                email: '',
                phone: ''
            });

            // Close modal and notify parent
            onClose();
            if (onSuccess) {
                onSuccess();
            }

            // Show success message with SweetAlert
            Swal.fire({
                icon: 'success',
                title: t('requestSentSuccess'),
                text: t('requestRecorded'),
                confirmButtonColor: '#1B1B3F',
                confirmButtonText: t('ok')
            });

        } catch (error) {
            console.error('Error submitting request:', error);
            Swal.fire({
                icon: 'error',
                title: t('requestError'),
                text: t('requestNotSent'),
                confirmButtonColor: '#ef4444',
                confirmButtonText: t('ok')
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                name: '',
                surname: '',
                gender: '',
                role: '',
                specialty: '',
                specialtyOther: '',
                sector: '',
                institution: '',
                email: '',
                phone: ''
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="request-modal-overlay" onClick={handleClose}>
            <div className="request-modal" onClick={(e) => e.stopPropagation()}>
                <div className="request-modal-header">
                    <h2>{t('sendRequest')}</h2>
                    <button
                        className="request-modal-close"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                <form className="request-modal-form" onSubmit={handleSubmit}>
                    <div className="request-modal-fields">
                        <div className="request-form-group">
                            <label htmlFor="name">{t('firstName')} *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`request-form-input ${errors.name ? 'error' : ''}`}
                                value={formData.name}
                                onChange={handleInputChange}
                                maxLength={100}
                                required
                                placeholder={t('enterFirstName')}
                                disabled={isSubmitting}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="surname">{t('lastName')} *</label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                className={`request-form-input ${errors.surname ? 'error' : ''}`}
                                value={formData.surname}
                                onChange={handleInputChange}
                                maxLength={100}
                                required
                                placeholder={t('enterLastName')}
                                disabled={isSubmitting}
                            />
                            {errors.surname && <span className="error-message">{errors.surname}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="email">{t('email')} *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`request-form-input ${errors.email ? 'error' : ''}`}
                                value={formData.email}
                                onChange={handleInputChange}
                                maxLength={255}
                                required
                                placeholder={t('enterEmail')}
                                disabled={isSubmitting}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="request-form-group">
                            <label>{t('gender')} *</label>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Kişi"
                                        checked={formData.gender === 'Kişi'}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                    <span>{t('male')}</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Qadın"
                                        checked={formData.gender === 'Qadın'}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                    <span>{t('female')}</span>
                                </label>
                            </div>
                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="role">{t('role')} *</label>
                            <select
                                id="role"
                                name="role"
                                className={`request-form-input ${errors.role ? 'error' : ''}`}
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">{t('selectRole')}</option>
                                <option value="həkim-mütəxəssis">{t('roleDoctorSpecialist')}</option>
                                <option value="həkim">{t('roleDoctor')}</option>
                                <option value="rezident">{t('roleResident')}</option>
                                <option value="tələbə">{t('roleStudent')}</option>
                                <option value="tibb bacısı">{t('roleNurse')}</option>
                            </select>
                            {errors.role && <span className="error-message">{errors.role}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="specialty">{t('specialty')} *</label>
                            <select
                                id="specialty"
                                name="specialty"
                                className={`request-form-input ${errors.specialty ? 'error' : ''}`}
                                value={formData.specialty}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">{t('selectSpecialty')}</option>
                                <option value="ümumi cərrah">{t('specialtyGeneralSurgeon')}</option>
                                <option value="gastroenteroloq">{t('specialtyGastroenterologist')}</option>
                                <option value="radioloq">{t('specialtyRadiologist')}</option>
                                <option value="onkoloq">{t('specialtyOncologist')}</option>
                                <option value="patoloq">{t('specialtyPathologist')}</option>
                                <option value="digər">{t('specialtyOtherText')}</option>
                            </select>
                            {errors.specialty && <span className="error-message">{errors.specialty}</span>}
                            {formData.specialty === 'digər' && (
                                <>
                                    <input
                                        type="text"
                                        name="specialtyOther"
                                        className={`request-form-input ${errors.specialtyOther ? 'error' : ''}`}
                                        value={formData.specialtyOther}
                                        onChange={handleInputChange}
                                        placeholder={t('enterSpecialtyOther')}
                                        disabled={isSubmitting}
                                        style={{ marginTop: '8px' }}
                                    />
                                    {errors.specialtyOther && <span className="error-message">{errors.specialtyOther}</span>}
                                </>
                            )}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="sector">{t('sector')} *</label>
                            <select
                                id="sector"
                                name="sector"
                                className={`request-form-input ${errors.sector ? 'error' : ''}`}
                                value={formData.sector}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">{t('selectSector')}</option>
                                <option value="dövlət">{t('sectorState')}</option>
                                <option value="özəl">{t('sectorPrivate')}</option>
                            </select>
                            {errors.sector && <span className="error-message">{errors.sector}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="institution">{t('institution')} *</label>
                            <input
                                type="text"
                                id="institution"
                                name="institution"
                                className={`request-form-input ${errors.institution ? 'error' : ''}`}
                                value={formData.institution}
                                onChange={handleInputChange}
                                required
                                placeholder={t('enterInstitution')}
                                disabled={isSubmitting}
                            />
                            {errors.institution && <span className="error-message">{errors.institution}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="phone">{t('phone')} *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={`request-form-input ${errors.phone ? 'error' : ''}`}
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder={t('enterPhone')}
                                disabled={isSubmitting}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>
                    </div>

                    <div className="request-modal-actions">
                        <button
                            type="button"
                            className="request-modal-cancel"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="request-modal-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('sending') : t('sendRequest')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;
