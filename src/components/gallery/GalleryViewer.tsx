"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from '@/types';

interface GalleryViewerProps {
  photos: Photo[];
  initialPhotoIndex?: number;
}

const GalleryViewer: React.FC<GalleryViewerProps> = ({ 
  photos, 
  initialPhotoIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);
  const currentPhoto = photos[currentIndex];

  // Calculate which 6 thumbnails to show based on current index
  const getVisibleThumbnails = () => {
    const visibleCount = 6;
    let startIndex = Math.max(0, currentIndex - Math.floor(visibleCount / 2));
    
    // Adjust if we're near the end
    if (startIndex + visibleCount > photos.length) {
      startIndex = Math.max(0, photos.length - visibleCount);
    }
    
    return photos.slice(startIndex, startIndex + visibleCount);
  };

  const visibleThumbnails = getVisibleThumbnails();
  const firstVisibleIndex = photos.indexOf(visibleThumbnails[0]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const goToPhoto = (index: number) => {
    setCurrentIndex(index);
  };

  if (!currentPhoto) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content Area - Fixed height to prevent overlap */}
      <div className="flex-1 relative bg-white flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Main Image - Much smaller, Chi Modu size */}
        <div className="relative" style={{ maxWidth: '400px', maxHeight: '400px' }}>
          <Image
            src={currentPhoto.imageUrl}
            alt={currentPhoto.altText}
            width={400}
            height={400}
            className="object-contain"
            style={{ maxWidth: '400px', maxHeight: '400px' }}
            priority
          />
        </div>

        {/* Image Info - positioned below image */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-sm text-gray-700">
          <h2 className="font-medium mb-1">{currentPhoto.title}</h2>
          {currentPhoto.location && currentPhoto.year && (
            <p className="text-gray-500">
              {currentPhoto.title} - {currentPhoto.location}, {currentPhoto.year}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail Carousel - Shows only 6 thumbnails at a time */}
      <div className="bg-white border-t border-gray-100 py-3 flex-shrink-0">
        <div className="flex justify-center gap-1 px-4">
          {visibleThumbnails.map((photo, idx) => {
            const actualIndex = firstVisibleIndex + idx;
            return (
              <button
                key={photo.id}
                onClick={() => goToPhoto(actualIndex)}
                className={`relative w-10 h-10 flex-shrink-0 overflow-hidden ${
                  actualIndex === currentIndex ? 'ring-1 ring-black' : 'opacity-60 hover:opacity-100'
                } transition-all duration-300`}
              >
                <Image
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.altText}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </button>
            );
          })}
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="text-center py-1 text-xs text-gray-500 bg-white flex-shrink-0">
        All Images Copyright{' '}
        <a href="/about" className="underline hover:text-gray-700">
          BOSHAnovART
        </a>
      </div>
    </div>
  );
};

export default GalleryViewer;
