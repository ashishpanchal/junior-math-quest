// ============================================================
// Math Treasure Hunt - Root Layout (Enhanced)
// App-wide layout with error boundary and smooth transitions
// ============================================================

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { initAudio, pauseBackgroundMusic, resumeBackgroundMusic } from '../utils/sound';
import { COLORS } from '../constants/theme';

function AppContent() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initAudio();

    // Pause/resume background music when app goes to background/foreground
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
        pauseBackgroundMusic();
      } else if (appState.current.match(/inactive|background/) && nextState === 'active') {
        resumeBackgroundMusic();
      }
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'fade_from_bottom',
          gestureEnabled: true,
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
        <Stack.Screen
          name="daily"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="speed-round"
          options={{ animation: 'fade_from_bottom' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
