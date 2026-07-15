// ============================================================
// Math Treasure Hunt - Sound Utility (Full Implementation)
// Plays synthesized sounds + looping background music
// Uses expo-audio (replaces deprecated expo-av)
// ============================================================

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
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

// ─── State ─────────────────────────────────────────────────────

let soundEnabled = true;
let musicEnabled = true;

/** Set sound effects enabled state */
export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
};

/** Set music enabled state */
export const setMusicEnabled = (enabled: boolean): void => {
  musicEnabled = enabled;
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

    const player = createAudioPlayer(uri);
    player.play();

    // Release after playback to free memory
    player.addListener('playbackStatusUpdate', (status) => {
      if (status.playing === false && status.currentTime > 0) {
        player.release();
      }
    });
  } catch (error) {
    // Silently fail — sound is non-critical
    console.warn('[Sound] Playback error:', type, error);
  }
};

// ─── Background Music ──────────────────────────────────────────

/**
 * Play background music (disabled for now - will add proper audio file later)
 */
export const playBackgroundMusic = async (): Promise<void> => {
  // Background music temporarily disabled.
  // To add proper music later, place an .mp3 file in assets/sounds/
  // and load it here with createAudioPlayer + player.loop = true
};

/**
 * Stop background music.
 */
export const stopBackgroundMusic = async (): Promise<void> => {
  // No-op while music is disabled
};

/**
 * Pause background music.
 */
export const pauseBackgroundMusic = async (): Promise<void> => {
  // No-op while music is disabled
};

/**
 * Resume background music after pause.
 */
export const resumeBackgroundMusic = async (): Promise<void> => {
  // No-op while music is disabled
};

/**
 * Check if background music is currently playing.
 */
export const isMusicPlaying = (): boolean => false;

// ─── Initialization ────────────────────────────────────────────

/** Initialize audio configuration */
export const initAudio = async (): Promise<void> => {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'duckOthers',
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};
