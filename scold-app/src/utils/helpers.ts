export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday = 
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  const names = name.trim().split(/\s+/);
  if (names.length === 0 || names[0] === '') return '?';
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const getRelationshipEmoji = (relationship: string): string => {
  switch (relationship.toLowerCase()) {
    case 'boss': return '👔';
    case 'manager': return '📊';
    case 'colleague': return '🤝';
    case 'friend': return '👋';
    case 'family': return '🏠';
    case 'teacher': return '📚';
    case 'neighbor': return '🏡';
    case 'stranger': return '👤';
    case 'other': return '✨';
    default: return '🤔';
  }
};
