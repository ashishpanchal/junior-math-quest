// ============================================================
// Math Treasure Hunt - AsyncStorage Utility
// Handles all local data persistence
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty, GameProgress, GameSettings, PlayerProfile, WorldId } from '../types';

const STORAGE_KEY = '@math_treasure_hunt_progress';

/** Default player profile */
const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Explorer',
  avatar: '🦁',
  age: 6,
  coins: 0,
  totalStars: 0,
  streak: 0,
  lastPlayDate: null,
};

/** Default game settings */
const DEFAULT_SETTINGS: GameSettings = {
  musicEnabled: true,
  soundEffectsEnabled: true,
  voiceEnabled: true,
  hapticsEnabled: true,
  difficulty: 'easy',
};

/** Default game progress */
const DEFAULT_PROGRESS: GameProgress = {
  profile: DEFAULT_PROFILE,
  settings: DEFAULT_SETTINGS,
  completedLevels: {
    jungle: [],
    pirate: [],
    space: [],
    dinosaur: [],
    candy: [],
    underwater: [],
  },
  levelStars: {},
  unlockedWorlds: ['jungle'], // First world is always unlocked
  achievements: [],
  coins: 0,
  totalStars: 0,
};

/** Load game progress from storage */
export const loadProgress = async (): Promise<GameProgress> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as GameProgress;
      // Merge with defaults in case of new fields
      return { ...DEFAULT_PROGRESS, ...parsed };
    }
    return DEFAULT_PROGRESS;
  } catch (error) {
    console.error('Error loading progress:', error);
    return DEFAULT_PROGRESS;
  }
};

/** Save game progress to storage */
export const saveProgress = async (progress: GameProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

/** Update player profile */
export const updateProfile = async (
  updates: Partial<PlayerProfile>
): Promise<GameProgress> => {
  const progress = await loadProgress();
  progress.profile = { ...progress.profile, ...updates };
  await saveProgress(progress);
  return progress;
};

/** Update settings */
export const updateSettings = async (
  updates: Partial<GameSettings>
): Promise<GameProgress> => {
  const progress = await loadProgress();
  progress.settings = { ...progress.settings, ...updates };
  await saveProgress(progress);
  return progress;
};

/** Mark a level as completed */
export const completeLevel = async (
  worldId: WorldId,
  levelId: number,
  stars: number,
  coinsEarned: number
): Promise<GameProgress> => {
  const progress = await loadProgress();

  // Add to completed levels (if not already)
  if (!progress.completedLevels[worldId].includes(levelId)) {
    progress.completedLevels[worldId].push(levelId);
  }

  // Update stars (keep best)
  const starKey = `${worldId}-${levelId}`;
  const prevStars = progress.levelStars[starKey] || 0;
  if (stars > prevStars) {
    progress.levelStars[starKey] = stars;
    progress.totalStars += stars - prevStars;
    progress.profile.totalStars = progress.totalStars;
  }

  // Add coins
  progress.coins += coinsEarned;
  progress.profile.coins = progress.coins;

  // Update streak
  const today = new Date().toDateString();
  if (progress.profile.lastPlayDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (progress.profile.lastPlayDate === yesterday.toDateString()) {
      progress.profile.streak += 1;
    } else if (progress.profile.lastPlayDate !== today) {
      progress.profile.streak = 1;
    }
    progress.profile.lastPlayDate = today;
  }

  await saveProgress(progress);
  return progress;
};

/** Unlock a world */
export const unlockWorld = async (worldId: WorldId): Promise<GameProgress> => {
  const progress = await loadProgress();
  if (!progress.unlockedWorlds.includes(worldId)) {
    progress.unlockedWorlds.push(worldId);
  }
  await saveProgress(progress);
  return progress;
};

/** Unlock an achievement */
export const unlockAchievement = async (achievementId: string): Promise<GameProgress> => {
  const progress = await loadProgress();
  if (!progress.achievements.includes(achievementId)) {
    progress.achievements.push(achievementId);
  }
  await saveProgress(progress);
  return progress;
};

/** Reset all progress */
export const resetProgress = async (): Promise<GameProgress> => {
  await saveProgress(DEFAULT_PROGRESS);
  return DEFAULT_PROGRESS;
};

/** Get difficulty setting */
export const getDifficulty = async (): Promise<Difficulty> => {
  const progress = await loadProgress();
  return progress.settings.difficulty;
};
