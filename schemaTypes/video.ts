import { defineType, defineField } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video URL or ID',
      type: 'string',
      description: 'Paste the full YouTube URL (e.g., https://youtu.be/7Dh9ux5XnPs) or just the ID (e.g., 7Dh9ux5XnPs)',
      validation: (rule) => rule.required().custom((value) => {
        if (!value) return 'YouTube URL or ID is required'
        
        // Extract ID from various YouTube URL formats
        const patterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
          /^([a-zA-Z0-9_-]{11})$/, // Direct ID format
        ]
        
        const match = patterns.some(pattern => pattern.test(value))
        return match || 'Please enter a valid YouTube URL or ID'
      }),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'videoCategory' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) =>
        rule.min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "3:42" or "15:20"',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'duration',
      category: 'category.name',
    },
    prepare({ title, subtitle, category }) {
      return {
        title,
        subtitle: `${category || 'Uncategorized'}${subtitle ? ` • ${subtitle}` : ''}`,
        media: PlayIcon,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Year (newest first)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
})

