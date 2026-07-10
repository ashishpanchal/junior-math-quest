// ============================================================
// Math Treasure Hunt - Animated Character Component
// A cute bouncing character that reacts to player actions
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

type CharacterMood = 'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';

interface AnimatedCharacterProps {
  mood?: CharacterMood;
  size?: number;
  emoji?: string;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  mood = 'idle',
  size = 80,
  emoji = '🦁',
}) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    switch (mood) {
      case 'idle':
        // Gentle floating animation
        translateY.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 1000 }),
            withTiming(0, { duration: 1000 })
          ),
          -1,
          true
        );
        scale.value = withSpring(1);
        rotation.value = withSpring(0);
        break;

      case 'happy':
        // Bouncy jump
        translateY.value = withRepeat(
          withSequence(
            withSpring(-20, { damping: 6 }),
            withSpring(0, { damping: 6 })
          ),
          3,
          true
        );
        scale.value = withSpring(1.2, { damping: 8 });
        break;

      case 'thinking':
        // Slight tilt
        rotation.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 500 }),
            withTiming(5, { duration: 500 })
          ),
          -1,
          true
        );
        break;

      case 'celebrating':
        // Excited bouncing and spinning
        translateY.value = withRepeat(
          withSequence(
            withSpring(-25, { damping: 5 }),
            withSpring(0, { damping: 5 })
          ),
          -1,
          true
        );
        scale.value = withRepeat(
          withSequence(
            withSpring(1.3, { damping: 8 }),
            withSpring(1.0, { damping: 8 })
          ),
          -1,
          true
        );
        rotation.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 200 }),
            withTiming(10, { duration: 200 })
          ),
          -1,
          true
        );
        break;

      case 'encouraging':
        // Gentle nod
        translateY.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 300 }),
            withTiming(0, { duration: 300 })
          ),
          3,
          true
        );
        break;
    }
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[{ fontSize: size }, animatedStyle]}>
        {emoji}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
