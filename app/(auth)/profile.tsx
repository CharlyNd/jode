import { View, Image, Text, Button, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { router } from 'expo-router';

const profile = () => {
  return (
    <View>
      <TouchableOpacity onPress={async () => await supabase.auth.signOut()} style={styles.button}>
        <Text style={{ color: '#fff' }}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 30,
    alignItems: 'center',
    backgroundColor: '#2b825b',
    padding: 12,
    borderRadius: 4,
  },
});
export default profile