// ============================================================
// Math Treasure Hunt - Game Data Constants
// ============================================================

import { Achievement, Difficulty, DifficultyConfig, GameWorld, WorldId } from '../types';

/** All game worlds with their configuration */
export const GAME_WORLDS: GameWorld[] = [
  {
    id: 'jungle',
    name: 'Jungle Treasure',
    emoji: '🌴',
    description: 'Explore the wild jungle and find hidden gems!',
    color: '#27AE60',
    gradientColors: ['#2ECC71', '#27AE60'],
    levelsCount: 10,
    requiredStars: 0, // First world is always unlocked
  },
  {
    id: 'pirate',
    name: 'Pirate Island',
    emoji: '🏴‍☠️',
    description: 'Sail the seas and discover pirate gold!',
    color: '#2980B9',
    gradientColors: ['#3498DB', '#2980B9'],
    levelsCount: 10,
    requiredStars: 10,
  },
  {
    id: 'space',
    name: 'Space Gems',
    emoji: '🚀',
    description: 'Blast off to space and collect cosmic gems!',
    color: '#8E44AD',
    gradientColors: ['#9B59B6', '#8E44AD'],
    levelsCount: 10,
    requiredStars: 25,
  },
  {
    id: 'dinosaur',
    name: 'Dinosaur Valley',
    emoji: '🦕',
    description: 'Travel back in time with friendly dinos!',
    color: '#D35400',
    gradientColors: ['#E67E22', '#D35400'],
    levelsCount: 10,
    requiredStars: 45,
  },
  {
    id: 'candy',
    name: 'Candy Castle',
    emoji: '🍭',
    description: 'Enter the sweetest castle in the land!',
    color: '#E91E63',
    gradientColors: ['#FF69B4', '#E91E63'],
    levelsCount: 10,
    requiredStars: 65,
  },
  {
    id: 'underwater',
    name: 'Underwater Pearls',
    emoji: '🐠',
    description: 'Dive deep to find magical pearls!',
    color: '#0097A7',
    gradientColors: ['#00BCD4', '#0097A7'],
    levelsCount: 10,
    requiredStars: 85,
  },
];

/** Difficulty configuration for ages 6-8 */
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    questionsPerLevel: 5,
    minNumber: 20,
    maxNumber: 50,
    optionsCount: 3,
    hasTimer: true,
    timeLimitSeconds: 10,
    questionTypes: [
      'addition',
      'subtraction',
      'counting',
      'comparison',
      'missing_number',
    ],
  },
  medium: {
    questionsPerLevel: 8,
    minNumber: 50,
    maxNumber: 99,
    optionsCount: 4,
    hasTimer: true,
    timeLimitSeconds: 10,
    questionTypes: [
      'addition',
      'subtraction',
      'counting',
      'comparison',
      'missing_number',
      'number_sequence',
    ],
  },
  hard: {
    questionsPerLevel: 10,
    minNumber: 20,
    maxNumber: 99,
    optionsCount: 4,
    hasTimer: true,
    timeLimitSeconds: 10,
    questionTypes: [
      'addition',
      'subtraction',
      'counting',
      'comparison',
      'missing_number',
      'number_sequence',
      'shape_counting',
    ],
  },
};

/** Timer bonus coins for fast answers (answered with time remaining) */
export const TIMER_BONUS_THRESHOLD = 5; // seconds remaining to earn bonus
export const TIMER_BONUS_COINS = 3; // extra coins per fast answer

/** Achievement definitions */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_star',
    title: 'First Star!',
    description: 'Earn your very first star',
    emoji: '⭐',
    requirement: 1,
    type: 'stars',
    isUnlocked: false,
  },
  {
    id: 'star_collector',
    title: 'Star Collector',
    description: 'Collect 10 stars',
    emoji: '🌟',
    requirement: 10,
    type: 'stars',
    isUnlocked: false,
  },
  {
    id: 'star_master',
    title: 'Star Master',
    description: 'Collect 50 stars',
    emoji: '✨',
    requirement: 50,
    type: 'stars',
    isUnlocked: false,
  },
  {
    id: 'coin_finder',
    title: 'Coin Finder',
    description: 'Collect 50 coins',
    emoji: '🪙',
    requirement: 50,
    type: 'coins',
    isUnlocked: false,
  },
  {
    id: 'treasure_hunter',
    title: 'Treasure Hunter',
    description: 'Collect 200 coins',
    emoji: '💰',
    requirement: 200,
    type: 'coins',
    isUnlocked: false,
  },
  {
    id: 'rich_explorer',
    title: 'Rich Explorer',
    description: 'Collect 500 coins',
    emoji: '👑',
    requirement: 500,
    type: 'coins',
    isUnlocked: false,
  },
  {
    id: 'first_level',
    title: 'Adventure Begins!',
    description: 'Complete your first level',
    emoji: '🎉',
    requirement: 1,
    type: 'levels',
    isUnlocked: false,
  },
  {
    id: 'level_explorer',
    title: 'Level Explorer',
    description: 'Complete 10 levels',
    emoji: '🗺️',
    requirement: 10,
    type: 'levels',
    isUnlocked: false,
  },
  {
    id: 'level_champion',
    title: 'Level Champion',
    description: 'Complete 30 levels',
    emoji: '🏆',
    requirement: 30,
    type: 'levels',
    isUnlocked: false,
  },
  {
    id: 'streak_3',
    title: 'Hot Streak!',
    description: 'Play 3 days in a row',
    emoji: '🔥',
    requirement: 3,
    type: 'streak',
    isUnlocked: false,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Play 7 days in a row',
    emoji: '💪',
    requirement: 7,
    type: 'streak',
    isUnlocked: false,
  },
  {
    id: 'world_unlock',
    title: 'World Traveler',
    description: 'Unlock 3 worlds',
    emoji: '🌍',
    requirement: 3,
    type: 'worlds',
    isUnlocked: false,
  },
  {
    id: 'all_worlds',
    title: 'Master Explorer',
    description: 'Unlock all 6 worlds',
    emoji: '🏅',
    requirement: 6,
    type: 'worlds',
    isUnlocked: false,
  },
];

/** Coins earned per correct answer */
export const COINS_PER_CORRECT = 5;

/** Bonus coins for completing a level without errors */
export const PERFECT_LEVEL_BONUS = 20;

/** Stars calculation thresholds */
export const STAR_THRESHOLDS = {
  one: 0.5,   // 50% correct = 1 star
  two: 0.75,  // 75% correct = 2 stars
  three: 1.0, // 100% correct = 3 stars
};

/** Encouragement messages for correct answers */
export const CORRECT_MESSAGES = [
  'Great job! 🎉',
  'Amazing! ⭐',
  'You did it! 🏆',
  'Wonderful! 🌟',
  'Super smart! 🧠',
  'Fantastic! 🎊',
  'Brilliant! 💡',
  'Awesome! 🚀',
  'Well done! 👏',
  'Perfect! 💯',
];

/** Gentle messages for wrong answers */
export const WRONG_MESSAGES = [
  'Try again! 💪',
  'Almost there! 🤔',
  'You can do it! 🌈',
  'Keep trying! ⭐',
  "No worries, try again! 😊",
];

/** Default avatars for player profile */
export const AVATARS = ['🦁', '🐱', '🐶', '🦊', '🐼', '🐨', '🦄', '🐸', '🐰', '🐻'];

/** World-themed emojis for visual elements */
export const WORLD_EMOJIS: Record<WorldId, string[]> = {
  jungle: ['🌴', '🦜', '🐒', '💎', '🌺'],
  pirate: ['🏴‍☠️', '⚓', '🦜', '💰', '🗺️'],
  space: ['🚀', '🌟', '👽', '🛸', '🪐'],
  dinosaur: ['🦕', '🦖', '🌋', '🥚', '🦴'],
  candy: ['🍭', '🍬', '🧁', '🎂', '🍫'],
  underwater: ['🐠', '🐙', '🐚', '🦈', '🧜‍♀️'],
};
