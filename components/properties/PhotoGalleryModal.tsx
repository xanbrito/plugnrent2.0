'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface PhotoGalleryModalProps {
  photos: Array<{ id: string; url: string; category?: string }>;
  initialIndex?: number;
  onClose: () => void;
}

export default function PhotoGalleryModal({
  photos,
  initialIndex = 0,
  onClose,
}: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const previousPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            onClick={previousPhoto}
            className="absolute left-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Photo */}
        <div className="max-w-7xl max-h-full">
          <Image
            src={currentPhoto.url}
            alt={`Foto ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            onClick={nextPhoto}
            className="absolute right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-blue-500 scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo.url}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
}




