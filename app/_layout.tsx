// ============================================================
// Math Treasure Hunt - Root Layout
// App-wide layout with navigation configuration
// ============================================================

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { initAudio } from '../utils/sound';

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
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FFF8E7' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="worlds" />
        <Stack.Screen name="levels" />
        <Stack.Screen name="game" />
        <Stack.Screen
          name="reward"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen name="achievements" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
