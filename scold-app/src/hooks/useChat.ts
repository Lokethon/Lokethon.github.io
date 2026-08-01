import { useRef, useState, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { usePersonStore } from '@/store/personStore';
import { ConversationManager } from '@/services/gemini/conversation';
import { buildSystemPrompt, PromptContext } from '@/services/gemini/prompts';
import { getLegalContext } from '@/services/legal/context';
import { analyzeEmotionalState } from '@/services/gemini/analyzer';
import { generateId } from '@/utils/helpers';
import { Message } from '@/types/chat';

export function useChat(conversationId: string) {
  const chatStore = useChatStore();
  const personStore = usePersonStore();
  
  const [error, setError] = useState<string | null>(null);
  const managerRef = useRef<ConversationManager | null>(null);

  const conversation = chatStore.conversations.find(c => c.id === conversationId);
  
  const initializeManager = useCallback(() => {
    if (!conversation) return null;
    
    if (managerRef.current) return managerRef.current;
    
    const isStranger = conversation.personId === 'stranger';
    let personName = conversation.personName;
    let personRelationship = conversation.personRelationship;
    
    if (!isStranger) {
      const person = personStore.getPersonById(conversation.personId);
      if (person) {
        personName = person.name;
        personRelationship = person.relationship;
      }
    }

    // Analyze emotional patterns from existing messages
    const emotionalPatterns = conversation.messages.length > 0 
      ? analyzeEmotionalState(conversation.messages as any)
      : undefined;

    // Build the layered system prompt
    const promptContext: PromptContext = {
      personName,
      personRelationship,
      isStranger,
      emotionalPatterns,
      legalContext: getLegalContext('India', personRelationship),
    };
    
    const systemPrompt = buildSystemPrompt(promptContext);
    
    // Create and initialize the conversation manager
    const manager = new ConversationManager();
    
    // Convert our Message[] to the format ConversationManager expects
    const historyMessages = conversation.messages.map(m => ({
      id: m.id,
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      content: m.content,
      timestamp: typeof m.timestamp === 'number' ? m.timestamp : Date.now(),
    }));
    
    manager.initializeChat(
      {
        id: conversation.id,
        title: conversation.title,
        personName,
        personRelationship,
        messages: historyMessages,
        updatedAt: conversation.updatedAt,
      },
      systemPrompt
    );
    
    managerRef.current = manager;
    return manager;
  }, [conversation, personStore]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !conversation) return;
    
    const manager = initializeManager();
    if (!manager) {
      setError('Failed to initialize chat. Please try again.');
      return;
    }

    setError(null);
    chatStore.setStreaming(true);

    // 1. Add User Message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };
    chatStore.addMessage(conversationId, userMessage);

    // 2. Add empty Assistant Message as placeholder for streaming
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };
    chatStore.addMessage(conversationId, assistantMessage);

    // 3. Stream response from Gemini
    try {
      let fullResponse = '';
      
      await manager.sendUserMessageStream(text.trim(), (chunk: string) => {
        fullResponse += chunk;
        chatStore.updateLastMessage(conversationId, fullResponse);
      });
      
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg = err.message?.includes('API key')
        ? 'Please set your Gemini API key in Settings.'
        : err.message || 'Failed to get response. Please try again.';
      setError(errorMsg);
      chatStore.updateLastMessage(
        conversationId, 
        "I'm having trouble connecting right now. Give me a moment and try again. 💛"
      );
    } finally {
      chatStore.setStreaming(false);
    }
  };

  return {
    sendMessage,
    isStreaming: chatStore.isStreaming,
    error,
    messages: conversation?.messages || [],
  };
}
