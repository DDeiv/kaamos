export default {
  name: 'particleColors',
  title: 'Particle Colors',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name for this color scheme (e.g., "Red Yellow Black")',
      validation: Rule => Rule.required()
    },
    {
      name: 'color1',
      title: 'Color 1 (Slow particles)',
      type: 'string',
      description: 'First color in the gradient (hex code, e.g., #CB0705)',
      validation: Rule => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false
      }).error('Must be a valid hex color (e.g., #CB0705)')
    },
    {
      name: 'color2',
      title: 'Color 2 (Medium particles)',
      type: 'string',
      description: 'Second color in the gradient (hex code, e.g., #D7FF00)',
      validation: Rule => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false
      }).error('Must be a valid hex color (e.g., #D7FF00)')
    },
    {
      name: 'color3',
      title: 'Color 3 (Fast particles)',
      type: 'string',
      description: 'Third color in the gradient (hex code, e.g., #000000)',
      validation: Rule => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false
      }).error('Must be a valid hex color (e.g., #000000)')
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Use this color scheme (only one should be active)',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      color1: 'color1',
      color2: 'color2',
      color3: 'color3'
    },
    prepare(selection) {
      const { title, active, color1, color2, color3 } = selection
      return {
        title: title,
        subtitle: active ? `✓ Active - ${color1} ${color2} ${color3}` : `Inactive - ${color1} ${color2} ${color3}`
      }
    }
  }
}
