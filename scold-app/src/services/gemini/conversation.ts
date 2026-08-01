import { ChatSession, Content } from '@google/generative-ai';
import { startChat, sendMessage, sendMessageStream } from './client';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  personName: string;
  personRelationship: string;
  messages: Message[];
  updatedAt: number;
}

export class ConversationManager {
  private chatSession: ChatSession | null = null;
  
  private formatHistory(messages: Message[]): Content[] {
    return messages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));
  }

  public initializeChat(conversation: Conversation, systemPrompt: string, maxHistory = 20) {
    const history = this.formatHistory(
      conversation.messages.slice(-maxHistory)
    );
    this.chatSession = startChat(history, systemPrompt);
  }

  public async sendUserMessage(text: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error('Chat session not initialized. Call initializeChat first.');
    }
    return await sendMessage(this.chatSession, text);
  }

  public async sendUserMessageStream(text: string, onChunk: (chunk: string) => void): Promise<string> {
    if (!this.chatSession) {
      throw new Error('Chat session not initialized. Call initializeChat first.');
    }
    
    const stream = await sendMessageStream(this.chatSession, text);
    let fullResponse = '';
    
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onChunk(chunkText);
    }
    
    return fullResponse;
  }

  public async getSessionHistory(): Promise<Content[]> {
    if (!this.chatSession) return [];
    return await this.chatSession.getHistory();
  }
}

export const createConversationManager = () => new ConversationManager();
