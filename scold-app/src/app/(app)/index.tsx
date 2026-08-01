import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { usePersonStore } from '@/store/personStore';
import { useChatStore } from '@/store/chatStore';
import { colors, typography, spacing } from '@/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import StrangerOption from '@/components/persons/StrangerOption';
import PersonCard from '@/components/persons/PersonCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { persons, loadPersons } = usePersonStore();
  const { conversations, loadConversations, createConversation } = useChatStore();

  useEffect(() => {
    loadPersons();
    loadConversations();
  }, [loadPersons, loadConversations]);

  const recentConversations = [...conversations]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const handleStartChat = async (personId: string, personName: string, relationship: string) => {
    const conv = await createConversation(personId, personName, relationship);
    router.push(`/(app)/chat/${conv.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey {user?.displayName || 'there'} 👋</Text>
          <Text style={styles.subtitle}>Ready to let it out?</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Start Scolding</Text>
          
          {persons.length === 0 ? (
            <TouchableOpacity 
              style={styles.emptyCard}
              onPress={() => router.push('/(app)/persons/add')}
            >
              <Text style={styles.emptyCardText}>+ Add someone to scold</Text>
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              <StrangerOption onPress={() => handleStartChat('stranger', 'Stranger', 'None')} />
              {persons.map(person => (
                <TouchableOpacity key={person.id} style={styles.personMiniCard} onPress={() => handleStartChat(person.id, person.name, person.relationship)}>
                  <Text style={styles.personMiniName}>{person.name}</Text>
                  <Text style={styles.personMiniRel}>{person.relationship}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Conversations</Text>
          
          {recentConversations.length === 0 ? (
            <Text style={styles.emptyStateText}>No conversations yet. Start scolding!</Text>
          ) : (
            recentConversations.map(conv => (
              <TouchableOpacity 
                key={conv.id} 
                style={styles.convCard}
                onPress={() => router.push(`/(app)/chat/${conv.id}`)}
              >
                <View style={styles.convHeader}>
                  <Text style={styles.convName}>{conv.personName}</Text>
                  <Text style={styles.convTime}>
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.convPreview} numberOfLines={1}>
                  {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content : 'No messages yet'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCardText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  horizontalScroll: {
    gap: spacing.md,
  },
  personMiniCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    width: 120,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  personMiniName: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  personMiniRel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  convCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  convName: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  convTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  convPreview: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
