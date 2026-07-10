// ============================================================
// Math Treasure Hunt - Confetti Component
// Fun confetti animation for celebrations
// ============================================================

import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_PIECES = 30;
const CONFETTI_COLORS = ['#FF6B35', '#FFD700', '#4ECDC4', '#9B59B6', '#FF69B4', '#2ECC71', '#3498DB'];
const CONFETTI_EMOJIS = ['🎉', '⭐', '🌟', '✨', '💫', '🎊', '🪙'];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(Math.random() * SCREEN_WIDTH);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const isEmoji = index % 3 === 0;
  const emoji = CONFETTI_EMOJIS[index % CONFETTI_EMOJIS.length];
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const delay = Math.random() * 1000;
  const duration = 2000 + Math.random() * 2000;

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(SCREEN_HEIGHT + 50, { duration }),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(translateX.value + 30, { duration: duration / 4 }),
          withTiming(translateX.value - 30, { duration: duration / 4 }),
          withTiming(translateX.value + 15, { duration: duration / 4 }),
          withTiming(translateX.value - 15, { duration: duration / 4 })
        ),
        -1,
        true
      )
    );

    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration / 2 }),
        -1,
        false
      )
    );

    // Fade out towards bottom
    opacity.value = withDelay(
      delay + duration * 0.7,
      withRepeat(
        withSequence(
          withTiming(0, { duration: duration * 0.3 }),
          withTiming(1, { duration: 0 })
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
    ],
    opacity: opacity.value,
  }));

  if (isEmoji) {
    return (
      <Animated.Text style={[styles.piece, animatedStyle, { fontSize: 20 }]}>
        {emoji}
      </Animated.Text>
    );
  }

  return (
    <Animated.View
      style={[
        styles.piece,
        styles.confettiRect,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

interface ConfettiProps {
  isActive: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: CONFETTI_PIECES }, (_, i) => (
        <ConfettiPiece key={i} index={i} />
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
  },
  confettiRect: {
    width: 10,
    height: 20,
    borderRadius: 3,
  },
});
