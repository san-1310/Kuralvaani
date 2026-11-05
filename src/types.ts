export interface VoiceOption {
  id: string;
  name: string;
  tamilName: string;
  gender: 'female' | 'male';
  tone: string;
  toneTamil: string;
  description: string;
  avatarColor: string;
}

export interface VoiceStylePreset {
  id: string;
  label: string;
  labelTamil: string;
  prompt: string;
  iconName: string;
}

export interface SampleText {
  id: string;
  category: string;
  categoryTamil: string;
  title: string;
  titleTamil: string;
  text: string;
  author?: string;
  description?: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  voiceName: string;
  voiceTamilName: string;
  audioBase64?: string;
  audioUrl?: string;
  duration?: number;
  engine: 'gemini' | 'browser';
  stylePrompt?: string;
}
