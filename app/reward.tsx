// ============================================================
// Math Treasure Hunt - Treasure Reward Screen
// Celebration screen after completing a level
// ============================================================

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { Confetti } from '../components/Confetti';
import { StarRating } from '../components/StarRating';
import { TreasureChest } from '../components/TreasureChest';
import { GameButton } from '../components/GameButton';
import { rewardHaptic } from '../utils/haptics';
import { playSound } from '../utils/sound';
import { GAME_WORLDS, WORLD_STORIES } from '../constants/gameData';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { WorldId } from '../types';

export default function RewardScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    worldId: string;
    levelId: string;
    stars: string;
    coins: string;
    correct: string;
    total: string;
  }>();

  const worldId = params.worldId as WorldId;
  const levelId = parseInt(params.levelId || '1', 10);
  const stars = parseInt(params.stars || '0', 10);
  const coins = parseInt(params.coins || '0', 10);
  const correct = parseInt(params.correct || '0', 10);
  const total = parseInt(params.total || '0', 10);

  const world = GAME_WORLDS.find((w) => w.id === worldId);
  const coinBounce = useSharedValue(0);

  useEffect(() => {
    rewardHaptic();
    playSound('treasure');

    coinBounce.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 400 }),
          withTiming(5, { duration: 400 })
        ),
        -1,
        true
      )
    );
  }, []);

  const coinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: coinBounce.value }],
  }));

  const getMessage = () => {
    if (stars === 3) return 'Perfect! You are amazing! 🌟';
    if (stars === 2) return 'Great job! Almost perfect! 🎉';
    if (stars === 1) return 'Good work! Keep practicing! 💪';
    return 'Nice try! You can do better! 😊';
  };

  return (
    <LinearGradient colors={['#FFD700', '#FF8C00']} style={styles.container}>
      <Confetti isActive={stars >= 2} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.xl, paddingBottom: insets.bottom + SPACING.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Level complete title */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>Level Complete!</Text>
          <Text style={styles.levelInfo}>
            {world?.emoji} {world?.name} - Level {levelId}
          </Text>
        </Animated.View>

        {/* Treasure chest */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.chestContainer}>
          <TreasureChest isOpen size={100} />
        </Animated.View>

        {/* Stars */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.starsContainer}>
          <StarRating stars={stars} size={48} animate />
        </Animated.View>

        {/* Message */}
        <Animated.Text entering={FadeInDown.delay(900).duration(500)} style={styles.message}>
          {getMessage()}
        </Animated.Text>

        {/* Results card */}
        <Animated.View entering={FadeInDown.delay(1100).duration(500)} style={styles.resultsCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Questions</Text>
            <Text style={styles.resultValue}>
              {correct} / {total} ✅
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Animated.View style={[styles.coinRow, coinStyle]}>
              <Text style={styles.resultLabel}>Coins Earned</Text>
              <Text style={styles.resultValue}>+{coins} 🪙</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Story snippet — what happens next in the adventure */}
        {WORLD_STORIES[worldId] && WORLD_STORIES[worldId][levelId - 1] && (
          <Animated.View entering={FadeInDown.delay(1250).duration(500)} style={styles.storyCard}>
            <Text style={styles.storyText}>
              {WORLD_STORIES[worldId][levelId - 1]}
            </Text>
          </Animated.View>
        )}

        {/* Buttons */}
        <Animated.View entering={FadeInUp.delay(1400).duration(500)} style={styles.buttons}>
          <GameButton
            title="Next Level"
            emoji="➡️"
            variant="primary"
            size="large"
            onPress={() => {
              router.replace({
                pathname: '/game',
                params: {
                  worldId,
                  levelId: (levelId + 1).toString(),
                  difficulty: 'easy',
                },
              });
            }}
            style={styles.button}
          />
          <GameButton
            title="World Map"
            emoji="🗺️"
            variant="accent"
            size="medium"
            onPress={() => router.replace('/worlds')}
            style={styles.button}
          />
          <GameButton
            title="Home"
            emoji="🏠"
            variant="secondary"
            size="small"
            onPress={() => router.replace('/home')}
          />
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textLight,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  levelInfo: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
    opacity: 0.9,
  },
  chestContainer: {
    marginVertical: SPACING.lg,
  },
  starsContainer: {
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resultsCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  resultLabel: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },
  resultValue: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.bold,
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.md,
  },
  storyCard: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  storyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.semibold,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  button: {
    width: '100%',
  },
});
