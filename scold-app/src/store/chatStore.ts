import { create } from 'zustand';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';
import type { Conversation, Message } from '@/types/chat';
import { usePersonStore } from './personStore';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isStreaming: boolean;
  isLoading: boolean;

  loadConversations: () => Promise<void>;
  createConversation: (personId: string, personName: string, personRelationship: string) => Promise<Conversation>;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => Promise<void>;
  updateLastMessage: (conversationId: string, content: string) => void;
  deleteConversation: (id: string) => Promise<void>;
  getConversationsByPerson: (personId: string) => Conversation[];
  setStreaming: (value: boolean) => void;
}

const CONVERSATIONS_KEY = '@scold_conversations';

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  isStreaming: false,
  isLoading: false,

  loadConversations: async () => {
    set({ isLoading: true });
    try {
      const stored = await storage.getItem<Conversation[]>(CONVERSATIONS_KEY);
      if (stored) {
        set({ conversations: stored });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createConversation: async (personId, personName, personRelationship) => {
    const newConv: Conversation = {
      id: generateId(),
      personId,
      personName,
      personRelationship,
      title: `Conversation with ${personName}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updated = [newConv, ...get().conversations];
    set({ conversations: updated, activeConversation: newConv });
    await storage.setItem(CONVERSATIONS_KEY, updated);

    // Update person's conversation count and last interaction
    const updatePerson = usePersonStore.getState().updatePerson;
    const person = usePersonStore.getState().getPersonById(personId);
    if (person) {
      await updatePerson(personId, { 
        conversationCount: person.conversationCount + 1,
        lastInteraction: Date.now()
      });
    }

    return newConv;
  },

  setActiveConversation: (id) => {
    const conv = get().conversations.find(c => c.id === id);
    set({ activeConversation: conv || null });
  },

  addMessage: async (conversationId, message) => {
    const conversations = get().conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          updatedAt: Date.now(),
        };
      }
      return conv;
    });

    const activeConv = conversations.find(c => c.id === conversationId) || null;
    
    set({ 
      conversations,
      activeConversation: get().activeConversation?.id === conversationId ? activeConv : get().activeConversation 
    });
    
    await storage.setItem(CONVERSATIONS_KEY, conversations);

    // Update person's last interaction
    if (activeConv) {
      const updatePerson = usePersonStore.getState().updatePerson;
      await updatePerson(activeConv.personId, { lastInteraction: Date.now() });
    }
  },

  updateLastMessage: (conversationId, content) => {
    const conversations = get().conversations.map(conv => {
      if (conv.id === conversationId && conv.messages.length > 0) {
        const newMessages = [...conv.messages];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          content,
        };
        return { ...conv, messages: newMessages, updatedAt: Date.now() };
      }
      return conv;
    });

    const activeConv = conversations.find(c => c.id === conversationId) || null;

    set({ 
      conversations,
      activeConversation: get().activeConversation?.id === conversationId ? activeConv : get().activeConversation
    });
  },

  deleteConversation: async (id) => {
    const updated = get().conversations.filter(c => c.id !== id);
    set({ 
      conversations: updated,
      activeConversation: get().activeConversation?.id === id ? null : get().activeConversation
    });
    await storage.setItem(CONVERSATIONS_KEY, updated);
  },

  getConversationsByPerson: (personId) => {
    return get().conversations.filter(c => c.personId === personId).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  setStreaming: (value) => {
    set({ isStreaming: value });
  }
}));
