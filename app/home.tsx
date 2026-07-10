// ============================================================
// Math Treasure Hunt - Home Screen (Polished)
// Treasure map themed main menu with animated elements
// ============================================================

import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TreasureMapBg } from '../components/TreasureMapBg';
import { CoinDisplay } from '../components/CoinDisplay';
import { GameButton } from '../components/GameButton';
import { TreasureChest } from '../components/TreasureChest';
import { useGameProgress } from '../hooks/useGameProgress';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING, responsive } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { progress, isLoading } = useGameProgress();

  // Animations
  const characterY = useSharedValue(20);
  const characterScale = useSharedValue(0);
  const titleScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const mapPulse = useSharedValue(1);

  useEffect(() => {
    // Character bounces in
    characterScale.value = withDelay(200, withSpring(1, { damping: 6, stiffness: 120 }));
    characterY.value = withDelay(200, withSpring(0, { damping: 8 }));

    // Then floats
    setTimeout(() => {
      characterY.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }, 800);

    // Title entrance
    titleScale.value = withDelay(400, withSpring(1, { damping: 10 }));
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));

    // Map decoration pulse
    mapPulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000 }),
        withTiming(1.0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const characterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: characterY.value },
      { scale: characterScale.value },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  if (isLoading || !progress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🗺️</Text>
        <Text style={styles.loadingText}>Preparing your adventure...</Text>
      </View>
    );
  }

  return (
    <TreasureMapBg variant="home">
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + SPACING.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top status bar */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={styles.statusBar}
        >
          <CoinDisplay coins={progress.coins} size="medium" />
          <View style={styles.starsChip}>
            <Text style={styles.starsEmoji}>⭐</Text>
            <Text style={styles.starsValue}>{progress.totalStars}</Text>
          </View>
        </Animated.View>

        {/* Hero section with character */}
        <View style={styles.heroSection}>
          <Animated.View style={characterStyle}>
            <Text style={styles.characterEmoji}>{progress.profile.avatar}</Text>
          </Animated.View>

          <Animated.View style={titleStyle}>
            <Text style={styles.greeting}>
              Hi, {progress.profile.name}! 👋
            </Text>
            <Text style={styles.title}>Math Treasure</Text>
            <Text style={styles.titleAccent}>Hunt</Text>
          </Animated.View>

          <Animated.Text
            entering={FadeInUp.delay(700).duration(400)}
            style={styles.tagline}
          >
            Solve puzzles · Find treasures · Have fun!
          </Animated.Text>
        </View>

        {/* Play button (big and prominent) */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(500)}
          style={styles.playSection}
        >
          <Pressable
            onPress={() => router.push('/worlds')}
            style={({ pressed }) => [
              styles.playButtonOuter,
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
          >
            <LinearGradient
              colors={['#FF6B35', '#FF8C00', '#FFa040']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButton}
            >
              <Text style={styles.playEmoji}>🎮</Text>
              <Text style={styles.playText}>Start Adventure!</Text>
              <Text style={styles.playSubtext}>Choose a world →</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Quick action row */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(500)}
          style={styles.actionsRow}
        >
          <Pressable
            onPress={() => router.push('/profile')}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={['#E3F2FD', '#BBDEFB']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionEmoji}>👤</Text>
              <Text style={styles.actionLabel}>Profile</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push('/achievements')}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={['#FFF8E1', '#FFECB3']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionEmoji}>🏆</Text>
              <Text style={styles.actionLabel}>Awards</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={['#F3E5F5', '#E1BEE7']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionEmoji}>⚙️</Text>
              <Text style={styles.actionLabel}>Settings</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Stats card */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(500)}
          style={styles.statsCard}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FAFAFA']}
            style={styles.statsGradient}
          >
            <Text style={styles.statsTitle}>My Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: '#FFEBEE' }]}>
                  <Text style={styles.statEmoji}>🔥</Text>
                </View>
                <Text style={styles.statValue}>{progress.profile.streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={styles.statEmoji}>✅</Text>
                </View>
                <Text style={styles.statValue}>
                  {Object.values(progress.completedLevels).flat().length}
                </Text>
                <Text style={styles.statLabel}>Levels</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={styles.statEmoji}>🌍</Text>
                </View>
                <Text style={styles.statValue}>
                  {progress.unlockedWorlds.length}
                </Text>
                <Text style={styles.statLabel}>Worlds</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={styles.statEmoji}>🏅</Text>
                </View>
                <Text style={styles.statValue}>
                  {progress.achievements.length}
                </Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </TreasureMapBg>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingEmoji: { fontSize: 60, marginBottom: SPACING.md },
  loadingText: { fontSize: FONTS.sizes.lg, color: COLORS.textSecondary },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  // Status bar
  statusBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  starsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    ...SHADOWS.golden,
  },
  starsEmoji: { fontSize: 18 },
  starsValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textGold,
  },
  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  characterEmoji: {
    fontSize: responsive.font(90),
    marginBottom: SPACING.sm,
  },
  greeting: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.black,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: FONTS.sizes.hero * 1.1,
    textShadowColor: 'rgba(255, 107, 53, 0.2)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  titleAccent: {
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.black,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: FONTS.sizes.hero * 1.1,
    textShadowColor: 'rgba(218, 165, 32, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontWeight: FONTS.weights.medium,
    letterSpacing: 0.5,
  },
  // Play button
  playSection: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  playButtonOuter: {
    borderRadius: BORDER_RADIUS.xxl,
    ...SHADOWS.large,
  },
  playButton: {
    borderRadius: BORDER_RADIUS.xxl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  playEmoji: { fontSize: 40, marginBottom: SPACING.sm },
  playText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textLight,
  },
  playSubtext: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
  // Actions row
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  actionCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.small,
  },
  actionGradient: {
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionEmoji: { fontSize: 28 },
  actionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  // Stats
  statsCard: {
    width: '100%',
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  statsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', gap: SPACING.xs },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statEmoji: { fontSize: 22 },
  statValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
});
