export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  personId: string;
  personName: string;
  personRelationship: string;
  messages: Message[];
  title: string;
  createdAt: number;
  updatedAt: number;
}
