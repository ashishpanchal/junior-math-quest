// ============================================================
// Math Treasure Hunt - Confetti Component (Enhanced)
// Rich, celebratory confetti with varied particles and bursts
// ============================================================

import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COUNT = 40;
const CONFETTI_COLORS = [
  '#FF6B35', '#FFD700', '#4ECDC4', '#9B59B6',
  '#FF69B4', '#2ECC71', '#3498DB', '#F39C12',
  '#E74C3C', '#1ABC9C', '#FF8C00', '#8E44AD',
];
const CELEBRATION_EMOJIS = [
  '🎉', '⭐', '🌟', '✨', '💫', '🎊',
  '🪙', '💎', '🏆', '🎈', '🎁', '❤️',
];

interface ConfettiPieceProps {
  index: number;
  totalPieces: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index, totalPieces }) => {
  const translateY = useSharedValue(-80);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  // Generate random but deterministic properties from index
  const startX = useMemo(() => (index / totalPieces) * SCREEN_WIDTH + (Math.random() - 0.5) * 40, [index]);
  const isEmoji = index % 4 === 0;
  const emoji = CELEBRATION_EMOJIS[index % CELEBRATION_EMOJIS.length];
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const isSquare = index % 3 === 0;
  const delay = (index % 8) * 150 + Math.random() * 300;
  const duration = 2500 + (index % 5) * 400;
  const swayAmount = 25 + (index % 4) * 15;

  useEffect(() => {
    // Entrance burst
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.3, { duration: 200, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 150 })
      )
    );

    // Fall down
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(SCREEN_HEIGHT + 100, { duration, easing: Easing.in(Easing.quad) }),
          withTiming(-80, { duration: 0 })
        ),
        -1,
        false
      )
    );

    // Sway
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(swayAmount, { duration: duration / 3, easing: Easing.inOut(Easing.sin) }),
          withTiming(-swayAmount, { duration: duration / 3, easing: Easing.inOut(Easing.sin) }),
          withTiming(swayAmount / 2, { duration: duration / 3, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    // Spin
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360 * (index % 2 === 0 ? 1 : -1), { duration: duration * 0.7 }),
        -1,
        false
      )
    );

    // Fade out near bottom
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.6 }),
          withTiming(0, { duration: duration * 0.4 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (isEmoji) {
    return (
      <Animated.Text
        style={[
          styles.piece,
          { left: startX, fontSize: 22 + (index % 3) * 6 },
          animatedStyle,
        ]}
      >
        {emoji}
      </Animated.Text>
    );
  }

  return (
    <Animated.View
      style={[
        styles.piece,
        isSquare ? styles.confettiSquare : styles.confettiRect,
        { backgroundColor: color, left: startX },
        animatedStyle,
      ]}
    />
  );
};

/** Star burst at specific position */
const StarBurst: React.FC<{ active: boolean }> = ({ active }) => {
  const burstScale = useSharedValue(0);
  const burstOpacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      burstScale.value = withSequence(
        withTiming(2.5, { duration: 400, easing: Easing.out(Easing.exp) }),
        withTiming(0, { duration: 300 })
      );
      burstOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 600 })
      );
    }
  }, [active]);

  const burstStyle = useAnimatedStyle(() => ({
    transform: [{ scale: burstScale.value }],
    opacity: burstOpacity.value,
  }));

  return (
    <Animated.Text style={[styles.burst, burstStyle]}>
      💥
    </Animated.Text>
  );
};

interface ConfettiProps {
  isActive: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Central burst */}
      <StarBurst active={isActive} />

      {/* Confetti pieces */}
      {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
        <ConfettiPiece key={i} index={i} totalPieces={CONFETTI_COUNT} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    top: 0,
  },
  confettiRect: {
    width: 8,
    height: 18,
    borderRadius: 2,
  },
  confettiSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  burst: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    fontSize: 60,
  },
});
