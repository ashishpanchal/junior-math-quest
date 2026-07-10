// ============================================================
// Math Treasure Hunt - Achievements Screen
// Displays all achievements with locked/unlocked state
// ============================================================

import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameProgress } from '../hooks/useGameProgress';
import { ACHIEVEMENTS } from '../constants/gameData';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const { progress, isLoading } = useGameProgress();

  if (isLoading || !progress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const unlockedCount = progress.achievements.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <LinearGradient colors={['#FFF8E7', '#FFEAA7']} style={styles.container}>
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

        <Text style={styles.title}>Achievements 🏆</Text>
        <Text style={styles.subtitle}>
          {unlockedCount} / {totalCount} unlocked
        </Text>

        {/* Achievement list */}
        <View style={styles.list}>
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = progress.achievements.includes(achievement.id);
            return (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !isUnlocked && styles.lockedCard,
                ]}
              >
                <Text style={styles.achievementEmoji}>
                  {isUnlocked ? achievement.emoji : '🔒'}
                </Text>
                <View style={styles.achievementInfo}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !isUnlocked && styles.lockedText,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDesc}>
                    {achievement.description}
                  </Text>
                </View>
                {isUnlocked && (
                  <Text style={styles.checkmark}>✅</Text>
                )}
              </View>
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
  list: {
    gap: SPACING.sm,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  lockedCard: {
    opacity: 0.6,
    backgroundColor: '#F0F0F0',
  },
  achievementEmoji: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  lockedText: {
    color: COLORS.textSecondary,
  },
  achievementDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
  },
});
