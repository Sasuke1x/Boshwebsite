import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introText',
      title: 'Introduction Text',
      type: 'text',
      rows: 3,
      description: 'The text that appears at the top of the contact page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'e.g., +1 (555) 123-4567',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Just the username, e.g., "boshnovart"',
    }),
    defineField({
      name: 'youtubeHandle',
      title: 'YouTube Channel',
      type: 'string',
      description: 'Just the channel name or @handle',
    }),
    defineField({
      name: 'responseTime',
      title: 'Response Time Message',
      type: 'string',
      initialValue: 'I typically respond to inquiries within 24 hours.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page Content',
      }
    },
  },
})

