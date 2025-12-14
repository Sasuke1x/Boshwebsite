import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import VideographyClient from './VideographyClient';

// Helper function to extract YouTube ID from URL or return the ID itself
function extractYouTubeId(input: string): string {
  if (!input) return '';
  
  // If it's already just an ID (11 characters, alphanumeric with dashes/underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }
  
  // Extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&?/]+)/,
    /(?:youtu\.be\/)([^&?/]+)/,
    /(?:youtube\.com\/embed\/)([^&?/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If nothing matched, return original (might be a malformed ID)
  return input;
}

export default async function VideographyPage() {
  // Fetch all videos from Sanity
  const videosQuery = `*[_type == "video"] | order(order asc, year desc) {
    _id,
    title,
    youtubeId,
    description,
    year,
    duration,
    "categorySlug": category->slug.current
  }`;

  const videos = await client.fetch(videosQuery);

  if (!videos || videos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Videography</h1>
          <p className="text-gray-600">
            No videos yet. Add some in the{' '}
            <Link href="/studio" className="text-blue-600 hover:underline">
              CMS
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Transform to match Video type
  const transformedVideos = videos.map((video: { _id: string; title: string; youtubeId: string; description?: string; year?: number; duration?: string; categorySlug?: string }) => {
    const cleanId = extractYouTubeId(video.youtubeId);
    return {
      id: video._id,
      title: video.title,
      youtubeId: cleanId,
      // Use hqdefault which is more reliable (exists for all videos)
      thumbnailUrl: `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`,
      description: video.description,
      year: video.year,
      duration: video.duration,
      category: video.categorySlug,
    };
  });

  return <VideographyClient videos={transformedVideos} />;
}
