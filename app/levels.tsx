// ============================================================
// Math Treasure Hunt - Level Selection Screen
// Grid of levels for a specific world
// ============================================================

import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LevelButton } from '../components/LevelButton';
import { ProgressBar } from '../components/ProgressBar';
import { useGameProgress } from '../hooks/useGameProgress';
import { GAME_WORLDS } from '../constants/gameData';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { WorldId } from '../types';

export default function LevelSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { worldId } = useLocalSearchParams<{ worldId: WorldId }>();
  const { progress, isLoading } = useGameProgress();

  if (isLoading || !progress || !worldId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading levels...</Text>
      </View>
    );
  }

  const world = GAME_WORLDS.find((w) => w.id === worldId);
  if (!world) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>World not found</Text>
      </View>
    );
  }

  const completedLevels = progress.completedLevels[worldId] || [];
  const totalLevels = world.levelsCount;
  const worldProgress = completedLevels.length / totalLevels;

  const isLevelLocked = (levelNum: number): boolean => {
    // Level 1 is always unlocked, others require previous level to be completed
    if (levelNum === 1) return false;
    return !completedLevels.includes(levelNum - 1);
  };

  const getLevelStars = (levelNum: number): number => {
    return progress.levelStars[`${worldId}-${levelNum}`] || 0;
  };

  const handleLevelPress = (levelNum: number) => {
    router.push({
      pathname: '/game',
      params: {
        worldId,
        levelId: levelNum.toString(),
        difficulty: progress.settings.difficulty,
      },
    });
  };

  return (
    <LinearGradient
      colors={world.gradientColors}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + SPACING.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        {/* World header */}
        <View style={styles.header}>
          <Text style={styles.worldEmoji}>{world.emoji}</Text>
          <Text style={styles.worldName}>{world.name}</Text>
          <Text style={styles.worldDesc}>{world.description}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <ProgressBar
            progress={worldProgress}
            showPercentage
            colors={['#FFFFFF', '#FFD700']}
          />
          <Text style={styles.progressText}>
            {completedLevels.length} / {totalLevels} levels complete
          </Text>
        </View>

        {/* Level grid */}
        <View style={styles.levelGrid}>
          {Array.from({ length: totalLevels }, (_, i) => {
            const levelNum = i + 1;
            const locked = isLevelLocked(levelNum);
            const completed = completedLevels.includes(levelNum);
            const stars = getLevelStars(levelNum);

            return (
              <LevelButton
                key={levelNum}
                levelNumber={levelNum}
                stars={stars}
                isLocked={locked}
                isCompleted={completed}
                color={world.color}
                onPress={() => handleLevelPress(levelNum)}
              />
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: FONTS.sizes.lg, color: COLORS.textPrimary },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  backButton: { marginBottom: SPACING.md },
  backText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.semibold,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  worldEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  worldName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
  },
  worldDesc: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  progressSection: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: FONTS.weights.medium,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
