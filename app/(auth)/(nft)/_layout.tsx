import { Stack } from 'expo-router';
import { Platform } from 'react-native';
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: () => null 
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown:  Platform.OS === 'android' ? true : false,
          headerTitle: 'Ma demande digitale',
          headerTitleAlign: 'center',
          // Set the presentation mode to modal for our modal route.
          presentation: Platform.OS === 'android'?'card':'formSheet',
        }}
      />
      <Stack.Screen
        name="demande"
        options={{
          headerShown:  Platform.OS === 'android' ? true : false,
          headerTitle: 'demande',
          headerTitleAlign: 'center',
          // Set the presentation mode to modal for our modal route.
          presentation: Platform.OS === 'android'?'card':'formSheet',
        }}
      />
      <Stack.Screen
        name="code"
        options={{
          headerShown:  Platform.OS === 'android' ? true : false,
          headerTitle: 'Mon code',
          headerTitleAlign: 'center',
          // Set the presentation mode to modal for our modal route.
          presentation: Platform.OS === 'android'?'card':'formSheet',
        }}
      />
    </Stack>
  );
}