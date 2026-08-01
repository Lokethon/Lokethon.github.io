import { Message, Conversation } from '@/types/chat';

const EMOTIONAL_KEYWORDS: Record<string, string[]> = {
  anger: ['angry', 'furious', 'mad', 'rage', 'hate', 'annoyed', 'frustrated', 'pissed', 'irritated'],
  sadness: ['sad', 'depressed', 'cry', 'crying', 'heartbroken', 'upset', 'lonely', 'hopeless', 'hurt'],
  anxiety: ['anxious', 'worried', 'stress', 'stressed', 'panic', 'scared', 'nervous', 'overwhelmed'],
  betrayal: ['betrayed', 'lied', 'backstabbed', 'cheated', 'untrustworthy', 'used'],
  joy: ['happy', 'glad', 'relieved', 'thankful', 'better', 'good', 'great', 'awesome'],
};

export const analyzeEmotionalState = (messages: Message[]): string[] => {
  const detectedEmotions = new Set<string>();
  
  const recentUserMessages = messages
    .filter(m => m.role === 'user')
    .slice(-5)
    .map(m => m.content.toLowerCase());

  recentUserMessages.forEach(content => {
    Object.entries(EMOTIONAL_KEYWORDS).forEach(([emotion, keywords]) => {
      if (keywords.some(kw => content.includes(kw))) {
        detectedEmotions.add(emotion);
      }
    });
  });

  return Array.from(detectedEmotions);
};

export const detectPatterns = (conversations: Conversation[]): string[] => {
  const patterns: string[] = [];
  
  if (conversations.length < 2) return patterns;
  
  const totalUserMessages = conversations.flatMap(c => 
    c.messages.filter(m => m.role === 'user')
  );
  
  const allText = totalUserMessages.map(m => m.content.toLowerCase()).join(' ');
  
  if (allText.includes('always does this') || allText.includes('keeps happening')) {
    patterns.push('Feeling trapped in a repetitive negative cycle');
  }
  
  if (allText.includes('my fault') || allText.includes('i should have')) {
    patterns.push('Self-blame tendencies');
  }

  if (allText.includes('quit') || allText.includes('leave') || allText.includes('resign')) {
    patterns.push('Contemplating leaving the relationship or situation');
  }
  
  if (allText.includes('ignore') || allText.includes('silent')) {
    patterns.push('Experiencing avoidance or silent treatment');
  }

  return patterns;
};

export const generateConversationSummary = (messages: Message[]): string => {
  if (messages.length === 0) return 'No prior conversation.';
  
  const lastUserMessages = messages
    .filter(m => m.role === 'user')
    .slice(-3)
    .map(m => m.content);
    
  if (lastUserMessages.length === 0) return 'No recent user messages.';
  
  const contextText = lastUserMessages.join(' | ');
  return contextText.length > 500 
    ? contextText.substring(0, 497) + '...'
    : contextText;
};
