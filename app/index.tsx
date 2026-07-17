// ============================================================
// Math Treasure Hunt - Splash Screen
// Animated splash with treasure theme
// ============================================================

import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../constants/theme';


export default function SplashScreen() {
  const titleScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const chestScale = useSharedValue(0);
  const sparkle = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    // Treasure chest bounces in
    chestScale.value = withDelay(200, withSpring(1, { damping: 6 }));

    // Title fades and scales in
    titleScale.value = withDelay(600, withSpring(1, { damping: 8 }));
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));

    // Sparkle animation
    sparkle.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        true
      )
    );

    // Subtitle fades in
    subtitleOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }));

    // Navigate to home after animation
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const chestStyle = useAnimatedStyle(() => ({
    transform: [{ scale: chestScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkle.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#FFD700', '#FF8C00', '#FF6B35']}
      style={styles.container}
    >
      {/* Decorative sparkles */}
      <Animated.Text style={[styles.sparkleLeft, sparkleStyle]}>✨</Animated.Text>
      <Animated.Text style={[styles.sparkleRight, sparkleStyle]}>💫</Animated.Text>
      <Animated.Text style={[styles.sparkleTop, sparkleStyle]}>⭐</Animated.Text>

      {/* Treasure chest */}
      <Animated.Text style={[styles.chest, chestStyle]}>🏆</Animated.Text>

      {/* Title */}
      <Animated.View style={titleStyle}>
        <Text style={styles.title}>Math</Text>
        <Text style={styles.titleHighlight}>Treasure Hunt</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Adventure awaits! 🗺️
      </Animated.Text>

      {/* Decorative bottom emojis */}
      <View style={styles.bottomDecor}>
        <Text style={styles.decorEmoji}>🌴</Text>
        <Text style={styles.decorEmoji}>🏴‍☠️</Text>
        <Text style={styles.decorEmoji}>🚀</Text>
        <Text style={styles.decorEmoji}>🦕</Text>
        <Text style={styles.decorEmoji}>🍭</Text>
        <Text style={styles.decorEmoji}>🐠</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chest: {
    fontSize: 100,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textLight,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleHighlight: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.extrabold,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textLight,
    marginTop: SPACING.md,
    fontWeight: FONTS.weights.medium,
  },
  sparkleLeft: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    fontSize: 32,
  },
  sparkleRight: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    fontSize: 32,
  },
  sparkleTop: {
    position: 'absolute',
    top: '10%',
    fontSize: 28,
  },
  bottomDecor: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 60,
    gap: SPACING.md,
  },
  decorEmoji: {
    fontSize: 28,
  },
});
