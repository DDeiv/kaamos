import React from 'react'

export default function Overlay({ isLoading }) {
    return (
        <div className="overlay-container">
            <header className="overlay-header">
                <div>
                    <h1>Kaamos</h1>
                    <p>lemme pin ya skin</p>
                </div>
                <nav>
                    <ul>
                        <li><a href="#">WORK</a></li>
                        <li><a href="#">INFO</a></li>
                        <li><a href="#">BOOKING</a></li>
                    </ul>
                </nav>
            </header>

            <main className="overlay-main">
                {/* Scrolling text moved to scroll with archive */}
            </main>

            <footer className="overlay-footer">
                <div className="footer-info">
                    <p>Tattoo artist based in Berlin</p>
                </div>
                <div className="footer-copy">
                    <p>© 2024</p>
                </div>
            </footer>
        </div>
    )
}
