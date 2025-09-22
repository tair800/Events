import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import footerLeft from '../../assets/footer-left.png'
import footerRight from '../../assets/footer-right.png'
// Footer logo now sourced from public assets as SVG
// Use SVG from public assets
// Social icons now sourced from public/assets as SVGs

function Footer() {
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
                        <Link to="/" className="footer-link">Ana səhifə</Link>
                        <Link to="/about" className="footer-link">Haqqımızda</Link>
                        <Link to="/events" className="footer-link">Tədbirlər</Link>
                        <Link to="/employee" className="footer-link">Üzv</Link>
                        <Link to="/gallery" className="footer-link">Qalereya</Link>
                        <Link to="/blog" className="footer-link">Blog</Link>
                        <Link to="/contact" className="footer-link">Contact</Link>
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
                                Veb-sayt Webonly tərəfindən hazırlanıb.
                            </div>
                            <div className="footer-copyright-right">
                                Copywrite @2025. Bütün hüquqlar qorunur. AHBPCA
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
