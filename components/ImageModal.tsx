
import React, { useState, useMemo } from 'react';
import type { GeneratedImage } from '../types';
import { Icon } from './Icon';

interface ImageModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

const FilterButton: React.FC<{ name: string; onClick: () => void; isActive: boolean }> = ({ name, onClick, isActive }) => (
    <button onClick={onClick} className={`px-3 py-1 text-xs rounded-full transition-colors ${isActive ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{name}</button>
);

const AdjustmentSlider: React.FC<{ name: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-xs text-gray-400 capitalize">{name}</label>
        <input type="range" min="0" max="200" value={value} onChange={onChange} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary" />
    </div>
);


export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onToggleFavorite }) => {
    const [activeFilter, setActiveFilter] = useState('none');
    const [adjustments, setAdjustments] = useState({ brightness: 100, contrast: 100, saturate: 100 });

    const handleAdjustmentChange = (type: keyof typeof adjustments) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdjustments(prev => ({ ...prev, [type]: parseInt(e.target.value, 10) }));
        setActiveFilter('custom');
    };
    
    const applyFilter = (filter: string) => {
        setActiveFilter(filter);
        switch(filter) {
            case 'grayscale': setAdjustments({ brightness: 100, contrast: 100, saturate: 0 }); break;
            case 'sepia': setAdjustments({ brightness: 90, contrast: 120, saturate: 150 }); break;
            case 'vibrant': setAdjustments({ brightness: 110, contrast: 110, saturate: 150 }); break;
            case 'none':
            default: setAdjustments({ brightness: 100, contrast: 100, saturate: 100 });
        }
    };
    
    const imageStyle = useMemo(() => ({
        filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturate}%) ${activeFilter === 'sepia' ? 'sepia(1)' : ''} ${activeFilter === 'grayscale' ? 'grayscale(1)' : ''}`
    }), [adjustments, activeFilter]);


    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:${image.settings.outputFormat};base64,${image.base64}`;
        link.download = `aetherlens_${image.id}.${image.settings.outputFormat === 'image/jpeg' ? 'jpg' : 'png'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col lg:flex-row gap-4" onClick={e => e.stopPropagation()}>
            {/* Image display */}
            <div className="flex-1 flex items-center justify-center bg-black/50 rounded-lg overflow-hidden">
                <img src={`data:image/png;base64,${image.base64}`} alt={image.prompt} className="max-w-full max-h-full object-contain transition-all duration-300" style={imageStyle}/>
            </div>
            
            {/* Control Panel */}
            <div className="w-full lg:w-80 bg-dark-card rounded-lg p-6 flex flex-col space-y-4 overflow-y-auto">
                <div>
                    <h3 className="text-lg font-bold">Details</h3>
                    <p className="text-sm text-gray-400 mt-2 bg-gray-900/50 p-3 rounded-md">{image.prompt}</p>
                </div>
                
                <div className="space-y-2 text-xs text-gray-300">
                    <p><strong>Style:</strong> {image.settings.stylePreset}</p>
                    <p><strong>Aspect Ratio:</strong> {image.settings.aspectRatio}</p>
                    <p><strong>Generated:</strong> {new Date(image.createdAt).toLocaleString()}</p>
                </div>

                <div className="pt-4 border-t border-dark-border">
                    <h4 className="text-md font-semibold mb-3">Filters & Adjustments</h4>
                     <div className="flex flex-wrap gap-2 mb-4">
                        <FilterButton name="None" onClick={() => applyFilter('none')} isActive={activeFilter === 'none'}/>
                        <FilterButton name="Vibrant" onClick={() => applyFilter('vibrant')} isActive={activeFilter === 'vibrant'}/>
                        <FilterButton name="Grayscale" onClick={() => applyFilter('grayscale')} isActive={activeFilter === 'grayscale'}/>
                        <FilterButton name="Sepia" onClick={() => applyFilter('sepia')} isActive={activeFilter === 'sepia'}/>
                    </div>
                    <div className="space-y-3">
                       <AdjustmentSlider name="brightness" value={adjustments.brightness} onChange={handleAdjustmentChange('brightness')} />
                       <AdjustmentSlider name="contrast" value={adjustments.contrast} onChange={handleAdjustmentChange('contrast')} />
                       <AdjustmentSlider name="saturate" value={adjustments.saturate} onChange={handleAdjustmentChange('saturate')} />
                    </div>
                </div>

                <div className="flex-grow"></div>

                <div className="flex items-center gap-2 pt-4 border-t border-dark-border">
                    <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
                        <Icon name="download" className="w-5 h-5"/> Download
                    </button>
                    <button onClick={() => onToggleFavorite(image.id)} className={`p-2.5 rounded-lg transition-colors ${image.isFavorite ? 'bg-accent text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                         <Icon name="favoriteFill" className={`w-5 h-5 ${image.isFavorite ? 'text-white' : 'text-transparent'}`} style={{ stroke: 'white', strokeWidth: 2 }} />
                    </button>
                </div>
            </div>
            
            <button onClick={onClose} className="absolute -top-3 -right-3 w-8 h-8 bg-dark-card rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-dark-border">
                <Icon name="close" className="w-5 h-5"/>
            </button>
        </div>
    </div>
  );
};
