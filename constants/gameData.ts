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
    minNumber: 1,
    maxNumber: 20,
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
    minNumber: 21,
    maxNumber: 50,
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
  'Math wizard! 🧙',
  "You're on fire! 🔥",
  'Treasure found! 💎',
  'Incredible! 🌈',
  'Wow wow wow! 🤩',
  'Superstar! ✨',
  'Nailed it! 🎯',
  'Genius move! 🦉',
  'Gold medal! 🥇',
  'Spectacular! 🎆',
];

/** Streak-specific messages shown when the player gets multiple correct in a row */
export const STREAK_MESSAGES: Record<number, string> = {
  3: "3 in a row! You're warming up! 🔥",
  4: "4 in a row! Unstoppable! ⚡",
  5: "5 in a row! AMAZING streak! 🌟🌟🌟",
};

/** Gentle messages for wrong answers */
export const WRONG_MESSAGES = [
  'Try again! 💪',
  'Almost there! 🤔',
  'You can do it! 🌈',
  'Keep trying! ⭐',
  "No worries, try again! 😊",
  "So close! One more try! 🎯",
  "Think again, you got this! 🧠",
  "Not quite, but you're learning! 📚",
];

/** Story snippets shown between levels, keyed by worldId */
export const WORLD_STORIES: Record<WorldId, string[]> = {
  jungle: [
    "🌴 You found a hidden path through the jungle vines!",
    "🦜 A friendly parrot drops a clue: 'The treasure is near!'",
    "💎 You spot a sparkling gem peeking through the leaves!",
    "🐒 A playful monkey swings by with a golden key!",
    "🌺 The jungle flowers bloom to reveal a secret trail!",
    "🗺️ Your treasure map shows you're halfway there!",
    "🌴 The ancient jungle temple is just ahead!",
    "🦁 A wise lion says: 'Only the smartest explorers pass!'",
    "💎 The ground sparkles — treasure is close!",
    "🏆 The legendary jungle crown awaits the bravest explorer!",
  ],
  pirate: [
    "🏴‍☠️ Captain says: 'Set sail for adventure, matey!'",
    "⚓ You discover a message in a bottle with the next clue!",
    "🦜 Polly the parrot squawks: 'Gold ahead! Gold ahead!'",
    "🗺️ The pirate map reveals a secret island!",
    "💰 You found a buried chest... but it needs more keys!",
    "🌊 The waves carry whispers of hidden treasure!",
    "🏝️ A mysterious island appears on the horizon!",
    "⚓ Your ship sails closer to the legendary loot!",
    "🦑 A friendly octopus guards the underwater caves!",
    "🏴‍☠️ X marks the spot — the final treasure awaits!",
  ],
  space: [
    "🚀 Houston, we have liftoff! Next planet ahead!",
    "🌟 A shooting star leaves a trail of space gems!",
    "👽 A friendly alien waves and shares a star crystal!",
    "🪐 You're flying past Saturn's rings — so beautiful!",
    "🛸 A UFO drops supplies for your mission!",
    "🌌 The Milky Way sparkles with cosmic treasures!",
    "☄️ A comet zooms by — ride its tail for a boost!",
    "🌟 You discovered a new constellation!",
    "🛸 The space station has a surprise waiting for you!",
    "🚀 Final approach to the cosmic treasure vault!",
  ],
  dinosaur: [
    "🦕 A gentle giant leads you deeper into the valley!",
    "🥚 You found a glowing dino egg — what's inside?",
    "🌋 The volcano rumbles... but you're safe on this path!",
    "🦖 A baby T-Rex wants to play number games too!",
    "🦴 Ancient fossils spell out a secret number code!",
    "🌿 You find fresh dino footprints to follow!",
    "🥚 The egg is cracking — a new dino friend hatches!",
    "🦕 Your dino buddy carries you across the river!",
    "🌋 The cave paintings show where treasure is hidden!",
    "🦖 The Valley King welcomes you to his treasure cave!",
  ],
  candy: [
    "🍭 Welcome to Candy Castle! Everything here is sweet!",
    "🍬 Candy fairies sprinkle sugar on your path!",
    "🧁 The Cupcake Bridge leads to the next room!",
    "🎂 A layer cake tower reveals a secret passage!",
    "🍫 The chocolate river carries golden candy coins!",
    "🍪 Cookie crumbs show the way forward!",
    "🍩 A donut wheel opens the next candy door!",
    "🍭 The Lollipop Garden is blooming with treasures!",
    "🧁 Sugar sprites dance to celebrate your progress!",
    "👑 The Candy Queen's crown jewels are almost yours!",
  ],
  underwater: [
    "🐠 A school of fish guides you deeper underwater!",
    "🐙 A helpful octopus opens a treasure cave!",
    "🐚 A magical seashell whispers the next clue!",
    "🦈 A friendly shark gives you a ride to the reef!",
    "🧜‍♀️ A mermaid shows you her pearl collection!",
    "🌊 The current carries you to a glowing grotto!",
    "🐠 Neon fish light up the dark ocean floor!",
    "🐚 You found the legendary singing shell!",
    "🦑 The Kraken isn't scary — he's guarding treasure!",
    "🧜‍♀️ The Ocean Palace gates open just for you!",
  ],
};

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
