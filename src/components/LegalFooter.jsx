import React from 'react'

export default function LegalFooter({ onOpenModal }) {
    return (
        <footer className="legal-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="logo-text">KAAMOS</span>
                        <p>Elevating the standard of handpoked tattooing in Berlin.</p>
                    </div>
                    <div className="footer-bottom">
                        <p>© {new Date().getFullYear()} KAAMOS. All rights reserved.</p>
                        <ul className="footer-links">
                            <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('privacy'); }}>Privacy Policy</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('terms'); }}>Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}
