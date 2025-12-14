import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disabled CDN for fresh data
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})

