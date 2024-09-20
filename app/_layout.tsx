import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import { LogBox } from 'react-native';


SplashScreen.preventAutoHideAsync();
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();
const intitialLayout = () => {
  const [loaded, error] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), Montserrat: require('../assets/fonts/Montserrat.ttf'), ...FontAwesome.font });
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loaded || error) return;
    if (!initialized) return;
    SplashScreen.hideAsync();
    // Check if the path/url is in the (auth) group
    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      if (session?.user?.user_metadata.phone_verified === true) {
        router.replace('/(auth)');
      } else {
        router.replace('/signup');
      }
    } else if (!session) {
      // Redirect unauthenticated users to the login page
      router.replace('/');
    }
  }, [session, initialized, loaded]);

  return <Slot />;

};

export default intitialLayout;
