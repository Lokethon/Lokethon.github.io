import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors, typography, spacing } from '@/theme';
import Button from '@/components/common/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, error, isLoading, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  const handleLogin = async () => {
    if (!email || !password) return;
    await login(email, password);
    if (useAuthStore.getState().isAuthenticated) {
      router.replace('/(app)');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>🔥 Scold</Text>
        <Text style={styles.tagline}>Your safe space to let it out</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={(text) => { setEmail(text); clearError(); }}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={(text) => { setPassword(text); clearError(); }}
          secureTextEntry
        />

        <Button 
          title="Sign In" 
          onPress={handleLogin} 
          isLoading={isLoading} 
          style={styles.loginBtn}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotBtn}>
          <Text style={styles.linkText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.linkTextBold}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
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
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
    ...typography.caption,
  },
  loginBtn: {
    marginTop: spacing.sm,
  },
  forgotBtn: {
    marginTop: spacing.lg,
    alignItems: 'center',
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
  linkText: {
    color: colors.primary,
    ...typography.body,
  },
  linkTextBold: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
