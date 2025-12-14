import { defineConfig, definePlugin } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { UploadIcon, TrashIcon, StarIcon } from '@sanity/icons'
import { BulkUploadTool } from './sanity/components/BulkUploadTool'
import { BulkDeleteTool } from './sanity/components/BulkDeleteTool'
import { BulkFeatureTool } from './sanity/components/BulkFeatureTool'

// Import schemas
import { photo } from './schemaTypes/photo'
import { photoCategory } from './schemaTypes/photoCategory'
import { video } from './schemaTypes/video'
import { videoCategory } from './schemaTypes/videoCategory'
import { product } from './schemaTypes/product'
import { event } from './schemaTypes/event'
import { aboutPage } from './schemaTypes/aboutPage'
import { contactPage } from './schemaTypes/contactPage'
import { storePage } from './schemaTypes/storePage'
import { eventsPage } from './schemaTypes/eventsPage'
import { siteSettings } from './schemaTypes/siteSettings'
import { bulkPhotos } from './schemaTypes/bulkPhotos'

// Define custom bulk upload tool as a plugin
const bulkUploadPlugin = definePlugin({
  name: 'bulk-upload-tool',
  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'bulk-upload',
        title: 'Bulk Upload',
        component: BulkUploadTool,
        icon: UploadIcon,
      },
    ]
  },
})

// Define custom bulk delete tool as a plugin
const bulkDeletePlugin = definePlugin({
  name: 'bulk-delete-tool',
  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'bulk-delete',
        title: 'Bulk Delete',
        component: BulkDeleteTool,
        icon: TrashIcon,
      },
    ]
  },
})

// Define custom bulk feature tool as a plugin
const bulkFeaturePlugin = definePlugin({
  name: 'bulk-feature-tool',
  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'bulk-feature',
        title: 'Bulk Feature',
        component: BulkFeatureTool,
        icon: StarIcon,
      },
    ]
  },
})

export default defineConfig({
  name: 'default',
  title: 'Boshnovart Portfolio',

  projectId: 'u1jfi7ga',
  dataset: 'production',

  basePath: '/studio',

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft',
        },
      },
    }),
    bulkUploadPlugin(),
    bulkDeletePlugin(),
    bulkFeaturePlugin(),
  ],

  schema: {
    types: [siteSettings, aboutPage, contactPage, storePage, eventsPage, bulkPhotos, photoCategory, videoCategory, photo, video, product, event],
  },
})

