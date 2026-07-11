// ============================================================
// Math Treasure Hunt - Game Engine Hook (Updated)
// Manages game loop with 10-second countdown timer per question
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Difficulty, LevelResult, MathQuestion, TimerState, WorldId } from '../types';
import { generateQuestions } from '../utils/questionGenerator';
import {
  COINS_PER_CORRECT,
  PERFECT_LEVEL_BONUS,
  STAR_THRESHOLDS,
  TIMER_BONUS_COINS,
  TIMER_BONUS_THRESHOLD,
} from '../constants/gameData';
import { playSound } from '../utils/sound';
import { errorHaptic, successHaptic } from '../utils/haptics';

interface UseGameEngineProps {
  worldId: WorldId;
  levelId: number;
  difficulty: Difficulty;
  onComplete: (result: LevelResult) => void;
}

export const useGameEngine = ({
  worldId,
  levelId,
  difficulty,
  onComplete,
}: UseGameEngineProps) => {
  // Generate questions for this level
  const questions = useMemo(() => generateQuestions(difficulty), [difficulty]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [timerBonusTotal, setTimerBonusTotal] = useState(0);

  // ─── Timer State ─────────────────────────────────────────────
  const [timer, setTimer] = useState<TimerState>({
    remaining: 10,
    isRunning: false,
    isExpired: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Current question */
  const currentQuestion: MathQuestion | undefined = questions[currentIndex];

  /** Progress through the level (0 to 1) */
  const progressPercent = questions.length > 0 ? currentIndex / questions.length : 0;

  /** Is this the last question? */
  const isLastQuestion = currentIndex >= questions.length - 1;

  // ─── Timer Logic ─────────────────────────────────────────────

  /** Start the countdown timer for a given time limit */
  const startTimer = useCallback((timeLimit: number = 10) => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimer({ remaining: timeLimit, isRunning: true, isExpired: false });

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev.remaining <= 1) {
          // Time's up
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return { remaining: 0, isRunning: false, isExpired: true };
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
  }, []);

  /** Stop the timer */
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimer((prev) => ({ ...prev, isRunning: false }));
  }, []);

  // Start timer when question changes or on first mount
  useEffect(() => {
    if (currentQuestion && !isAnswered) {
      const timeLimit = currentQuestion.timeLimit ?? 10;
      startTimer(timeLimit);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentIndex, startTimer]);

  // Handle timer expiry (auto-reveal as wrong)
  useEffect(() => {
    if (timer.isExpired && !isAnswered) {
      // Time ran out — treat as wrong answer without selecting anything
      setIsAnswered(true);
      setIsCorrect(false);
      setSelectedAnswer(null);
      errorHaptic();
      playSound('wrong');
    }
  }, [timer.isExpired, isAnswered]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ─── Scoring ─────────────────────────────────────────────────

  /** Calculate stars based on correct percentage */
  const calculateStars = (correct: number, total: number): number => {
    const ratio = total > 0 ? correct / total : 0;
    if (ratio >= STAR_THRESHOLDS.three) return 3;
    if (ratio >= STAR_THRESHOLDS.two) return 2;
    if (ratio >= STAR_THRESHOLDS.one) return 1;
    return 0;
  };

  // ─── Actions ─────────────────────────────────────────────────

  /** Handle player selecting an answer */
  const handleAnswer = useCallback(
    async (answer: number) => {
      if (isAnswered || timer.isExpired) return;

      // Stop the timer
      stopTimer();

      const correct = answer === currentQuestion?.correctAnswer;
      setSelectedAnswer(answer);
      setIsAnswered(true);
      setIsCorrect(correct);

      if (correct) {
        setCorrectCount((prev) => prev + 1);

        // Timer bonus: award extra coins if answered fast
        if (timer.remaining >= TIMER_BONUS_THRESHOLD) {
          setTimerBonusTotal((prev) => prev + TIMER_BONUS_COINS);
        }

        await successHaptic();
        await playSound('correct');
      } else {
        await errorHaptic();
        await playSound('wrong');
      }
    },
    [isAnswered, timer.isExpired, timer.remaining, currentQuestion, stopTimer]
  );

  /** Move to next question or finish level */
  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      // Level complete — calculate final score
      const totalQuestions = questions.length;
      const stars = calculateStars(correctCount, totalQuestions);
      const baseCoins = correctCount * COINS_PER_CORRECT;
      const perfectBonus = correctCount === totalQuestions ? PERFECT_LEVEL_BONUS : 0;
      const coinsEarned = baseCoins + perfectBonus + timerBonusTotal;
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const result: LevelResult = {
        worldId,
        levelId,
        totalQuestions,
        correctAnswers: correctCount,
        stars,
        coinsEarned,
        timeSpent,
        isNewBest: true,
        timerBonus: timerBonusTotal,
      };

      playSound('levelComplete');
      onComplete(result);
    } else {
      // Move to next question — timer restarts via useEffect
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setIsCorrect(false);
    }
  }, [
    isLastQuestion,
    correctCount,
    questions.length,
    startTime,
    worldId,
    levelId,
    onComplete,
    timerBonusTotal,
  ]);

  /** Retry the wrong answer (unlimited retries, restarts timer) */
  const handleRetry = useCallback(() => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    const timeLimit = currentQuestion?.timeLimit ?? 10;
    startTimer(timeLimit);
  }, [startTimer, currentQuestion]);

  return {
    // Question state
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    correctCount,
    isAnswered,
    selectedAnswer,
    isCorrect,
    progressPercent,
    isLastQuestion,

    // Timer state
    timer,

    // Actions
    handleAnswer,
    handleNext,
    handleRetry,
  };
};
