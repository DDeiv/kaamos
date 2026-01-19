import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import particleShape from './sanity_schemas/particleShape'
import archiveImage from './sanity_schemas/archiveImage'
import particleColors from './sanity_schemas/particleColors'
import siteSettings from './sanity_schemas/siteSettings'

export default defineConfig({
  name: 'default',
  title: 'Kaamos',

  projectId: '2z41erz0',
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool(),
  ],

  schema: {
    types: [
      particleShape,
      archiveImage,
      particleColors,
      siteSettings,
    ],
  },
})
