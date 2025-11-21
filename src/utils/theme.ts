import type { Theme } from '../types';

export const getTheme = (isDark: boolean): Theme => ({
  bg: isDark ? '#1a1a2e' : '#f5f5f5',
  cardBg: isDark ? '#2a2a3e' : '#ffffff',
  text: isDark ? '#e0e0e0' : '#2D3748',
  textSecondary: isDark ? '#a0a0b0' : '#718096',
  accent: isDark ? '#7c6f9f' : '#9b8fc4',
  accentHover: isDark ? '#6d5f8f' : '#8a7fb3',
  border: isDark ? '#3a3a4e' : '#E2E8F0',
  buttonBg: isDark ? '#3a3a4e' : '#ffffff',
  shadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
  deleteBtn: isDark ? '#3a2a3e' : '#f8f0f5',
  deleteBtnHover: isDark ? '#4a3a4e' : '#f0e0ec',
  deleteIcon: isDark ? '#b08fb8' : '#9b8fc4',
});