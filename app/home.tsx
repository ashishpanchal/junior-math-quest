// ============================================================
// Math Treasure Hunt - Home Screen
// Main menu with play button and navigation options
// ============================================================

import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoinDisplay } from '../components/CoinDisplay';
import { GameButton } from '../components/GameButton';
import { useGameProgress } from '../hooks/useGameProgress';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { progress, isLoading } = useGameProgress();
  const bounceY = useSharedValue(0);
  const characterScale = useSharedValue(0);

  useEffect(() => {
    // Character entrance
    characterScale.value = withSpring(1, { damping: 8 });

    // Floating animation
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const characterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { scale: characterScale.value },
    ],
  }));

  if (isLoading || !progress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading... ⏳</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#FFF8E7', '#FFE4B5']} style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + SPACING.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with coins */}
        <View style={styles.header}>
          <CoinDisplay coins={progress.coins} />
          <View style={styles.starsDisplay}>
            <Text style={styles.starsText}>⭐ {progress.totalStars}</Text>
          </View>
        </View>

        {/* Character and title */}
        <View style={styles.heroSection}>
          <Animated.Text style={[styles.character, characterStyle]}>
            {progress.profile.avatar}
          </Animated.Text>
          <Text style={styles.greeting}>
            Hi, {progress.profile.name}! 👋
          </Text>
          <Text style={styles.title}>Math Treasure Hunt</Text>
          <Text style={styles.subtitle}>Solve puzzles, find treasures!</Text>
        </View>

        {/* Main buttons */}
        <View style={styles.buttonsContainer}>
          <GameButton
            title="Play!"
            emoji="🎮"
            variant="primary"
            size="large"
            onPress={() => router.push('/worlds')}
            style={styles.playButton}
          />

          <View style={styles.buttonRow}>
            <GameButton
              title="Profile"
              emoji="👤"
              variant="accent"
              size="medium"
              onPress={() => router.push('/profile')}
              style={styles.halfButton}
            />
            <GameButton
              title="Awards"
              emoji="🏆"
              variant="secondary"
              size="medium"
              onPress={() => router.push('/achievements')}
              style={styles.halfButton}
            />
          </View>

          <GameButton
            title="Settings"
            emoji="⚙️"
            variant="success"
            size="small"
            onPress={() => router.push('/settings')}
          />
        </View>

        {/* Stats section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{progress.profile.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statValue}>
              {Object.values(progress.completedLevels).flat().length}
            </Text>
            <Text style={styles.statLabel}>Levels</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🌍</Text>
            <Text style={styles.statValue}>
              {progress.unlockedWorlds.length}
            </Text>
            <Text style={styles.statLabel}>Worlds</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  starsDisplay: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  starsText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  character: {
    fontSize: 80,
    marginBottom: SPACING.sm,
  },
  greeting: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  playButton: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  halfButton: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: SPACING.lg,
    gap: SPACING.lg,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
