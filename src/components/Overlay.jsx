import React from 'react'

export default function Overlay({ isLoading }) {
    return (
        <div className="overlay-container">
            <header className="overlay-header">
                <div>
                    <h1>MOLTEN TYSON</h1>
                    <p>NEO-TRIBAL TATTOO ARTIST</p>
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
                {isLoading ? (
                    <div className="loading-text">INITIALIZING...</div>
                ) : (
                    <div className="scrolling-text">
                        Organic Forms • Neo Tribal • Molten Metal • Flesh & Ink • Organic Forms • Neo Tribal • Molten Metal • Flesh & Ink •
                    </div>
                )}
            </main>

            <footer className="overlay-footer">
                <div className="footer-info">
                    <p>Exploring organic forms through ink and skin.</p>
                    <p>Based in Berlin.</p>
                </div>
                <div className="footer-copy">
                    <p>© 2024</p>
                </div>
            </footer>
        </div>
    )
}
