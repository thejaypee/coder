
export interface ChatMessage {
  role: 'user' | 'agent' | 'system';
  content: string;
}
