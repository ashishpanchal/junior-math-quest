// ============================================================
// Math Treasure Hunt - Haptics Utility
// Provides haptic feedback for game interactions
// ============================================================

import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

/** Set haptics enabled state */
export const setHapticsEnabled = (enabled: boolean): void => {
  hapticsEnabled = enabled;
};

/** Light haptic for button press */
export const lightHaptic = async (): Promise<void> => {
  if (!hapticsEnabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Haptics may not be available on all devices
  }
};

/** Medium haptic for correct answer */
export const successHaptic = async (): Promise<void> => {
  if (!hapticsEnabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    // Haptics may not be available on all devices
  }
};

/** Error haptic for wrong answer */
export const errorHaptic = async (): Promise<void> => {
  if (!hapticsEnabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    // Haptics may not be available on all devices
  }
};

/** Heavy haptic for achievements/rewards */
export const rewardHaptic = async (): Promise<void> => {
  if (!hapticsEnabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    // Haptics may not be available on all devices
  }
};
