import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';


const Home = () => {
  return (
    <View>
      <TouchableOpacity onPress={router.back}>
      <Text>home</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home