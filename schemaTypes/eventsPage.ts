import { defineType, defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events Page',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Events Photography',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      description: 'Short introductory text for the events page',
    }),
    defineField({
      name: 'headerImage',
      title: 'Header Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Additional information about events photography services (shown above event folders)',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Events Page Content',
      }
    },
  },
})

