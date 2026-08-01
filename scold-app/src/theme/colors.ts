export const colors = {
  background: '#0D0D0D',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  surfaceHover: '#3A3A3C',
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#34D399',
  accent: '#06B6D4',
  textPrimary: '#F5F5F5',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  border: '#3A3A3C',
  borderLight: '#52525B',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  userBubble: '#10B981',
  aiBubble: '#2C2C2E',
  inputBackground: '#1C1C1E',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export type Colors = typeof colors;
