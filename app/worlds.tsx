// ============================================================
// Math Treasure Hunt - World Selection Screen (Polished)
// Treasure map themed world grid with card animations
// ============================================================

import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
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
import { useGameProgress } from '../hooks/useGameProgress';
import { GAME_WORLDS } from '../constants/gameData';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING, responsive } from '../constants/theme';
import { GameWorld, WorldId } from '../types';
import { lightHaptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface WorldCardEnhancedProps {
  world: GameWorld;
  isUnlocked: boolean;
  starsEarned: number;
  index: number;
  onPress: () => void;
}

const WorldCardEnhanced: React.FC<WorldCardEnhancedProps> = ({
  world,
  isUnlocked,
  starsEarned,
  index,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const floatY = useSharedValue(0);

  useEffect(() => {
    // Gentle float for unlocked cards
    if (isUnlocked) {
      floatY.value = withDelay(
        index * 200,
        withRepeat(
          withSequence(
            withTiming(-3, { duration: 2000 }),
            withTiming(3, { duration: 2000 })
          ),
          -1,
          true
        )
      );
    }
  }, [isUnlocked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: floatY.value },
    ],
  }));

  const handlePressIn = () => {
    if (isUnlocked) {
      scale.value = withSpring(0.93, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 });
  };

  const handlePress = () => {
    if (isUnlocked) {
      lightHaptic();
      onPress();
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(200 + index * 100).duration(500).springify()}
      style={styles.worldCardWrapper}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.worldCard, animatedStyle]}
      >
        <LinearGradient
          colors={isUnlocked ? world.gradientColors : ['#CFD8DC', '#B0BEC5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.worldGradient}
        >
          {/* Decorative shimmer */}
          {isUnlocked && (
            <View style={styles.shimmerOverlay} />
          )}

          {/* World emoji */}
          <Text style={styles.worldEmoji}>{world.emoji}</Text>

          {/* World name */}
          <Text style={styles.worldName} numberOfLines={1}>
            {world.name}
          </Text>

          {/* Stars or lock */}
          {isUnlocked ? (
            <View style={styles.worldStarsRow}>
              <Text style={styles.worldStarsText}>⭐ {starsEarned}</Text>
            </View>
          ) : (
            <View style={styles.lockBadge}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockText}>{world.requiredStars} ⭐</Text>
            </View>
          )}
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
};

export default function WorldSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { progress, isLoading } = useGameProgress();

  if (isLoading || !progress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🌍</Text>
        <Text style={styles.loadingText}>Loading worlds...</Text>
      </View>
    );
  }

  const getWorldStars = (worldId: WorldId): number => {
    let stars = 0;
    for (const key of Object.keys(progress.levelStars)) {
      if (key.startsWith(worldId)) {
        stars += progress.levelStars[key];
      }
    }
    return stars;
  };

  const handleWorldPress = (worldId: WorldId) => {
    router.push({ pathname: '/levels', params: { worldId } });
  };

  return (
    <TreasureMapBg variant="world">
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + SPACING.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.header}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Choose a World!</Text>
            <Text style={styles.headerSubtitle}>
              {progress.totalStars} ⭐ collected
            </Text>
          </View>

          <CoinDisplay coins={progress.coins} size="small" />
        </Animated.View>

        {/* Treasure map scroll message */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.mapBanner}
        >
          <LinearGradient
            colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.05)']}
            style={styles.mapBannerGradient}
          >
            <Text style={styles.mapBannerEmoji}>🗺️</Text>
            <Text style={styles.mapBannerText}>
              Unlock worlds by collecting stars!
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* World grid */}
        <View style={styles.worldGrid}>
          {GAME_WORLDS.map((world, index) => {
            const isUnlocked = progress.unlockedWorlds.includes(world.id);
            return (
              <WorldCardEnhanced
                key={world.id}
                world={world}
                isUnlocked={isUnlocked}
                starsEarned={getWorldStars(world.id)}
                index={index}
                onPress={() => handleWorldPress(world.id)}
              />
            );
          })}
        </View>

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
  loadingEmoji: { fontSize: 50, marginBottom: SPACING.md },
  loadingText: { fontSize: FONTS.sizes.lg, color: COLORS.textSecondary },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.bold,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Map banner
  mapBanner: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  mapBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.borderGold,
    gap: SPACING.sm,
  },
  mapBannerEmoji: { fontSize: 24 },
  mapBannerText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textGold,
    fontWeight: FONTS.weights.semibold,
    flex: 1,
  },
  // World grid
  worldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  worldCardWrapper: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  worldCard: {
    width: '100%',
    aspectRatio: 0.95,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.large,
  },
  worldGradient: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderBottomLeftRadius: 100,
  },
  worldEmoji: {
    fontSize: responsive.font(48),
    marginBottom: SPACING.sm,
  },
  worldName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  worldStarsRow: {
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  worldStarsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.bold,
  },
  lockBadge: {
    marginTop: SPACING.sm,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  lockIcon: { fontSize: 18 },
  lockText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.medium,
    marginTop: 2,
  },
});
