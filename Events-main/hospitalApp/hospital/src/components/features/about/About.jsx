import React, { useState, useEffect } from 'react'
import './About.css'
import { getContextualImagePath } from '../../../utils/imageUtils'
import { useLanguage } from '../../../context'
import { useTranslation } from '../../../hooks/useTranslation'
const aboutMainImage = '/assets/about-main.png'
const aboutTop1Image = '/assets/about-dot1.png'
const aboutTop2Image = '/assets/about-dot2.png'
const aboutTop3Image = '/assets/about-dot3.png'
const aboutTop4Image = '/assets/about-dot4.png'
const circleImage = '/assets/circle.png'
import LogoCarousel from '../../ui/LogoCarousel'
import AboutCarousel from './AboutCarousel.jsx'

function About() {
    const [counter, setCounter] = useState(1);
    const [counter2, setCounter2] = useState(1);
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [cachedData, setCachedData] = useState({});
    const { selectedLanguage } = useLanguage();
    const { t } = useTranslation();

    // Fetch About data from API with caching
    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                // Check if we have cached data for this language
                if (cachedData[selectedLanguage]) {
                    setAboutData(cachedData[selectedLanguage]);
                    setLoading(false);
                    return;
                }

                setIsTransitioning(true);
                setLoading(true);

                let apiUrl = 'https://localhost:5000/api/about';

                // Use language-specific endpoint if not Azerbaijani
                if (selectedLanguage !== 'aze') {
                    apiUrl = `https://localhost:5000/api/about/language/${selectedLanguage}`;
                }

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch about data');
                }
                const data = await response.json();
                const aboutItem = data[0]; // Get the first about entry

                // Cache the data for this language
                setCachedData(prev => ({
                    ...prev,
                    [selectedLanguage]: aboutItem
                }));

                setAboutData(aboutItem);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                // Add a small delay for smooth transition
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 150);
            }
        };

        fetchAboutData();
    }, [selectedLanguage]);







    // Counter animation for dot4 (Events)
    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(prevCounter => {
                if (prevCounter < 70) {
                    return prevCounter + 1;
                } else {
                    clearInterval(timer);
                    return 70;
                }
            });
        }, 30); // Slowed down from 1ms to 50ms

        return () => clearInterval(timer);
    }, []);

    // Counter animation for dot3 (doctors)
    useEffect(() => {
        const timer = setInterval(() => {
            setCounter2(prevCounter => {
                if (prevCounter < 100) {
                    return prevCounter + 1;
                } else {
                    clearInterval(timer);
                    return 100;
                }
            });
        }, 10); // Slowed down from 1ms to 30ms

        return () => clearInterval(timer);
    }, []);



    // Show loading state only for initial load, not for language changes
    if (loading && !cachedData[selectedLanguage]) {
        return (
            <div className="about-page">
                <div style={{
                    textAlign: 'center',
                    padding: '50px',
                    color: 'white',
                    opacity: 0.7,
                    transition: 'opacity 0.3s ease'
                }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="about-page">
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>Error loading data: {error}</p>
                </div>
            </div>
        );
    }


    return (
        <div className={`about-page ${isTransitioning ? 'transitioning' : ''}`} data-language={selectedLanguage}>
            <img
                src={circleImage}
                alt="Circle"
                className="about-circle-first"
            />
            <img
                src={circleImage}
                alt="Circle"
                className="about-circle-second"
            />
            <div className="about-content-container">
                <div className="left-image-section">
                    <div className="dot-image-container">
                        <img src={aboutTop1Image} alt="About Dot Image" />
                    </div>
                    <div className="dot2-image-container">
                        <img src={aboutTop2Image} alt="About Dot 2 Image" />
                    </div>
                    <div className="dot3-image-container">
                        <img src={aboutTop3Image} alt="About Dot 3 Image" />
                        <div className="dot3-text-overlay">
                            <span className="dot3-number">+{counter2}</span>
                            <span className="dot3-label">{t('doctors')}</span>
                        </div>
                    </div>
                    <div className="dot4-image-container">
                        <img src={aboutTop4Image} alt="About Dot 4 Image" />
                        <div className="dot4-text-overlay">
                            <span className="dot4-number">+{counter}</span>
                            <span className="dot4-label">{t('events')}</span>
                        </div>
                    </div>
                    <div className="main-image-container">
                        <img
                            src={aboutData?.img ? getContextualImagePath(aboutData.img, 'admin') : aboutMainImage}
                            alt="About Main Image"
                        />
                    </div>
                </div>

                <div className="right-text-section" style={{ color: 'black' }}>
                    <h1 className="main-title">
                        {aboutData?.title || t('aboutTitle')}
                    </h1>

                    <div className="text-content" style={{ marginTop: '2rem' }}>
                        {aboutData?.description ? (
                            aboutData.description.split('\n\n').map((paragraph, index) => (
                                <p key={index}>
                                    {paragraph.trim()}
                                </p>
                            ))
                        ) : (
                            t('aboutDescription').split('\n\n').map((paragraph, index) => (
                                <p key={index}>
                                    {paragraph.trim()}
                                </p>
                            ))
                        )}
                    </div>
                </div>
            </div>



            <AboutCarousel />

            <LogoCarousel />
        </div>
    )
}

export default About
