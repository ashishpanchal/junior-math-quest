// ============================================================
// Math Treasure Hunt - Treasure Chest Component (Enhanced)
// Animated sparkling treasure chest with particle effects
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { COLORS } from '../constants/theme';

interface SparkleProps {
  index: number;
  size: number;
  parentSize: number;
}

const Sparkle: React.FC<SparkleProps> = ({ index, size, parentSize }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const angle = (index * (360 / 8)) * (Math.PI / 180);
  const radius = parentSize * 0.55;
  const baseX = Math.cos(angle) * radius;
  const baseY = Math.sin(angle) * radius;

  useEffect(() => {
    const delay = index * 200;
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 600 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withSpring(1.2, { damping: 6 }),
          withTiming(0, { duration: 400 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      )
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(baseX * 1.3, { duration: 600 }),
          withTiming(baseX, { duration: 0 }),
          withTiming(baseX, { duration: 800 })
        ),
        -1,
        false
      )
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(baseY * 1.3 - 10, { duration: 600 }),
          withTiming(baseY, { duration: 0 }),
          withTiming(baseY, { duration: 800 })
        ),
        -1,
        false
      )
    );
  }, []);

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const sparkles = ['✨', '⭐', '💫', '🌟', '✨', '💛', '✨', '⭐'];

  return (
    <Animated.Text
      style={[
        styles.sparkle,
        { fontSize: size * 0.2 },
        sparkleStyle,
      ]}
    >
      {sparkles[index % sparkles.length]}
    </Animated.Text>
  );
};

interface TreasureChestProps {
  isOpen?: boolean;
  size?: number;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({
  isOpen = false,
  size = 100,
}) => {
  const chestScale = useSharedValue(isOpen ? 0.8 : 1);
  const chestRotation = useSharedValue(0);
  const glowScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0.3);
  const lidBounce = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      // Dramatic open animation
      chestScale.value = withSequence(
        withSpring(1.4, { damping: 4, stiffness: 200 }),
        withSpring(1.15, { damping: 8 })
      );
      chestRotation.value = withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      lidBounce.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      chestScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: 1200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      chestRotation.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 2000 }),
          withTiming(2, { duration: 2000 })
        ),
        -1,
        true
      );
    }

    // Glow pulse
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000 }),
        withTiming(0.9, { duration: 1000 })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 800 }),
        withTiming(0.15, { duration: 800 })
      ),
      -1,
      true
    );
  }, [isOpen]);

  const chestStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: chestScale.value },
      { rotate: `${chestRotation.value}deg` },
      { translateY: lidBounce.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.container, { width: size * 2, height: size * 2 }]}>
      {/* Background glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: size * 0.7,
          },
          glowStyle,
        ]}
      />

      {/* Sparkle particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <Sparkle key={i} index={i} size={size} parentSize={size} />
      ))}

      {/* Main chest emoji */}
      <Animated.Text style={[{ fontSize: size }, chestStyle]}>
        {isOpen ? '🎁' : '🧳'}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    backgroundColor: COLORS.secondary,
  },
  sparkle: {
    position: 'absolute',
  },
});
