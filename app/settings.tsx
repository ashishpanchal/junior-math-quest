// ============================================================
// Math Treasure Hunt - Parent Settings Screen
// Parental controls and game settings
// ============================================================

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameProgress } from '../hooks/useGameProgress';
import { Difficulty } from '../types';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';


export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { progress, isLoading, updateGameSettings, handleReset } = useGameProgress();
  const [showParentGate, setShowParentGate] = useState(true);
  const [gateAnswer, setGateAnswer] = useState('');

  if (isLoading || !progress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Simple parent gate: solve a math problem
  if (showParentGate) {
    return (
      <LinearGradient colors={['#FFF8E7', '#E8E8E8']} style={styles.container}>
        <View style={[styles.gateContainer, { paddingTop: insets.top + SPACING.xl }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.gateTitle}>Parent Area 🔒</Text>
          <Text style={styles.gateSubtitle}>
            To access settings, please solve:
          </Text>
          <Text style={styles.gateQuestion}>15 + 27 = ?</Text>
          <View style={styles.gateOptions}>
            {[38, 42, 45].map((opt) => (
              <Pressable
                key={opt}
                style={styles.gateOption}
                onPress={() => {
                  if (opt === 42) {
                    setShowParentGate(false);
                  }
                }}
              >
                <Text style={styles.gateOptionText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </LinearGradient>
    );
  }


  const settings = progress.settings;

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will erase all coins, stars, and progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => handleReset(),
        },
      ]
    );
  };

  const setDifficulty = (diff: Difficulty) => {
    updateGameSettings({ difficulty: diff });
  };

  return (
    <LinearGradient colors={['#FFF8E7', '#E8E8E8']} style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + SPACING.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Parent Settings ⚙️</Text>

        {/* Sound Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Feedback</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🎵 Music</Text>
            <Switch
              value={settings.musicEnabled}
              onValueChange={(v) => updateGameSettings({ musicEnabled: v })}
              trackColor={{ true: COLORS.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🔊 Sound Effects</Text>
            <Switch
              value={settings.soundEffectsEnabled}
              onValueChange={(v) => updateGameSettings({ soundEffectsEnabled: v })}
              trackColor={{ true: COLORS.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🗣️ Voice</Text>
            <Switch
              value={settings.voiceEnabled}
              onValueChange={(v) => updateGameSettings({ voiceEnabled: v })}
              trackColor={{ true: COLORS.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>📳 Haptics</Text>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(v) => updateGameSettings({ hapticsEnabled: v })}
              trackColor={{ true: COLORS.primary }}
            />
          </View>
        </View>


        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty</Text>
          <View style={styles.difficultyRow}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <Pressable
                key={diff}
                onPress={() => setDifficulty(diff)}
                style={[
                  styles.difficultyButton,
                  settings.difficulty === diff && styles.difficultyActive,
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    settings.difficulty === diff && styles.difficultyTextActive,
                  ]}
                >
                  {diff === 'easy' ? '🌱 Easy' : diff === 'medium' ? '🌿 Medium' : '🌳 Hard'}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.difficultyDesc}>
            {settings.difficulty === 'easy'
              ? 'Numbers 1-20, 3 options, 5 questions'
              : settings.difficulty === 'medium'
              ? 'Numbers 21-50, 4 options, 8 questions'
              : 'Numbers 50-99, mixed types, 10 questions'}
          </Text>
        </View>

        {/* Timer Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ Question Timer</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>⏱️ Timer Enabled</Text>
            <Switch
              value={settings.timerEnabled ?? true}
              onValueChange={(v) => updateGameSettings({ timerEnabled: v })}
              trackColor={{ true: COLORS.primary }}
            />
          </View>

          {(settings.timerEnabled ?? true) && (
            <>
              <Text style={styles.timerValueLabel}>
                Time per question: {settings.timerSeconds ?? 10} seconds
              </Text>

              <View style={styles.timerOptionsRow}>
                {[5, 10, 15, 20, 30].map((sec) => (
                  <Pressable
                    key={sec}
                    onPress={() => updateGameSettings({ timerSeconds: sec })}
                    style={[
                      styles.timerOption,
                      (settings.timerSeconds ?? 10) === sec && styles.timerOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timerOptionText,
                        (settings.timerSeconds ?? 10) === sec && styles.timerOptionTextActive,
                      ]}
                    >
                      {sec}s
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.timerHint}>
                {(settings.timerSeconds ?? 10) <= 5
                  ? '⚡ Very fast! Great for a challenge.'
                  : (settings.timerSeconds ?? 10) <= 10
                  ? '⏱️ Default speed. Good for most children.'
                  : (settings.timerSeconds ?? 10) <= 15
                  ? '🐢 A bit more time to think.'
                  : '🌈 Plenty of time. No pressure!'}
              </Text>
            </>
          )}

          {!(settings.timerEnabled ?? true) && (
            <Text style={styles.timerHint}>
              Timer is off. Children can answer at their own pace.
            </Text>
          )}
        </View>

        {/* Safety info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Features ✅</Text>
          <View style={styles.safetyList}>
            <Text style={styles.safetyItem}>✅ No ads</Text>
            <Text style={styles.safetyItem}>✅ No login required</Text>
            <Text style={styles.safetyItem}>✅ No chat features</Text>
            <Text style={styles.safetyItem}>✅ No external links</Text>
            <Text style={styles.safetyItem}>✅ No in-app purchases</Text>
            <Text style={styles.safetyItem}>✅ No data collection</Text>
            <Text style={styles.safetyItem}>✅ All data stored locally</Text>
          </View>
        </View>

        {/* Reset */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <Pressable onPress={handleResetProgress} style={styles.resetButton}>
            <Text style={styles.resetText}>🗑️ Reset All Progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: FONTS.sizes.lg },
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xxl },
  backButton: { marginBottom: SPACING.md },
  backText: { fontSize: FONTS.sizes.lg, color: COLORS.primary, fontWeight: FONTS.weights.semibold },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  difficultyRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  difficultyButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  difficultyActive: { borderColor: COLORS.primary, backgroundColor: COLORS.surfaceLight },
  difficultyText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  difficultyTextActive: { color: COLORS.primary, fontWeight: FONTS.weights.bold },
  difficultyDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center' },
  // Timer settings
  timerValueLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.semibold,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  timerOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  timerOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
  },
  timerOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
  },
  timerOptionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.semibold,
  },
  timerOptionTextActive: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
  timerHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  safetyList: { gap: SPACING.xs },
  safetyItem: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  resetButton: {
    backgroundColor: '#FFF0F0',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  resetText: { fontSize: FONTS.sizes.md, color: COLORS.error, fontWeight: FONTS.weights.bold },
  gateContainer: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.lg },
  gateTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
  },
  gateSubtitle: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  gateQuestion: { fontSize: FONTS.sizes.xxxl, fontWeight: FONTS.weights.bold, color: COLORS.primary, marginBottom: SPACING.lg },
  gateOptions: { flexDirection: 'row', gap: SPACING.md },
  gateOption: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  gateOptionText: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.textPrimary },
});
