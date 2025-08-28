
import React from 'react';
import { GeneratedImage } from '../types';
import { ImageCard } from './ImageCard';
import { Loader } from './Loader';
import { Icon } from './Icon';

interface GalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
  onSelectImage: (image: GeneratedImage) => void;
  onToggleFavorite: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, isLoading, onSelectImage, onToggleFavorite }) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-dark-card/30 rounded-lg border-2 border-dashed border-dark-border">
        <Loader size="lg" />
        <p className="mt-4 text-lg font-semibold text-gray-300">Generating your masterpiece...</p>
        <p className="text-sm text-gray-500">This can take a few moments.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center bg-dark-card/30 rounded-lg border-2 border-dashed border-dark-border p-8">
        <Icon name="gallery" className="w-20 h-20 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white">Let's Create Something Amazing</h2>
        <p className="mt-2 text-gray-400 max-w-md">Your generated images will appear here. Use the controls on the left to start your first creation.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-1">
        {images.map((image) => (
            <ImageCard 
                key={image.id} 
                image={image} 
                onSelect={onSelectImage}
                onToggleFavorite={onToggleFavorite}
            />
        ))}
        </div>
    </div>
  );
};
