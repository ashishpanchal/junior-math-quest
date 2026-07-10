// ============================================================
// Math Treasure Hunt - Root Layout (Enhanced)
// App-wide layout with smooth animated transitions
// ============================================================

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { initAudio } from '../utils/sound';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  useEffect(() => {
    initAudio();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          // Smooth transitions
          animation: 'fade_from_bottom',
          animationDuration: 280,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          ...(Platform.OS === 'ios' && {
            customAnimationOnGesture: true,
            fullScreenGestureEnabled: true,
          }),
        }}
      >
        <Stack.Screen
          name="index"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="home"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="profile"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="worlds"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="levels"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="game"
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="reward"
          options={{
            animation: 'fade',
            animationDuration: 400,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="achievements"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="settings"
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}
