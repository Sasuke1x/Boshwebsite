import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { ABOUT_PAGE_QUERY } from '@/sanity/lib/queries';
import { PortableText } from 'next-sanity';

// Revalidate every 60 seconds to get fresh data
export const revalidate = 60;

export default async function AboutPage() {
  // Fetch About page content from Sanity
  const aboutData = await client.fetch(ABOUT_PAGE_QUERY);

  // If no content in CMS, show placeholder message
  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">About Page</h1>
          <p className="text-gray-600">
            No content yet. Add your About page content in the{' '}
            <Link href="/studio" className="text-blue-600 hover:underline">
              CMS
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Simple layout inspired by Chi Modu's minimal approach - responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          {aboutData.profileImage?.asset?.url ? (
            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
              <Image
                src={aboutData.profileImage.asset.url}
                alt={aboutData.profileImage.alt || aboutData.title || 'Profile'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="relative aspect-[4/5] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No profile image yet</p>
            </div>
          )}

          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-2xl font-light text-gray-800">{aboutData.title}</h1>
            
            <div className="prose prose-sm text-gray-700 leading-relaxed space-y-4">
              <PortableText value={aboutData.bio} />

              {aboutData.services && aboutData.services.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Services</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {aboutData.services.map((service: string, index: number) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aboutData.recognition && aboutData.recognition.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Recognition</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {aboutData.recognition.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
