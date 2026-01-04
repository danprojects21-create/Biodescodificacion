
export enum ViewMode {
  CHAT = 'CHAT',
  LIVE = 'LIVE',
  CREATIVE = 'CREATIVE',
  HISTORY = 'HISTORY'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface SymbolicMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  prompt: string;
  timestamp: Date;
}
