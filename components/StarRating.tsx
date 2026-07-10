// ============================================================
// Math Treasure Hunt - Star Rating Component
// Shows 1-3 stars with animation for level completion
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { SPACING } from '../constants/theme';

interface StarRatingProps {
  stars: number; // 0-3
  maxStars?: number;
  size?: number;
  animate?: boolean;
}

const Star: React.FC<{ filled: boolean; index: number; size: number; animate: boolean }> = ({
  filled,
  index,
  size,
  animate,
}) => {
  const scale = useSharedValue(animate ? 0 : 1);
  const rotation = useSharedValue(animate ? -30 : 0);

  useEffect(() => {
    if (animate && filled) {
      scale.value = withDelay(
        index * 300,
        withSpring(1, { damping: 8, stiffness: 150 })
      );
      rotation.value = withDelay(
        index * 300,
        withSpring(0, { damping: 10 })
      );
    }
  }, [animate, filled, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.Text style={[{ fontSize: size }, animatedStyle]}>
      {filled ? '⭐' : '☆'}
    </Animated.Text>
  );
};

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  maxStars = 3,
  size = 32,
  animate = false,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          filled={i < stars}
          index={i}
          size={size}
          animate={animate}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
});
