// ============================================================
// Math Treasure Hunt - Coin Display Component (Enhanced)
// Shows the player's coin count with sparkle and bounce animations
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';

interface CoinDisplayProps {
  coins: number;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  showPlus?: boolean;
}

export const CoinDisplay: React.FC<CoinDisplayProps> = ({
  coins,
  size = 'small',
  animate = true,
  showPlus = false,
}) => {
  const coinRotation = useSharedValue(0);
  const coinScale = useSharedValue(1);
  const shimmerX = useSharedValue(-30);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (animate) {
      // Coin wobble
      coinRotation.value = withRepeat(
        withSequence(
          withTiming(8, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(-8, { duration: 600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      // Subtle pulse
      coinScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1.0, { duration: 800 })
        ),
        -1,
        true
      );
      // Shimmer sweep
      shimmerX.value = withDelay(
        500,
        withRepeat(
          withSequence(
            withTiming(40, { duration: 1500 }),
            withTiming(-30, { duration: 0 }),
            withTiming(-30, { duration: 2000 }) // pause
          ),
          -1,
          false
        )
      );
      // Glow
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1000 }),
          withTiming(0.2, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [animate]);

  const coinStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${coinRotation.value}deg` },
      { scale: coinScale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const sizeConfig = SIZE_MAP[size];

  return (
    <View style={[styles.outerContainer, sizeConfig.outer]}>
      {/* Glow ring */}
      <Animated.View style={[styles.glowRing, sizeConfig.outer, glowStyle]} />

      <LinearGradient
        colors={['#FFF9E6', '#FFFFFF', '#FFF9E6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, sizeConfig.container]}
      >
        {/* Animated coin */}
        <Animated.Text style={[{ fontSize: sizeConfig.emojiSize }, coinStyle]}>
          🪙
        </Animated.Text>

        {/* Count */}
        <Text style={[styles.text, { fontSize: sizeConfig.fontSize }]}>
          {showPlus && coins > 0 ? '+' : ''}
          {coins.toLocaleString()}
        </Text>
      </LinearGradient>
    </View>
  );
};

const SIZE_MAP = {
  small: {
    outer: { height: 36, minWidth: 72 },
    container: { paddingHorizontal: 10, paddingVertical: 4 },
    emojiSize: 18,
    fontSize: FONTS.sizes.md,
  },
  medium: {
    outer: { height: 44, minWidth: 90 },
    container: { paddingHorizontal: 14, paddingVertical: 6 },
    emojiSize: 24,
    fontSize: FONTS.sizes.lg,
  },
  large: {
    outer: { height: 56, minWidth: 110 },
    container: { paddingHorizontal: 18, paddingVertical: 10 },
    emojiSize: 32,
    fontSize: FONTS.sizes.xl,
  },
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.secondary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    ...SHADOWS.golden,
  },
  text: {
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textGold,
  },
});
