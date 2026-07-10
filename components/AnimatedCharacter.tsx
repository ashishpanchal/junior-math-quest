// ============================================================
// Math Treasure Hunt - Animated Character Component (Enhanced)
// Cute bouncing character with speech bubble and expressive animations
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';

type CharacterMood = 'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';

interface AnimatedCharacterProps {
  mood?: CharacterMood;
  size?: number;
  emoji?: string;
  message?: string;
  showPlatform?: boolean;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  mood = 'idle',
  size = 80,
  emoji = '🦁',
  message,
  showPlatform = true,
}) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.15);
  const eyeScale = useSharedValue(1);

  useEffect(() => {
    // Reset all values
    translateY.value = 0;
    scale.value = 1;
    rotation.value = 0;

    switch (mood) {
      case 'idle':
        // Smooth floating animation
        translateY.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          true
        );
        // Shadow scales with bounce
        shadowOpacity.value = withRepeat(
          withSequence(
            withTiming(0.08, { duration: 1500 }),
            withTiming(0.18, { duration: 1500 })
          ),
          -1,
          true
        );
        // Gentle blink
        eyeScale.value = withDelay(
          3000,
          withRepeat(
            withSequence(
              withTiming(0.1, { duration: 100 }),
              withTiming(1, { duration: 100 }),
              withTiming(1, { duration: 4000 })
            ),
            -1,
            false
          )
        );
        break;

      case 'happy':
        // Excited bounce with squash and stretch
        translateY.value = withRepeat(
          withSequence(
            withSpring(-28, { damping: 4, stiffness: 200 }),
            withSpring(0, { damping: 6, stiffness: 150 })
          ),
          4,
          true
        );
        scale.value = withRepeat(
          withSequence(
            withSpring(1.25, { damping: 6 }),
            withSpring(0.95, { damping: 8 }),
            withSpring(1.1, { damping: 10 })
          ),
          2,
          true
        );
        rotation.value = withSequence(
          withTiming(-8, { duration: 100 }),
          withTiming(8, { duration: 100 }),
          withTiming(-4, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
        break;

      case 'thinking':
        // Head tilt with gentle bob
        rotation.value = withRepeat(
          withSequence(
            withTiming(8, { duration: 800, easing: Easing.inOut(Easing.sin) }),
            withTiming(-3, { duration: 800, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          true
        );
        translateY.value = withRepeat(
          withSequence(
            withTiming(-4, { duration: 600 }),
            withTiming(0, { duration: 600 })
          ),
          -1,
          true
        );
        scale.value = withTiming(1.05, { duration: 400 });
        break;

      case 'celebrating':
        // Wild celebration with spinning
        translateY.value = withRepeat(
          withSequence(
            withSpring(-35, { damping: 3, stiffness: 250 }),
            withSpring(0, { damping: 4, stiffness: 200 })
          ),
          -1,
          true
        );
        scale.value = withRepeat(
          withSequence(
            withSpring(1.35, { damping: 5 }),
            withSpring(0.9, { damping: 6 }),
            withSpring(1.15, { damping: 8 })
          ),
          -1,
          true
        );
        rotation.value = withRepeat(
          withSequence(
            withTiming(-15, { duration: 150 }),
            withTiming(15, { duration: 150 })
          ),
          -1,
          true
        );
        break;

      case 'encouraging':
        // Gentle supportive nod
        translateY.value = withRepeat(
          withSequence(
            withTiming(-6, { duration: 400 }),
            withTiming(0, { duration: 400 })
          ),
          3,
          true
        );
        scale.value = withSequence(
          withSpring(1.1, { damping: 10 }),
          withSpring(1.0, { damping: 12 })
        );
        break;
    }
  }, [mood]);

  const characterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: shadowOpacity.value,
    transform: [
      { scaleX: 1 - Math.abs(translateY.value) * 0.005 },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Speech bubble */}
      {message && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={styles.speechBubble}
        >
          <Text style={styles.speechText}>{message}</Text>
          <View style={styles.speechArrow} />
        </Animated.View>
      )}

      {/* Character */}
      <Animated.View style={characterStyle}>
        <Text style={{ fontSize: size }}>{emoji}</Text>
      </Animated.View>

      {/* Ground shadow */}
      {showPlatform && (
        <Animated.View style={[styles.shadow, { width: size * 0.6 }, shadowStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubble: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.medium,
    maxWidth: 200,
  },
  speechText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.semibold,
    textAlign: 'center',
  },
  speechArrow: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    left: '45%',
    width: 12,
    height: 12,
    backgroundColor: COLORS.cardBackground,
    transform: [{ rotate: '45deg' }],
  },
  shadow: {
    height: 8,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: '#000',
    marginTop: 4,
  },
});
