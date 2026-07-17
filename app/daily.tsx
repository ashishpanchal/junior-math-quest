// ============================================================
// Math Treasure Hunt - Daily Challenge Screen
// One special challenge per day with streak calendar
// ============================================================

import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnswerButton } from '../components/AnswerButton';
import { GameButton } from '../components/GameButton';
import { Confetti } from '../components/Confetti';
import { AnimatedCharacter } from '../components/AnimatedCharacter';
import { useGameProgress } from '../hooks/useGameProgress';
import { generateQuestions } from '../utils/questionGenerator';
import { completeDailyChallenge, isDailyChallengeCompleted } from '../utils/storage';
import { playSound } from '../utils/sound';
import { successHaptic, errorHaptic, rewardHaptic } from '../utils/haptics';
import { CORRECT_MESSAGES, WRONG_MESSAGES } from '../constants/gameData';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { MathQuestion } from '../types';

const DAILY_BONUS_COINS = 15;
const STREAK_BONUS_MULTIPLIER = 2; // Extra coins per streak day

export default function DailyChallengeScreen() {
  const insets = useSafeAreaInsets();
  const { progress, reload } = useGameProgress();

  const [isCompleted, setIsCompleted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate 3 daily challenge questions (seeded by date for consistency)
  const questions: MathQuestion[] = useMemo(() => {
    return generateQuestions(progress?.settings?.difficulty ?? 'easy', 3);
  }, [progress?.settings?.difficulty]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (progress && isDailyChallengeCompleted(progress)) {
      setAlreadyDone(true);
    }
  }, [progress]);

  const handleAnswer = useCallback(
    async (answer: number) => {
      if (isAnswered) return;
      setSelectedAnswer(answer);
      setIsAnswered(true);

      const correct = answer === currentQuestion?.correctAnswer;
      setIsCorrect(correct);

      if (correct) {
        setCorrectCount((prev) => prev + 1);
        const msg = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
        setFeedbackMsg(msg);
        await successHaptic();
        await playSound('correct');
      } else {
        const msg = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
        setFeedbackMsg(msg);
        await errorHaptic();
        await playSound('wrong');
      }
    },
    [isAnswered, currentQuestion]
  );

  const handleNext = useCallback(async () => {
    if (currentIndex >= questions.length - 1) {
      // Daily complete!
      const streak = (progress?.dailyChallenge?.dailyStreak ?? 0) + 1;
      const coins = DAILY_BONUS_COINS + (streak * STREAK_BONUS_MULTIPLIER);
      await completeDailyChallenge(coins);
      await rewardHaptic();
      await playSound('levelComplete');
      setIsCompleted(true);
      setShowConfetti(true);
      reload();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setIsCorrect(false);
      setFeedbackMsg('');
    }
  }, [currentIndex, questions.length, progress, reload]);

  const dailyStreak = progress?.dailyChallenge?.dailyStreak ?? 0;
  const completedDates = progress?.dailyChallenge?.completedDates ?? [];

  // Build last 7 days for calendar display
  const last7Days = useMemo(() => {
    const days: { label: string; date: string; completed: boolean }[] = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        label: dayNames[d.getDay()],
        date: dateStr,
        completed: completedDates.includes(dateStr),
      });
    }
    return days;
  }, [completedDates]);

  if (!progress) return null;

  // Already completed today
  if (alreadyDone) {
    return (
      <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.container}>
        <View style={[styles.centeredContent, { paddingTop: insets.top + SPACING.xl }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <AnimatedCharacter emoji="🎯" mood="celebrating" size={80} />
          <Text style={styles.doneTitle}>Daily Done! ✅</Text>
          <Text style={styles.doneSubtext}>
            Great work today! Come back tomorrow{'\n'}for your next challenge.
          </Text>

          {/* Streak calendar */}
          <View style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>🔥 {dailyStreak} Day Streak</Text>
            <View style={styles.calendarRow}>
              {last7Days.map((day, i) => (
                <View key={i} style={styles.calendarDay}>
                  <Text style={styles.calendarLabel}>{day.label}</Text>
                  <View
                    style={[
                      styles.calendarDot,
                      day.completed && styles.calendarDotCompleted,
                    ]}
                  >
                    <Text style={styles.calendarDotText}>
                      {day.completed ? '⭐' : '○'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <GameButton
            title="Back to Home"
            emoji="🏠"
            variant="primary"
            onPress={() => router.replace('/home')}
          />
        </View>
      </LinearGradient>
    );
  }

  // Completed just now
  if (isCompleted) {
    const streak = dailyStreak + 1;
    const coins = DAILY_BONUS_COINS + (streak * STREAK_BONUS_MULTIPLIER);

    return (
      <LinearGradient colors={['#FFD700', '#FF8C00']} style={styles.container}>
        <Confetti isActive={showConfetti} />
        <View style={[styles.centeredContent, { paddingTop: insets.top + SPACING.xl }]}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.completeTitle}>🎉 Daily Challenge Complete!</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.rewardCard}>
            <Text style={styles.rewardText}>
              ✅ {correctCount}/{questions.length} Correct
            </Text>
            <Text style={styles.rewardCoins}>+{coins} 🪙</Text>
            <Text style={styles.streakText}>🔥 {streak} Day Streak!</Text>
          </Animated.View>

          {/* Streak calendar */}
          <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>This Week</Text>
            <View style={styles.calendarRow}>
              {last7Days.map((day, i) => (
                <View key={i} style={styles.calendarDay}>
                  <Text style={styles.calendarLabel}>{day.label}</Text>
                  <View
                    style={[
                      styles.calendarDot,
                      (day.completed || day.date === new Date().toISOString().split('T')[0]) &&
                        styles.calendarDotCompleted,
                    ]}
                  >
                    <Text style={styles.calendarDotText}>
                      {day.completed || day.date === new Date().toISOString().split('T')[0] ? '⭐' : '○'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(900).duration(500)}>
            <GameButton
              title="Back to Home"
              emoji="🏠"
              variant="primary"
              size="large"
              onPress={() => router.replace('/home')}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  // Active challenge
  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.gameContent, { paddingTop: insets.top + SPACING.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backTextLight}>← Back</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>🎯 Daily Challenge</Text>
            <Text style={styles.headerSubtext}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>🔥 {dailyStreak}</Text>
          </View>
        </View>

        {/* Character + Feedback */}
        <View style={styles.characterArea}>
          <AnimatedCharacter
            emoji="🎯"
            mood={isAnswered ? (isCorrect ? 'happy' : 'encouraging') : 'thinking'}
            size={50}
            message={isAnswered ? feedbackMsg : undefined}
            showPlatform={false}
          />
        </View>

        {/* Question */}
        {currentQuestion && (
          <Animated.View entering={FadeIn.duration(300)} key={currentQuestion.id} style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.visual && (
              <Text style={styles.visualText}>{currentQuestion.visual}</Text>
            )}
          </Animated.View>
        )}

        {/* Answers */}
        {currentQuestion && (
          <View style={styles.answersGrid}>
            {currentQuestion.options.map((option, index) => (
              <AnswerButton
                key={`${currentQuestion.id}-${index}`}
                answer={option}
                onPress={handleAnswer}
                isSelected={selectedAnswer === option}
                isCorrect={option === currentQuestion.correctAnswer}
                isRevealed={isAnswered}
                disabled={isAnswered}
                index={index}
              />
            ))}
          </View>
        )}

        {/* Next button */}
        {isAnswered && (
          <Animated.View entering={FadeInUp.duration(300)} style={styles.nextArea}>
            <GameButton
              title={currentIndex >= questions.length - 1 ? '🎉 Finish!' : 'Next →'}
              variant="success"
              size="large"
              onPress={handleNext}
            />
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
  },
  gameContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
  },
  headerSubtext: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  backButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  backText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.bold,
  },
  backTextLight: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.bold,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  streakBadgeText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
  },
  // Character
  characterArea: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  // Question
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  questionText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  visualText: {
    fontSize: 28,
    marginTop: SPACING.md,
    letterSpacing: 4,
    textAlign: 'center',
  },
  // Answers
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  // Next
  nextArea: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  // Done state
  doneTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  doneSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Complete state
  completeTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  rewardText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  rewardCoins: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.secondary,
  },
  streakText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  // Calendar
  calendarCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  calendarTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  calendarDay: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  calendarLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
  },
  calendarDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDotCompleted: {
    backgroundColor: '#FFF3E0',
  },
  calendarDotText: {
    fontSize: 16,
  },
});
