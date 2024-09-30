import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import TrafficLight from '@/components/TrafficLight';

export default function Search() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [snap, setSnap] = useState('');
  const [insta, setInsta] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false} style={styles.subContainer} automaticallyAdjustKeyboardInsets>
        <View style={styles.results}>
          {/* <View style={styles.profilContainer}> */}
          <View style={styles.imageSection}>
            {/* {image && <Image source={{ uri: image }} style={styles.avatar} />} */}
            {/* {!image && <View style={styles.avatar} />} */}
            <View style={styles.avatar} >
              <Image source={require('../../../assets/images/noResults.png')} style={{ width: 125, height: 125, borderRadius: 100 }} />
            </View>

            <View style={styles.profilDetails}>
              <Text style={{ fontSize: 20, color: "#e0e0e0", fontFamily:"SpaceMono-Regular" }}>Charles-Etienne</Text>
              {/* <Text style={{ fontSize: 18, color: "#e0e0e0" }}>06 12 34 56 78</Text> */}
            </View>
          </View>
          {/* <View style={{
            backgroundColor: "#bb3838", borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5
          }}>
            <Text style={{ fontSize: 13, color: "#fff" }}>Jode Rouge</Text>
          </View> */}
          <View style={{ height: '40%', width: "25%" }}>
            <TrafficLight color="couple" />
          </View>

          {/* </View> */}
          {/* <Image source={require('../../../assets/images/noResults.png')} style={styles.image} />
          <Text style={{ fontSize: 20, color: "#9f9f9f", marginTop: 10 }}>Aucun Résultat</Text> */}
        </View>
        <View style={styles.searchSection}>
          <View style={{ height: "100%", alignItems: "center", justifyContent: "space-around", paddingTop: "5%" }}>
            <View>
              <Text style={{ fontSize: 17, color: "#cfcfcf", fontFamily:"SpaceMono-regular" }}>Rechercher une personne 🚦 par ↴</Text>
              {/* <Text style={{ fontSize: 18, color: "#e0e0e0" }}>06 12 34 56 78</Text> */}
            </View>
            <View style={styles.searchContainer}>
              {/* <Text style={styles.subtitle}>Recherche par Nom et Prénom</Text> */}
              <TextInput
                style={styles.searchBar}
                placeholder="Nom et Prénom"
                value={name}
                onChangeText={setName}
                placeholderTextColor={"#8e8e8e"}
              />
            </View>
            {/* <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: "#e0e0e0" }}>ou</Text>
          </View> */}
            <View style={styles.searchContainer}>
              {/* <Text style={styles.subtitle}>Recherche par numéro de téléphone</Text> */}
              <TextInput
                style={styles.searchBar}
                placeholder="Numéro de téléphone"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor={"#8e8e8e"}
              />
            </View>
            <View style={styles.searchContainer}>
              {/* <Text style={styles.subtitle}>Recherche par numéro de téléphone</Text> */}
              <TextInput
                style={styles.searchBar}
                placeholder="@instagram"
                value={insta}
                onChangeText={setInsta}
                placeholderTextColor={"#8e8e8e"}
              />
            </View>
            <View style={styles.searchContainer}>
              {/* <Text style={styles.subtitle}>Recherche par numéro de téléphone</Text> */}
              <TextInput
                style={styles.searchBar}
                placeholder="@snapshat"
                value={snap}
                onChangeText={setSnap}
                placeholderTextColor={"#8e8e8e"}
              />
            </View>
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
    // padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  avatar: {
    width: 125,
    height: 125,
    // backgroundColor: '#ccc',
    // alignSelf: 'center',
    borderRadius: 100,
  },
  image: {
    width: 200,
    height: 200,
  },
  subContainer: {
    width: '100%',
    // paddingHorizontal: 10,
  },
  subtitle: {
    // fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
    color: "#e0e0e0",
  },
  searchSection: {
    width: '100%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
  },
  searchBar: {
    padding: 12,
    // backgroundColor: '#202020',
    // minWidth: '70%',
    // borderRadius: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccff33',
    marginHorizontal: 10,
    fontSize: 16,
    minWidth: '50%',
    color: "#ccff33",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62
  },
  results: {
    alignSelf: 'center',
    padding: 20,
    borderWidth: 1,
    // marginTop: "5%",
    backgroundColor: '#101010',
    width: "100%",
    height: '55%',
    justifyContent: 'space-around',
    alignItems: 'center',
    // borderRadius: 50,
    flexDirection: 'column',
  },
  profilContainer: {
    width: '100%',
    height: '70%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    alignItems: "center",
  },
  profilDetails: {
    // alignItems: "center",
    // maxWidth: '60%',
    // marginTop: 20,
  },
});