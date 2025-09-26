import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContextualImagePath } from '../../../utils/imageUtils';
import LogoCarousel from '../../ui/LogoCarousel';
import { RequestModal, EmployeeSlider } from '../../ui';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
// Removed timelineData import - now fetching from API
import './EventsDetail.css';

const EventsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const eventId = parseInt(id);
    const { selectedLanguage } = useLanguage();
    const { t } = useTranslation();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [timelineSlots, setTimelineSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(0);
    const [timelineLoading, setTimelineLoading] = useState(true);
    const [currentTimelineStart, setCurrentTimelineStart] = useState(0);
    const itemsPerPage = 3;

    // Fetch timeline data from API
    useEffect(() => {
        const fetchTimelineData = async () => {
            try {
                setTimelineLoading(true);
                const response = await fetch(`https://localhost:5000/api/eventtimeline/event/${eventId}/language/${selectedLanguage}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch timeline data');
                }
                const data = await response.json();
                setTimelineSlots(data);
                setSelectedTimeSlot(0); // Default to first slot (index 0)
                setCurrentTimelineStart(data.length - 1); // Start with last slot as first visible
                console.log('Timeline data loaded successfully:', data.length, 'slots');
            } catch (error) {
                console.error('Error loading timeline data:', error);
                // Fallback to empty array if there's an error
                setTimelineSlots([]);
            } finally {
                setTimelineLoading(false);
            }
        };

        if (eventId) {
            fetchTimelineData();
        }
    }, [eventId, selectedLanguage]);

    // Update CSS custom property for dynamic height based on timeline slots count
    useEffect(() => {
        const timelineLeft = document.querySelector('.event-detail-timeline-left');
        if (timelineLeft && timelineSlots.length > 0) {
            const itemCount = timelineSlots.length;
            timelineLeft.style.setProperty('--timeline-item-count', itemCount.toString());
            console.log('Setting timeline height for', itemCount, 'items');

            // Force a reflow to ensure the style is applied
            timelineLeft.offsetHeight;
        }
    }, [timelineSlots.length]);

    // Fetch event data from API
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://localhost:5000/api/events/${eventId}/language/${selectedLanguage}`);
                if (!response.ok) {
                    throw new Error('Event not found');
                }
                const eventData = await response.json();
                setEvent(eventData);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId, selectedLanguage]);

    // Countdown timer effect
    useEffect(() => {
        if (!event) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const eventTime = new Date(event.eventDate).getTime();
            const difference = eventTime - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

                setTimeLeft({ days, hours, minutes });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            }
        };

        // Calculate immediately
        calculateTimeLeft();

        // Update every second for real-time countdown
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [event]);


    // Handle request modal success
    const handleRequestSuccess = () => {
        console.log('Request submitted successfully from event detail page');
        setShowRequestModal(false);
    };

    // Handle time slot selection
    const handleTimeSlotClick = (index) => {
        setSelectedTimeSlot(index);
        console.log(`Selected time slot: ${index}`);
        console.log('Selected slot data:', timelineSlots[index]);
        console.log('Info field:', timelineSlots[index]?.info);
    };

    // Function to refresh timeline data
    const refreshTimelineData = () => {
        try {
            setTimelineSlots(timelineData.slots);
            console.log('Timeline data refreshed');
        } catch (error) {
            console.error('Error refreshing timeline data:', error);
        }
    };

    // Handle scroll button clicks for sliding window
    const handleScrollUp = () => {
        if (timelineSlots.length === 0) return;

        // Move window up by 1 slot, with infinite wrap
        const newStart = currentTimelineStart > 0 ? currentTimelineStart - 1 : timelineSlots.length - 1;
        setCurrentTimelineStart(newStart);

        // Always select the middle slot of the visible window
        const middleIndex = (newStart + 1) % timelineSlots.length;
        setSelectedTimeSlot(middleIndex);
    };

    const handleScrollDown = () => {
        if (timelineSlots.length === 0) return;

        // Move window down by 1 slot, with infinite wrap
        const newStart = (currentTimelineStart + 1) % timelineSlots.length;
        setCurrentTimelineStart(newStart);

        // Always select the middle slot of the visible window
        const middleIndex = (newStart + 1) % timelineSlots.length;
        setSelectedTimeSlot(middleIndex);
    };


    // Get visible timeline slots for sliding window
    const getVisibleTimelineSlots = () => {
        if (timelineSlots.length === 0) return [];

        const visibleSlots = [];
        const maxSlots = Math.min(itemsPerPage, timelineSlots.length);

        for (let i = 0; i < maxSlots; i++) {
            const index = (currentTimelineStart + i) % timelineSlots.length;
            visibleSlots.push({
                ...timelineSlots[index],
                originalIndex: index
            });
        }

        // If we have fewer than 3 slots, fill with empty slots to maintain 3-slot display
        while (visibleSlots.length < itemsPerPage) {
            visibleSlots.push({
                id: `empty-${visibleSlots.length}`,
                startTime: '',
                endTime: '',
                originalIndex: -1,
                isEmpty: true
            });
        }

        return visibleSlots;
    };

    // Get the actual index in the full array for visible slots
    const getActualIndex = (visibleIndex) => {
        return (currentTimelineStart + visibleIndex) % timelineSlots.length;
    };


    // Show loading state
    if (loading) {
        return (
            <div className="events-detail-page">
                <div className="events-detail-header-text">
                    <span className="events-detail-header-first">Yüklənir...</span>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !event) {
        return (
            <div className="events-detail-page">
                <div className="events-detail-header-text">
                    <span className="events-detail-header-first">
                        {error || 'Event Not Found'}
                    </span>
                    <button onClick={() => navigate('/events')} className="back-button">Back to Events</button>
                </div>
            </div>
        );
    }

    return (
        <div className="events-detail-page">
            <div className="events-detail-background-image">
                <img src="/assets/event-dna.png" alt="Equipment DNA Background" />
            </div>

            <img src="/assets/events-star1.png" alt="Star 1" className="events-star-left" />
            <img src="/assets/events-star2.png" alt="Star 2" className="events-star-right" />

            <div className="events-detail-main-title">
                <div className="title-line-1">{event.title}</div>
                <div className="title-line-2">{event.subtitle}</div>
            </div>

            <div className="events-detail-cards">
                <div className="event-detail-card event-date-card">
                    <img src="/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/assets/event-date.svg" alt="Calendar" className="card-calendar-icon" />
                    <div className="card-date-info">
                        <span className="card-date-day">{new Date(event.eventDate).getDate()}</span>
                        <span className="card-date-separator">.</span>
                        <span className="card-date-month">{new Date(event.eventDate).getMonth() + 1}</span>
                        <span className="card-date-separator">.</span>
                        <span className="card-date-year">{new Date(event.eventDate).getFullYear()}</span>
                    </div>
                </div>
                <div className="event-detail-card event-location-card">
                    <img src="/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/assets/event-clock.svg" alt="Clock" className="card-clock-icon" />
                    <div className="card-time-info">
                        <span className="card-time">{event.time}</span>
                    </div>
                </div>
                {event.region && (
                    <div className="event-detail-card event-region-card">
                        <img src="/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                        <img src="/assets/event-location.svg" alt="Region" className="card-location-icon" />
                        <div className="card-location-info">
                            <span className="card-location">{event.region}</span>
                        </div>
                    </div>
                )}
                <div className="event-detail-card event-participants-card">
                    <img src="/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/assets/event-venue.svg" alt="Location" className="card-location-icon" />
                    <div className="card-location-info">
                        <span className="card-location">{event.venue}</span>
                    </div>
                </div>
            </div>

            <div className="events-detail-description">
                <p>{event.longDescription}</p>
            </div>

            <div className="events-detail-main-image">
                <div className="countdown-timer">
                    <div className="timer-display">
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.days.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Gün</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Saat</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Dəq</span>
                        </div>
                    </div>

                </div>
                <img src={getContextualImagePath(event.detailImageLeft, 'admin')} alt="Event Detail Left" className="left-event-image" />
                <img src={getContextualImagePath(event.detailImageMain, 'admin')} alt="Event Detail Main" className="main-event-image" />
                <img src={getContextualImagePath(event.detailImageRight, 'admin')} alt="Event Detail Right" className="right-event-image" />
                <button className="muraciet-btn" onClick={() => setShowRequestModal(true)}>Müraciət et</button>
                <button className="pdf-download-btn" onClick={() => {/* PDF download logic */ }}>Pdf yüklə</button>
            </div>

            <div className="employee-slider-section">
                <div className="event-detail-employee-header">
                    <div className="event-detail-employee-header-left">
                        <span className="event-detail-employee-header-second">
                            <span>{t('conferenceSpeakers')}</span>
                        </span>
                    </div>
                </div>
                <div className="event-detail-employee-slider">
                    <EmployeeSlider eventId={eventId} />
                </div>
                <div className="event-detail-timeline-header">
                    <div className="event-detail-timeline-header-left">
                        <span className="event-detail-timeline-header-second">
                            <span>{t('conferencePlanning')}</span>
                        </span>
                    </div>
                </div>

                <div className="event-detail-timeline-container">
                    <div className="event-detail-timeline-left">
                        <div className="time-slot-selector">
                            {timelineLoading ? (
                                <div className="timeline-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Timeline yüklənir...</p>
                                </div>
                            ) : (
                                <>
                                    <button
                                        className="time-slot-scroll-btn"
                                        onClick={handleScrollUp}
                                        disabled={timelineSlots.length <= itemsPerPage}
                                    >
                                        <img src="/assets/event-prev.svg" alt="Previous" />
                                    </button>
                                    <div className="time-slot-list">
                                        {getVisibleTimelineSlots().map((slot, visibleIndex) => {
                                            if (slot.isEmpty) {
                                                return (
                                                    <div
                                                        key={`empty-${visibleIndex}`}
                                                        className="time-slot-item time-slot-item-empty"
                                                    >
                                                        <div className="time-slot-clock">
                                                            <img src="/assets/clock.png" alt="Clock" />
                                                        </div>
                                                        <div className="time-slot-text">-</div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={`${slot.id}-${slot.originalIndex}`}
                                                    className={`time-slot-item ${selectedTimeSlot === slot.originalIndex ? 'active' : ''}`}
                                                    onClick={() => handleTimeSlotClick(slot.originalIndex)}
                                                >
                                                    <div className="time-slot-clock">
                                                        <img src="/assets/clock.png" alt="Clock" />
                                                    </div>
                                                    <div className="time-slot-text">{slot.startTime} - {slot.endTime}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        className="time-slot-scroll-btn"
                                        onClick={handleScrollDown}
                                        disabled={timelineSlots.length <= itemsPerPage}
                                    >
                                        <img src="/assets/event-next.svg" alt="Next" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="event-detail-timeline-right">
                        {timelineLoading ? (
                            <div className="timeline-loading">
                                <div className="loading-spinner"></div>
                                <p>{t('loadingData')}</p>
                            </div>
                        ) : timelineSlots.length > 0 && selectedTimeSlot < timelineSlots.length ? (
                            <div key={selectedTimeSlot} className="timeline-slot-details">
                                <div className="timeline-slot-header">
                                    <h3 className="timeline-slot-title">
                                        {timelineSlots[selectedTimeSlot].title}
                                    </h3>
                                    <div className="timeline-slot-time">
                                        {timelineSlots[selectedTimeSlot].startTime} - {timelineSlots[selectedTimeSlot].endTime}
                                    </div>
                                </div>
                                <div className="timeline-slot-content">
                                    <p className="timeline-slot-description">
                                        {timelineSlots[selectedTimeSlot].description}
                                    </p>
                                    <div className="timeline-slot-info">
                                        <div className="info-content">
                                            <div className="info-details">
                                                <div
                                                    className="info-text"
                                                    dangerouslySetInnerHTML={{
                                                        __html: timelineSlots[selectedTimeSlot].info || t('noInformationAvailable')
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="timeline-no-data">
                                <p>{t('noTimelineData')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="logo-carousel-section events-detail-logo-carousel">
                <LogoCarousel />
            </div>

            {/* Request Modal */}
            <RequestModal
                isOpen={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                onSuccess={handleRequestSuccess}
            />
        </div>
    );
};

export default EventsDetail;
