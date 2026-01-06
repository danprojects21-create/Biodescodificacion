
export enum ViewMode {
  CHAT = 'CHAT',
  LIVE = 'LIVE',
  CREATIVE = 'CREATIVE',
  HISTORY = 'HISTORY'
}

export type VoiceType = 'female' | 'male';

export interface AppSettings {
  voice: VoiceType;
  autoPlay: boolean;
  theme: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
  // Added grounding field to store Search Grounding citations
  grounding?: any[];
}

export interface SymbolicMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  prompt: string;
  timestamp: Date;
}
