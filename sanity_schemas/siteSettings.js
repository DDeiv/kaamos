export default {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        {
            name: 'location',
            title: 'Current Location',
            type: 'string',
            description: 'The city shown in "CURRENTLY POKING IN: ___"',
        },
        {
            name: 'locationLink',
            title: 'Location Link',
            type: 'url',
            description: 'URL to open when the location button is clicked (opens in new tab)',
        },
    ],
}
