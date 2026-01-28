import React, { useEffect, useState } from 'react'
import { client } from '../sanityClient'

export default function Overlay({ isLoading, activeSection }) {
    const [location, setLocation] = useState('BERLIN')
    const [locationLink, setLocationLink] = useState(null)

    useEffect(() => {
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
    }, [])

    const getSectionTitle = () => {
        switch (activeSection) {
            case 'bio': return 'INFO & ABOUT'
            case 'previous-work': return 'PREVIOUS WORK'
            case 'available-work': return 'AVAILABLE WORK'
            case 'booking': return 'BOOK A TATTOO'
            default: return 'KAAMOS'
        }
    }

    return (
        <>
            <div className="overlay-container">
                <header className="overlay-header">
                    <h1>{getSectionTitle()}</h1>
                    <nav>
                        <ul>
                            <li><a href="#booking" className={activeSection === 'booking' ? 'active' : ''}>BOOK A TATTOO</a></li>
                            <li><a href="#bio" className={activeSection === 'bio' ? 'active' : ''}>INFO & ABOUT</a></li>
                            <li><a href="#previous-work" className={activeSection === 'previous-work' ? 'active' : ''}>PREVIOUS WORK</a></li>
                            <li><a href="#available-work" className={activeSection === 'available-work' ? 'active' : ''}>AVAILABLE WORK</a></li>
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
                className="location-button"
                onClick={locationLink ? undefined : (e) => e.preventDefault()}
            >
                {location}
            </a>
        </>
    )
}
