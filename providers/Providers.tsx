import React, { PropsWithChildren } from 'react'
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import useTheme from '@/hooks/useTheme';
import { StatusBar } from 'expo-status-bar';
import ToastProvider from './ToastProvider';
import ConfigProvider from './ConfigProvider';

export default function Providers({ children }: PropsWithChildren<{}>) {
  const { value, mode } = useTheme();
  const style = mode === 'dark' ? 'light' : 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={value}>
        <StatusBar style={style} />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: value.colors.background
          }}
        >
          <ToastProvider>
            <ConfigProvider>
              {children}
            </ConfigProvider>
          </ToastProvider>
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}