import { photo } from './photo'
import { photoCategory } from './photoCategory'
import { video } from './video'
import { videoCategory } from './videoCategory'
import { product } from './product'
import { event } from './event'
import { aboutPage } from './aboutPage'
import { contactPage } from './contactPage'
import { storePage } from './storePage'
import { eventsPage } from './eventsPage'
import { siteSettings } from './siteSettings'
import { bulkPhotos } from './bulkPhotos'

export const schemaTypes = [
  // Settings
  siteSettings,
  // Pages (singletons)
  aboutPage,
  contactPage,
  storePage,
  eventsPage,
  // Bulk upload
  bulkPhotos,
  // Categories
  photoCategory,
  videoCategory,
  // Content types
  photo,
  video,
  product,
  event,
]
