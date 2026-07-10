// ============================================================
// Math Treasure Hunt - Player Profile Screen
// Shows player stats, avatar selection, and name editing
// ============================================================

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameButton } from '../components/GameButton';
import { StarRating } from '../components/StarRating';
import { CoinDisplay } from '../components/CoinDisplay';
import { useGameProgress } from '../hooks/useGameProgress';
import { AVATARS } from '../constants/gameData';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { progress, isLoading, setPlayerName, setPlayerAvatar } = useGameProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');

  if (isLoading || !progress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
    }
    setIsEditing(false);
  };

  const totalLevels = Object.values(progress.completedLevels).flat().length;

  return (
    <LinearGradient colors={['#E8F6FF', '#FFF8E7']} style={styles.container}>
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

        <Text style={styles.title}>My Profile 👤</Text>

        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <Text style={styles.currentAvatar}>{progress.profile.avatar}</Text>
          {!isEditing ? (
            <Text style={styles.playerName}>{progress.profile.name}</Text>
          ) : (
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your name"
              maxLength={15}
              autoFocus
              onSubmitEditing={handleSaveName}
            />
          )}
          {!isEditing ? (
            <Pressable
              onPress={() => {
                setNameInput(progress.profile.name);
                setIsEditing(true);
              }}
            >
              <Text style={styles.editText}>✏️ Edit Name</Text>
            </Pressable>
          ) : (
            <GameButton
              title="Save"
              size="small"
              onPress={handleSaveName}
            />
          )}
        </View>

        {/* Choose avatar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((avatar) => (
              <Pressable
                key={avatar}
                onPress={() => setPlayerAvatar(avatar)}
                style={[
                  styles.avatarOption,
                  progress.profile.avatar === avatar && styles.avatarSelected,
                ]}
              >
                <Text style={styles.avatarEmoji}>{avatar}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Stats cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🪙</Text>
              <Text style={styles.statValue}>{progress.coins}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{progress.totalStars}</Text>
              <Text style={styles.statLabel}>Stars</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>{totalLevels}</Text>
              <Text style={styles.statLabel}>Levels</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{progress.profile.streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🌍</Text>
              <Text style={styles.statValue}>{progress.unlockedWorlds.length}</Text>
              <Text style={styles.statLabel}>Worlds</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statValue}>{progress.achievements.length}</Text>
              <Text style={styles.statLabel}>Awards</Text>
            </View>
          </View>
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
  backText: { fontSize: FONTS.sizes.lg, color: COLORS.primary, fontWeight: FONTS.weights.semibold },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  currentAvatar: { fontSize: 80, marginBottom: SPACING.sm },
  playerName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  nameInput: {
    fontSize: FONTS.sizes.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    width: 200,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  editText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  section: { marginBottom: SPACING.lg },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  avatarSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
  },
  avatarEmoji: { fontSize: 32 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  statCard: {
    width: '31%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statEmoji: { fontSize: 28, marginBottom: SPACING.xs },
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
