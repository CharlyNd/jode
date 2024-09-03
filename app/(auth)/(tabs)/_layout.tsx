import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="demande"
        options={{
          headerShown: false,
          // Set the presentation mode to modal for our modal route.
        }}
      />
    </Stack>
  );
}