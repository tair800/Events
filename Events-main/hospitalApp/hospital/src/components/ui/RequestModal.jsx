import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { requestService } from '../../services/requestService';
import './RequestModal.css';

const RequestModal = ({ isOpen, onClose, onSuccess }) => {
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
            newErrors.name = 'Ad tələb olunur';
        }

        if (!formData.surname.trim()) {
            newErrors.surname = 'Soyad tələb olunur';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email tələb olunur';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Zəhmət olmasa düzgün email ünvanı daxil edin';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefon nömrəsi tələb olunur';
        }

        if (!formData.finCode.trim()) {
            newErrors.finCode = 'FİN kod tələb olunur';
        }

        if (!formData.vezife.trim()) {
            newErrors.vezife = 'Vəzifə tələb olunur';
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
                title: 'Müraciət uğurla göndərildi!',
                text: 'Müraciətiniz qeydə alındı. Tezliklə sizinlə əlaqə saxlayacağıq.',
                confirmButtonColor: '#1B1B3F',
                confirmButtonText: 'Tamam'
            });

        } catch (error) {
            console.error('Error submitting request:', error);
            Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: 'Müraciət göndərilmədi. Zəhmət olmasa yenidən cəhd edin.',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'Tamam'
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
                    <h2>Müraciət Göndər</h2>
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
                            <label htmlFor="name">Ad *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`request-form-input ${errors.name ? 'error' : ''}`}
                                value={formData.name}
                                onChange={handleInputChange}
                                maxLength={100}
                                required
                                placeholder="Adınızı daxil edin"
                                disabled={isSubmitting}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="surname">Soyad *</label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                className={`request-form-input ${errors.surname ? 'error' : ''}`}
                                value={formData.surname}
                                onChange={handleInputChange}
                                maxLength={100}
                                required
                                placeholder="Soyadınızı daxil edin"
                                disabled={isSubmitting}
                            />
                            {errors.surname && <span className="error-message">{errors.surname}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`request-form-input ${errors.email ? 'error' : ''}`}
                                value={formData.email}
                                onChange={handleInputChange}
                                maxLength={255}
                                required
                                placeholder="Email ünvanınızı daxil edin"
                                disabled={isSubmitting}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="phone">Telefon *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={`request-form-input ${errors.phone ? 'error' : ''}`}
                                value={formData.phone}
                                onChange={handleInputChange}
                                maxLength={20}
                                required
                                placeholder="Telefon nömrənizi daxil edin"
                                disabled={isSubmitting}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="finCode">FİN Kod *</label>
                            <input
                                type="text"
                                id="finCode"
                                name="finCode"
                                className={`request-form-input ${errors.finCode ? 'error' : ''}`}
                                value={formData.finCode}
                                onChange={handleInputChange}
                                maxLength={20}
                                required
                                placeholder="FİN kodunuzu daxil edin"
                                disabled={isSubmitting}
                            />
                            {errors.finCode && <span className="error-message">{errors.finCode}</span>}
                        </div>

                        <div className="request-form-group">
                            <label htmlFor="vezife">Vəzifə *</label>
                            <input
                                type="text"
                                id="vezife"
                                name="vezife"
                                className={`request-form-input ${errors.vezife ? 'error' : ''}`}
                                value={formData.vezife}
                                onChange={handleInputChange}
                                maxLength={200}
                                required
                                placeholder="Vəzifənizi daxil edin"
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
                            Ləğv et
                        </button>
                        <button
                            type="submit"
                            className="request-modal-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Göndərilir...' : 'Müraciət Göndər'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;
