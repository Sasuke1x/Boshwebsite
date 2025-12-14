import { defineType, defineField, defineArrayMember } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export const bulkPhotos = defineType({
  name: 'bulkPhotos',
  title: 'Bulk Photo Upload',
  type: 'document',
  icon: ImagesIcon,
  description: '📸 Upload multiple photos from one session. Set category and defaults once, then upload photos.',
  fields: [
    defineField({
      name: 'title',
      title: 'Upload Session Name',
      type: 'string',
      description: 'Give this upload session a name (e.g., "Event Photos - May 2024")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category for All Photos',
      type: 'reference',
      to: [{ type: 'photoCategory' }],
      description: 'All photos will be added to this category',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'defaultLocation',
      title: 'Default Location',
      type: 'string',
      description: 'Optional: Apply this location to all photos',
    }),
    defineField({
      name: 'defaultYear',
      title: 'Default Year',
      type: 'number',
      description: 'Optional: Apply this year to all photos',
    }),
    defineField({
      name: 'photos',
      title: 'Photos to Upload',
      type: 'array',
      description: '📌 HOW TO USE: Click "+ Add item" button multiple times (once for each photo you want to upload). Then click into each slot to upload and add details.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: '⚠️ Important for SEO - describe this image',
              validation: (rule) => rule.warning('Alt text is important for SEO and accessibility'),
            }),
            defineField({
              name: 'title',
              title: 'Photo Title',
              type: 'string',
              description: 'Optional: Custom title for this photo',
            }),
            defineField({
              name: 'location',
              title: 'Location Override',
              type: 'string',
              description: 'Leave blank to use default location',
            }),
            defineField({
              name: 'year',
              title: 'Year Override',
              type: 'number',
              description: 'Leave blank to use default year',
            }),
            defineField({
              name: 'featured',
              title: 'Featured',
              type: 'boolean',
              description: 'Show on homepage?',
              initialValue: false,
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'processed',
      title: 'Processed',
      type: 'boolean',
      description: 'Photos have been created',
      readOnly: true,
      hidden: true,
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.name',
    },
    prepare({ title, category }) {
      return {
        title,
        subtitle: category || 'No category selected',
      }
    },
  },
})

