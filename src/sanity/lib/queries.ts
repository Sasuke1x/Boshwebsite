import { defineQuery } from 'next-sanity'

// Image fragment for reuse
const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height }
    }
  },
  alt,
  hotspot,
  crop
`

// Photo Categories
export const PHOTO_CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "photoCategory"] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    description
  }
`)

// Photos by category
export const PHOTOS_BY_CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "photo" && category->slug.current == $slug] | order(order asc, year desc) {
    _id,
    title,
    image {
      ${imageFragment}
    },
    location,
    year,
    description,
    featured
  }
`)

// Featured photos for homepage
export const FEATURED_PHOTOS_QUERY = defineQuery(/* groq */ `
  *[_type == "photo" && featured == true] | order(order asc) {
    _id,
    title,
    image {
      ${imageFragment}
    },
    location,
    year,
    "categorySlug": category->slug.current
  }
`)

// Video Categories
export const VIDEO_CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "videoCategory"] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    description
  }
`)

// Videos by category
export const VIDEOS_BY_CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "video" && category->slug.current == $slug] | order(order asc, year desc) {
    _id,
    title,
    youtubeId,
    description,
    year,
    duration,
    featured
  }
`)

// Featured videos for homepage
export const FEATURED_VIDEOS_QUERY = defineQuery(/* groq */ `
  *[_type == "video" && featured == true] | order(order asc) [0...3] {
    _id,
    title,
    youtubeId,
    description,
    duration,
    "categorySlug": category->slug.current
  }
`)

// All products
export const PRODUCTS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && isAvailable == true] | order(order asc, price asc) {
    _id,
    title,
    description,
    price,
    stockQuantity,
    image {
      ${imageFragment}
    },
    category,
    size,
    paypalItemId
  }
`)

// Products by category
export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && category == $category && isAvailable == true] | order(order asc, price asc) {
    _id,
    title,
    description,
    price,
    image {
      ${imageFragment}
    },
    category,
    size,
    paypalItemId
  }
`)

// Site settings
export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    email,
    phone,
    sidebarLogo {
      ${imageFragment}
    },
    sidebarLogoText,
    instagramUrl,
    youtubeUrl,
    twitterUrl,
    linkedinUrl
  }
`)

// Page content
export const ABOUT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "aboutPage"][0] {
    title,
    bio,
    profileImage {
      ${imageFragment}
    },
    services,
    recognition
  }
`)

export const CONTACT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "contactPage"][0] {
    title,
    introText,
    email,
    phone,
    responseTime
  }
`)

export const STORE_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "storePage"][0] {
    title,
    subtitle,
    headerImage {
      ${imageFragment}
    },
    shippingInfo,
    returnPolicy
  }
`)

export const EVENTS_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "eventsPage"][0] {
    title,
    subtitle,
    headerImage {
      ${imageFragment}
    },
    description
  }
`)

// All events (for events listing page)
export const ALL_EVENTS_QUERY = defineQuery(/* groq */ `
  *[_type == "event"] | order(featured desc, date desc) {
    _id,
    title,
    "slug": slug.current,
    date,
    location,
    description,
    coverImage {
      ${imageFragment}
    },
    featured,
    "photoCount": count(photos)
  }
`)

// Single event by slug (for individual event page)
export const EVENT_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    date,
    location,
    description,
    coverImage {
      ${imageFragment}
    },
    photos[] {
      ${imageFragment},
      caption
    }
  }
`)

// All photos (for photography page)
export const ALL_PHOTOS_QUERY = defineQuery(/* groq */ `
  *[_type == "photo"] | order(featured desc, order asc, year desc) {
    _id,
    title,
    image {
      ${imageFragment}
    },
    location,
    year,
    description,
    featured,
    "categoryName": category->name,
    "categorySlug": category->slug.current
  }
`)

// All videos (for videography page)
export const ALL_VIDEOS_QUERY = defineQuery(/* groq */ `
  *[_type == "video"] | order(featured desc, order asc, year desc) {
    _id,
    title,
    youtubeId,
    description,
    year,
    duration,
    featured,
    "categoryName": category->name,
    "categorySlug": category->slug.current
  }
`)

