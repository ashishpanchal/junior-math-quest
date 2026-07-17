// ============================================================
// Math Treasure Hunt - Game Button Component
// Large, colorful, child-friendly button with press animation
// ============================================================

import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { lightHaptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GameButtonProps {
  title: string;
  onPress: () => void;
  emoji?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

const GRADIENT_COLORS: Record<string, [string, string]> = {
  primary: [COLORS.primary, COLORS.primaryLight],
  secondary: [COLORS.secondary, COLORS.secondaryLight],
  success: [COLORS.green, COLORS.greenLight],
  accent: [COLORS.accent, COLORS.accentLight],
};

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  emoji,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    lightHaptic();
    onPress();
  };

  const sizeStyle = SIZE_STYLES[size];
  const gradientColors = GRADIENT_COLORS[variant];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, disabled && styles.disabled, style]}
      accessibilityRole="button"
      accessibilityLabel={`${emoji ? emoji + ' ' : ''}${title}`}
      accessibilityState={{ disabled }}
    >
      <LinearGradient
        colors={disabled ? [COLORS.disabled, COLORS.disabled] : gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, sizeStyle]}
      >
        {emoji && <Text style={[styles.emoji, { fontSize: sizeStyle.fontSize }]}>{emoji}</Text>}
        <Text style={[styles.text, { fontSize: sizeStyle.fontSize }]}>{title}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
};

const SIZE_STYLES = {
  small: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONTS.sizes.md,
  },
  medium: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    fontSize: FONTS.sizes.lg,
  },
  large: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    fontSize: FONTS.sizes.xl,
  },
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  text: {
    color: COLORS.textLight,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});
