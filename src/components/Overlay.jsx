import React, { useEffect, useState, useRef } from 'react'
import { client } from '../sanityClient'
import { Arrow } from './icons/Arrow'

export default function Overlay({ isLoading, activeSection, legalModalOpen }) {
    const [location, setLocation] = useState('BERLIN')
    const [locationLink, setLocationLink] = useState(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1190)
    const availableWorkRef = useRef(null)
    const [menuArrowPos, setMenuArrowPos] = useState({ top: 0, left: 0 })

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1190)
            if (availableWorkRef.current) {
                const rect = availableWorkRef.current.getBoundingClientRect()
                setMenuArrowPos({
                    top: rect.top + (rect.height / 2),
                    left: rect.left - 25
                })
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        const fetchSettings = async () => {
            try {
                const query = '*[_type == "siteSettings"][0]{ location, locationLink }'
                const settings = await client.fetch(query)
                if (settings?.location) {
                    setLocation(settings.location.toUpperCase())
                }
                if (settings?.locationLink) {
                    setLocationLink(settings.locationLink)
                }
            } catch (err) {
                console.error("Failed to fetch site settings:", err)
            }
        }
        fetchSettings()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const isBookingActive = activeSection === 'booking'
    const showBackToTop = isBookingActive && !legalModalOpen

    // Flying Arrow Logic for Mobile
    const flyingStyle = isMobile ? {
        top: showBackToTop ? '0.5rem' : `${menuArrowPos.top}px`,
        right: showBackToTop ? '0.5rem' : `calc(100% - ${menuArrowPos.left}px)`,
        transform: showBackToTop ? 'translate(0, 0) rotate(-90deg) scale(1.1)' : 'translate(0, -50%) rotate(0deg) scale(0.8)',
        opacity: showBackToTop ? 1 : 0,
        pointerEvents: showBackToTop ? 'auto' : 'none'
    } : {}

    return (
        <>
            <div className={`overlay-container ${isBookingActive ? 'booking-focus' : ''}`}>
                <header className="overlay-header">
                    <h1>KAAMOS</h1>
                    <nav>
                        <ul>
                            <li>
                                <Arrow className={`menu-arrow ${activeSection === 'bio' ? 'visible' : ''}`} />
                                <a href="#bio" className={activeSection === 'bio' ? 'active' : ''}>INFO & ABOUT</a>
                            </li>
                            <li>
                                <Arrow className={`menu-arrow ${activeSection === 'previous-work' ? 'visible' : ''}`} />
                                <a href="#previous-work" className={activeSection === 'previous-work' ? 'active' : ''}>PREVIOUS WORK</a>
                            </li>
                            <li ref={availableWorkRef}>
                                <Arrow className={`menu-arrow ${activeSection === 'available-work' ? 'visible' : ''}`} />
                                <a href="#available-work" className={activeSection === 'available-work' ? 'active' : ''}>AVAILABLE WORK</a>
                            </li>
                            <li>
                                <Arrow className={`menu-arrow ${isBookingActive ? 'visible' : ''} ${isMobile ? 'mobile-hidden' : ''}`} />
                                <a href="#booking" className={isBookingActive ? 'active' : ''}>BOOK A TATTOO</a>
                            </li>
                        </ul>
                    </nav>
                </header>
                <footer className="overlay-footer">
                    <span className="footer-text footer-text-full">NOW POKING IN:</span>
                    <span className="footer-text footer-text-short">NOW IN:</span>
                    <span className="footer-text footer-text-mobile">CURRENTLY POKING IN:</span>
                </footer>
            </div>
            <a
                href={locationLink || '#'}
                target={locationLink ? '_blank' : '_self'}
                rel={locationLink ? 'noopener noreferrer' : undefined}
                className={`location-button ${showBackToTop ? 'booking-focus' : ''}`}
                onClick={locationLink ? undefined : (e) => e.preventDefault()}
            >
                {location}
            </a>
            <button
                className={`back-to-top ${showBackToTop ? 'booking-focus' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to landing page"
                style={flyingStyle}
            >
                <Arrow className="custom-arrow-svg" />
            </button>
        </>
    )
}
