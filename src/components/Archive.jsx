import React, { useEffect, useState } from 'react'
import { client, urlFor, MOCK_ARCHIVE_IMAGES } from '../sanityClient'

export default function Archive() {
    const [images, setImages] = useState([])

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Try to fetch from Sanity
                const query = '*[_type == "archiveImage"]{ _id, title, image, category }'
                const sanityImages = await client.fetch(query)

                if (sanityImages && sanityImages.length > 0) {
                    const isMobile = window.innerWidth <= 890
                    const imagesWithOffsets = sanityImages.map(img => ({
                        ...img,
                        randomOffsetY: Math.floor(Math.random() * (isMobile ? 80 : 250)) - (isMobile ? 40 : 125),
                        randomOffsetX: Math.floor(Math.random() * (isMobile ? 40 : 140)) - (isMobile ? 20 : 70)
                    }))
                    setImages(imagesWithOffsets)
                } else {
                    // No images uploaded yet
                    console.log("No archive images found in Sanity")
                    setImages([])
                }
            } catch (err) {
                console.error("Failed to fetch archive images:", err)
                setImages([])
            }
        }
        fetchImages()
    }, [])

    const renderSection = (title, categoryId, categoryValue) => {
        const filteredImages = images.filter(img => {
            if (categoryValue === 'previous-work' && !img.category) return true
            return img.category === categoryValue
        })

        return (
            <section id={categoryId} className="archive-section">
                <div className="archive-container">
                    {filteredImages.map((img, index) => {
                        return (
                            <div
                                key={img._id}
                                className="archive-item"
                                style={{
                                    marginTop: `${img.randomOffsetY}px`,
                                    marginLeft: `${img.randomOffsetX}px`,
                                }}
                            >
                                <img
                                    src={img.image ? urlFor(img.image).width(500).url() : img.url}
                                    alt={img.title || 'Archive Image'}
                                    loading="lazy"
                                />
                            </div>
                        )
                    })}
                </div>
            </section>
        )
    }

    return (
        <div className="archive-wrapper">
            {renderSection('PREVIOUS WORK', 'previous-work', 'previous-work')}
            {renderSection('AVAILABLE WORK', 'available-work', 'available-work')}
        </div>
    )
}
