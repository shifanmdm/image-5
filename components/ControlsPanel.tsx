
import React from 'react';
import type { GenerationSettings } from '../types';
import { STYLE_PRESETS, ASPECT_RATIOS, PROMPT_TEMPLATES } from '../constants';
import { Loader } from './Loader';
import { Icon } from './Icon';

interface ControlsPanelProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  onGenerate: () => void;
  onEnhance: () => void;
  isLoading: boolean;
  isEnhancing: boolean;
}

const ControlSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
    {children}
  </div>
);

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  settings,
  setSettings,
  onGenerate,
  onEnhance,
  isLoading,
  isEnhancing,
}) => {
  
  const handleTemplateClick = (template: string) => {
    setSettings(s => ({ ...s, prompt: template }));
  };
  
  return (
    <aside className="w-full lg:w-96 bg-dark-card/50 backdrop-blur-xl border-r border-dark-border p-6 flex flex-col space-y-6 overflow-y-auto">
      <div className="flex-1">
        <ControlSection title="Prompt">
          <div className="relative">
            <textarea
              value={settings.prompt}
              onChange={(e) => setSettings({ ...settings, prompt: e.target.value })}
              placeholder="A futuristic cat wizard casting a spell..."
              className="w-full h-28 p-3 bg-gray-900/50 border border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
            />
            <button
                onClick={onEnhance}
                disabled={isEnhancing || isLoading}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 text-xs bg-secondary/80 hover:bg-secondary text-white font-semibold py-1 px-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isEnhancing ? <Loader size="sm" /> : <Icon name="sparkles" className="w-3 h-3"/>}
                Enhance
            </button>
          </div>
           <div className="mt-2">
            <p className="text-xs text-gray-400 mb-2">Or try a template:</p>
            <div className="flex flex-wrap gap-1">
              {PROMPT_TEMPLATES.slice(0, 3).map((template, index) => (
                <button key={index} onClick={() => handleTemplateClick(template)} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-full transition-colors">{template.split(',')[0]}</button>
              ))}
            </div>
          </div>
        </ControlSection>

        <ControlSection title="Style Preset">
          <select
            value={settings.stylePreset}
            onChange={(e) => setSettings({ ...settings, stylePreset: e.target.value })}
            className="w-full p-2.5 bg-gray-900/50 border border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          >
            {STYLE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </select>
        </ControlSection>

        <ControlSection title="Aspect Ratio">
            <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map(ratio => (
                    <button
                        key={ratio.id}
                        onClick={() => setSettings(s => ({...s, aspectRatio: ratio.id as GenerationSettings['aspectRatio']}))}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${settings.aspectRatio === ratio.id ? 'bg-primary text-white' : 'bg-gray-700/50 hover:bg-gray-700'}`}
                    >
                        {ratio.name}
                    </button>
                ))}
            </div>
        </ControlSection>

        <ControlSection title="Variations">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={settings.numImages}
              onChange={(e) => setSettings({ ...settings, numImages: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="font-bold text-lg w-8 text-center">{settings.numImages}</span>
          </div>
        </ControlSection>
      </div>

      <div className="pt-6 border-t border-dark-border">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? <Loader /> : <Icon name="generate" className="w-6 h-6" />}
          Generate
        </button>
      </div>
    </aside>
  );
};
