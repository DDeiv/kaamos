import React from 'react'

export default function LegalFooter() {
    return (
        <footer className="legal-footer">
            <div className="impressum-content">
                <div>
                    <strong>KAAMOS TATTOO</strong><br />
                    Berlin, Germany<br />
                </div>
                <div>
                    <strong>CONTACT</strong><br />
                    info@kaamos.com<br />
                    +49 (0) 000 0000000
                </div>
                <div>
                    <strong>TAX INFO</strong><br />
                    Steuernummer: 00/000/00000<br />
                    VAT ID: DE 000000000
                </div>
            </div>
            <div className="legal-links">
                <a href="#">Impressum (Legal Notice)</a>
                <a href="#">Privacy Policy (Datenschutzerklärung)</a>
                <a href="#">Terms & Conditions</a>
                <a href="#">Cookie Settings</a>
            </div>
            <div className="copyright">
                © {new Date().getFullYear()} KAAMOS. All rights reserved.
            </div>
        </footer>
    )
}
