// ============================================================
// Math Treasure Hunt - Theme Constants
// ============================================================

export const COLORS = {
  // Primary palette
  primary: '#FF6B35',
  primaryLight: '#FF8F65',
  secondary: '#FFD700',
  secondaryLight: '#FFE44D',

  // Accent colors
  accent: '#4ECDC4',
  accentLight: '#7EDDD6',
  purple: '#9B59B6',
  purpleLight: '#BB8FCE',
  pink: '#FF69B4',
  pinkLight: '#FF99CC',
  green: '#2ECC71',
  greenLight: '#58D68D',
  blue: '#3498DB',
  blueLight: '#5DADE2',

  // Background colors
  background: '#FFF8E7',
  cardBackground: '#FFFFFF',
  surfaceLight: '#FFF0D4',

  // Text colors
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#FFFFFF',

  // Status colors
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',

  // Other
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  border: '#E8E8E8',
  disabled: '#BDC3C7',
} as const;

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    title: 48,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
