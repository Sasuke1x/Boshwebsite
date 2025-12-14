import { defineType, defineField } from 'sanity'
import { BasketIcon } from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number',
      description: 'Number of items available in stock. Leave at 0 or empty for unlimited/made-to-order.',
      initialValue: 0,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Print', value: 'print' },
          { title: 'Digital', value: 'digital' },
          { title: 'Package', value: 'package' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'e.g., "16" x 20"" (for prints)',
      hidden: ({ parent }) => parent?.category !== 'print',
    }),
    defineField({
      name: 'isAvailable',
      title: 'Available for Purchase',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'paypalItemId',
      title: 'PayPal Item ID',
      type: 'string',
      description: 'Unique identifier for PayPal integration',
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
      price: 'price',
      media: 'image',
      category: 'category',
      available: 'isAvailable',
      stock: 'stockQuantity',
    },
    prepare({ title, price, media, category, available, stock }) {
      const stockText = stock > 0 ? ` • ${stock} in stock` : '';
      return {
        title,
        subtitle: `$${price} • ${category}${!available ? ' • Unavailable' : ''}${stockText}`,
        media,
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
      title: 'Price (low to high)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
})

