# Sanity CMS Schema Setup

This directory contains Sanity schema definitions for managing dynamic content in the application.

## Schemas

### 1. `particleShape.js` - Particle Animation Shapes
Controls the shapes that particles morph into during the background animation.

**Fields:**
- **title**: Name for the shape (e.g., "Circle", "Star")
- **image**: Shape image (PNG with transparency recommended)
- **order**: Display order in morphing sequence (0, 1, 2, etc.)

**Usage:**
1. In your Sanity Studio, create a new "Particle Shape" document
2. Upload an image (the particle system samples points from this image)
3. Set the order number to control sequence
4. Publish the document

### 2. `archiveImage.js` - Archive Gallery Images
Controls the images displayed in the scrollable archive section.

**Fields:**
- **title**: Image title/description
- **image**: The image file to display

**Usage:**
1. In your Sanity Studio, create a new "Archive Image" document
2. Upload your image
3. Add a title
4. Publish the document

## Integrating Schemas into Sanity Studio

To use these schemas in your Sanity Studio, you need to import and register them in your Sanity configuration.

### Example `sanity.config.js`:

```javascript
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import particleShape from './sanity_schemas/particleShape'
import archiveImage from './sanity_schemas/archiveImage'

export default defineConfig({
  name: 'default',
  title: 'Your Project Name',

  projectId: 'your-project-id',
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool(),
  ],

  schema: {
    types: [
      particleShape,
      archiveImage,
    ],
  },
})
```

## Client Configuration

Update `src/sanityClient.js` with your actual Sanity project credentials:

```javascript
export const client = createClient({
    projectId: 'your-actual-project-id', // Get from sanity.io
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-05-03',
})
```

## Fallback Behavior

Both components (particle animation and archive) include fallback behavior:
- **Particle Animation**: Falls back to local images in `/public/shapes/` if Sanity data unavailable
- **Archive**: Falls back to mock data (placeholder images) if Sanity data unavailable

This ensures the app works even if Sanity isn't configured or has connection issues.
