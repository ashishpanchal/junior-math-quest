// ============================================================
// Math Treasure Hunt - Answer Button Component (Enhanced)
// Big, colorful, child-friendly answer buttons with juice
// ============================================================

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, responsive } from '../constants/theme';
import { lightHaptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Fun gradient colors for each button position
const BUTTON_GRADIENTS: [string, string][] = [
  ['#667eea', '#764ba2'],  // Purple-blue
  ['#f093fb', '#f5576c'],  // Pink-red
  ['#4facfe', '#00f2fe'],  // Blue-cyan
  ['#43e97b', '#38f9d7'],  // Green-teal
];

const BUTTON_BG_COLORS = ['#EDE7F6', '#FCE4EC', '#E3F2FD', '#E8F5E9'];

interface AnswerButtonProps {
  answer: number;
  onPress: (answer: number) => void;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  disabled: boolean;
  index: number;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  answer,
  onPress,
  isSelected,
  isCorrect,
  isRevealed,
  disabled,
  index,
}) => {
  const scale = useSharedValue(0);
  const shake = useSharedValue(0);
  const bounceY = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const successScale = useSharedValue(1);

  // Staggered entry animation
  useEffect(() => {
    scale.value = withDelay(
      index * 120,
      withSpring(1, { damping: 10, stiffness: 160 })
    );
    // Idle subtle bounce
    bounceY.value = withDelay(
      index * 120 + 500,
      withRepeat(
        withSequence(
          withTiming(-2, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(2, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, [index]);

  // Shake animation for wrong answer
  useEffect(() => {
    if (isRevealed && isSelected && !isCorrect) {
      shake.value = withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-4, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [isRevealed, isSelected, isCorrect]);

  // Success celebration
  useEffect(() => {
    if (isRevealed && isSelected && isCorrect) {
      successScale.value = withSequence(
        withSpring(1.15, { damping: 4, stiffness: 200 }),
        withSpring(1.05, { damping: 8 })
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        3,
        true
      );
    }
  }, [isRevealed, isSelected, isCorrect]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * successScale.value },
      { translateX: shake.value },
      { translateY: bounceY.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    lightHaptic();
    onPress(answer);
  };

  const getBackgroundColor = () => {
    if (!isRevealed) return BUTTON_BG_COLORS[index % BUTTON_BG_COLORS.length];
    if (isSelected && isCorrect) return '#D4EDDA';
    if (isSelected && !isCorrect) return '#F8D7DA';
    if (isCorrect) return '#D4EDDA';
    return '#F5F5F5';
  };

  const getBorderColor = () => {
    if (!isRevealed) return BUTTON_GRADIENTS[index % BUTTON_GRADIENTS.length][0];
    if (isSelected && isCorrect) return COLORS.success;
    if (isSelected && !isCorrect) return COLORS.error;
    if (isCorrect) return COLORS.success;
    return COLORS.border;
  };

  const getTextColor = () => {
    if (!isRevealed) return BUTTON_GRADIENTS[index % BUTTON_GRADIENTS.length][0];
    if (isRevealed && isSelected && isCorrect) return COLORS.success;
    if (isRevealed && isSelected && !isCorrect) return COLORS.error;
    if (isRevealed && isCorrect) return COLORS.success;
    return COLORS.textSecondary;
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.wrapper, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={`Answer ${answer}`}
      accessibilityState={{ disabled, selected: isSelected }}
    >
      {/* Success glow */}
      {isRevealed && isSelected && isCorrect && (
        <Animated.View style={[styles.glowEffect, glowStyle]} />
      )}

      <View
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
          },
          disabled && !isRevealed && styles.disabled,
        ]}
      >
        {/* Number */}
        <Text style={[styles.text, { color: getTextColor() }]}>
          {answer}
        </Text>

        {/* Feedback icons */}
        {isRevealed && isSelected && isCorrect && (
          <View style={styles.feedbackBadge}>
            <Text style={styles.feedbackIcon}>✓</Text>
          </View>
        )}
        {isRevealed && isSelected && !isCorrect && (
          <View style={[styles.feedbackBadge, styles.feedbackBadgeError]}>
            <Text style={styles.feedbackIcon}>✗</Text>
          </View>
        )}

        {/* Decorative corner dot */}
        {!isRevealed && (
          <View style={[styles.cornerDot, { backgroundColor: getBorderColor() }]} />
        )}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '46%',
    aspectRatio: 1.4,
    margin: '2%',
    position: 'relative',
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.success,
    transform: [{ scale: 1.05 }],
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 3.5,
    ...SHADOWS.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  text: {
    fontSize: responsive.font(36),
    fontWeight: FONTS.weights.extrabold,
  },
  feedbackBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBadgeError: {
    backgroundColor: COLORS.error,
  },
  feedbackIcon: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.bold,
  },
  cornerDot: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.4,
  },
  disabled: {
    opacity: 0.6,
  },
});
