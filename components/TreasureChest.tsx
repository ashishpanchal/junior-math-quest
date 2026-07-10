// ============================================================
// Math Treasure Hunt - Treasure Chest Component
// Animated sparkling treasure chest for rewards
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface TreasureChestProps {
  isOpen?: boolean;
  size?: number;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({
  isOpen = false,
  size = 100,
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.5);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 5 }),
        withSpring(1.1, { damping: 8 })
      );
    }

    // Gentle pulse
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      true
    );

    // Sparkle rotation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );
  }, [isOpen]);

  const chestStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[{ fontSize: size * 0.3 }, sparkleStyle, styles.sparkle]}>
        ✨
      </Animated.Text>
      <Animated.Text style={[{ fontSize: size }, chestStyle]}>
        {isOpen ? '🎁' : '🧳'}
      </Animated.Text>
      <Animated.Text style={[{ fontSize: size * 0.25 }, sparkleStyle, styles.sparkleRight]}>
        💫
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
  sparkle: {
    position: 'absolute',
    top: -10,
    left: -10,
  },
  sparkleRight: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
});
