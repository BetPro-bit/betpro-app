import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { Platform } from 'react-native';

export default function RootLayout() {
  const content = (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#080c10" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#080c10' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
          <Stack.Screen name="(auth)/otp" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="games/aviator" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="games/mines" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="games/wheel" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="games/dice" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="games/plinko" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="deposit" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
          <Stack.Screen name="withdraw" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );

  if (Platform.OS === 'web') {
    return content;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {content}
    </GestureHandlerRootView>
  );
}
