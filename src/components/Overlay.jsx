import React from 'react'

export default function Overlay({ isLoading }) {
    return (
        <div className="overlay-container">
            <header className="overlay-header">
                <h1>KAAMOS</h1>
                <nav>
                    <ul>
                        <li><a href="#">BOOK</a></li>
                        <li><a href="#">INFO</a></li>
                        <li><a href="#">GALLERY</a></li>
                    </ul>
                </nav>
            </header>
            <footer className="overlay-footer">
                <span className="footer-text footer-text-full">CURRENTLY POKING IN:</span>
                <span className="footer-text footer-text-short">NOW POKING IN:</span>
                <span className="location-button">BERLIN</span>
            </footer>
        </div>
    )
}
