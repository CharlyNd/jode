import { Tabs } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Layout = () => {

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
        },
        tabBarActiveTintColor: '#000',
        headerTintColor: '#fff',
        headerRight: () => (
          <TouchableOpacity onPress={() => supabase.auth.signOut()}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default Layout;