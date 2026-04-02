/**
 * Color Palette
 * Single source of truth for all app colors
 */

export const COLORS = {
  // Primary - Emerald theme
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
    950: '#052e16',
  },
  
  // Secondary - Gray
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic colors
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Backgrounds
  background: '#ffffff',
  backgroundAlt: '#f9fafb',
  
  // Borders
  border: '#e5e7eb',
  
  // Text
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    light: '#d1d5db',
  },
};

export const TAILWIND_COLORS = {
  primary: 'emerald',
  secondary: 'gray',
  success: 'green',
  error: 'red',
  warning: 'amber',
  info: 'blue',
};
