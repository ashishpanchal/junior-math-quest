// ============================================================
// Math Treasure Hunt - Level Button Component
// Circular button for level selection grid
// ============================================================

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { lightHaptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LevelButtonProps {
  levelNumber: number;
  stars: number; // 0-3
  isLocked: boolean;
  isCompleted: boolean;
  color: string;
  onPress: () => void;
}

export const LevelButton: React.FC<LevelButtonProps> = ({
  levelNumber,
  stars,
  isLocked,
  isCompleted,
  color,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isLocked) scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (!isLocked) {
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
      <View
        style={[
          styles.button,
          {
            backgroundColor: isLocked ? COLORS.disabled : color,
            opacity: isLocked ? 0.5 : 1,
          },
        ]}
      >
        {isLocked ? (
          <Text style={styles.lockIcon}>🔒</Text>
        ) : (
          <Text style={styles.levelNumber}>{levelNumber}</Text>
        )}
      </View>
      {!isLocked && stars > 0 && (
        <View style={styles.starsContainer}>
          {Array.from({ length: 3 }, (_, i) => (
            <Text key={i} style={styles.miniStar}>
              {i < stars ? '⭐' : '☆'}
            </Text>
          ))}
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: SPACING.sm,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  levelNumber: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
  },
  lockIcon: {
    fontSize: 22,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  miniStar: {
    fontSize: 10,
  },
});
