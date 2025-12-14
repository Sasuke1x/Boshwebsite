import { client } from '@/sanity/lib/client';
import { ALL_EVENTS_QUERY, EVENTS_PAGE_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { Calendar, MapPin, Image as ImageIcon } from 'lucide-react';

export default async function EventsPage() {
  // Fetch events page content and all events
  const [eventsPageContent, events] = await Promise.all([
    client.fetch(EVENTS_PAGE_QUERY),
    client.fetch(ALL_EVENTS_QUERY),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header Image */}
        {eventsPageContent?.headerImage?.asset?.url && (
          <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-8">
            <Image
              src={eventsPageContent.headerImage.asset.url}
              alt={eventsPageContent.headerImage.alt || 'Events Photography'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title and Subtitle */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            {eventsPageContent?.title || 'Events Photography'}
          </h1>
          {eventsPageContent?.subtitle && (
            <p className="text-lg text-gray-600 mb-6">
              {eventsPageContent.subtitle}
            </p>
          )}
          {eventsPageContent?.description && (
            <div className="prose prose-gray max-w-none">
              <PortableText value={eventsPageContent.description} />
            </div>
          )}
        </div>

        {/* Empty State */}
        {(!events || events.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No events yet.
            </p>
            <p className="text-gray-600">
              Create events in the{' '}
              <Link href="/studio" className="text-blue-600 hover:underline">
                CMS
              </Link>{' '}
              to organize your event photography
            </p>
          </div>
        )}

        {/* Events Grid */}
        {events && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: { _id: string; title: string; slug: { current: string }; date?: string; location?: string; description?: string; coverImage: { asset: { url: string }; alt?: string }; photoCount?: number }, index: number) => {
              // Optimize cover image URL
              const coverImageUrl = `${event.coverImage.asset.url}?w=800&h=600&fit=crop&auto=format&q=85`;
              
              return (
                <Link
                  key={event._id}
                  href={`/photography/events/${event.slug}`}
                  className="group block"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Event Cover Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={coverImageUrl}
                        alt={event.coverImage.alt || event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading={index < 3 ? 'eager' : 'lazy'}
                        priority={index < 3}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Photo Count Badge */}
                      {event.photoCount && event.photoCount > 0 && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                          <ImageIcon size={14} />
                          <span>{event.photoCount}</span>
                        </div>
                      )}
                    </div>

                  {/* Event Info */}
                  <div className="p-4">
                    <h3 className="text-xl font-light text-gray-800 mb-2 group-hover:text-black transition-colors">
                      {event.title}
                    </h3>
                    
                    {/* Date */}
                    {event.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Calendar size={14} />
                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    )}

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}