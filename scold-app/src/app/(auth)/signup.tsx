import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors, typography, spacing } from '@/theme';
import Button from '@/components/common/Button';

export default function SignupScreen() {
  const router = useRouter();
  const { register, error, isLoading, clearError } = useAuthStore();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSignup = async () => {
    setLocalError('');
    if (!displayName || !email || !password || !confirmPassword) {
      setLocalError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    await register(email, password, displayName);
    if (useAuthStore.getState().isAuthenticated) {
      router.replace('/(app)');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join your safe space</Text>
        </View>

        <View style={styles.form}>
          {(error || localError) ? (
            <Text style={styles.errorText}>{localError || error}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Display Name"
            placeholderTextColor={colors.textSecondary}
            value={displayName}
            onChangeText={(text) => { setDisplayName(text); clearError(); setLocalError(''); }}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={(text) => { setEmail(text); clearError(); setLocalError(''); }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={(text) => { setPassword(text); clearError(); setLocalError(''); }}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.textSecondary}
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); clearError(); setLocalError(''); }}
            secureTextEntry
          />
          <Text style={styles.hint}>Password must be at least 6 characters</Text>

          <Button 
            title="Create Account" 
            onPress={handleSignup} 
            isLoading={isLoading} 
            style={styles.signupBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkTextBold}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.body,
  },
  hint: {
    color: colors.textSecondary,
    ...typography.caption,
    marginBottom: spacing.lg,
    marginLeft: spacing.xs,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md,
    ...typography.caption,
  },
  signupBtn: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    ...typography.body,
  },
  linkTextBold: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
