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
            // Increased to 600 for sharper definition of pointy edges
            const width = 600
            const height = 600 * (img.height / img.width)

            canvas.width = width
            canvas.height = height

            // Draw image to canvas
            ctx.drawImage(img, 0, 0, width, height)

            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data

            const positions = new Float32Array(particleCount * 3)
            const validPixels = []

            // First pass: Analyze image data to build a weighted map of pixels
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                const a = data[i + 3]

                // Calculate darkness (inverted brightness)
                const brightness = (r + g + b) / 3
                const darkness = 1.0 - (brightness / 255.0)
                const alphaNorm = a / 255.0

                // Weight depends on darkness and alpha
                // Linear weight to represent true density
                const weight = darkness * alphaNorm

                // Lower threshold to catch faint dots
                if (weight > 0.1) {
                    const pixelIndex = i / 4
                    const x = pixelIndex % width
                    const y = Math.floor(pixelIndex / width)
                    validPixels.push({ x, y, weight })
                }
            }

            if (validPixels.length === 0) {
                console.warn('No valid pixels found in image:', imageUrl)
                resolve(new Float32Array(particleCount * 3))
                return
            }

            // Second pass: Generate particles using rejection sampling to respect density
            let count = 0
            let attempts = 0
            const maxAttempts = particleCount * 100

            while (count < particleCount && attempts < maxAttempts) {
                attempts++
                const randomPixel = validPixels[Math.floor(Math.random() * validPixels.length)]

                // Linear rejection sampling: probability proportional to weight
                // This ensures particle density matches image density 1:1
                if (Math.random() < randomPixel.weight) {
                    // Normalize X, Y to -1 to 1
                    const nx = (randomPixel.x / width) * 2 - 1
                    const ny = -((randomPixel.y / height) * 2 - 1)

                    // Z-axis Inflation based on density (thicker in denser areas)
                    const maxZ = randomPixel.weight * 0.5
                    const z = (Math.random() - 0.5) * maxZ

                    // Minimal jitter
                    const jitter = 0.002

                    positions[count * 3] = (nx + (Math.random() - 0.5) * jitter) * 2.5
                    positions[count * 3 + 1] = (ny + (Math.random() - 0.5) * jitter) * 2.5
                    positions[count * 3 + 2] = z * 2.5

                    count++
                }
            }

            resolve(positions)
        }

        img.onerror = (err) => {
            console.error('Failed to load image:', imageUrl, err)
            reject(err)
        }
    })
}
