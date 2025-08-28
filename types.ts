
export interface GenerationSettings {
  prompt: string;
  stylePreset: string;
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  numImages: number;
  outputFormat: 'image/jpeg' | 'image/png';
}

export interface GeneratedImage {
  id: string;
  base64: string;
  prompt: string;
  settings: GenerationSettings;
  isFavorite: boolean;
  createdAt: string;
}

export type AppTab = 'generate' | 'history' | 'favorites';
