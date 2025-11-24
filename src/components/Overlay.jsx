import React from 'react'

export default function Overlay() {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem',
            pointerEvents: 'none' // Allow clicks to pass through to canvas if needed, but text should be selectable
        }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>MOLTEN TYSON</h1>
                    <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>NEO-TRIBAL TATTOO ARTIST</p>
                </div>
                <nav style={{ pointerEvents: 'auto' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                        <li><a href="#">WORK</a></li>
                        <li><a href="#">INFO</a></li>
                        <li><a href="#">BOOKING</a></li>
                    </ul>
                </nav>
            </header>

            <main style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Scrolling Text */}
                <div style={{
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    fontSize: '8rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    opacity: 0.1,
                    animation: 'scroll 20s linear infinite',
                    willChange: 'transform'
                }}>
                    Organic Forms • Neo Tribal • Molten Metal • Flesh & Ink • Organic Forms • Neo Tribal • Molten Metal • Flesh & Ink •
                </div>
                <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
            </main>

            <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.875rem' }}>
                <div style={{ maxWidth: '300px' }}>
                    <p>Exploring organic forms through ink and skin.</p>
                    <p>Based in Berlin.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p>© 2024</p>
                </div>
            </footer>
        </div>
    )
}
