import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import Avatar from '@/components/common/Avatar';

interface ChatHeaderProps {
  personName: string;
  personRelationship: string;
  onBack: () => void;
  emoji?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ personName, personRelationship, onBack, emoji }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>
      
      <View style={styles.titleContainer}>
        <Text style={styles.name} numberOfLines={1}>{personName}</Text>
        <Text style={styles.relationship} numberOfLines={1}>{personRelationship}</Text>
      </View>
      
      <View style={styles.avatarContainer}>
        <Avatar name={personName} size="sm" emoji={emoji} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    color: colors.textPrimary,
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  name: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  relationship: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  avatarContainer: {
    marginLeft: 8,
    padding: 4,
  },
});

export default React.memo(ChatHeader);
