// ============================================================
// Math Treasure Hunt - Game Screen (Polished)
// Core gameplay with improved question cards, responsive layout
// ============================================================

import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TreasureMapBg } from '../components/TreasureMapBg';
import { AnswerButton } from '../components/AnswerButton';
import { AnimatedCharacter } from '../components/AnimatedCharacter';
import { ProgressBar } from '../components/ProgressBar';
import { CoinDisplay } from '../components/CoinDisplay';
import { Confetti } from '../components/Confetti';
import { useGameEngine } from '../hooks/useGameEngine';
import { useGameProgress } from '../hooks/useGameProgress';
import { CORRECT_MESSAGES, WRONG_MESSAGES, GAME_WORLDS } from '../constants/gameData';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING, responsive } from '../constants/theme';
import { Difficulty, LevelResult, WorldId } from '../types';

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    worldId: string;
    levelId: string;
    difficulty: string;
  }>();

  const worldId = params.worldId as WorldId;
  const levelId = parseInt(params.levelId || '1', 10);
  const difficulty = (params.difficulty || 'easy') as Difficulty;

  const { handleLevelComplete } = useGameProgress();
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [showMiniConfetti, setShowMiniConfetti] = useState(false);

  const handleComplete = useCallback(
    (result: LevelResult) => {
      handleLevelComplete(worldId, levelId, result.stars, result.coinsEarned);
      router.replace({
        pathname: '/reward',
        params: {
          worldId,
          levelId: levelId.toString(),
          stars: result.stars.toString(),
          coins: result.coinsEarned.toString(),
          correct: result.correctAnswers.toString(),
          total: result.totalQuestions.toString(),
        },
      });
    },
    [worldId, levelId, handleLevelComplete]
  );

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    correctCount,
    isAnswered,
    selectedAnswer,
    isCorrect,
    handleAnswer,
    handleNext,
    handleRetry,
  } = useGameEngine({ worldId, levelId, difficulty, onComplete: handleComplete });

  const world = GAME_WORLDS.find((w) => w.id === worldId);

  const onAnswerPress = (answer: number) => {
    handleAnswer(answer);
    if (answer === currentQuestion?.correctAnswer) {
      const msg = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedbackMsg(msg);
      setCoinsEarned((prev) => prev + 5);
      setShowMiniConfetti(true);
      setTimeout(() => setShowMiniConfetti(false), 2000);
    } else {
      const msg = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
      setFeedbackMsg(msg);
    }
  };

  if (!currentQuestion || !world) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🧮</Text>
        <Text style={styles.loadingText}>Getting ready...</Text>
      </View>
    );
  }

  const progressValue = (currentIndex + (isAnswered && isCorrect ? 1 : 0)) / totalQuestions;

  return (
    <TreasureMapBg variant="game">
      {/* Mini confetti on correct answer */}
      <Confetti isActive={showMiniConfetti} />

      <View style={[styles.content, { paddingTop: insets.top + SPACING.sm }]}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.exitButton}>
            <Text style={styles.exitText}>✕</Text>
          </Pressable>

          <View style={styles.progressSection}>
            <ProgressBar
              progress={progressValue}
              height={14}
              colors={world.gradientColors}
            />
            <Text style={styles.questionCount}>
              {currentIndex + 1} / {totalQuestions}
            </Text>
          </View>

          <CoinDisplay coins={coinsEarned} size="small" showPlus />
        </View>

        {/* Character with speech bubble */}
        <View style={styles.characterSection}>
          <AnimatedCharacter
            emoji={world.emoji}
            mood={isAnswered ? (isCorrect ? 'happy' : 'encouraging') : 'thinking'}
            size={responsive.font(55)}
            message={isAnswered ? feedbackMsg : undefined}
            showPlatform={false}
          />
        </View>

        {/* Question card */}
        <Animated.View
          entering={SlideInRight.duration(350).springify()}
          key={currentQuestion.id}
          style={styles.questionCard}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FAFCFF']}
            style={styles.questionGradient}
          >
            {/* Question type badge */}
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {currentQuestion.type === 'addition' ? '➕' :
                 currentQuestion.type === 'subtraction' ? '➖' :
                 currentQuestion.type === 'counting' ? '🔢' :
                 currentQuestion.type === 'comparison' ? '⚖️' :
                 currentQuestion.type === 'missing_number' ? '❓' : '🔷'}
              </Text>
            </View>

            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>

            {currentQuestion.visual && (
              <View style={styles.visualContainer}>
                <Text style={styles.visualText}>{currentQuestion.visual}</Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Answer options */}
        <View style={styles.answersContainer}>
          <View style={styles.answersGrid}>
            {currentQuestion.options.map((option, index) => (
              <AnswerButton
                key={`${currentQuestion.id}-${index}`}
                answer={option}
                onPress={onAnswerPress}
                isSelected={selectedAnswer === option}
                isCorrect={option === currentQuestion.correctAnswer}
                isRevealed={isAnswered}
                disabled={isAnswered}
                index={index}
              />
            ))}
          </View>
        </View>

        {/* Bottom action */}
        {isAnswered && (
          <Animated.View entering={FadeInUp.duration(300)} style={styles.actionContainer}>
            {isCorrect ? (
              <Pressable onPress={handleNext} style={styles.actionButton}>
                <LinearGradient
                  colors={[COLORS.success, COLORS.greenDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionText}>
                    {currentIndex >= totalQuestions - 1 ? '🎉 Finish!' : 'Next →'}
                  </Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <Pressable onPress={handleRetry} style={styles.actionButton}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionText}>Try Again 💪</Text>
                </LinearGradient>
              </Pressable>
            )}
          </Animated.View>
        )}
      </View>
    </TreasureMapBg>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingEmoji: { fontSize: 50, marginBottom: SPACING.md },
  loadingText: { fontSize: FONTS.sizes.lg, color: COLORS.textSecondary },
  content: { flex: 1, paddingHorizontal: SPACING.md },
  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.sm, marginBottom: SPACING.sm,
  },
  exitButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.small,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  exitText: { fontSize: 18, color: COLORS.textSecondary, fontWeight: FONTS.weights.bold },
  progressSection: { flex: 1 },
  questionCount: {
    fontSize: FONTS.sizes.xs, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: 3, fontWeight: FONTS.weights.semibold,
  },
  // Character
  characterSection: { alignItems: 'center', marginBottom: SPACING.sm, minHeight: 80 },
  // Question card
  questionCard: {
    borderRadius: BORDER_RADIUS.xl, marginBottom: SPACING.md,
    ...SHADOWS.large, overflow: 'hidden',
  },
  questionGradient: {
    padding: SPACING.lg, borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center', borderWidth: 2, borderColor: COLORS.border,
  },
  typeBadge: {
    position: 'absolute', top: 10, left: 14,
    backgroundColor: COLORS.surfaceLight,
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  typeBadgeText: { fontSize: 16 },
  questionText: {
    fontSize: responsive.font(22), fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary, textAlign: 'center',
    lineHeight: responsive.font(30),
  },
  visualContainer: {
    marginTop: SPACING.md, backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  visualText: { fontSize: responsive.font(32), letterSpacing: 6, textAlign: 'center' },
  // Answers
  answersContainer: { flex: 1, justifyContent: 'center' },
  answersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  // Action
  actionContainer: { paddingBottom: SPACING.lg },
  actionButton: { borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', ...SHADOWS.large },
  actionGradient: {
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl,
    alignItems: 'center', borderRadius: BORDER_RADIUS.xl,
  },
  actionText: {
    fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.extrabold, color: COLORS.textLight,
  },
});
