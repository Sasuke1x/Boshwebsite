"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from '@/types';

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ 
  photos, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrevious 
}) => {
  const currentPhoto = photos[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-white hover:text-gray-300 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {/* Navigation buttons */}
      <button
        onClick={onPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft size={48} />
      </button>

      <button
        onClick={onNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight size={48} />
      </button>

      {/* Main image */}
      <div className="relative max-w-6xl max-h-[90vh] mx-4">
        <Image
          src={currentPhoto.imageUrl}
          alt={currentPhoto.altText}
          width={currentPhoto.width}
          height={currentPhoto.height}
          className="max-w-full max-h-full object-contain"
          priority
        />
      </div>

      {/* Image info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white">
        <h2 className="text-lg font-medium mb-2">{currentPhoto.title}</h2>
        {currentPhoto.location && currentPhoto.year && (
          <p className="text-gray-300 text-sm">
            {currentPhoto.location}, {currentPhoto.year}
          </p>
        )}
        <p className="text-gray-400 text-xs mt-2">
          {currentIndex + 1} of {photos.length}
        </p>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default Lightbox;
