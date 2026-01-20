import React, { useEffect, useState } from 'react'
import { client } from '../sanityClient'

export default function Overlay({ isLoading }) {
    const [location, setLocation] = useState('BERLIN')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const query = '*[_type == "siteSettings"][0]{ location }'
                const settings = await client.fetch(query)
                if (settings?.location) {
                    setLocation(settings.location.toUpperCase())
                }
            } catch (err) {
                console.error("Failed to fetch site settings:", err)
            }
        }
        fetchSettings()
    }, [])

    return (
        <div className="overlay-container">
            <header className="overlay-header">
                <h1>KAAMOS</h1>
                <nav>
                    <ul>
                        <li><a href="#">BOOK A TATTOO</a></li>
                        <li><a href="#">PREVIOUS WORK</a></li>
                        <li><a href="#">AVAILABLE DESIGNS</a></li>
                        <li><a href="#">INFO & ABOUT</a></li>
                    </ul>
                </nav>
            </header>
            <footer className="overlay-footer">
                <span className="footer-text footer-text-full">NOW POKING IN:</span>
                <span className="footer-text footer-text-short">NOW IN:</span>
                <span className="location-button">{location}</span>
            </footer>
        </div>
    )
}
