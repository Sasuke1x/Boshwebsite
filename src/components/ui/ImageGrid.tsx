"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Photo } from '@/types';

interface ImageGridProps {
  photos: Photo[];
  columns?: 2 | 3 | 4;
  onImageClick?: (photo: Photo, index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ 
  photos, 
  columns = 3, 
  onImageClick 
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set(prev).add(photoId));
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group cursor-pointer"
          onClick={() => onImageClick?.(photo, index)}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
            <Image
              src={photo.thumbnailUrl || photo.imageUrl}
              alt={photo.altText}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(photo.id)}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            {/* Loading skeleton */}
            {!loadedImages.has(photo.id) && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {/* Image info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-medium text-sm">{photo.title}</h3>
              {photo.location && (
                <p className="text-xs text-gray-300 mt-1">{photo.location}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGrid;
