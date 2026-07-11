// ============================================================
// Math Treasure Hunt - Sound Utility (Full Implementation)
// Plays synthesized sounds + looping background music
// ============================================================

import { Audio, AVPlaybackSource } from 'expo-av';
import {
  SOUND_ACHIEVEMENT,
  SOUND_BACKGROUND_MUSIC,
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

// ─── State ─────────────────────────────────────────────────────

let soundEnabled = true;
let musicEnabled = true;
let bgMusicInstance: Audio.Sound | null = null;
let bgMusicIsPlaying = false;

/** Set sound effects enabled state */
export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
};

/** Set music enabled state and start/stop music accordingly */
export const setMusicEnabled = (enabled: boolean): void => {
  musicEnabled = enabled;
  if (!enabled) {
    stopBackgroundMusic();
  } else if (enabled && !bgMusicIsPlaying) {
    playBackgroundMusic();
  }
};

// ─── Sound Effects ─────────────────────────────────────────────

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
 * Play a one-shot sound effect.
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

// ─── Background Music ──────────────────────────────────────────

/**
 * Play cheerful background music in a loop.
 * Volume is kept low (0.3) so it doesn't overpower game sounds.
 * Call this on the home screen or game start.
 */
export const playBackgroundMusic = async (): Promise<void> => {
  if (!musicEnabled) return;
  if (bgMusicIsPlaying) return; // Already playing

  try {
    // Unload any previous instance
    if (bgMusicInstance) {
      await bgMusicInstance.unloadAsync();
      bgMusicInstance = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: SOUND_BACKGROUND_MUSIC } as AVPlaybackSource,
      {
        shouldPlay: true,
        isLooping: true,
        volume: 0.3,
      }
    );

    bgMusicInstance = sound;
    bgMusicIsPlaying = true;

    // Handle unexpected stops
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && !status.isPlaying && !status.isBuffering) {
        // Music stopped unexpectedly
        bgMusicIsPlaying = false;
      }
    });
  } catch (error) {
    console.warn('[Music] Background music error:', error);
    bgMusicIsPlaying = false;
  }
};

/**
 * Stop background music and unload from memory.
 */
export const stopBackgroundMusic = async (): Promise<void> => {
  try {
    if (bgMusicInstance) {
      await bgMusicInstance.stopAsync();
      await bgMusicInstance.unloadAsync();
      bgMusicInstance = null;
    }
    bgMusicIsPlaying = false;
  } catch (error) {
    console.warn('[Music] Stop error:', error);
    bgMusicIsPlaying = false;
  }
};

/**
 * Pause background music (e.g., when app goes to background).
 */
export const pauseBackgroundMusic = async (): Promise<void> => {
  try {
    if (bgMusicInstance && bgMusicIsPlaying) {
      await bgMusicInstance.pauseAsync();
    }
  } catch (error) {
    console.warn('[Music] Pause error:', error);
  }
};

/**
 * Resume background music after pause.
 */
export const resumeBackgroundMusic = async (): Promise<void> => {
  if (!musicEnabled) return;
  try {
    if (bgMusicInstance) {
      await bgMusicInstance.playAsync();
      bgMusicIsPlaying = true;
    } else {
      // Instance was lost, restart
      await playBackgroundMusic();
    }
  } catch (error) {
    console.warn('[Music] Resume error:', error);
  }
};

/**
 * Check if background music is currently playing.
 */
export const isMusicPlaying = (): boolean => bgMusicIsPlaying;

// ─── Initialization ────────────────────────────────────────────

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
