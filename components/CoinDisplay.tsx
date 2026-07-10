// ============================================================
// Math Treasure Hunt - Coin Display Component
// Shows the player's coin count with animation
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';

interface CoinDisplayProps {
  coins: number;
  size?: 'small' | 'large';
  animate?: boolean;
}

export const CoinDisplay: React.FC<CoinDisplayProps> = ({
  coins,
  size = 'small',
  animate = false,
}) => {
  const bounce = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      bounce.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 500 }),
          withTiming(3, { duration: 500 })
        ),
        -1,
        true
      );
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      <Animated.Text
        style={[
          styles.emoji,
          isLarge && styles.emojiLarge,
          animatedStyle,
        ]}
      >
        🪙
      </Animated.Text>
      <Text style={[styles.text, isLarge && styles.textLarge]}>
        {coins.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
    ...SHADOWS.small,
  },
  containerLarge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  emoji: {
    fontSize: 18,
  },
  emojiLarge: {
    fontSize: 28,
  },
  text: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  textLarge: {
    fontSize: FONTS.sizes.xl,
  },
});
