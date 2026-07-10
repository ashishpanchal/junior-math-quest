// ============================================================
// Math Treasure Hunt - Treasure Map Background Component
// Decorative treasure-map themed background with floating elements
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
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FloatingElementProps {
  emoji: string;
  size: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  emoji,
  size,
  top,
  left,
  delay,
  duration,
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.15);
  const rotation = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration }),
          withTiming(12, { duration })
        ),
        -1,
        true
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.25, { duration: duration * 0.8 }),
          withTiming(0.12, { duration: duration * 0.8 })
        ),
        -1,
        true
      )
    );
    rotation.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: duration * 1.5 }),
          withTiming(5, { duration: duration * 1.5 })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        {
          position: 'absolute',
          top: `${top}%`,
          left: `${left}%`,
          fontSize: size,
        },
        style,
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

interface TreasureMapBgProps {
  variant?: 'home' | 'world' | 'game' | 'ocean';
  children: React.ReactNode;
}

const BG_ELEMENTS = {
  home: [
    { emoji: '🗺️', size: 40, top: 5, left: 80, delay: 0, duration: 3000 },
    { emoji: '💎', size: 28, top: 15, left: 8, delay: 500, duration: 3500 },
    { emoji: '🧭', size: 32, top: 35, left: 85, delay: 200, duration: 2800 },
    { emoji: '⚓', size: 26, top: 55, left: 5, delay: 800, duration: 3200 },
    { emoji: '🌟', size: 22, top: 70, left: 90, delay: 400, duration: 2500 },
    { emoji: '🪙', size: 24, top: 82, left: 12, delay: 600, duration: 3400 },
    { emoji: '🏴‍☠️', size: 30, top: 90, left: 75, delay: 300, duration: 2900 },
  ],
  world: [
    { emoji: '🌍', size: 36, top: 3, left: 5, delay: 0, duration: 3200 },
    { emoji: '✨', size: 22, top: 12, left: 88, delay: 300, duration: 2600 },
    { emoji: '🗝️', size: 28, top: 40, left: 3, delay: 600, duration: 3000 },
    { emoji: '💫', size: 24, top: 60, left: 92, delay: 100, duration: 3400 },
    { emoji: '🏆', size: 26, top: 78, left: 8, delay: 700, duration: 2800 },
    { emoji: '⭐', size: 20, top: 88, left: 85, delay: 400, duration: 3100 },
  ],
  game: [
    { emoji: '✨', size: 18, top: 8, left: 5, delay: 0, duration: 2800 },
    { emoji: '💫', size: 16, top: 20, left: 92, delay: 400, duration: 3200 },
    { emoji: '⭐', size: 14, top: 45, left: 3, delay: 200, duration: 2500 },
    { emoji: '🌟', size: 16, top: 75, left: 95, delay: 600, duration: 3000 },
  ],
  ocean: [
    { emoji: '🐠', size: 28, top: 10, left: 8, delay: 0, duration: 3500 },
    { emoji: '🐚', size: 24, top: 25, left: 85, delay: 500, duration: 3000 },
    { emoji: '🌊', size: 30, top: 50, left: 5, delay: 300, duration: 2800 },
    { emoji: '⚓', size: 26, top: 70, left: 90, delay: 700, duration: 3200 },
    { emoji: '🧜‍♀️', size: 28, top: 85, left: 10, delay: 200, duration: 3400 },
  ],
};

const GRADIENT_MAP: Record<string, readonly string[]> = {
  home: GRADIENTS.homeScreen,
  world: GRADIENTS.treasureMap,
  game: GRADIENTS.gameScreen,
  ocean: GRADIENTS.oceanDeep,
};

export const TreasureMapBg: React.FC<TreasureMapBgProps> = ({
  variant = 'home',
  children,
}) => {
  const elements = BG_ELEMENTS[variant];
  const gradient = GRADIENT_MAP[variant];

  return (
    <LinearGradient colors={gradient as unknown as string[]} style={styles.container}>
      {/* Decorative dotted map lines */}
      <View style={styles.mapOverlay} pointerEvents="none">
        {/* Corner compass rose decoration */}
        <View style={styles.compassCorner}>
          <Animated.Text style={styles.compassText}>⊕</Animated.Text>
        </View>
      </View>

      {/* Floating background elements */}
      <View style={styles.elementsContainer} pointerEvents="none">
        {elements.map((el, i) => (
          <FloatingElement key={i} {...el} />
        ))}
      </View>

      {/* Actual content */}
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  compassCorner: {
    position: 'absolute',
    top: 60,
    right: 20,
    opacity: 0.06,
  },
  compassText: {
    fontSize: 80,
    color: COLORS.mapBrown,
  },
  elementsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
