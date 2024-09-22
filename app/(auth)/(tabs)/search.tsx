import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import TrafficLight from '@/components/TrafficLight';

export default function Search() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false} style={styles.subContainer} automaticallyAdjustKeyboardInsets>
        <View style={styles.results}>
          <View style={styles.profilContainer}>
            <View style={{ width: '20%' }}>
              <TrafficLight color="couple" />
            </View>
            <View style={styles.imageSection}>
              {/* {image && <Image source={{ uri: image }} style={styles.avatar} />} */}
              {/* {!image && <View style={styles.avatar} />} */}
              <View style={styles.avatar} />
              <View style={styles.profilDetails}>
                <Text style={{ fontSize: 23, fontFamily: "SpaceMono-Regular" }}>Charles-Etienne N'DIAYE</Text>
                <Text style={{ fontSize: 18, fontFamily: "SpaceMono-Regular" }}>06 12 34 56 78</Text>
              </View>

            </View>

          </View>
          {/* <Image source={require('../../../assets/images/noResults.png')} style={styles.image} />
          <Text style={{ fontSize: 20, color: "#9f9f9f", marginTop: 10 }}>Aucun Résultat</Text> */}
        </View>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.subtitle}>Recherche par Nom et Prénom</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Rechercher..."
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.searchContainer}>
            <Text style={styles.subtitle}>Recherche par Téléphone</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Rechercher..."
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 125,
    height: 125,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 100,
  },
  image: {
    width: 200,
    height: 200,
  },
  subContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  subtitle: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
  },
  searchSection: {
    width: '100%',
    marginTop: "5%",
    height: '25%',
    justifyContent: 'space-around',
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: '#f9f9f9',
    height: 40,
    borderRadius: 40,
    paddingHorizontal: 15,
    width: '100%',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62
  },
  results: {
    // marginTop: "10%",
    // backgroundColor: '#eeeeee',
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  profilContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    alignItems: "center",
  },
  profilDetails: {
    maxWidth: '60%',
    marginTop: 20,
  },
});