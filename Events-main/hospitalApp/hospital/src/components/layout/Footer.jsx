import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import footerLeft from '../../assets/footer-left.png'
import footerRight from '../../assets/footer-right.png'
import { useTranslation } from '../../hooks/useTranslation'
// Footer logo now sourced from public assets as SVG
// Use SVG from public assets
// Social icons now sourced from public/assets as SVGs

function Footer() {
    const { t } = useTranslation();

    return (
        <footer>
            <div className="footer-content">
                <div className="footer-left">
                    <img src={footerLeft} alt="Footer Left Image" />
                </div>
                <div className="footer-center">
                    <div className="footer-logo">
                        <img src="/assets/footer.svg" alt="Footer Logo" />
                    </div>
                    <div className="footer-navigation">
                        <Link to="/" className="footer-link">{t('home')}</Link>
                        <Link to="/about" className="footer-link">{t('about')}</Link>
                        <Link to="/events" className="footer-link">{t('events')}</Link>
                        <Link to="/employee" className="footer-link">{t('employees')}</Link>
                        <Link to="/gallery" className="footer-link">{t('gallery')}</Link>
                        <Link to="/blog" className="footer-link">{t('blog')}</Link>
                        <Link to="/contact" className="footer-link">{t('contact')}</Link>
                    </div>
                    <div className="social-media-icons">
                        <a className="social-icon" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <img src="/assets/facebook.svg" alt="Facebook" />
                        </a>
                        <a className="social-icon" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <img src="/assets/instagram.svg" alt="Instagram" />
                        </a>
                        <a className="social-icon" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <img src="/assets/linkedin.svg" alt="LinkedIn" />
                        </a>
                        <a className="social-icon" href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <img src="/assets/youtube.svg" alt="YouTube" />
                        </a>
                        <a className="social-icon" href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                            <img src="/assets/telegram.svg" alt="Telegram" />
                        </a>
                    </div>
                    <div className="footer-copyright">
                        <div className="footer-copyright-line"></div>
                        <div className="footer-copyright-content">
                            <div className="footer-copyright-left">
                                {t('websiteByPrefix')} <a href="https://webonly.io/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Webonly</a>{t('websiteBySuffix')}
                            </div>
                            <div className="footer-copyright-right">
                                {t('copyright')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-right">
                    <img src={footerRight} alt="Footer Right Image" />
                </div>
            </div>
        </footer>
    )
}

export default Footer
