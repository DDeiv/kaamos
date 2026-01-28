import React from 'react'

export default function LegalFooter() {
    return (
        <footer className="legal-footer">
            <div className="footer-grid">
                <div className="footer-block">
                    <h3>STUDIO</h3>
                    <p>KAAMOS TATTOO<br />BERLIN, DE</p>
                </div>
                <div className="footer-block">
                    <h3>CONTACT</h3>
                    <p><a href="mailto:info@kaamos.com">INFO@KAAMOS.COM</a></p>
                </div>
                <div className="footer-block">
                    <h3>LEGAL</h3>
                    <ul className="legal-list">
                        <li><a href="#">IMPRESSUM</a></li>
                        <li><a href="#">DATENSCHUTZ</a></li>
                        <li><a href="#">AGB</a></li>
                    </ul>
                </div>
                <div className="footer-block">
                    <h3>SOCIAL</h3>
                    <ul className="legal-list">
                        <li><a href="#">INSTAGRAM</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} KAAMOS</span>
                <span>ALL RIGHTS RESERVED</span>
            </div>
        </footer>
    )
}
