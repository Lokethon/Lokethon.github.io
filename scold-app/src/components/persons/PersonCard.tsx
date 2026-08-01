import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/theme';
import { Person } from '@/types/person';
import Avatar from '@/components/common/Avatar';

interface PersonCardProps {
  person: Person;
  onPress: () => void;
  onDelete?: () => void;
}

const getEmojiForRelationship = (rel: string): string => {
  const map: Record<string, string> = {
    Boss: '👔',
    Manager: '📊',
    Colleague: '💼',
    Friend: '🤝',
    Family: '🏠',
    Teacher: '📚',
    Neighbor: '🏘️',
    Other: '👤',
  };
  return map[rel] || '👤';
};

const PersonCard: React.FC<PersonCardProps> = ({ person, onPress, onDelete }) => {
  const timeString = person.lastInteraction 
    ? new Date(person.lastInteraction).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : 'New';

  const emoji = getEmojiForRelationship(person.relationship);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <Avatar name={person.name} size="md" emoji={emoji} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{person.name}</Text>
        <Text style={styles.relationship} numberOfLines={1}>{person.relationship}</Text>
      </View>
      
      <View style={styles.metaContainer}>
        <Text style={styles.time}>{timeString}</Text>
        {onDelete && (
          <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
            <Text style={styles.deleteText}>🗑️</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  pressed: {
    backgroundColor: colors.surfaceElevated,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  relationship: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  metaContainer: {
    alignItems: 'flex-end',
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 14,
  },
});

export default React.memo(PersonCard);
