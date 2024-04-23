import Providers from '@/providers/Providers';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import React, { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import useTheme from '@/hooks/useTheme';

export default function RootLayout() {

  const { value } = useTheme();
  const [loaded, error] = useFonts({
    TwEB: require('../assets/fonts/TwEB.ttf'),
    TwB: require('../assets/fonts/TwB.ttf'),
    TwSB: require('../assets/fonts/TwSB.ttf'),
    TwN: require('../assets/fonts/TwN.ttf'),
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(value.colors.background);
    }
  }, [value])


  if (!loaded || error) {
    return null;
  }

  return (
    <Providers>
      <Slot />
    </Providers>
  )
}