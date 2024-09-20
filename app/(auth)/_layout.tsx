import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Dimensions, View, Text, TouchableHighlight } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import Ionicons from '@expo/vector-icons/Ionicons';

const width = Dimensions.get("screen").width;

const Layout = () => {

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: Dimensions.get('window').width * 0.95,
          },
          drawerHideStatusBarOnOpen: true
        }}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            // drawerItemStyle: { display: 'none' },
            drawerIcon: ()=>(<Ionicons name="home-outline" size={24} color="#2F215F" />),
            title: '',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Mes données et comptes',
            title: 'Mes données et comptes',
          }}
        />
      </Drawer>
    </GestureHandlerRootView >
  );
};
export default Layout;