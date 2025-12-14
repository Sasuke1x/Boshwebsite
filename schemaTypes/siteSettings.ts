import { defineType, defineField } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Your site/brand name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of your site (for SEO)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
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
      name: 'sidebarLogo',
      title: 'Sidebar Logo/Image',
      type: 'image',
      description: 'Small logo or image to display in the sidebar footer (optional)',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the logo for accessibility',
        }),
      ],
    }),
    defineField({
      name: 'sidebarLogoText',
      title: 'Sidebar Logo Text',
      type: 'string',
      description: 'Text to display if no logo image is uploaded (e.g., "BOSH")',
      initialValue: 'BOSH',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: 'Full Instagram profile URL (e.g., https://instagram.com/boshnovart)',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Full YouTube channel URL (e.g., https://www.youtube.com/@novARTFilms)',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter/X URL',
      type: 'url',
      description: 'Full Twitter/X profile URL',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Full LinkedIn profile URL',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      };
    },
  },
});

