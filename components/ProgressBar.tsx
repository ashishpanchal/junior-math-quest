// ============================================================
// Math Treasure Hunt - Progress Bar Component
// Animated progress bar showing level completion
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  height?: number;
  colors?: [string, string];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  height = 16,
  colors = [COLORS.accent, COLORS.green],
}) => {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withSpring(progress, { damping: 15 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(animatedWidth.value * 100, 100)}%`,
  }));

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, { height }, animatedStyle]}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, { height }]}
          />
        </Animated.View>
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
  track: {
    width: '100%',
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  percentage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'right',
    fontWeight: FONTS.weights.medium,
  },
});
