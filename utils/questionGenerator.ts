// ============================================================
// Math Treasure Hunt - Math Question Generator
// Generates age-appropriate math questions for children
// ============================================================

import { Difficulty, MathQuestion, QuestionType } from '../types';
import { DIFFICULTY_CONFIG } from '../constants/gameData';

/** Generate a unique ID */
const generateId = (): string => Math.random().toString(36).substring(2, 9);

/** Get a random integer between min and max (inclusive) */
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Shuffle an array */
const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/** Generate wrong answers that are close to the correct answer */
const generateWrongOptions = (
  correctAnswer: number,
  count: number,
  min: number,
  max: number
): number[] => {
  const wrongs: Set<number> = new Set();

  // Try to generate answers close to the correct one first
  const nearbyValues = [
    correctAnswer + 1,
    correctAnswer - 1,
    correctAnswer + 2,
    correctAnswer - 2,
    correctAnswer + 3,
    correctAnswer - 3,
  ].filter((v) => v >= min && v <= max && v !== correctAnswer);

  // Shuffle and pick from nearby
  const shuffled = shuffle(nearbyValues);
  for (const val of shuffled) {
    if (wrongs.size >= count) break;
    wrongs.add(val);
  }

  // Fill remaining with random values
  let attempts = 0;
  while (wrongs.size < count && attempts < 50) {
    const val = randomInt(min, max);
    if (val !== correctAnswer && !wrongs.has(val)) {
      wrongs.add(val);
    }
    attempts++;
  }

  return Array.from(wrongs).slice(0, count);
};

/** Generate an addition question: a + b = ? */
const generateAddition = (maxNumber: number, optionsCount: number): MathQuestion => {
  const a = randomInt(1, Math.floor(maxNumber / 2));
  const b = randomInt(1, maxNumber - a);
  const correctAnswer = a + b;

  const wrongs = generateWrongOptions(correctAnswer, optionsCount - 1, 1, maxNumber);
  const options = shuffle([correctAnswer, ...wrongs]);

  return {
    id: generateId(),
    type: 'addition',
    question: `${a} + ${b} = ?`,
    options,
    correctAnswer,
    difficulty: maxNumber <= 10 ? 'easy' : 'medium',
  };
};

/** Generate a subtraction question: a - b = ? (no negative results) */
const generateSubtraction = (maxNumber: number, optionsCount: number): MathQuestion => {
  const a = randomInt(2, maxNumber);
  const b = randomInt(1, a - 1); // Ensure no negative result
  const correctAnswer = a - b;

  const wrongs = generateWrongOptions(correctAnswer, optionsCount - 1, 0, maxNumber);
  const options = shuffle([correctAnswer, ...wrongs]);

  return {
    id: generateId(),
    type: 'subtraction',
    question: `${a} - ${b} = ?`,
    options,
    correctAnswer,
    difficulty: maxNumber <= 10 ? 'easy' : 'medium',
  };
};

/** Generate a counting question with emoji visuals */
const generateCounting = (maxNumber: number, optionsCount: number): MathQuestion => {
  const emojis = ['⭐', '🍎', '🌺', '🐟', '🦋', '🎈', '💎', '🍪', '🌸', '🐝'];
  const emoji = emojis[randomInt(0, emojis.length - 1)];
  const count = randomInt(1, Math.min(maxNumber, 10));
  const visual = emoji.repeat(count);

  const wrongs = generateWrongOptions(count, optionsCount - 1, 1, Math.min(maxNumber, 12));
  const options = shuffle([count, ...wrongs]);

  return {
    id: generateId(),
    type: 'counting',
    question: `Count the items:`,
    visual,
    options,
    correctAnswer: count,
    difficulty: maxNumber <= 10 ? 'easy' : 'medium',
  };
};

/** Generate a comparison question: which is bigger? */
const generateComparison = (maxNumber: number, optionsCount: number): MathQuestion => {
  const a = randomInt(1, maxNumber);
  let b = randomInt(1, maxNumber);
  while (b === a) {
    b = randomInt(1, maxNumber);
  }

  const correctAnswer = Math.max(a, b);

  // For comparison, options are the two numbers plus distractors
  const wrongs = generateWrongOptions(correctAnswer, optionsCount - 1, 1, maxNumber);
  // Always include both compared numbers in the options
  const otherOptions = wrongs.filter((w) => w !== a && w !== b).slice(0, optionsCount - 2);
  const options = shuffle([a, b, ...otherOptions].slice(0, optionsCount));

  // Make sure correct answer is in options
  if (!options.includes(correctAnswer)) {
    options[0] = correctAnswer;
  }

  return {
    id: generateId(),
    type: 'comparison',
    question: `Which number is bigger?\n${a} or ${b}`,
    options: shuffle(options),
    correctAnswer,
    difficulty: maxNumber <= 10 ? 'easy' : 'medium',
  };
};

/** Generate a missing number question: what comes after/before? */
const generateMissingNumber = (maxNumber: number, optionsCount: number): MathQuestion => {
  const patterns = ['after', 'before', 'between'] as const;
  const pattern = patterns[randomInt(0, maxNumber <= 10 ? 1 : 2)];

  let question: string;
  let correctAnswer: number;

  switch (pattern) {
    case 'after': {
      const num = randomInt(1, maxNumber - 1);
      question = `What number comes after ${num}?`;
      correctAnswer = num + 1;
      break;
    }
    case 'before': {
      const num = randomInt(2, maxNumber);
      question = `What number comes before ${num}?`;
      correctAnswer = num - 1;
      break;
    }
    case 'between': {
      const num = randomInt(2, maxNumber - 1);
      question = `What number is between ${num - 1} and ${num + 1}?`;
      correctAnswer = num;
      break;
    }
  }

  const wrongs = generateWrongOptions(correctAnswer, optionsCount - 1, 1, maxNumber);
  const options = shuffle([correctAnswer, ...wrongs]);

  return {
    id: generateId(),
    type: 'missing_number',
    question,
    options,
    correctAnswer,
    difficulty: maxNumber <= 10 ? 'easy' : 'medium',
  };
};

/** Generate a shape counting question */
const generateShapeCounting = (maxNumber: number, optionsCount: number): MathQuestion => {
  const shapes = [
    { emoji: '🔴', name: 'red circles' },
    { emoji: '🟡', name: 'yellow circles' },
    { emoji: '🔵', name: 'blue circles' },
    { emoji: '🟢', name: 'green circles' },
    { emoji: '⬜', name: 'white squares' },
    { emoji: '🔷', name: 'blue diamonds' },
    { emoji: '🔶', name: 'orange diamonds' },
    { emoji: '💜', name: 'purple hearts' },
  ];

  const shape = shapes[randomInt(0, shapes.length - 1)];
  const count = randomInt(2, Math.min(maxNumber, 8));
  const visual = shape.emoji.repeat(count);

  const wrongs = generateWrongOptions(count, optionsCount - 1, 1, Math.min(maxNumber, 10));
  const options = shuffle([count, ...wrongs]);

  return {
    id: generateId(),
    type: 'shape_counting',
    question: `How many ${shape.name} do you see?`,
    visual,
    options,
    correctAnswer: count,
    difficulty: maxNumber <= 10 ? 'easy' : 'medium',
  };
};

/** Get available question types based on difficulty */
const getQuestionTypes = (difficulty: Difficulty): QuestionType[] => {
  switch (difficulty) {
    case 'easy':
      return ['addition', 'subtraction', 'counting', 'comparison'];
    case 'medium':
      return ['addition', 'subtraction', 'counting', 'comparison', 'missing_number'];
    case 'hard':
      return [
        'addition',
        'subtraction',
        'counting',
        'comparison',
        'missing_number',
        'shape_counting',
      ];
  }
};

/**
 * Generate a set of questions for a level
 * @param difficulty - The difficulty setting
 * @param count - Override number of questions (uses difficulty default if not specified)
 */
export const generateQuestions = (
  difficulty: Difficulty,
  count?: number
): MathQuestion[] => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const numQuestions = count || config.questionsPerLevel;
  const { maxNumber, optionsCount } = config;
  const types = getQuestionTypes(difficulty);
  const questions: MathQuestion[] = [];

  for (let i = 0; i < numQuestions; i++) {
    const type = types[randomInt(0, types.length - 1)];
    let question: MathQuestion;

    switch (type) {
      case 'addition':
        question = generateAddition(maxNumber, optionsCount);
        break;
      case 'subtraction':
        question = generateSubtraction(maxNumber, optionsCount);
        break;
      case 'counting':
        question = generateCounting(maxNumber, optionsCount);
        break;
      case 'comparison':
        question = generateComparison(maxNumber, optionsCount);
        break;
      case 'missing_number':
        question = generateMissingNumber(maxNumber, optionsCount);
        break;
      case 'shape_counting':
        question = generateShapeCounting(maxNumber, optionsCount);
        break;
    }

    questions.push(question);
  }

  return questions;
};
