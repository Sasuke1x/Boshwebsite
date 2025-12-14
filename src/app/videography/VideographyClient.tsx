"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Video } from '@/types';

interface VideographyClientProps {
  videos: Video[];
}

export default function VideographyClient({ videos }: VideographyClientProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [failedThumbnails, setFailedThumbnails] = useState<Set<string>>(new Set());

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const handleThumbnailError = (videoId: string) => {
    setFailedThumbnails(prev => new Set(prev).add(videoId));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      {/* Larger grid layout for videos - responsive */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              {/* Larger video thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-gray-200 mb-3">
                {!failedThumbnails.has(video.id) ? (
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => handleThumbnailError(video.id)}
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <div className="text-center">
                      <Play size={48} className="text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">{video.title}</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play size={24} className="text-black ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              {/* Video title - like Chi Modu's photo titles */}
              <h3 className="text-sm text-gray-800 font-normal">
                {video.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal - Larger */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-6xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
              title={selectedVideo.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button 
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

