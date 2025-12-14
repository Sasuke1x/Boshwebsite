import { client } from '@/sanity/lib/client';
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await client.fetch(EVENT_BY_SLUG_QUERY, { slug });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <Link
          href="/photography/events"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Events</span>
        </Link>

        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            {/* Date */}
            {event.date && (
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-gray-700 max-w-3xl">{event.description}</p>
          )}
        </div>

        {/* Photos Grid */}
        {event.photos && event.photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.photos.map((photo: { asset: { url: string }; alt?: string; caption?: string }, index: number) => {
              // Optimize photo URL
              const photoUrl = `${photo.asset.url}?w=800&h=800&fit=crop&auto=format&q=85`;
              
              return (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg group"
                >
                  <Image
                    src={photoUrl}
                    alt={photo.alt || `Photo ${index + 1} from ${event.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index < 6 ? 'eager' : 'lazy'}
                    priority={index < 6}
                  />
                {/* Caption Overlay */}
                {photo.caption && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <p className="text-white text-center text-sm">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No photos in this event yet. Add photos in the{' '}
              <Link href="/studio" className="text-blue-600 hover:underline">
                CMS
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

