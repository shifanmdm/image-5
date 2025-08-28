
import React, { useState, useEffect, useCallback } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { ImageModal } from './components/ImageModal';
import { GenerationSettings, GeneratedImage, AppTab } from './types';
import { generateImages, enhancePrompt } from './services/geminiService';
import { Toaster, toast } from './components/Toaster';
import { HistoryPanel } from './components/HistoryPanel';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GenerationSettings>({
    prompt: '',
    stylePreset: 'photorealistic',
    aspectRatio: '1:1',
    numImages: 1,
    outputFormat: 'image/jpeg',
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('generate');

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('generationHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      toast.error("Could not load generation history.");
    }
  }, []);

  const saveHistory = useCallback((newHistory: GeneratedImage[]) => {
    try {
      setHistory(newHistory);
      localStorage.setItem('generationHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
      toast.error("Could not save generation history.");
    }
  }, []);

  const handleGenerate = async () => {
    if (!settings.prompt.trim()) {
      toast.error('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setGeneratedImages([]);
    try {
      const results = await generateImages(settings);
      const newImages: GeneratedImage[] = results.map(base64 => ({
        id: `img_${Date.now()}_${Math.random()}`,
        base64,
        prompt: settings.prompt,
        settings: { ...settings },
        isFavorite: false,
        createdAt: new Date().toISOString(),
      }));
      setGeneratedImages(newImages);
      saveHistory([...newImages, ...history]);
      setActiveTab('generate');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Image generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!settings.prompt.trim()) {
        toast.error('Please enter a prompt to enhance.');
        return;
    }
    setIsEnhancing(true);
    try {
        const enhanced = await enhancePrompt(settings.prompt);
        setSettings(prev => ({ ...prev, prompt: enhanced }));
        toast.success('Prompt enhanced successfully!');
    } catch (error) {
        console.error('Prompt enhancement failed:', error);
        toast.error('Failed to enhance prompt.');
    } finally {
        setIsEnhancing(false);
    }
  };


  const handleToggleFavorite = (id: string) => {
    const newHistory = history.map(img =>
      img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
    );
    saveHistory(newHistory);
    // Also update current gallery if the image is there
    setGeneratedImages(prev => prev.map(img => 
      img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
    ));
    if (selectedImage?.id === id) {
      setSelectedImage(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };
  
  const handleDeleteFromHistory = (id: string) => {
    const newHistory = history.filter(img => img.id !== id);
    saveHistory(newHistory);
    toast.success("Image removed from history.");
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 flex flex-col lg:flex-row">
      <Toaster />
      <ControlsPanel
        settings={settings}
        setSettings={setSettings}
        onGenerate={handleGenerate}
        onEnhance={handleEnhancePrompt}
        isLoading={isLoading}
        isEnhancing={isEnhancing}
      />
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'generate' && (
          <Gallery
            images={generatedImages}
            isLoading={isLoading}
            onSelectImage={setSelectedImage}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {activeTab !== 'generate' && (
           <HistoryPanel 
            history={history}
            tab={activeTab}
            onSelectImage={setSelectedImage} 
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteFromHistory}
            onUseSettings={(s) => {
              setSettings(s);
              setActiveTab('generate');
              toast.info("Settings loaded. You can now generate a new image.");
            }}
          />
        )}
      </main>
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
};

export default App;
