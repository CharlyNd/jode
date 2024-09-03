import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Dimensions, View, Text, TouchableHighlight } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import CustomDrawerContent from '@/components/CustomDrawerContent';

const width = Dimensions.get("screen").width;

const Layout = () => {

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: Dimensions.get('window').width,
          },
          drawerHideStatusBarOnOpen: true
        }}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerItemStyle: { display: 'none' }
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'settings',
          }}
        />
      </Drawer>
    </GestureHandlerRootView >
  );
};
export default Layout;