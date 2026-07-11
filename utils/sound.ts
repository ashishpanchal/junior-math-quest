// ============================================================
// Math Treasure Hunt - Sound Utility (Working Implementation)
// Plays synthesized fun sounds using Expo AV
// ============================================================

import { Audio, AVPlaybackSource } from 'expo-av';
import {
  SOUND_ACHIEVEMENT,
  SOUND_BUTTON,
  SOUND_COIN,
  SOUND_CORRECT,
  SOUND_LEVEL_COMPLETE,
  SOUND_STAR,
  SOUND_TIMER_UP,
  SOUND_TIMER_WARN,
  SOUND_TREASURE,
  SOUND_WRONG,
} from './soundData';

/** Sound types available in the game */
export type SoundType =
  | 'correct'
  | 'wrong'
  | 'levelComplete'
  | 'treasure'
  | 'buttonPress'
  | 'coinCollect'
  | 'starEarn'
  | 'achievement'
  | 'timerWarn'
  | 'timerUp';

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

/** Map sound types to their data URIs */
const SOUND_MAP: Record<SoundType, string> = {
  correct: SOUND_CORRECT,
  wrong: SOUND_WRONG,
  levelComplete: SOUND_LEVEL_COMPLETE,
  treasure: SOUND_TREASURE,
  buttonPress: SOUND_BUTTON,
  coinCollect: SOUND_COIN,
  starEarn: SOUND_STAR,
  achievement: SOUND_ACHIEVEMENT,
  timerWarn: SOUND_TIMER_WARN,
  timerUp: SOUND_TIMER_UP,
};

/**
 * Play a sound effect.
 * Uses base64-encoded WAV data — no external files needed!
 */
export const playSound = async (type: SoundType): Promise<void> => {
  if (!soundEnabled) return;

  try {
    const uri = SOUND_MAP[type];
    if (!uri) return;

    const { sound } = await Audio.Sound.createAsync(
      { uri } as AVPlaybackSource,
      { shouldPlay: true, volume: 1.0 }
    );

    // Unload after playback to free memory
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    // Silently fail — sound is non-critical
    console.warn('[Sound] Playback error:', type, error);
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
 * Play background music (placeholder - add music file for full implementation)
 */
export const playBackgroundMusic = async (): Promise<void> => {
  if (!musicEnabled) return;
  // Background music would require a longer audio file.
  // For now this is a placeholder — add a looping .mp3 to assets/sounds/
  // and load it here with { isLooping: true, volume: 0.2 }
};

/** Stop background music */
export const stopBackgroundMusic = async (): Promise<void> => {
  // Will be implemented when background music file is added
};
