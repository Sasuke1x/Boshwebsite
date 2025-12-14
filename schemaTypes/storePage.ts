import { defineField, defineType } from 'sanity';
import { PackageIcon } from '@sanity/icons';

export const storePage = defineType({
  name: 'storePage',
  title: 'Store Page',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Main heading for the store page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      description: 'Brief description or tagline for the store',
    }),
    defineField({
      name: 'headerImage',
      title: 'Header Image',
      type: 'image',
      description: 'Optional banner image for the store page',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'shippingInfo',
      title: 'Shipping Information',
      type: 'text',
      rows: 4,
      description: 'Details about shipping, delivery times, etc.',
    }),
    defineField({
      name: 'returnPolicy',
      title: 'Return Policy',
      type: 'text',
      rows: 4,
      description: 'Your return/refund policy',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'headerImage',
    },
  },
});

