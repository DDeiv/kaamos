import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: '2z41erz0',
    dataset: 'production',
    useCdn: true,                 // set to `false` to bypass the edge cache
    apiVersion: '2023-05-03',     // use current date (YYYY-MM-DD) to target the latest API version
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
    return builder.image(source)
}

// Mock data for initial development/fallback
export const MOCK_ARCHIVE_IMAGES = [
    { _id: '1', url: 'https://picsum.photos/400/600?random=1', title: 'Tattoo 1' },
    { _id: '2', url: 'https://picsum.photos/400/500?random=2', title: 'Tattoo 2' },
    { _id: '3', url: 'https://picsum.photos/400/700?random=3', title: 'Tattoo 3' },
    { _id: '4', url: 'https://picsum.photos/400/600?random=4', title: 'Tattoo 4' },
    { _id: '5', url: 'https://picsum.photos/400/500?random=5', title: 'Tattoo 5' },
    { _id: '6', url: 'https://picsum.photos/400/800?random=6', title: 'Tattoo 6' },
]

export const MOCK_PARTICLE_SHAPES = [
    '/shapes/shape1.png',
    '/shapes/shape2.png',
    '/shapes/shape3.png',
    '/shapes/shape4.png',
    '/shapes/shape5.png'
]
