import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePersonStore } from '@/store/personStore';
import { useChatStore } from '@/store/chatStore';
import { colors, typography, spacing } from '@/theme';
import PersonCard from '@/components/persons/PersonCard';
import StrangerOption from '@/components/persons/StrangerOption';

export default function PersonsScreen() {
  const router = useRouter();
  const { persons, loadPersons, removePerson } = usePersonStore();
  const { createConversation } = useChatStore();

  useEffect(() => {
    loadPersons();
  }, [loadPersons]);

  const handleStartChat = async (personId: string, personName: string, relationship: string) => {
    const conv = await createConversation(personId, personName, relationship);
    router.push(`/(app)/chat/${conv.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your People</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => router.push('/(app)/persons/add')}
        >
          <Text style={styles.addBtnText}>+ Add Person</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={persons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.strangerWrap}>
            <StrangerOption onPress={() => handleStartChat('stranger', 'Stranger', 'None')} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No people added yet. Add someone you want to scold!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PersonCard 
            person={item} 
            onPress={() => handleStartChat(item.id, item.name, item.relationship)}
            onDelete={() => removePerson(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  addBtn: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addBtnText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  strangerWrap: {
    marginBottom: spacing.lg,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
