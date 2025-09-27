import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getContextualImagePath } from '../../utils/imageUtils'
const adminDeleteIcon = '/assets/admin-delete.png'
const adminBrowseIcon = '/assets/admin-browse.png'
import './AdminHome.css'

function AdminHome() {
    const [homeData, setHomeData] = useState({
        section1Description: '',
        section1DescriptionEn: '',
        section1DescriptionRu: '',
        section2Image: '',
        section3Image: '',
        section4Title: '',
        section4TitleEn: '',
        section4TitleRu: '',
        section4Description: '',
        section4DescriptionEn: '',
        section4DescriptionRu: '',
        section4PurposeTitle: '',
        section4PurposeTitleEn: '',
        section4PurposeTitleRu: '',
        section4PurposeDescription: '',
        section4PurposeDescriptionEn: '',
        section4PurposeDescriptionRu: ''
    });
    const [loading, setLoading] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState('az');

    const languageOptions = [
        { code: 'az', name: 'Azərbaycan', flag: '/assets/azerbaijan.svg' },
        { code: 'en', name: 'English', flag: '/assets/english.svg' },
        { code: 'ru', name: 'Русский', flag: '/assets/russian.svg' }
    ];

    // Helper functions for language-aware field handling
    const getCurrentFieldName = (baseField) => {
        if (activeLanguage === 'az') return baseField;
        return `${baseField}${activeLanguage === 'en' ? 'En' : 'Ru'}`;
    };

    const getCurrentFieldValue = (baseField) => {
        const fieldName = getCurrentFieldName(baseField);
        return homeData[fieldName] || '';
    };

    const getLocalizedPlaceholder = (baseField, defaultText) => {
        const languageSuffix = activeLanguage === 'az' ? '' : (activeLanguage === 'en' ? ' (English)' : ' (Russian)');
        return `${defaultText}${languageSuffix}`;
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            const response = await fetch('https://localhost:5000/api/HomeSection/first');
            if (response.ok) {
                const data = await response.json();
                setHomeData({
                    section1Description: data.section1Description || '',
                    section1DescriptionEn: data.section1DescriptionEn || '',
                    section1DescriptionRu: data.section1DescriptionRu || '',
                    section2Image: data.section2Image || '',
                    section3Image: data.section3Image || '',
                    section4Title: data.section4Title || '',
                    section4TitleEn: data.section4TitleEn || '',
                    section4TitleRu: data.section4TitleRu || '',
                    section4Description: data.section4Description || '',
                    section4DescriptionEn: data.section4DescriptionEn || '',
                    section4DescriptionRu: data.section4DescriptionRu || '',
                    section4PurposeTitle: data.section4PurposeTitle || '',
                    section4PurposeTitleEn: data.section4PurposeTitleEn || '',
                    section4PurposeTitleRu: data.section4PurposeTitleRu || '',
                    section4PurposeDescription: data.section4PurposeDescription || '',
                    section4PurposeDescriptionEn: data.section4PurposeDescriptionEn || '',
                    section4PurposeDescriptionRu: data.section4PurposeDescriptionRu || ''
                });
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch home data.');
        }
    };

    const showAlert = (icon, title, text) => {
        Swal.fire({ icon, title, text, confirmButtonColor: '#1976d2', timer: 2000, showConfirmButton: false });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHomeData(prev => ({ ...prev, [name]: value }));
    };

    const handleLanguageFieldChange = (baseField, value) => {
        const fieldName = getCurrentFieldName(baseField);
        setHomeData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleImageBrowse = async (sectionName) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const endpoint = 'https://localhost:5000/api/ImageUpload/home';

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Add timestamp to force image reload
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;
                            setHomeData(prev => ({ ...prev, [sectionName]: imagePathWithTimestamp }));
                            showAlert('success', 'Image Uploaded!', `Image "${file.name}" uploaded successfully!`);
                        } else {
                            showAlert('error', 'Upload Failed!', result.message || 'Failed to upload image.');
                        }
                    } else {
                        showAlert('error', 'Upload Failed!', 'Failed to upload image to server.');
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    showAlert('error', 'Upload Failed!', 'Failed to upload image. Please try again.');
                }
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    const handleImageDelete = (sectionName) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setHomeData(prev => ({ ...prev, [sectionName]: '' }));
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await fetch('https://localhost:5000/api/HomeSection/first', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(homeData),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Home sections updated successfully!');
            } else {
                showAlert('error', 'Error!', 'Failed to update home sections.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to update home sections.');
        } finally {
            setLoading(false);
        }
    };

    const renderImageSection = (sectionName, title) => (
        <div className="section-form-group">
            <h3>{title}</h3>
            <div className="image-section">
                <div className="image-placeholder">
                    {homeData[sectionName] ? (
                        // Show existing uploaded image
                        <img
                            src={getContextualImagePath(homeData[sectionName], 'admin')}
                            alt={`${title} image`}
                            className="current-image"
                            key={homeData[sectionName]} // Force re-render when image changes
                        />
                    ) : (
                        <div className="image-placeholder-text">No image uploaded</div>
                    )}
                </div>

                <div className="image-actions-left">
                    <button
                        type="button"
                        onClick={() => handleImageDelete(sectionName)}
                        className="action-btn delete-btn"
                        title="Delete image"
                    >
                        <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleImageBrowse(sectionName)}
                        className="action-btn browse-btn"
                        title="Browse image"
                    >
                        <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                    </button>
                </div>

                <div className="image-info">
                    *Yüklənən şəkil 400 x 400 ölçüsündə olmalıdır
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="admin-home-loading">Loading...</div>;

    return (
        <div className="admin-home">
            <div className="admin-home-container">
                <div className="admin-home-card">
                    <div className="admin-home-header">
                        <h2>Home Page Management</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-home-form">
                        {/* Language Tabs */}
                        <div className="language-tabs-container">
                            <div className="language-tabs">
                                {languageOptions.map((lang) => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        className={`language-tab ${activeLanguage === lang.code ? 'active' : ''}`}
                                        onClick={() => setActiveLanguage(lang.code)}
                                    >
                                        <img src={lang.flag} alt={lang.name} className="language-flag" />
                                        <span className="language-name">{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-fields-left">
                            {/* Section 1 - Description */}
                            <div className="section-form-group">
                                <h3>Section 1 - Main Title</h3>
                                <div className="form-group">
                                    <label htmlFor="section1Description">Main Title & Description</label>
                                    <textarea
                                        id="section1Description"
                                        name={getCurrentFieldName('section1Description')}
                                        value={getCurrentFieldValue('section1Description')}
                                        onChange={(e) => handleLanguageFieldChange('section1Description', e.target.value)}
                                        placeholder={getLocalizedPlaceholder('section1Description', 'Enter the main title and description for section 1')}
                                        className="form-textarea"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            {/* Section 4 - Content */}
                            <div className="section-form-group">
                                <h3>Section 4 - Organization Details</h3>
                                {['section4Title', 'section4Description', 'section4PurposeTitle', 'section4PurposeDescription'].map(field => (
                                    <div className="form-group" key={field}>
                                        <label htmlFor={field}>
                                            {field.replace('section4', '').replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        {field.includes('Description') ? (
                                            <textarea
                                                id={field}
                                                name={getCurrentFieldName(field)}
                                                value={getCurrentFieldValue(field)}
                                                onChange={(e) => handleLanguageFieldChange(field, e.target.value)}
                                                placeholder={getLocalizedPlaceholder(field, `Enter ${field.replace('section4', '').replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`)}
                                                className="form-textarea"
                                                rows="3"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                id={field}
                                                name={getCurrentFieldName(field)}
                                                value={getCurrentFieldValue(field)}
                                                onChange={(e) => handleLanguageFieldChange(field, e.target.value)}
                                                placeholder={getLocalizedPlaceholder(field, `Enter ${field.replace('section4', '').replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`)}
                                                className="form-input"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="image-section-right">
                            {renderImageSection('section2Image', 'Section 2 - Main Image')}
                            {renderImageSection('section3Image', 'Section 3 - Secondary Image')}
                        </div>
                    </form>

                    <div className="form-actions">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome
