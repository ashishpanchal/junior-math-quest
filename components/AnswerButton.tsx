// ============================================================
// Math Treasure Hunt - Answer Button Component
// Displays an answer option with correct/wrong feedback
// ============================================================

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { lightHaptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnswerButtonProps {
  answer: number;
  onPress: (answer: number) => void;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  disabled: boolean;
  index: number;
  style?: ViewStyle;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  answer,
  onPress,
  isSelected,
  isCorrect,
  isRevealed,
  disabled,
  index,
  style,
}) => {
  const scale = useSharedValue(0);
  const shake = useSharedValue(0);

  // Entry animation with stagger
  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 12,
      delay: index * 100,
    });
  }, [index]);

  // Shake animation for wrong answer
  useEffect(() => {
    if (isRevealed && isSelected && !isCorrect) {
      shake.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-5, { duration: 50 }),
          withTiming(5, { duration: 50 }),
          withTiming(0, { duration: 50 })
        ),
        1,
        false
      );
    }
  }, [isRevealed, isSelected, isCorrect]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: shake.value },
    ],
  }));

  const handlePress = () => {
    lightHaptic();
    onPress(answer);
  };

  const getBackgroundColor = () => {
    if (!isRevealed) return COLORS.cardBackground;
    if (isSelected && isCorrect) return COLORS.success;
    if (isSelected && !isCorrect) return COLORS.error;
    if (isCorrect) return COLORS.success; // Highlight correct answer
    return COLORS.cardBackground;
  };

  const getTextColor = () => {
    if (isRevealed && (isSelected || isCorrect)) return COLORS.textLight;
    return COLORS.textPrimary;
  };

  const getBorderColor = () => {
    if (!isRevealed) return COLORS.border;
    if (isSelected && isCorrect) return COLORS.success;
    if (isSelected && !isCorrect) return COLORS.error;
    if (isCorrect) return COLORS.success;
    return COLORS.border;
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        animatedStyle,
        disabled && !isRevealed && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{answer}</Text>
      {isRevealed && isSelected && isCorrect && (
        <Text style={styles.feedback}>✓</Text>
      )}
      {isRevealed && isSelected && !isCorrect && (
        <Text style={styles.feedback}>✗</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: 70,
    minHeight: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 3,
    margin: SPACING.sm,
    ...SHADOWS.small,
  },
  text: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  feedback: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.bold,
  },
  disabled: {
    opacity: 0.7,
  },
});
