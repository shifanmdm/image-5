
import React from 'react';
import type { GeneratedImage } from '../types';
import { Icon } from './Icon';

interface ImageCardProps {
  image: GeneratedImage;
  onSelect: (image: GeneratedImage) => void;
  onToggleFavorite: (id: string) => void;
  onDelete?: (id: string) => void;
  onUseSettings?: (settings: GeneratedImage['settings']) => void;
  isHistory?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onSelect, onToggleFavorite, onDelete, onUseSettings, isHistory = false }) => {
    
    const stopPropagation = <T,>(fn: (arg: T) => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        fn(image.id as T);
    };

    const handleUseSettings = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(onUseSettings) onUseSettings(image.settings);
    }
    
    return (
        <div className="group relative aspect-square bg-dark-card rounded-lg overflow-hidden cursor-pointer shadow-lg" onClick={() => onSelect(image)}>
            <img src={`data:image/png;base64,${image.base64}`} alt={image.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-end gap-2">
                    {isHistory && onUseSettings && (
                        <button onClick={handleUseSettings} className="p-2 bg-secondary/80 hover:bg-secondary rounded-full text-white transition-colors duration-200 transform hover:scale-110">
                            <Icon name="reuse" className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={stopPropagation(onToggleFavorite)} className={`p-2 rounded-full text-white transition-colors duration-200 transform hover:scale-110 ${image.isFavorite ? 'bg-accent/80 hover:bg-accent' : 'bg-white/20 hover:bg-white/40'}`}>
                        <Icon name="favoriteFill" className={`w-5 h-5 ${image.isFavorite ? 'text-white' : 'text-transparent'}`} style={{ stroke: 'white', strokeWidth: 2 }} />
                    </button>
                    {isHistory && onDelete && (
                         <button onClick={stopPropagation(onDelete)} className="p-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white transition-colors duration-200 transform hover:scale-110">
                            <Icon name="delete" className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <p className="text-xs text-white line-clamp-3">{image.prompt}</p>
            </div>
        </div>
    );
};
