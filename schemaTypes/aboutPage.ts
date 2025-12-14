import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'About',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Main bio paragraphs - will appear on the right side',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of services you offer',
    }),
    defineField({
      name: 'recognition',
      title: 'Recognition & Awards',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of awards, features, exhibitions',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page Content',
      }
    },
  },
})

