import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries';
import ContactClient from './ContactClient';

// Revalidate every 60 seconds to get fresh data
export const revalidate = 60;

export default async function ContactPage() {
  // Fetch Contact page content and Site Settings from Sanity
  const [contactData, siteSettings] = await Promise.all([
    client.fetch(CONTACT_PAGE_QUERY),
    client.fetch(SITE_SETTINGS_QUERY).catch(() => null),
  ]);

  // If no content in CMS, show placeholder message
  if (!contactData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Contact Page</h1>
          <p className="text-gray-600">
            No content yet. Add your Contact page content in the{' '}
            <Link href="/studio" className="text-blue-600 hover:underline">
              CMS
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return <ContactClient contactData={contactData} siteSettings={siteSettings} />;
}
