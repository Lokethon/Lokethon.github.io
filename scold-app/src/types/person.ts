export type Relationship = 
  | 'Boss' | 'Manager' | 'Colleague' | 'Friend' 
  | 'Family' | 'Teacher' | 'Neighbor' | 'Stranger' | 'Other';

export interface Person {
  id: string;
  name: string;
  relationship: Relationship;
  notes?: string;
  conversationCount: number;
  createdAt: number;
  lastInteraction?: number;
}
