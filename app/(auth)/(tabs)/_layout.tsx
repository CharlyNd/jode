import { Stack } from 'expo-router';
import { Platform } from 'react-native';
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
          headerShown:  Platform.OS === 'android' ? true : false,
          headerTitle: 'Recherche',
          headerTitleAlign: 'center',
          // Set the presentation mode to modal for our modal route.
          presentation: Platform.OS === 'android'?'card':'formSheet',
        }}
      />
      <Stack.Screen
        name="blockchain"
        options={{
          headerShown:  Platform.OS === 'android' ? true : false,
          headerTitle: 'Blockchain',
          headerTitleAlign: 'center',
          // Set the presentation mode to modal for our modal route.
          presentation: Platform.OS === 'android'?'card':'formSheet',
        }}
      />
      {/* <Stack.Screen
        name="demande"
        options={{
          headerShown: false,
          // Set the presentation mode to modal for our modal route.
        }}
      /> */}
      {/* <Stack.Screen
        name="nft"
        options={{
          headerShown: false,
          // presentation: Platform.OS === 'android' ? 'card':'containedModal',
          // contentStyle: {
            // marginLeft: 'auto',
            // borderTopLeftRadius: 20,
            // borderTopRightRadius: 20,
            // width: Platform.OS === 'android'?'100%':'95%',
            // backgroundColor: 'transparent',
          // },
          // Set the presentation mode to modal for our modal route.
        }}
      /> */}
    </Stack>
  );
}