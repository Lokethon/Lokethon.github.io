import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '@/theme';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Relationship } from '@/types/person';

interface AddPersonFormProps {
  onSubmit: (name: string, relationship: Relationship, notes?: string) => void;
  onCancel: () => void;
}

const RELATIONSHIPS: { label: Relationship; emoji: string }[] = [
  { label: 'Boss', emoji: '👔' },
  { label: 'Manager', emoji: '📊' },
  { label: 'Colleague', emoji: '💼' },
  { label: 'Friend', emoji: '🤝' },
  { label: 'Family', emoji: '🏠' },
  { label: 'Teacher', emoji: '📚' },
  { label: 'Neighbor', emoji: '🏘️' },
  { label: 'Other', emoji: '👤' },
];

const AddPersonForm: React.FC<AddPersonFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!relationship) {
      setError('Please select a relationship');
      return;
    }
    setError('');
    onSubmit(name.trim(), relationship, notes.trim() ? notes.trim() : undefined);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Someone</Text>
        
        <Input
          label="Who are you mad at?"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError('');
          }}
          placeholder="Enter their name"
        />

        <Text style={styles.sectionLabel}>Relationship</Text>
        <View style={styles.grid}>
          {RELATIONSHIPS.map((rel) => {
            const isSelected = relationship === rel.label;
            return (
              <Pressable
                key={rel.label}
                style={[
                  styles.gridItem,
                  isSelected && styles.gridItemActive,
                ]}
                onPress={() => {
                  setRelationship(rel.label);
                  if (error) setError('');
                }}
              >
                <Text style={styles.emoji}>{rel.emoji}</Text>
                <Text style={[
                  styles.gridItemText,
                  isSelected && styles.gridItemTextActive
                ]}>
                  {rel.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Input
          label="Any notes? (Optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Why are they usually annoying?"
          multiline
          style={styles.textArea}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actions}>
          <Button title="Cancel" variant="ghost" onPress={onCancel} style={styles.actionBtn} />
          <Button title="Add Person" variant="primary" onPress={handleSubmit} style={styles.actionBtn} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  gridItem: {
    width: '25%',
    padding: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  gridItemActive: {
    backgroundColor: 'transparent',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  gridItemText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  gridItemTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: colors.danger || '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default React.memo(AddPersonForm);
