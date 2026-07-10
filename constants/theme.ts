// ============================================================
// Math Treasure Hunt - Theme Constants (Enhanced)
// Polished, child-friendly design system
// ============================================================

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Responsive scale factor based on screen width (baseline 375pt iPhone) */
const scale = (size: number): number => (SCREEN_WIDTH / 375) * size;

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isTablet: SCREEN_WIDTH >= 768,
} as const;

/** Responsive sizing helper */
export const responsive = {
  /** Scale a number relative to screen width */
  scale,
  /** Font size that scales appropriately */
  font: (size: number): number => Math.round(scale(size)),
  /** Spacing that adapts to screen */
  space: (size: number): number => Math.round(scale(size)),
  /** Width percentage */
  wp: (percent: number): number => (SCREEN_WIDTH * percent) / 100,
  /** Height percentage */
  hp: (percent: number): number => (SCREEN_HEIGHT * percent) / 100,
} as const;

export const COLORS = {
  // Primary palette
  primary: '#FF6B35',
  primaryLight: '#FF8F65',
  primaryDark: '#E55A25',
  secondary: '#FFD700',
  secondaryLight: '#FFE44D',
  secondaryDark: '#E6C200',

  // Accent colors
  accent: '#4ECDC4',
  accentLight: '#7EDDD6',
  accentDark: '#3BADA5',
  purple: '#9B59B6',
  purpleLight: '#BB8FCE',
  pink: '#FF69B4',
  pinkLight: '#FF99CC',
  green: '#2ECC71',
  greenLight: '#58D68D',
  greenDark: '#1FA355',
  blue: '#3498DB',
  blueLight: '#5DADE2',
  orange: '#F39C12',
  orangeLight: '#F5B041',

  // Background colors
  background: '#FFF8E7',
  backgroundWarm: '#FFF3D6',
  cardBackground: '#FFFFFF',
  surfaceLight: '#FFF0D4',
  surfaceMedium: '#FFE8C2',

  // Treasure map theme colors
  mapSand: '#F5DEB3',
  mapBrown: '#8B4513',
  mapGold: '#DAA520',
  mapParchment: '#FAEBD7',
  mapOcean: '#87CEEB',

  // Text colors
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#FFFFFF',
  textGold: '#B8860B',

  // Status colors
  success: '#27AE60',
  successLight: '#A9DFBF',
  error: '#E74C3C',
  errorLight: '#F5B7B1',
  warning: '#F39C12',
  warningLight: '#FAD7A0',

  // Other
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.25)',
  border: '#E8E8E8',
  borderGold: 'rgba(218, 165, 32, 0.5)',
  disabled: '#BDC3C7',
  shimmer: 'rgba(255, 255, 255, 0.6)',
} as const;

/** Predefined gradient presets for backgrounds */
export const GRADIENTS = {
  treasureMap: ['#FAEBD7', '#F5DEB3', '#DEB887'] as const,
  warmSunset: ['#FFF8E7', '#FFE4B5', '#FFD39B'] as const,
  oceanDeep: ['#E8F6FF', '#B3E5FC', '#81D4FA'] as const,
  goldShine: ['#FFD700', '#FFC107', '#FF8F00'] as const,
  forestGreen: ['#E8F5E9', '#C8E6C9', '#A5D6A7'] as const,
  purpleDream: ['#F3E5F5', '#E1BEE7', '#CE93D8'] as const,
  skyBlue: ['#E3F2FD', '#BBDEFB', '#90CAF9'] as const,
  homeScreen: ['#FFF8E7', '#FFEAA7', '#FFD93D'] as const,
  gameScreen: ['#FAFFFE', '#E8F8F5', '#D1F2EB'] as const,
} as const;

export const FONTS = {
  sizes: {
    xs: responsive.font(11),
    sm: responsive.font(13),
    md: responsive.font(15),
    lg: responsive.font(19),
    xl: responsive.font(24),
    xxl: responsive.font(30),
    xxxl: responsive.font(38),
    title: responsive.font(46),
    hero: responsive.font(56),
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
} as const;

export const SPACING = {
  xxs: responsive.space(2),
  xs: responsive.space(4),
  sm: responsive.space(8),
  md: responsive.space(16),
  lg: responsive.space(24),
  xl: responsive.space(32),
  xxl: responsive.space(48),
  xxxl: responsive.space(64),
} as const;

export const BORDER_RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
  round: 9999,
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
  golden: {
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
} as const;

/** Common animation timing */
export const ANIMATION = {
  fast: 200,
  medium: 400,
  slow: 800,
  bounce: { damping: 8, stiffness: 150 },
  gentle: { damping: 12, stiffness: 100 },
  snappy: { damping: 15, stiffness: 200 },
} as const;
