// ============================================================
// Math Treasure Hunt - Game Progress Hook
// Manages game state and progress throughout the app
// ============================================================

import { useCallback, useEffect, useState } from 'react';
import { GameProgress, WorldId } from '../types';
import {
  completeLevel,
  loadProgress,
  resetProgress,
  saveProgress,
  unlockAchievement,
  unlockWorld,
  updateProfile,
  updateSettings,
} from '../utils/storage';
import { ACHIEVEMENTS, GAME_WORLDS } from '../constants/gameData';
import { setSoundEnabled, setMusicEnabled } from '../utils/sound';
import { setHapticsEnabled } from '../utils/haptics';

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    const load = async () => {
      const data = await loadProgress();
      setProgress(data);
      // Sync sound/haptics settings
      setSoundEnabled(data.settings.soundEffectsEnabled);
      setMusicEnabled(data.settings.musicEnabled);
      setHapticsEnabled(data.settings.hapticsEnabled);
      setIsLoading(false);
    };
    load();
  }, []);

  // Sync settings whenever progress changes
  useEffect(() => {
    if (progress) {
      setSoundEnabled(progress.settings.soundEffectsEnabled);
      setMusicEnabled(progress.settings.musicEnabled);
      setHapticsEnabled(progress.settings.hapticsEnabled);
    }
  }, [progress?.settings]);

  /** Reload progress from storage */
  const reload = useCallback(async () => {
    const data = await loadProgress();
    setProgress(data);
  }, []);

  /** Complete a level and check for unlocks */
  const handleLevelComplete = useCallback(
    async (worldId: WorldId, levelId: number, stars: number, coins: number) => {
      const updated = await completeLevel(worldId, levelId, stars, coins);

      // Check if new worlds should be unlocked
      for (const world of GAME_WORLDS) {
        if (
          !updated.unlockedWorlds.includes(world.id) &&
          updated.totalStars >= world.requiredStars
        ) {
          await unlockWorld(world.id);
          updated.unlockedWorlds.push(world.id);
        }
      }

      // Check achievements
      await checkAchievements(updated);
      
      // Reload fresh data
      const fresh = await loadProgress();
      setProgress(fresh);
    },
    []
  );

  /** Check and unlock achievements */
  const checkAchievements = async (data: GameProgress) => {
    for (const achievement of ACHIEVEMENTS) {
      if (data.achievements.includes(achievement.id)) continue;

      let current = 0;
      switch (achievement.type) {
        case 'stars':
          current = data.totalStars;
          break;
        case 'coins':
          current = data.coins;
          break;
        case 'levels':
          current = Object.values(data.completedLevels).flat().length;
          break;
        case 'streak':
          current = data.profile.streak;
          break;
        case 'worlds':
          current = data.unlockedWorlds.length;
          break;
      }

      if (current >= achievement.requirement) {
        await unlockAchievement(achievement.id);
      }
    }
  };

  /** Update player name */
  const setPlayerName = useCallback(async (name: string) => {
    const updated = await updateProfile({ name });
    setProgress(updated);
  }, []);

  /** Update player avatar */
  const setPlayerAvatar = useCallback(async (avatar: string) => {
    const updated = await updateProfile({ avatar });
    setProgress(updated);
  }, []);

  /** Update settings */
  const updateGameSettings = useCallback(
    async (settings: Partial<GameProgress['settings']>) => {
      const updated = await updateSettings(settings);
      setProgress(updated);
    },
    []
  );

  /** Reset all progress */
  const handleReset = useCallback(async () => {
    const fresh = await resetProgress();
    setProgress(fresh);
  }, []);

  return {
    progress,
    isLoading,
    reload,
    handleLevelComplete,
    setPlayerName,
    setPlayerAvatar,
    updateGameSettings,
    handleReset,
  };
};
