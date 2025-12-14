import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { FEATURED_PHOTOS_QUERY } from '@/sanity/lib/queries';
import GalleryViewer from '@/components/gallery/GalleryViewer';

// Revalidate every 60 seconds to get fresh data
export const revalidate = 60;

export default async function Home() {
  // Fetch featured photos from Sanity
  const photos = await client.fetch(FEATURED_PHOTOS_QUERY);
  
  console.log('Homepage: Fetched', photos?.length || 0, 'featured photos from Sanity');

  // If no photos yet, show message
  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Boshnovart Portfolio</h1>
          <p className="text-gray-600">
            No photos yet. Add some featured photos in the{' '}
            <Link href="/studio" className="text-blue-600 hover:underline">
              CMS
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Transform Sanity data to match Photo type with optimized images
  const transformedPhotos = photos.map((photo: { _id: string; title: string; image: { asset: { url: string; metadata?: { dimensions?: { width: number; height: number } } }; alt?: string }; location?: string; year?: number; altText?: string; category?: { name: string }; categorySlug?: string }) => {
    const baseUrl = photo.image.asset.url;
    // For homepage full-screen viewer, use higher quality
    const optimizedUrl = `${baseUrl}?w=1920&auto=format&q=90`;
    
    return {
      id: photo._id,
      title: photo.title,
      imageUrl: optimizedUrl,
      thumbnailUrl: optimizedUrl,
      location: photo.location,
      year: photo.year,
      altText: photo.image.alt,
      category: photo.categorySlug,
      width: photo.image.asset.metadata?.dimensions?.width || 800,
      height: photo.image.asset.metadata?.dimensions?.height || 600,
    };
  });

  return (
    <div className="h-screen">
      <GalleryViewer photos={transformedPhotos} initialPhotoIndex={0} />
    </div>
  );
}