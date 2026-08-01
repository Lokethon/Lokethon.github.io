import { create } from 'zustand';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';
import type { Person, Relationship } from '@/types/person';

interface PersonState {
  persons: Person[];
  isLoading: boolean;
  
  loadPersons: () => Promise<void>;
  addPerson: (name: string, relationship: Relationship, notes?: string) => Promise<Person>;
  removePerson: (id: string) => Promise<void>;
  updatePerson: (id: string, updates: Partial<Person>) => Promise<void>;
  getPersonById: (id: string) => Person | undefined;
}

const PERSONS_STORAGE_KEY = '@scold_persons';

export const usePersonStore = create<PersonState>((set, get) => ({
  persons: [],
  isLoading: false,

  loadPersons: async () => {
    set({ isLoading: true });
    try {
      const storedPersons = await storage.getItem<Person[]>(PERSONS_STORAGE_KEY);
      if (storedPersons) {
        set({ persons: storedPersons });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  addPerson: async (name: string, relationship: Relationship, notes?: string) => {
    const newPerson: Person = {
      id: generateId(),
      name,
      relationship,
      notes,
      conversationCount: 0,
      createdAt: Date.now(),
      lastInteraction: undefined,
    };

    const updatedPersons = [...get().persons, newPerson];
    set({ persons: updatedPersons });
    await storage.setItem(PERSONS_STORAGE_KEY, updatedPersons);
    
    return newPerson;
  },

  removePerson: async (id: string) => {
    const updatedPersons = get().persons.filter(p => p.id !== id);
    set({ persons: updatedPersons });
    await storage.setItem(PERSONS_STORAGE_KEY, updatedPersons);
  },

  updatePerson: async (id: string, updates: Partial<Person>) => {
    const updatedPersons = get().persons.map(person => 
      person.id === id ? { ...person, ...updates } : person
    );
    set({ persons: updatedPersons });
    await storage.setItem(PERSONS_STORAGE_KEY, updatedPersons);
  },

  getPersonById: (id: string) => {
    return get().persons.find(p => p.id === id);
  }
}));
