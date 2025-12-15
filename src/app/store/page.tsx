import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { PRODUCTS_QUERY, STORE_PAGE_QUERY } from '@/sanity/lib/queries';
import StoreClient from './StoreClient';

// Revalidate every 60 seconds to get fresh data
export const revalidate = 60;

export default async function StorePage() {
  // Fetch store page content and products from Sanity
  const [storePageContent, products] = await Promise.all([
    client.fetch(STORE_PAGE_QUERY),
    client.fetch(PRODUCTS_QUERY),
  ]);

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header Image */}
          {storePageContent?.headerImage?.asset?.url && (
            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-8">
              <Image
                src={storePageContent.headerImage.asset.url}
                alt={storePageContent.headerImage.alt || 'Store header'}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="text-center">
            <h1 className="text-3xl font-light mb-4">
              {storePageContent?.title || 'Store'}
            </h1>
            {storePageContent?.subtitle && (
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{storePageContent.subtitle}</p>
            )}
            <p className="text-gray-600">
              No products yet. Add some in the{' '}
              <Link href="/studio" className="text-blue-600 hover:underline">
                CMS
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Transform to match Product type
  const transformedProducts = products.map((product: { _id: string; title: string; description: string; price: number; stockQuantity: number; image: { asset: { url: string } }; category: string; size?: string; isAvailable?: boolean; paypalItemId?: string }) => ({
    id: product._id,
    title: product.title,
    description: product.description,
    price: product.price,
    stockQuantity: product.stockQuantity,
    imageUrl: product.image.asset.url,
    category: product.category,
    size: product.size,
    isAvailable: product.isAvailable ?? true,
    paypalItemId: product.paypalItemId,
  }));

  return <StoreClient products={transformedProducts} storePageContent={storePageContent} />;
}
