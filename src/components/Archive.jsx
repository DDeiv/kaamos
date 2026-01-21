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

    return (
        <div className="archive-container">
            {images.map((img, index) => {
                const randomOffsetY = Math.floor(Math.random() * 250) - 125
                const randomOffsetX = Math.floor(Math.random() * 140) - 70

                return (
                    <div
                        key={img._id}
                        className="archive-item"
                        style={{
                            marginTop: `${randomOffsetY}px`,
                            marginLeft: `${randomOffsetX}px`,
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
    )
}
