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
        email: '',
        phone: '',
        finCode: '',
        vezife: ''
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

        if (!formData.email.trim()) {
            newErrors.email = t('emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('invalidEmail');
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t('phoneRequired');
        }

        if (!formData.finCode.trim()) {
            newErrors.finCode = t('finCodeRequired');
        }

        if (!formData.vezife.trim()) {
            newErrors.vezife = t('positionRequired');
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
            await requestService.createRequest(formData);

            // Reset form
            setFormData({
                name: '',
                surname: '',
                email: '',
                phone: '',
                finCode: '',
                vezife: ''
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
                email: '',
                phone: '',
                finCode: '',
                vezife: ''
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
                            <label htmlFor="phone">{t('phone')} *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={`request-form-input ${errors.phone ? 'error' : ''}`}
                                value={formData.phone}
                                onChange={handleInputChange}
                                maxLength={20}
                                required
                                placeholder={t('enterPhone')}
                                disabled={isSubmitting}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="finCode">{t('finCode')} *</label>
                            <input
                                type="text"
                                id="finCode"
                                name="finCode"
                                className={`request-form-input ${errors.finCode ? 'error' : ''}`}
                                value={formData.finCode}
                                onChange={handleInputChange}
                                maxLength={20}
                                required
                                placeholder={t('enterFinCode')}
                                disabled={isSubmitting}
                            />
                            {errors.finCode && <span className="error-message">{errors.finCode}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="vezife">{t('position')} *</label>
                            <input
                                type="text"
                                id="vezife"
                                name="vezife"
                                className={`request-form-input ${errors.vezife ? 'error' : ''}`}
                                value={formData.vezife}
                                onChange={handleInputChange}
                                maxLength={200}
                                required
                                placeholder={t('enterPosition')}
                                disabled={isSubmitting}
                            />
                            {errors.vezife && <span className="error-message">{errors.vezife}</span>}
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
