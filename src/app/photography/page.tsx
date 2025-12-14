import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { PHOTO_CATEGORIES_QUERY } from '@/sanity/lib/queries';
import PhotographyClient from './PhotographyClient';

export default async function PhotographyPage() {
  // Fetch all photos and categories from Sanity
  const categories = await client.fetch(PHOTO_CATEGORIES_QUERY);

  // Get all photos across all categories
  const allPhotosQuery = `*[_type == "photo"] | order(order asc, year desc) {
    _id,
    title,
    image {
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
    },
    location,
    year,
    description,
    "categorySlug": category->slug.current
  }`;

  const photos = await client.fetch(allPhotosQuery);

  // Transform to match Photo type with optimized images
  const transformedPhotos = photos.map((photo: { _id: string; title: string; image: { asset: { url: string; metadata?: { dimensions?: { width: number; height: number } } }; alt?: string }; location?: string; year?: number; categorySlug?: string; description?: string }) => {
    const baseUrl = photo.image.asset.url;
    // Create optimized thumbnail URL (800px wide, auto format, quality 85)
    const thumbnailUrl = `${baseUrl}?w=800&h=600&fit=crop&auto=format&q=85`;
    // Full size for lightbox (max 1920px wide)
    const fullUrl = `${baseUrl}?w=1920&auto=format&q=90`;
    
    return {
      id: photo._id,
      title: photo.title,
      imageUrl: fullUrl,
      thumbnailUrl: thumbnailUrl,
      location: photo.location,
      year: photo.year,
      altText: photo.image.alt,
      description: photo.description,
      category: photo.categorySlug,
      width: photo.image.asset.metadata?.dimensions?.width || 800,
      height: photo.image.asset.metadata?.dimensions?.height || 600,
    };
  });

  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Photography Gallery</h1>
          <p className="text-gray-600">
            No photos yet. Add some in the{' '}
            <Link href="/studio" className="text-blue-600 hover:underline">
              CMS
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return <PhotographyClient photos={transformedPhotos} />;
}
