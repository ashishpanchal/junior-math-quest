// ============================================================
// Math Treasure Hunt - Game Screen
// Core gameplay with questions, answers, and feedback
// ============================================================

import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnswerButton } from '../components/AnswerButton';
import { AnimatedCharacter } from '../components/AnimatedCharacter';
import { ProgressBar } from '../components/ProgressBar';
import { CoinDisplay } from '../components/CoinDisplay';
import { useGameEngine } from '../hooks/useGameEngine';
import { useGameProgress } from '../hooks/useGameProgress';
import { CORRECT_MESSAGES, WRONG_MESSAGES, GAME_WORLDS } from '../constants/gameData';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
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
    progressPercent,
    handleAnswer,
    handleNext,
    handleRetry,
  } = useGameEngine({ worldId, levelId, difficulty, onComplete: handleComplete });

  const world = GAME_WORLDS.find((w) => w.id === worldId);

  // Handle answer selection with feedback message
  const onAnswerPress = (answer: number) => {
    handleAnswer(answer);
    if (answer === currentQuestion?.correctAnswer) {
      const msg = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedbackMsg(msg);
      setCoinsEarned((prev) => prev + 5);
    } else {
      const msg = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
      setFeedbackMsg(msg);
    }
  };

  if (!currentQuestion || !world) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#FFF8E7', '#E8F6FF']} style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + SPACING.sm }]}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.exitButton}>
            <Text style={styles.exitText}>✕</Text>
          </Pressable>
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={(currentIndex + (isAnswered ? 1 : 0)) / totalQuestions}
              height={12}
              colors={world.gradientColors}
            />
          </View>
          <CoinDisplay coins={coinsEarned} />
        </View>

        {/* Question counter */}
        <Text style={styles.questionCounter}>
          Question {currentIndex + 1} of {totalQuestions}
        </Text>

        {/* Character */}
        <View style={styles.characterContainer}>
          <AnimatedCharacter
            emoji={world.emoji}
            mood={isAnswered ? (isCorrect ? 'happy' : 'encouraging') : 'thinking'}
            size={60}
          />
        </View>

        {/* Question card */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          key={currentQuestion.id}
          style={styles.questionCard}
        >
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.visual && (
            <Text style={styles.visualText}>{currentQuestion.visual}</Text>
          )}
        </Animated.View>

        {/* Feedback message */}
        {isAnswered && (
          <Animated.Text
            entering={FadeIn.duration(300)}
            style={[
              styles.feedbackText,
              { color: isCorrect ? COLORS.success : COLORS.warning },
            ]}
          >
            {feedbackMsg}
          </Animated.Text>
        )}

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
              <Pressable onPress={handleNext} style={styles.nextButton}>
                <LinearGradient
                  colors={[COLORS.success, COLORS.green]}
                  style={styles.nextGradient}
                >
                  <Text style={styles.nextText}>
                    {currentIndex >= totalQuestions - 1 ? 'Finish! 🎉' : 'Next →'}
                  </Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <Pressable onPress={handleRetry} style={styles.nextButton}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.nextGradient}
                >
                  <Text style={styles.nextText}>Try Again 💪</Text>
                </LinearGradient>
              </Pressable>
            )}
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: FONTS.sizes.lg },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  exitText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.bold,
  },
  progressContainer: { flex: 1 },
  questionCounter: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  questionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  questionText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  visualText: {
    fontSize: 36,
    marginTop: SPACING.md,
    letterSpacing: 4,
  },
  feedbackText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  answersContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actionContainer: {
    paddingBottom: SPACING.xl,
  },
  nextButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  nextGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
  },
  nextText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
  },
});
