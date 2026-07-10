// ============================================================
// Math Treasure Hunt - Sound Utility
// Placeholder sound system using Expo AV
// Replace placeholder files with actual sound files later
// ============================================================

import { Audio } from 'expo-av';

/** Sound types available in the game */
export type SoundType =
  | 'correct'
  | 'wrong'
  | 'levelComplete'
  | 'treasure'
  | 'buttonPress'
  | 'coinCollect'
  | 'starEarn'
  | 'achievement';

// Sound enabled state (controlled by parent settings)
let soundEnabled = true;
let musicEnabled = true;

/** Set sound enabled state */
export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
};

/** Set music enabled state */
export const setMusicEnabled = (enabled: boolean): void => {
  musicEnabled = enabled;
};

/**
 * Play a sound effect
 * NOTE: This is a placeholder implementation.
 * Add actual sound files to assets/sounds/ and update the paths below.
 */
export const playSound = async (type: SoundType): Promise<void> => {
  if (!soundEnabled) return;

  try {
    // Placeholder: In production, load actual sound files
    // Example:
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../assets/sounds/correct.mp3')
    // );
    // await sound.playAsync();

    // For now, we log the sound that would play
    console.log(`[Sound] Playing: ${type}`);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

/** Initialize audio configuration */
export const initAudio = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

/**
 * Play background music
 * NOTE: Placeholder - add actual music file
 */
export const playBackgroundMusic = async (): Promise<void> => {
  if (!musicEnabled) return;

  try {
    console.log('[Music] Playing background music');
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../assets/sounds/background.mp3'),
    //   { isLooping: true, volume: 0.3 }
    // );
    // await sound.playAsync();
  } catch (error) {
    console.error('Error playing background music:', error);
  }
};

/** Stop background music */
export const stopBackgroundMusic = async (): Promise<void> => {
  try {
    console.log('[Music] Stopping background music');
  } catch (error) {
    console.error('Error stopping music:', error);
  }
};
