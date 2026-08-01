import React from 'react';
import { useAuthStore } from '@/store/authStore';
import LoginScreen from './(auth)/login';
import HomeScreen from './(app)/index';

export default function RootIndex() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <HomeScreen />;
  }

  return <LoginScreen />;
}
