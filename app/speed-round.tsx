// ============================================================
// Math Treasure Hunt - Speed Round Game Mode
// Answer as many questions as possible in 30 seconds!
// ============================================================

import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnswerButton } from '../components/AnswerButton';
import { GameButton } from '../components/GameButton';
import { Confetti } from '../components/Confetti';
import { AnimatedCharacter } from '../components/AnimatedCharacter';
import { useGameProgress } from '../hooks/useGameProgress';
import { generateQuestions } from '../utils/questionGenerator';
import { updateSpeedRoundBest } from '../utils/storage';
import { playSound } from '../utils/sound';
import { successHaptic, errorHaptic, rewardHaptic } from '../utils/haptics';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING, responsive } from '../constants/theme';
import { MathQuestion } from '../types';

const ROUND_DURATION = 30; // seconds
const COINS_PER_CORRECT = 3;

type GamePhase = 'ready' | 'playing' | 'finished';

export default function SpeedRoundScreen() {
  const insets = useSafeAreaInsets();
  const { progress, reload } = useGameProgress();

  const [phase, setPhase] = useState<GamePhase>('ready');
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate a big pool of questions (enough for 30 seconds of fast answers)
  const [questions] = useState<MathQuestion[]>(() =>
    generateQuestions(progress?.settings?.difficulty ?? 'easy', 30)
  );

  const currentQuestion = questions[questionIndex];
  const bestScore = progress?.dailyChallenge?.speedRoundBest ?? 0;

  // Timer animation
  const timerPulse = useSharedValue(1);

  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 5) {
      timerPulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 200, easing: Easing.out(Easing.quad) }),
          withTiming(1.0, { duration: 200 })
        ),
        -1,
        true
      );
    }
  }, [phase, timeLeft]);

  const timerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: timerPulse.value }],
  }));

  // Start the game
  const startGame = useCallback(() => {
    setPhase('playing');
    setTimeLeft(ROUND_DURATION);
    setScore(0);
    setQuestionIndex(0);
    setIsAnswered(false);
    setSelectedAnswer(null);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up!
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // End game when timer reaches 0
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, phase]);

  const endGame = useCallback(async () => {
    setPhase('finished');
    timerPulse.value = withTiming(1);

    if (score > bestScore) {
      setIsNewBest(true);
      await updateSpeedRoundBest(score);
    }

    if (score >= 5) {
      setShowConfetti(true);
      await rewardHaptic();
    }
    await playSound('levelComplete');
    reload();
  }, [score, bestScore, reload]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleAnswer = useCallback(
    async (answer: number) => {
      if (isAnswered || phase !== 'playing') return;

      setSelectedAnswer(answer);
      setIsAnswered(true);

      const correct = answer === currentQuestion?.correctAnswer;
      setIsCorrect(correct);

      if (correct) {
        setScore((prev) => prev + 1);
        await successHaptic();
        await playSound('correct');

        // Auto-advance after short delay for speed
        setTimeout(() => {
          if (questionIndex < questions.length - 1) {
            setQuestionIndex((prev) => prev + 1);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setIsCorrect(false);
          }
        }, 400);
      } else {
        await errorHaptic();
        await playSound('wrong');

        // Show correct answer briefly, then advance
        setTimeout(() => {
          if (questionIndex < questions.length - 1) {
            setQuestionIndex((prev) => prev + 1);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setIsCorrect(false);
          }
        }, 800);
      }
    },
    [isAnswered, phase, currentQuestion, questionIndex, questions.length]
  );

  // Ready screen
  if (phase === 'ready') {
    return (
      <LinearGradient colors={['#FF6B35', '#FF8C00']} style={styles.container}>
        <View style={[styles.centeredContent, { paddingTop: insets.top + SPACING.xl }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backTextLight}>← Back</Text>
          </Pressable>

          <AnimatedCharacter emoji="⚡" mood="idle" size={80} />

          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.readyTitle}>Speed Round! ⚡</Text>
            <Text style={styles.readySubtext}>
              Answer as many questions as you can{'\n'}in {ROUND_DURATION} seconds!
            </Text>
          </Animated.View>

          {bestScore > 0 && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.bestScoreCard}>
              <Text style={styles.bestScoreText}>🏆 Your Best: {bestScore}</Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(400).duration(500)}>
            <GameButton
              title="Start!"
              emoji="🚀"
              variant="primary"
              size="large"
              onPress={startGame}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  // Finished screen
  if (phase === 'finished') {
    const coinsEarned = score * COINS_PER_CORRECT;

    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <Confetti isActive={showConfetti} />
        <View style={[styles.centeredContent, { paddingTop: insets.top + SPACING.xl }]}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.finishTitle}>⏱️ Time's Up!</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={styles.scoreSubtext}>correct answers</Text>
            {isNewBest && (
              <Text style={styles.newBestText}>🎉 New Personal Best!</Text>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.rewardRow}>
            <Text style={styles.coinsText}>+{coinsEarned} 🪙</Text>
            {bestScore > 0 && !isNewBest && (
              <Text style={styles.bestText}>Best: {bestScore}</Text>
            )}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.finishButtons}>
            <GameButton
              title="Play Again"
              emoji="🔄"
              variant="success"
              size="large"
              onPress={() => {
                setPhase('ready');
                setShowConfetti(false);
                setIsNewBest(false);
              }}
            />
            <GameButton
              title="Home"
              emoji="🏠"
              variant="secondary"
              size="medium"
              onPress={() => router.replace('/home')}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  // Playing screen
  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={[styles.playContent, { paddingTop: insets.top + SPACING.sm }]}>
        {/* Timer + Score bar */}
        <View style={styles.playHeader}>
          <Animated.View style={[styles.timerBubble, timerStyle]}>
            <Text
              style={[
                styles.timerText,
                timeLeft <= 5 && { color: COLORS.error },
              ]}
            >
              {timeLeft}s
            </Text>
          </Animated.View>

          <View style={styles.scoreBubble}>
            <Text style={styles.scoreHeaderText}>⚡ {score}</Text>
          </View>
        </View>

        {/* Question */}
        {currentQuestion && (
          <Animated.View
            entering={SlideInRight.duration(250).springify()}
            key={currentQuestion.id}
            style={styles.playQuestionCard}
          >
            <Text style={styles.playQuestionText}>{currentQuestion.question}</Text>
            {currentQuestion.visual && (
              <Text style={styles.playVisualText}>{currentQuestion.visual}</Text>
            )}
          </Animated.View>
        )}

        {/* Answers */}
        {currentQuestion && (
          <View style={styles.playAnswersGrid}>
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
      </View>
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
  playContent: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  // Back
  backButton: {
    position: 'absolute',
    top: SPACING.xl,
    left: SPACING.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  backTextLight: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.bold,
  },
  // Ready
  readyTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  readySubtext: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  bestScoreCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  bestScoreText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
  },
  // Playing
  playHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  timerBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  timerText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textLight,
  },
  scoreBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  scoreHeaderText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textLight,
  },
  playQuestionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  playQuestionText: {
    fontSize: responsive.font(22),
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  playVisualText: {
    fontSize: 26,
    marginTop: SPACING.md,
    letterSpacing: 3,
    textAlign: 'center',
  },
  playAnswersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1,
  },
  // Finished
  finishTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  scoreLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: FONTS.weights.black,
    color: COLORS.primary,
  },
  scoreSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  newBestText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.secondary,
    marginTop: SPACING.sm,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  coinsText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textLight,
  },
  bestText: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.7)',
  },
  finishButtons: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.md,
  },
});
