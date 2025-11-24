// Utility to sample particle positions from an image
// Returns a Promise that resolves to a Float32Array of positions [x, y, z, x, y, z, ...]

export function sampleParticlesFromImage(imageUrl, particleCount = 10000) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = imageUrl

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            // Scale down for performance if needed, but keeping it reasonable
            const width = 200
            const height = 200 * (img.height / img.width)

            canvas.width = width
            canvas.height = height

            // Draw image to canvas
            ctx.drawImage(img, 0, 0, width, height)

            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data

            const positions = new Float32Array(particleCount * 3)
            const validPixels = []

            // First pass: find all valid pixels (dark enough)
            // Assuming black shapes on white background or vice versa. 
            // Based on user images, looks like dark shapes on white/transparent.
            // Let's assume we want to spawn particles where it is DARK.

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                const a = data[i + 3]

                // Calculate brightness
                const brightness = (r + g + b) / 3

                // If pixel is not transparent and is dark enough
                if (a > 20 && brightness < 200) {
                    const pixelIndex = i / 4
                    const x = pixelIndex % width
                    const y = Math.floor(pixelIndex / width)
                    validPixels.push({ x, y })
                }
            }

            if (validPixels.length === 0) {
                console.warn('No valid pixels found in image:', imageUrl)
                // Fallback to random sphere
                for (let i = 0; i < particleCount; i++) {
                    const u = Math.random()
                    const v = Math.random()
                    const theta = 2 * Math.PI * u
                    const phi = Math.acos(2 * v - 1)
                    const r = 2
                    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
                    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
                    positions[i * 3 + 2] = r * Math.cos(phi)
                }
                resolve(positions)
                return
            }

            // Second pass: Randomly sample from valid pixels
            for (let i = 0; i < particleCount; i++) {
                const randomPixel = validPixels[Math.floor(Math.random() * validPixels.length)]

                // Normalize to -1 to 1 range
                // Flip Y because canvas 0,0 is top-left, 3D is bottom-left usually (or center)
                const nx = (randomPixel.x / width) * 2 - 1
                const ny = -((randomPixel.y / height) * 2 - 1)

                // Add some random jitter to avoid grid look
                const jitter = 0.01

                positions[i * 3] = (nx + (Math.random() - 0.5) * jitter) * 2.5 // Scale up
                positions[i * 3 + 1] = (ny + (Math.random() - 0.5) * jitter) * 2.5
                positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5 // Flattened Z depth
            }

            resolve(positions)
        }

        img.onerror = (err) => {
            console.error('Failed to load image:', imageUrl, err)
            reject(err)
        }
    })
}
