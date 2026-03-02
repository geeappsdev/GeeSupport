
export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  name?: string;
  avatar?: string;
  attachments?: Attachment[];
  isError?: boolean;
  isPinned?: boolean;
  isOptimized?: boolean;
}

export interface Attachment {
  id: number;
  name: string;
  type: 'image' | 'file';
  data: string; // base64
}

export interface UserProfile {
  name: string;
  avatar: string;
  theme: string;
  mode: 'light' | 'dark' | 'system';
  layout: 'left' | 'right';
  enableCitations: boolean;
}

export interface Station {
  name: string;
  url: string;
  isCustom: boolean;
  listenerCount?: number;
}

export interface Format {
  id: string;
  name: string;
  description: string;
  icon?: string;
  instruction?: string;
  category: 'draft' | 'snippet' | 'internal';
  modelTier?: 'lite' | 'standard' | 'pro';
}

export interface Tone {
  id: string;
  name: string;
  description: string;
  promptInstruction: string;
}

export interface ProductDomain {
  id: string;
  name: string;
  description: string;
  contextInstruction: string;
  keywords: string[];
  category: ('direct' | 'connect' | 'saas')[];
}
