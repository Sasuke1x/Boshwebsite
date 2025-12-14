"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Photo } from '@/types';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo, index: number) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set(prev).add(photoId));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      {/* Grid layout exactly like Chi Modu's - responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group cursor-pointer"
            onClick={() => onPhotoClick?.(photo, index)}
          >
            {/* Image container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-2">
              <Image
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.altText}
                fill
                className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                  loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(photo.id)}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={index < 6 ? 'eager' : 'lazy'}
                priority={index < 6}
              />
              
              {/* Loading skeleton */}
              {!loadedImages.has(photo.id) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </div>
            
            {/* Photo title with proper wrapping */}
            <h3 
              className="text-sm text-gray-800 font-normal line-clamp-2 min-h-[2.5rem]" 
              title={photo.title}
            >
              {photo.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
