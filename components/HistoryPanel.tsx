
import React from 'react';
import type { GeneratedImage, AppTab } from '../types';
import { ImageCard } from './ImageCard';
import { Icon } from './Icon';

interface HistoryPanelProps {
    history: GeneratedImage[];
    tab: AppTab;
    onSelectImage: (image: GeneratedImage) => void;
    onToggleFavorite: (id: string) => void;
    onDelete: (id: string) => void;
    onUseSettings: (settings: GeneratedImage['settings']) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, tab, onSelectImage, onToggleFavorite, onDelete, onUseSettings }) => {
    
    const filteredImages = tab === 'favorites' ? history.filter(img => img.isFavorite) : history;

    const EmptyState: React.FC<{title: string; message: string; icon: 'history' | 'favorite'}> = ({ title, message, icon}) => (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-dark-card/30 rounded-lg border-2 border-dashed border-dark-border p-8">
            <Icon name={icon} className="w-20 h-20 text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-gray-400 max-w-md">{message}</p>
        </div>
    );

    if (filteredImages.length === 0) {
        if (tab === 'history') {
            return <EmptyState title="No History Yet" message="Your generated images will be saved here for you to revisit." icon="history" />;
        }
        return <EmptyState title="No Favorites Yet" message="Click the heart icon on an image to save it here." icon="favorite" />;
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-1">
                {filteredImages.map(image => (
                    <ImageCard 
                        key={image.id}
                        image={image}
                        onSelect={onSelectImage}
                        onToggleFavorite={onToggleFavorite}
                        onDelete={onDelete}
                        onUseSettings={onUseSettings}
                        isHistory={true}
                    />
                ))}
            </div>
        </div>
    );
};
