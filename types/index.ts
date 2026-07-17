// ============================================================
// Math Treasure Hunt - Type Definitions (Updated)
// Supports 7 question types, timer, and age 6-8 ranges
// ============================================================

/** Difficulty levels available in the game */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** All supported math question types */
export type QuestionType =
  | 'addition'
  | 'subtraction'
  | 'counting'
  | 'comparison'
  | 'missing_number'
  | 'number_sequence'
  | 'shape_counting';

/** A single math question */
export interface MathQuestion {
  id: string;
  type: QuestionType;
  /** The question text displayed to the child */
  question: string;
  /** Optional visual representation (emoji-based, e.g. "⭐⭐⭐") */
  visual?: string;
  /** Answer options (3 or 4 numbers, randomised order) */
  options: number[];
  /** The single correct answer */
  correctAnswer: number;
  /** Difficulty this question was generated for */
  difficulty: Difficulty;
  /** Time limit in seconds for this question */
  timeLimit: number;
}

/** Difficulty configuration defining number ranges and rules */
export interface DifficultyConfig {
  /** Number of questions in a level */
  questionsPerLevel: number;
  /** Minimum number used in calculations */
  minNumber: number;
  /** Maximum number used in calculations */
  maxNumber: number;
  /** Number of answer options (3 or 4) */
  optionsCount: 3 | 4;
  /** Whether the timer is active */
  hasTimer: boolean;
  /** Time limit per question in seconds */
  timeLimitSeconds: number;
  /** Which question types are available at this difficulty */
  questionTypes: QuestionType[];
}

/** Timer state for the game engine */
export interface TimerState {
  /** Seconds remaining */
  remaining: number;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Whether time ran out */
  isExpired: boolean;
}

/** World IDs */
export type WorldId =
  | 'jungle'
  | 'pirate'
  | 'space'
  | 'dinosaur'
  | 'candy'
  | 'underwater';

/** Game world definition */
export interface GameWorld {
  id: WorldId;
  name: string;
  emoji: string;
  description: string;
  color: string;
  gradientColors: [string, string];
  levelsCount: number;
  requiredStars: number;
}

/** A single level within a world */
export interface GameLevel {
  id: number;
  worldId: WorldId;
  difficulty: Difficulty;
  questionsCount: number;
  isCompleted: boolean;
  stars: number;
  isLocked: boolean;
}

/** Player's profile data */
export interface PlayerProfile {
  name: string;
  avatar: string;
  age: number;
  coins: number;
  totalStars: number;
  streak: number;
  lastPlayDate: string | null;
}

/** Achievement definition */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requirement: number;
  type: 'stars' | 'coins' | 'levels' | 'streak' | 'worlds';
  isUnlocked: boolean;
}

/** Game settings controlled by parents */
export interface GameSettings {
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  voiceEnabled: boolean;
  hapticsEnabled: boolean;
  difficulty: Difficulty;
  /** Timer duration per question in seconds (default: 10) */
  timerSeconds: number;
  /** Whether timer is enabled */
  timerEnabled: boolean;
}

/** Progress data saved to AsyncStorage */
export interface GameProgress {
  profile: PlayerProfile;
  settings: GameSettings;
  completedLevels: Record<WorldId, number[]>;
  levelStars: Record<string, number>;
  unlockedWorlds: WorldId[];
  achievements: string[];
  coins: number;
  totalStars: number;
  /** Daily challenge tracking */
  dailyChallenge?: DailyChallengeData;
}

/** Daily challenge persistence data */
export interface DailyChallengeData {
  /** Date string of last completed daily challenge */
  lastCompletedDate: string | null;
  /** Number of consecutive days completed */
  dailyStreak: number;
  /** Record of dates when daily was completed (ISO date strings) */
  completedDates: string[];
  /** Highest score in speed round mode */
  speedRoundBest: number;
}

/** Answer result after player selects an option */
export interface AnswerResult {
  isCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
  questionIndex: number;
  /** Whether the answer was given before time expired */
  answeredInTime: boolean;
  /** Seconds remaining when answered */
  timeRemaining: number;
}

/** Level completion result */
export interface LevelResult {
  worldId: WorldId;
  levelId: number;
  totalQuestions: number;
  correctAnswers: number;
  stars: number;
  coinsEarned: number;
  timeSpent: number;
  isNewBest: boolean;
  /** Bonus coins earned from fast answers */
  timerBonus: number;
}

/** Navigation params for game screen */
export interface GameScreenParams {
  worldId: WorldId;
  levelId: number;
  difficulty: Difficulty;
}
