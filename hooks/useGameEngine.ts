// ============================================================
// Math Treasure Hunt - Game Engine Hook
// Manages the core game loop: questions, answers, scoring
// ============================================================

import { useCallback, useMemo, useState } from 'react';
import { Difficulty, LevelResult, MathQuestion, WorldId } from '../types';
import { generateQuestions } from '../utils/questionGenerator';
import { COINS_PER_CORRECT, PERFECT_LEVEL_BONUS, STAR_THRESHOLDS } from '../constants/gameData';
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

  /** Current question */
  const currentQuestion: MathQuestion | undefined = questions[currentIndex];

  /** Progress through the level (0 to 1) */
  const progressPercent = questions.length > 0 ? currentIndex / questions.length : 0;

  /** Is this the last question? */
  const isLastQuestion = currentIndex >= questions.length - 1;

  /** Calculate stars based on correct percentage */
  const calculateStars = (correct: number, total: number): number => {
    const ratio = total > 0 ? correct / total : 0;
    if (ratio >= STAR_THRESHOLDS.three) return 3;
    if (ratio >= STAR_THRESHOLDS.two) return 2;
    if (ratio >= STAR_THRESHOLDS.one) return 1;
    return 0;
  };

  /** Handle player selecting an answer */
  const handleAnswer = useCallback(
    async (answer: number) => {
      if (isAnswered) return;

      const correct = answer === currentQuestion?.correctAnswer;
      setSelectedAnswer(answer);
      setIsAnswered(true);
      setIsCorrect(correct);

      if (correct) {
        setCorrectCount((prev) => prev + 1);
        await successHaptic();
        await playSound('correct');
      } else {
        await errorHaptic();
        await playSound('wrong');
      }
    },
    [isAnswered, currentQuestion]
  );

  /** Move to next question or finish level */
  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      // Level complete
      const finalCorrect = correctCount + (isCorrect ? 0 : 0); // Already counted
      const totalQuestions = questions.length;
      const stars = calculateStars(finalCorrect + (isCorrect && !isAnswered ? 1 : 0), totalQuestions);
      const coinsEarned =
        finalCorrect * COINS_PER_CORRECT +
        (finalCorrect === totalQuestions ? PERFECT_LEVEL_BONUS : 0);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const result: LevelResult = {
        worldId,
        levelId,
        totalQuestions,
        correctAnswers: finalCorrect,
        stars,
        coinsEarned,
        timeSpent,
        isNewBest: true, // Will be compared in progress
      };

      playSound('levelComplete');
      onComplete(result);
    } else {
      // Next question
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setIsCorrect(false);
    }
  }, [isLastQuestion, correctCount, isCorrect, questions.length, startTime, worldId, levelId, onComplete, isAnswered]);

  /** Retry the wrong answer (allow unlimited retries) */
  const handleRetry = useCallback(() => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
  }, []);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    correctCount,
    isAnswered,
    selectedAnswer,
    isCorrect,
    progressPercent,
    isLastQuestion,
    handleAnswer,
    handleNext,
    handleRetry,
  };
};
