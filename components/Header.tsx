
import React from 'react';
import type { AppTab } from '../types';
import { Icon } from './Icon';

interface HeaderProps {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
}

const TabButton: React.FC<{
    label: string;
    icon: 'generate' | 'history' | 'favorite';
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
        }`}
    >
        <Icon name={icon} className="w-5 h-5" />
        <span className="hidden sm:inline">{label}</span>
    </button>
);


export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-dark-border">
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
         <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-lg flex items-center justify-center">
            <Icon name="logo" className="w-6 h-6 text-white"/>
         </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AetherLens
        </h1>
      </div>
      <nav className="p-1.5 bg-dark-card rounded-xl border border-dark-border flex items-center space-x-1">
        <TabButton label="Generate" icon="generate" isActive={activeTab === 'generate'} onClick={() => setActiveTab('generate')} />
        <TabButton label="History" icon="history" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        <TabButton label="Favorites" icon="favorite" isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
      </nav>
    </header>
  );
};
