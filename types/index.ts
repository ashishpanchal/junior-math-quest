// ============================================================
// Math Treasure Hunt - Type Definitions
// ============================================================

/** Difficulty levels available in the game */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Types of math questions */
export type QuestionType =
  | 'addition'
  | 'subtraction'
  | 'counting'
  | 'comparison'
  | 'missing_number'
  | 'shape_counting';

/** A single math question */
export interface MathQuestion {
  id: string;
  type: QuestionType;
  question: string;
  /** Visual representation (emoji-based) */
  visual?: string;
  options: number[];
  correctAnswer: number;
  difficulty: Difficulty;
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
  requiredStars: number; // Stars needed to unlock
}

/** A single level within a world */
export interface GameLevel {
  id: number;
  worldId: WorldId;
  difficulty: Difficulty;
  questionsCount: number;
  isCompleted: boolean;
  stars: number; // 0-3 stars earned
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
}

/** Progress data saved to AsyncStorage */
export interface GameProgress {
  profile: PlayerProfile;
  settings: GameSettings;
  completedLevels: Record<WorldId, number[]>;
  levelStars: Record<string, number>; // key: `${worldId}-${levelId}`
  unlockedWorlds: WorldId[];
  achievements: string[]; // IDs of unlocked achievements
  coins: number;
  totalStars: number;
}

/** Answer result after player selects an option */
export interface AnswerResult {
  isCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
  questionIndex: number;
}

/** Level completion result */
export interface LevelResult {
  worldId: WorldId;
  levelId: number;
  totalQuestions: number;
  correctAnswers: number;
  stars: number; // 0-3
  coinsEarned: number;
  timeSpent: number; // in seconds
  isNewBest: boolean;
}

/** Navigation params for game screen */
export interface GameScreenParams {
  worldId: WorldId;
  levelId: number;
  difficulty: Difficulty;
}
