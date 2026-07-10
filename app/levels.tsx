// ============================================================
// Math Treasure Hunt - Level Selection Screen (Polished)
// Treasure path with animated level nodes and better spacing
// ============================================================

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressBar } from '../components/ProgressBar';
import { TreasureChest } from '../components/TreasureChest';
import { useGameProgress } from '../hooks/useGameProgress';
import { GAME_WORLDS } from '../constants/gameData';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { WorldId } from '../types';
import { lightHaptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// --- Level Node Component ---
interface LevelNodeProps {
  levelNumber: number;
  stars: number;
  isLocked: boolean;
  isCompleted: boolean;
  color: string;
  index: number;
  onPress: () => void;
}

const LevelNode: React.FC<LevelNodeProps> = ({
  levelNumber, stars, isLocked, isCompleted, color, index, onPress,
}) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (!isLocked && !isCompleted) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1000 }),
          withTiming(0.1, { duration: 1000 })
        ),
        -1, true
      );
    }
  }, [isLocked, isCompleted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    if (!isLocked) scale.value = withSpring(0.88, { damping: 15 });
  };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 12 }); };
  const handlePress = () => { if (!isLocked) { lightHaptic(); onPress(); } };

  const isLeft = index % 2 === 0;

  return (
    <Animated.View
      entering={FadeInUp.delay(100 + index * 80).duration(400)}
      style={[styles.levelNodeRow, { justifyContent: isLeft ? 'flex-start' : 'flex-end' }]}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.levelNode, animatedStyle]}
      >
        {!isLocked && !isCompleted && (
          <Animated.View style={[styles.levelGlow, { backgroundColor: color }, glowStyle]} />
        )}
        <View
          style={[
            styles.levelCircle,
            { backgroundColor: isLocked ? COLORS.disabled : color,
              borderColor: isLocked ? '#AAA' : color },
            isCompleted && styles.levelCompleted,
          ]}
        >
          {isLocked ? (
            <Text style={styles.lockEmoji}>🔒</Text>
          ) : (
            <Text style={styles.levelNumber}>{levelNumber}</Text>
          )}
        </View>
        {!isLocked && stars > 0 && (
          <View style={styles.miniStars}>
            {Array.from({ length: 3 }, (_, i) => (
              <Text key={i} style={styles.miniStar}>{i < stars ? '⭐' : '☆'}</Text>
            ))}
          </View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
};

// --- Main Screen ---
export default function LevelSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { worldId } = useLocalSearchParams<{ worldId: WorldId }>();
  const { progress, isLoading } = useGameProgress();

  if (isLoading || !progress || !worldId) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading...</Text></View>;
  }
  const world = GAME_WORLDS.find((w) => w.id === worldId);
  if (!world) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>World not found</Text></View>;
  }

  const completedLevels = progress.completedLevels[worldId] || [];
  const totalLevels = world.levelsCount;
  const worldProgress = completedLevels.length / totalLevels;

  const isLevelLocked = (n: number) => n === 1 ? false : !completedLevels.includes(n - 1);
  const getLevelStars = (n: number) => progress.levelStars[`${worldId}-${n}`] || 0;
  const handleLevelPress = (n: number) => {
    router.push({ pathname: '/game', params: { worldId, levelId: n.toString(), difficulty: progress.settings.difficulty } });
  };

  return (
    <LinearGradient colors={world.gradientColors} style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.md }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.worldHeaderEmoji}>{world.emoji}</Text>
            <Text style={styles.worldHeaderName}>{world.name}</Text>
          </View>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* Progress */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{completedLevels.length} / {totalLevels} Levels</Text>
            <Text style={styles.progressPercent}>{Math.round(worldProgress * 100)}%</Text>
          </View>
          <ProgressBar progress={worldProgress} height={14} colors={['#FFFFFF', '#FFD700']} />
        </Animated.View>

        {/* Treasure goal */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.treasureGoal}>
          <TreasureChest isOpen={worldProgress >= 1} size={50} />
          <Text style={styles.treasureLabel}>{worldProgress >= 1 ? 'Complete! 🎉' : 'Treasure awaits!'}</Text>
        </Animated.View>

        {/* Level path */}
        <View style={styles.levelPath}>
          {Array.from({ length: totalLevels }, (_, i) => (
            <LevelNode
              key={i + 1}
              levelNumber={i + 1}
              stars={getLevelStars(i + 1)}
              isLocked={isLevelLocked(i + 1)}
              isCompleted={completedLevels.includes(i + 1)}
              color={world.color}
              index={i}
              onPress={() => handleLevelPress(i + 1)}
            />
          ))}
        </View>
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: FONTS.sizes.lg, color: COLORS.textLight },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: COLORS.textLight, fontWeight: FONTS.weights.bold },
  headerInfo: { flex: 1, alignItems: 'center' },
  worldHeaderEmoji: { fontSize: 36 },
  worldHeaderName: {
    fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold,
    color: COLORS.textLight, marginTop: 2,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md, marginBottom: SPACING.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  progressLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, fontWeight: FONTS.weights.semibold },
  progressPercent: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, fontWeight: FONTS.weights.bold },
  treasureGoal: { alignItems: 'center', marginBottom: SPACING.md },
  treasureLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, fontWeight: FONTS.weights.medium, marginTop: SPACING.xs },
  levelPath: { paddingHorizontal: SPACING.md },
  levelNodeRow: { flexDirection: 'row', paddingVertical: SPACING.md, paddingHorizontal: SPACING.md },
  levelNode: { alignItems: 'center', position: 'relative' },
  levelGlow: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40, top: -6, left: -6,
  },
  levelCircle: {
    width: 68, height: 68, borderRadius: 34,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, ...SHADOWS.medium,
  },
  levelCompleted: { borderColor: '#FFD700', borderWidth: 4 },
  levelNumber: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.extrabold, color: COLORS.textLight },
  lockEmoji: { fontSize: 22 },
  miniStars: { flexDirection: 'row', marginTop: 4, gap: 1 },
  miniStar: { fontSize: 11 },
});
