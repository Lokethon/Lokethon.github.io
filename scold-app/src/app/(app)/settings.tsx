import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { colors, typography, spacing } from '@/theme';
import Button from '@/components/common/Button';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [location, setLocation] = useState('India'); // Default placeholder

  const handleLogout = async () => {
    await logout();
    // Redirect happens automatically due to app layout logic
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <Text style={styles.rowLabel}>Name</Text>
            <Text style={styles.rowValue}>{user?.displayName || 'User'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>{user?.email || ''}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={[styles.card, styles.row]}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme} 
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textPrimary}
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.rowLabel}>Location (for legal context)</Text>
            <TextInput 
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(app)/legal-info')}>
            <Text style={styles.rowLabel}>Know Your Rights (Legal Info)</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Scold</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>
              Scold is an AI-powered emotional support application designed to provide a safe space to vent frustrations without burning real-world bridges.
            </Text>
          </View>
        </View>

        <Button 
          title="Sign Out" 
          onPress={handleLogout} 
          style={styles.logoutBtn}
          textStyle={{ color: colors.textPrimary }}
        />

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  rowValue: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  input: {
    ...typography.body,
    color: colors.primary,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  chevron: {
    ...typography.h3,
    color: colors.textSecondary,
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  logoutBtn: {
    backgroundColor: colors.danger,
    marginTop: spacing.md,
  },
  versionText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
