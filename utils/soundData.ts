// ============================================================
// Math Treasure Hunt - Synthesized Sound Data
// Tiny WAV sounds encoded as base64 data URIs
// These are simple tones suitable for kids game feedback
// ============================================================

/**
 * Generate a WAV file as a base64 data URI from raw parameters.
 * Creates simple sine-wave tones at various frequencies.
 */
const generateWav = (
  frequencies: number[],
  durations: number[],
  volume: number = 0.5,
  sampleRate: number = 22050
): string => {
  // Calculate total samples
  const totalDuration = durations.reduce((a, b) => a + b, 0);
  const numSamples = Math.floor(sampleRate * totalDuration);

  // Create PCM data (16-bit mono)
  const samples = new Int16Array(numSamples);
  let sampleIndex = 0;

  for (let i = 0; i < frequencies.length; i++) {
    const freq = frequencies[i];
    const dur = durations[i];
    const segmentSamples = Math.floor(sampleRate * dur);

    for (let s = 0; s < segmentSamples && sampleIndex < numSamples; s++) {
      const t = s / sampleRate;
      // Apply envelope (fade in/out to avoid clicks)
      const fadeIn = Math.min(1, s / (sampleRate * 0.01));
      const fadeOut = Math.min(1, (segmentSamples - s) / (sampleRate * 0.01));
      const envelope = fadeIn * fadeOut;

      const sample = Math.sin(2 * Math.PI * freq * t) * volume * envelope;
      samples[sampleIndex] = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
      sampleIndex++;
    }
  }

  // Build WAV header
  const dataSize = numSamples * 2; // 16-bit = 2 bytes per sample
  const fileSize = 44 + dataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write samples
  for (let i = 0; i < numSamples; i++) {
    view.setInt16(44 + i * 2, samples[i], true);
  }

  // Convert to base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // Use btoa if available, otherwise manual encoding
  const base64 = btoa(binary);
  return `data:audio/wav;base64,${base64}`;
};

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// btoa polyfill for React Native
function btoa(input: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < input.length) {
    const a = input.charCodeAt(i++);
    const b = i < input.length ? input.charCodeAt(i++) : 0;
    const c = i < input.length ? input.charCodeAt(i++) : 0;

    const triplet = (a << 16) | (b << 8) | c;
    result += chars[(triplet >> 18) & 63];
    result += chars[(triplet >> 12) & 63];
    result += i > input.length + 1 ? '=' : chars[(triplet >> 6) & 63];
    result += i > input.length ? '=' : chars[triplet & 63];
  }
  return result;
}

// ─── Sound Definitions ─────────────────────────────────────────

/**
 * Happy ascending chime (correct answer)
 * C5 → E5 → G5 ascending major triad - cheerful!
 */
export const SOUND_CORRECT = generateWav(
  [523, 659, 784],
  [0.1, 0.1, 0.2],
  0.6
);

/**
 * Gentle low tone (wrong answer - not punishing)
 * Just a soft low note
 */
export const SOUND_WRONG = generateWav(
  [220, 196],
  [0.15, 0.15],
  0.3
);

/**
 * Triumphant fanfare (level complete)
 * C5 → E5 → G5 → C6 ascending with longer final note
 */
export const SOUND_LEVEL_COMPLETE = generateWav(
  [523, 659, 784, 1047],
  [0.12, 0.12, 0.12, 0.35],
  0.6
);

/**
 * Magical sparkle (treasure/reward)
 * High shimmering tones
 */
export const SOUND_TREASURE = generateWav(
  [880, 1109, 1319, 1568, 1760],
  [0.08, 0.08, 0.08, 0.08, 0.25],
  0.5
);

/**
 * Soft click (button press)
 * Short high pop
 */
export const SOUND_BUTTON = generateWav(
  [800],
  [0.05],
  0.3
);

/**
 * Coin collect jingle
 * Quick ascending twinkle
 */
export const SOUND_COIN = generateWav(
  [660, 880],
  [0.06, 0.1],
  0.5
);

/**
 * Star earn sound
 * Sparkly ascending high notes
 */
export const SOUND_STAR = generateWav(
  [784, 988, 1175],
  [0.08, 0.08, 0.15],
  0.5
);

/**
 * Achievement unlock fanfare
 * Grand ascending with resolution
 */
export const SOUND_ACHIEVEMENT = generateWav(
  [440, 554, 659, 880, 1047, 1319],
  [0.08, 0.08, 0.08, 0.1, 0.1, 0.3],
  0.6
);

/**
 * Timer warning beep (when time is low)
 */
export const SOUND_TIMER_WARN = generateWav(
  [600],
  [0.08],
  0.4
);

/**
 * Timer expired buzz
 */
export const SOUND_TIMER_UP = generateWav(
  [300, 250, 200],
  [0.1, 0.1, 0.15],
  0.4
);

// Background music removed — will add a proper .mp3 file later.
