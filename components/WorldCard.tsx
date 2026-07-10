// ============================================================
// Math Treasure Hunt - World Card Component
// Displays a game world with lock/unlock state
// ============================================================

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { GameWorld } from '../types';
import { lightHaptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface WorldCardProps {
  world: GameWorld;
  isUnlocked: boolean;
  starsEarned: number;
  onPress: () => void;
}

export const WorldCard: React.FC<WorldCardProps> = ({
  world,
  isUnlocked,
  starsEarned,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (isUnlocked) scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (isUnlocked) {
      lightHaptic();
      onPress();
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      <LinearGradient
        colors={isUnlocked ? world.gradientColors : ['#BDC3C7', '#95A5A6']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.emoji}>{world.emoji}</Text>
        <Text style={styles.name}>{world.name}</Text>
        {isUnlocked ? (
          <View style={styles.starsRow}>
            <Text style={styles.starsText}>⭐ {starsEarned}</Text>
          </View>
        ) : (
          <View style={styles.lockContainer}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.lockText}>
              {world.requiredStars} ⭐ to unlock
            </Text>
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '47%',
    aspectRatio: 1,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.medium,
  },
  gradient: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  starsRow: {
    marginTop: SPACING.sm,
  },
  starsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.semibold,
  },
  lockContainer: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  lockEmoji: {
    fontSize: 24,
  },
  lockText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
