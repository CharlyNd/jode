import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { supabase } from '@/utils/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { DrawerActions } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';




const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserAvatar();
    loadUserName();
  }, []);


  const loadUserAvatar = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    supabase.storage
      .from('avatars')
      .download(`${User?.id}/avatar.png`)
      .then(({ data }) => {
        // console.log(data);
        if (!data) return;

        const fr = new FileReader();
        fr.readAsDataURL(data!);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadUserName = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('users')
      .select('name')
      .eq('userId', User?.id);

    if (data) {
      setUserName(data[0].name || 'No name provided');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.titleText}>Bonjour {userName}</Text>
      </View>
      <View style={styles.topSection}>
        <View style={styles.visiteContainer}>
          <Text style={styles.visitNumber}>0</Text>
          <Text style={styles.visitText}>visite</Text>
        </View>
        <View style={styles.profilContainer}>
          <Text style={styles.profilTitle}>Profil complété à 50%</Text>
          <Progress.Bar animated={false} progress={0.5} width={200} height={5} color="#2F215F" borderColor='#c1c1c1' />
          <TouchableOpacity><Text style={styles.profilButton}>compléter</Text></TouchableOpacity>
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.button}
          onPress={() => router.navigate('demande')} >
          <Text style={styles.buttonText}>Nouvelle demande</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomNavContainer}>
        <View style={styles.iconNavContainer}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            {image && <Image source={{ uri: image }} style={styles.avatar} />}
            {!image && <View style={styles.avatar} />}
          </TouchableOpacity>
          <Text style={styles.statusText}>Statut visible</Text>
        </View>
        <View style={styles.iconNavRightContainer}>
          <TouchableOpacity onPress={() => router.navigate("demande")}>
            <MaterialCommunityIcons name="ring" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate("search")}>
            <Ionicons name="search" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },
  bottomNavContainer: {
    position: 'absolute',
    flexDirection: 'row',
    width: '90%',
    padding: 10,
    borderRadius: 50,
    bottom: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    backgroundColor: '#000',
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 100,
  },
  iconNavRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
  },
  iconNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    // width: '25%',
  },
  statusText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff'
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#2b825b',
    borderRadius: 4,
    padding: 10,
    color: '#000',
  },
  button: {
    alignSelf: 'center',
    borderRadius: 10,
    width: '90%',
    marginVertical: 15,
    alignItems: 'center',
    backgroundColor: '#2F215F',
    padding: 12,
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff'
  },
  topSection: {
    flexDirection: 'row',
    height: '20%',
    margin: 20,
  },
  visiteContainer: {
    width: '30%',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefefdf',
    borderRadius: 10
  },
  visitNumber: {
    fontSize: 40,
    color: '#000'
  },
  visitText: {
    fontSize: 15,
    color: '#747474'
  },
  profilContainer: {
    width: '70%',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  profilTitle: {
    fontSize: 15,
    color: '#000'
  },
  profilButton: {
    fontSize: 15,
    color: '#616161'
  },
  titleSection: {
    flexDirection: 'row',
    margin: 20,
  },
  titleText: {
    fontSize: 30,
    color: '#8c8c8c'
  }
});
export default Home