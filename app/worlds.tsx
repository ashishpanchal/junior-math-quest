// ============================================================
// Math Treasure Hunt - World Selection Screen
// Grid of game worlds with lock/unlock state
// ============================================================

import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WorldCard } from '../components/WorldCard';
import { useGameProgress } from '../hooks/useGameProgress';
import { GAME_WORLDS } from '../constants/gameData';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { WorldId } from '../types';

export default function WorldSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { progress, isLoading } = useGameProgress();

  if (isLoading || !progress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading worlds... 🌍</Text>
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
    <LinearGradient colors={['#FFF8E7', '#E8F6FF']} style={styles.container}>
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

        <Text style={styles.title}>Choose a World! 🗺️</Text>
        <Text style={styles.subtitle}>
          You have {progress.totalStars} ⭐ stars
        </Text>

        {/* World grid */}
        <View style={styles.worldGrid}>
          {GAME_WORLDS.map((world) => {
            const isUnlocked = progress.unlockedWorlds.includes(world.id);
            return (
              <WorldCard
                key={world.id}
                world={world}
                isUnlocked={isUnlocked}
                starsEarned={getWorldStars(world.id)}
                onPress={() => handleWorldPress(world.id)}
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
  loadingText: { fontSize: FONTS.sizes.lg },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  backButton: { marginBottom: SPACING.md },
  backText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  worldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
