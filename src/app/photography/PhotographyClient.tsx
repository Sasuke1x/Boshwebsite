"use client";

import { useState } from 'react';
import PhotoGrid from '@/components/gallery/PhotoGrid';
import Lightbox from '@/components/gallery/Lightbox';
import { Photo } from '@/types';

interface PhotographyClientProps {
  photos: Photo[];
}

export default function PhotographyClient({ photos }: PhotographyClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleNextPhoto = () => {
    const nextIndex = (selectedIndex + 1) % photos.length;
    setSelectedIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  };

  const handlePreviousPhoto = () => {
    const prevIndex = selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;
    setSelectedIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  };

  return (
    <>
      <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
      
      {selectedPhoto && (
        <Lightbox
          photos={photos}
          currentIndex={selectedIndex}
          onClose={handleCloseLightbox}
          onNext={handleNextPhoto}
          onPrevious={handlePreviousPhoto}
        />
      )}
    </>
  );
}

