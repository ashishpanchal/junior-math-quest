// ============================================================
// Math Treasure Hunt - Math Question Generator (Rewritten)
// Age 6-8 appropriate questions with 7 types
// Rules: no negative answers, randomised options, 1 correct answer
// ============================================================

import { Difficulty, DifficultyConfig, MathQuestion, QuestionType } from '../types';
import { DIFFICULTY_CONFIG } from '../constants/gameData';

// ─── Utility Helpers ─────────────────────────────────────────

/** Generate a short unique ID */
const uid = (): string => Math.random().toString(36).substring(2, 9);

/** Random integer between min and max (inclusive) */
const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Pick a random element from an array */
const pick = <T>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];

/** Fisher-Yates shuffle (returns new array) */
const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Determine difficulty label from config */
const getDifficultyFromConfig = (config: DifficultyConfig): Difficulty => {
  if (config === DIFFICULTY_CONFIG.easy) return 'easy';
  if (config === DIFFICULTY_CONFIG.medium) return 'medium';
  if (config === DIFFICULTY_CONFIG.hard) return 'hard';
  return 'expert';
};

/**
 * Generate distractor (wrong) answers close to the correct one.
 * Ensures no duplicates, no negatives, and keeps values in [min, max].
 */
const generateDistractors = (
  correct: number,
  count: number,
  min: number,
  max: number
): number[] => {
  const distractors = new Set<number>();

  // Prefer nearby values for plausible wrong answers
  const offsets = [1, -1, 2, -2, 3, -3, 5, -5, 4, -4, 10, -10];
  for (const offset of offsets) {
    if (distractors.size >= count) break;
    const val = correct + offset;
    if (val >= min && val <= max && val !== correct) {
      distractors.add(val);
    }
  }

  // Fill remaining with random values if needed
  let attempts = 0;
  while (distractors.size < count && attempts < 100) {
    const val = randInt(min, max);
    if (val !== correct && !distractors.has(val)) {
      distractors.add(val);
    }
    attempts++;
  }

  return Array.from(distractors).slice(0, count);
};

/**
 * Build the final options array: 1 correct + distractors, shuffled.
 */
const buildOptions = (
  correct: number,
  optionsCount: number,
  min: number,
  max: number
): number[] => {
  const distractors = generateDistractors(correct, optionsCount - 1, min, max);
  return shuffle([correct, ...distractors]);
};

// ─── Question Generators ─────────────────────────────────────

/** Addition: a + b = ? (result stays within maxNumber) */
const generateAddition = (config: DifficultyConfig): MathQuestion => {
  const { minNumber, maxNumber, optionsCount, timeLimitSeconds } = config;
  // Pick two numbers whose sum doesn't exceed maxNumber
  const a = randInt(minNumber, Math.floor(maxNumber * 0.6));
  const b = randInt(1, Math.min(maxNumber - a, Math.floor(maxNumber * 0.5)));
  const correct = a + b;

  return {
    id: uid(),
    type: 'addition',
    question: `${a} + ${b} = ?`,
    options: buildOptions(correct, optionsCount, minNumber, maxNumber),
    correctAnswer: correct,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

/** Subtraction: a - b = ? (no negative results, result >= 0) */
const generateSubtraction = (config: DifficultyConfig): MathQuestion => {
  const { minNumber, maxNumber, optionsCount, timeLimitSeconds } = config;
  // Ensure a > b so result is positive
  const a = randInt(Math.max(minNumber, 10), maxNumber);
  const b = randInt(1, a - 1);
  const correct = a - b;

  return {
    id: uid(),
    type: 'subtraction',
    question: `${a} - ${b} = ?`,
    options: buildOptions(correct, optionsCount, 0, maxNumber),
    correctAnswer: correct,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

/** Counting objects: show emojis, count how many */
const generateCounting = (config: DifficultyConfig): MathQuestion => {
  const { optionsCount, timeLimitSeconds } = config;
  const items = ['⭐', '🍎', '🌺', '🐟', '🦋', '🎈', '💎', '🍪', '🌸', '🐝', '🍓', '🧁'];
  const emoji = pick(items);
  // Counting stays reasonable (3-12 items visible)
  const count = randInt(3, 12);
  const visual = emoji.repeat(count);

  return {
    id: uid(),
    type: 'counting',
    question: 'Count the items:',
    visual,
    options: buildOptions(count, optionsCount, 1, 15),
    correctAnswer: count,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

/** Comparison: which number is bigger / smaller? */
const generateComparison = (config: DifficultyConfig): MathQuestion => {
  const { minNumber, maxNumber, optionsCount, timeLimitSeconds } = config;
  const a = randInt(minNumber, maxNumber);
  let b = randInt(minNumber, maxNumber);
  // Ensure a ≠ b
  while (b === a) b = randInt(minNumber, maxNumber);

  // Randomly ask bigger or smaller
  const askBigger = Math.random() > 0.5;
  const correct = askBigger ? Math.max(a, b) : Math.min(a, b);
  const keyword = askBigger ? 'bigger' : 'smaller';

  // Options should include both numbers + distractors
  let opts = [a, b];
  const extra = generateDistractors(correct, optionsCount - 2, minNumber, maxNumber)
    .filter((v) => v !== a && v !== b);
  opts = [...opts, ...extra].slice(0, optionsCount);

  // Ensure correct is in options
  if (!opts.includes(correct)) {
    opts[opts.length - 1] = correct;
  }

  return {
    id: uid(),
    type: 'comparison',
    question: `Which number is ${keyword}?\n${a}  or  ${b}`,
    options: shuffle(opts),
    correctAnswer: correct,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

/** Missing number: what comes before / after / between? */
const generateMissingNumber = (config: DifficultyConfig): MathQuestion => {
  const { minNumber, maxNumber, optionsCount, timeLimitSeconds } = config;
  const patterns = ['after', 'before', 'between'] as const;
  const pattern = pick(patterns);

  let question: string;
  let correct: number;

  switch (pattern) {
    case 'after': {
      const num = randInt(minNumber, maxNumber - 1);
      question = `What number comes after ${num}?`;
      correct = num + 1;
      break;
    }
    case 'before': {
      const num = randInt(minNumber + 1, maxNumber);
      question = `What number comes before ${num}?`;
      correct = num - 1;
      break;
    }
    case 'between': {
      const num = randInt(minNumber + 1, maxNumber - 1);
      question = `What number is between ${num - 1} and ${num + 1}?`;
      correct = num;
      break;
    }
  }

  return {
    id: uid(),
    type: 'missing_number',
    question,
    options: buildOptions(correct, optionsCount, Math.max(0, correct - 5), correct + 5),
    correctAnswer: correct,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

/** Number sequence: find the next number in a pattern */
const generateNumberSequence = (config: DifficultyConfig): MathQuestion => {
  const { minNumber, maxNumber, optionsCount, timeLimitSeconds } = config;

  // Sequence patterns: +step, -step, or alternating
  const step = randInt(2, 5);
  const isIncreasing = Math.random() > 0.3; // Mostly increasing for kids
  const start = isIncreasing
    ? randInt(minNumber, Math.max(minNumber, maxNumber - step * 5))
    : randInt(minNumber + step * 4, maxNumber);

  // Generate 4 terms and ask for the 5th
  const terms: number[] = [];
  for (let i = 0; i < 4; i++) {
    terms.push(start + (isIncreasing ? step * i : -step * i));
  }
  const correct = start + (isIncreasing ? step * 4 : -step * 4);

  // Ensure no negative answer
  if (correct < 0) {
    // Fallback to simple increasing
    const safeStart = randInt(minNumber, maxNumber - step * 5);
    const safeTerms = Array.from({ length: 4 }, (_, i) => safeStart + step * i);
    const safeCorrect = safeStart + step * 4;

    return {
      id: uid(),
      type: 'number_sequence',
      question: `What comes next?\n${safeTerms.join(', ')}, ?`,
      options: buildOptions(safeCorrect, optionsCount, safeCorrect - 10, safeCorrect + 10),
      correctAnswer: safeCorrect,
      difficulty: getDifficultyFromConfig(config),
      timeLimit: timeLimitSeconds,
    };
  }

  return {
    id: uid(),
    type: 'number_sequence',
    question: `What comes next?\n${terms.join(', ')}, ?`,
    options: buildOptions(correct, optionsCount, Math.max(0, correct - 10), correct + 10),
    correctAnswer: correct,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

/** Multiplication: a × b = ? */
const generateMultiplication = (config: DifficultyConfig): MathQuestion => {
  const { optionsCount, timeLimitSeconds } = config;
  const isExpert = config === DIFFICULTY_CONFIG.expert;

  // Expert: up to 12×12; otherwise simpler tables
  const a = isExpert ? randInt(4, 12) : randInt(2, 9);
  const b = isExpert ? randInt(4, 12) : randInt(2, 9);
  const correct = a * b;

  return {
    id: uid(),
    type: 'multiplication',
    question: `${a} × ${b} = ?`,
    options: buildOptions(correct, optionsCount, Math.max(1, correct - 15), correct + 15),
    correctAnswer: correct,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

/** Division: a ÷ b = ? (always exact division, no remainders) */
const generateDivision = (config: DifficultyConfig): MathQuestion => {
  const { optionsCount, timeLimitSeconds } = config;
  const isExpert = config === DIFFICULTY_CONFIG.expert;

  // Generate by working backwards: pick answer and divisor, compute dividend
  const answer = isExpert ? randInt(3, 15) : randInt(2, 10);
  const divisor = isExpert ? randInt(3, 12) : randInt(2, 9);
  const dividend = answer * divisor;

  return {
    id: uid(),
    type: 'division',
    question: `${dividend} ÷ ${divisor} = ?`,
    options: buildOptions(answer, optionsCount, Math.max(1, answer - 8), answer + 8),
    correctAnswer: answer,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

/** Multi-step: a OP b OP c = ? (two operations chained) */
const generateMultiStep = (config: DifficultyConfig): MathQuestion => {
  const { optionsCount, timeLimitSeconds } = config;

  const ops = ['+', '-'] as const;
  const op1 = pick(ops);
  const op2 = pick(ops);

  // Keep numbers manageable for mental math
  const a = randInt(10, 50);
  let b = randInt(5, 30);
  let c = randInt(5, 20);

  // Compute step by step ensuring no negatives
  let intermediate = op1 === '+' ? a + b : a - b;
  if (intermediate < 0) {
    b = randInt(1, a - 1);
    intermediate = a - b;
  }

  let correct = op2 === '+' ? intermediate + c : intermediate - c;
  if (correct < 0) {
    c = randInt(1, intermediate - 1);
    correct = intermediate - c;
  }

  const question = `${a} ${op1} ${b} ${op2} ${c} = ?`;

  return {
    id: uid(),
    type: 'multi_step',
    question,
    options: buildOptions(correct, optionsCount, Math.max(0, correct - 12), correct + 12),
    correctAnswer: correct,
    difficulty: 'expert',
    timeLimit: timeLimitSeconds,
  };
};

/** Word problem: contextual math story */
const generateWordProblem = (config: DifficultyConfig): MathQuestion => {
  const { optionsCount, timeLimitSeconds } = config;

  const templates = [
    () => {
      const total = randInt(20, 60);
      const gave = randInt(5, total - 5);
      const correct = total - gave;
      return { question: `Ali has ${total} stickers. He gives ${gave} to Sam.\nHow many does Ali have left?`, correct };
    },
    () => {
      const perBox = randInt(4, 10);
      const boxes = randInt(3, 8);
      const correct = perBox * boxes;
      return { question: `There are ${boxes} boxes with ${perBox} apples each.\nHow many apples in total?`, correct };
    },
    () => {
      const total = randInt(20, 50);
      const groups = pick([2, 4, 5, 10] as const);
      const safeTotal = total - (total % groups); // ensure clean division
      const correct = safeTotal / groups;
      return { question: `${safeTotal} candies shared equally among ${groups} friends.\nHow many does each get?`, correct };
    },
    () => {
      const a = randInt(15, 40);
      const b = randInt(10, 30);
      const correct = a + b;
      return { question: `Mia scored ${a} points in round 1 and ${b} in round 2.\nWhat is her total score?`, correct };
    },
    () => {
      const price = randInt(5, 15);
      const count = randInt(3, 7);
      const correct = price * count;
      return { question: `Each toy costs $${price}.\nHow much for ${count} toys?`, correct };
    },
    () => {
      const start = randInt(30, 80);
      const ate = randInt(5, 15);
      const bought = randInt(10, 20);
      const correct = start - ate + bought;
      return { question: `You have ${start} coins. You spend ${ate} and earn ${bought}.\nHow many coins now?`, correct };
    },
  ];

  const template = pick(templates);
  const { question, correct } = template();

  return {
    id: uid(),
    type: 'word_problem',
    question,
    options: buildOptions(correct, optionsCount, Math.max(0, correct - 10), correct + 10),
    correctAnswer: correct,
    difficulty: 'expert',
    timeLimit: timeLimitSeconds,
  };
};

/** Shape counting: count specific shapes among mixed shapes */
const generateShapeCounting = (config: DifficultyConfig): MathQuestion => {
  const { optionsCount, timeLimitSeconds } = config;

  const shapes = [
    { emoji: '🔴', name: 'red circles' },
    { emoji: '🟡', name: 'yellow circles' },
    { emoji: '🔵', name: 'blue circles' },
    { emoji: '🟢', name: 'green circles' },
    { emoji: '🟣', name: 'purple circles' },
    { emoji: '🔷', name: 'blue diamonds' },
    { emoji: '🔶', name: 'orange diamonds' },
    { emoji: '⬜', name: 'white squares' },
    { emoji: '🟧', name: 'orange squares' },
    { emoji: '💜', name: 'purple hearts' },
    { emoji: '💚', name: 'green hearts' },
    { emoji: '⭐', name: 'stars' },
  ];

  // Pick target shape and distractor shapes
  const targetShape = pick(shapes);
  const otherShapes = shapes.filter((s) => s.emoji !== targetShape.emoji);
  const distractor1 = pick(otherShapes);
  const distractor2 = pick(otherShapes.filter((s) => s.emoji !== distractor1.emoji));

  // Generate mixed visual
  const targetCount = randInt(3, 8);
  const distractor1Count = randInt(2, 5);
  const distractor2Count = randInt(1, 4);

  // Build visual string with mixed shapes then shuffle characters
  const allItems = [
    ...Array(targetCount).fill(targetShape.emoji),
    ...Array(distractor1Count).fill(distractor1.emoji),
    ...Array(distractor2Count).fill(distractor2.emoji),
  ];
  const visual = shuffle(allItems).join('');

  return {
    id: uid(),
    type: 'shape_counting',
    question: `How many ${targetShape.name} do you see?`,
    visual,
    options: buildOptions(targetCount, optionsCount, 1, targetCount + 5),
    correctAnswer: targetCount,
    difficulty: getDifficultyFromConfig(config),
    timeLimit: timeLimitSeconds,
  };
};

// ─── Question Dispatcher ─────────────────────────────────────

/** Map question type to its generator function */
const GENERATORS: Record<QuestionType, (config: DifficultyConfig) => MathQuestion> = {
  addition: generateAddition,
  subtraction: generateSubtraction,
  multiplication: generateMultiplication,
  division: generateDivision,
  multi_step: generateMultiStep,
  counting: generateCounting,
  comparison: generateComparison,
  missing_number: generateMissingNumber,
  number_sequence: generateNumberSequence,
  shape_counting: generateShapeCounting,
  word_problem: generateWordProblem,
};

// ─── Public API ──────────────────────────────────────────────

/**
 * Generate a set of questions for a level.
 * Ensures variety by cycling through available types.
 *
 * @param difficulty - The difficulty setting
 * @param count - Override number of questions (uses config default if omitted)
 * @returns Array of MathQuestion objects ready for gameplay
 */
export const generateQuestions = (
  difficulty: Difficulty,
  count?: number
): MathQuestion[] => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const numQuestions = count ?? config.questionsPerLevel;
  const types = config.questionTypes;
  const questions: MathQuestion[] = [];

  // Ensure each type appears at least once before repeating (variety)
  const shuffledTypes = shuffle([...types]);
  let typeIndex = 0;

  for (let i = 0; i < numQuestions; i++) {
    // Cycle through shuffled types for variety
    const type = shuffledTypes[typeIndex % shuffledTypes.length];
    typeIndex++;

    const generator = GENERATORS[type];
    const question = generator(config);
    questions.push(question);
  }

  return questions;
};

/**
 * Generate a single question of a specific type.
 * Useful for practice modes or testing.
 */
export const generateSingleQuestion = (
  type: QuestionType,
  difficulty: Difficulty
): MathQuestion => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const generator = GENERATORS[type];
  return generator(config);
};
