export type View = 'home' | 'try-on' | 'restore' | 'history' | 'settings';

export interface ProcessedImage {
  id: string;
  type: 'try-on' | 'restore';
  originalUrl: string;
  clothingUrl?: string;
  resultUrl: string;
  timestamp: number;
  prompt: string;
  title: string;
  technicalInfo?: string;
}

export interface GenerationParams {
  prompt: string;
  modelBase64?: string;
  clothingBase64?: string;
  originalBase64?: string;
}
