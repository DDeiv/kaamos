import React, { useEffect, useState } from 'react'
import { client, urlFor, MOCK_ARCHIVE_IMAGES } from '../sanityClient'

export default function Archive() {
    const [images, setImages] = useState([])

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Try to fetch from Sanity
                const query = '*[_type == "archiveImage"]{ _id, title, image }'
                const sanityImages = await client.fetch(query)

                if (sanityImages && sanityImages.length > 0) {
                    setImages(sanityImages)
                } else {
                    // Fallback to mock data if no Sanity data or error (e.g. unconfigured client)
                    console.log("Using mock archive data")
                    setImages(MOCK_ARCHIVE_IMAGES)
                }
            } catch (err) {
                console.warn("Sanity fetch failed (expected if not configured), using mock data:", err)
                setImages(MOCK_ARCHIVE_IMAGES)
            }
        }
        fetchImages()
    }, [])

    return (
        <div className="archive-container">
            {images.map((img, index) => {
                // Random horizontal positioning for "cascade" effect
                // We'll use a deterministic random based on index to avoid hydration mismatch if possible,
                // or just simple random for now since it's client-side only.
                const randomOffset = Math.floor(Math.random() * 40) // 0-40% offset
                const alignment = index % 2 === 0 ? 'flex-start' : 'flex-end'

                return (
                    <div
                        key={img._id}
                        className="archive-item"
                        style={{
                            alignSelf: alignment,
                            marginLeft: alignment === 'flex-start' ? `${randomOffset}%` : 0,
                            marginRight: alignment === 'flex-end' ? `${randomOffset}%` : 0,
                        }}
                    >
                        <img
                            src={img.image ? urlFor(img.image).width(600).url() : img.url}
                            alt={img.title || 'Archive Image'}
                            loading="lazy"
                        />
                    </div>
                )
            })}
        </div>
    )
}
