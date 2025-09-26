import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContextualImagePath } from '../../../utils/imageUtils';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import './Employee.css';
import employeeBg from '../../../assets/employee-bg.png';
import Pagination from '../../ui/Pagination';
import usePagination from '../../../hooks/usePagination';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [cachedData, setCachedData] = useState({});
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();
    const { selectedLanguage } = useLanguage();
    const { t } = useTranslation();

    // Update items per page based on screen size
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth <= 375) {
                setItemsPerPage(6); // 1x1 grid, 6 cards per page
            } else if (window.innerWidth <= 425) {
                setItemsPerPage(4); // 2x2 grid, 4 cards per page
            } else if (window.innerWidth <= 768) {
                setItemsPerPage(6); // 2x3 grid, 6 cards per page
            } else {
                setItemsPerPage(9); // 3x3 grid, 9 cards per page
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const {
        currentPage,
        totalPages,
        currentItems: currentEmployees,
        startIndex,
        endIndex,
        handlePageChange,
        handlePreviousPage,
        handleNextPage
    } = usePagination(employees, itemsPerPage);

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Check cache first
                if (cachedData[selectedLanguage]) {
                    setEmployees(cachedData[selectedLanguage]);
                    return;
                }

                // Only show loading for initial load, not language changes
                if (!employees.length) {
                    setLoading(true);
                } else {
                    setIsTransitioning(true);
                }

                // Use language-specific endpoint if not Azerbaijani
                const apiUrl = selectedLanguage === 'aze'
                    ? 'https://localhost:5000/api/employees'
                    : `https://localhost:5000/api/employees/language/${selectedLanguage}`;

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();

                // Cache the data
                setCachedData(prev => ({
                    ...prev,
                    [selectedLanguage]: data
                }));

                setEmployees(data);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setError(err.message);
            } finally {
                setLoading(false);
                setIsTransitioning(false);
            }
        };

        fetchEmployees();
    }, [selectedLanguage]);

    const handleEmployeeClick = (employeeId) => {
        navigate(`/employee/${employeeId}`);
    };

    if (loading) {
        return (
            <div className="employee-page">
                <h1>{t('members')}</h1>
                <div className="loading-container">
                    <p>{t('loadingEmployees')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="employee-page">
                <h1>{t('members')}</h1>
                <div className="error-container">
                    <p>{t('errorLoadingEmployees')}: {error}</p>
                    <button onClick={() => window.location.reload()}>{t('retry')}</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`employee-page ${isTransitioning ? 'transitioning' : ''}`}>
            <h1>{t('members')}</h1>

            <div className="employee-cards-container">
                {currentEmployees.map((employee) => (
                    <div
                        key={employee.id}
                        className="employee-unified-card"
                        onClick={() => handleEmployeeClick(employee.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={employeeBg}
                            alt="Employee Background"
                            className="employee-bg-image"
                        />
                        <img
                            src={employee.image ? getContextualImagePath(employee.image, 'admin') : "/assets/employee1.png"}
                            alt="Employee"
                            className="employee-photo"
                        />
                        <div className="employee-fullname">
                            {employee.fullname}
                        </div>
                        <div className="employee-field-section">
                            <div className="employee-field">
                                <div className="employee-field-dot"></div>
                                {employee.field}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={employees.length}
                itemsPerPage={itemsPerPage}
                showInfo={true}
                className="employee-pagination"
            />
        </div>
    );
};

export default Employee;