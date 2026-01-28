export default {
    name: 'archiveImage',
    title: 'Archive Image',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Previous Work', value: 'previous-work' },
                    { title: 'Available Work', value: 'available-work' },
                ],
                layout: 'radio',
            },
            validation: Rule => Rule.required(),
        },
    ],
}
