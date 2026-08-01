import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/theme';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  emoji?: string;
  imageUrl?: string;
}

const AVATAR_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#10B981', 
  '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'
];

const sizeMap = {
  sm: 32,
  md: 44,
  lg: 64,
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getBackgroundColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', emoji, imageUrl }) => {
  const dimension = sizeMap[size];
  const borderRadius = dimension / 2;
  const backgroundColor = getBackgroundColor(name);
  const initials = getInitials(name);
  const fontSize = dimension * 0.4;

  return (
    <View style={[styles.container, { width: dimension, height: dimension }]}>
      <View
        style={[
          styles.circle,
          { width: dimension, height: dimension, borderRadius, backgroundColor },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: dimension, height: dimension, borderRadius }}
          />
        ) : (
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        )}
      </View>
      {emoji && (
        <View style={styles.badge}>
          <Text style={[styles.emoji, { fontSize: dimension * 0.3 }]}>{emoji}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    lineHeight: 18,
  },
});

export default React.memo(Avatar);
