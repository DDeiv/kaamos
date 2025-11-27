export default {
    name: 'particleShape',
    title: 'Particle Shape',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Name for this particle shape (e.g., "Shape 1", "Circle", etc.)',
        },
        {
            name: 'image',
            title: 'Shape Image',
            type: 'image',
            description: 'Upload a shape image (PNG with transparency works best). The particle system will sample points from this image.',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Order in which this shape appears in the morphing sequence (lower numbers appear first)',
            validation: Rule => Rule.required().integer().min(0),
        },
    ],
    orderings: [
        {
            title: 'Display Order',
            name: 'orderAsc',
            by: [
                {field: 'order', direction: 'asc'}
            ]
        }
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
            order: 'order',
        },
        prepare(selection) {
            const {title, media, order} = selection
            return {
                title: title || 'Untitled Shape',
                subtitle: `Order: ${order ?? 'Not set'}`,
                media: media,
            }
        }
    }
}
