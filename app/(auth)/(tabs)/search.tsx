import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function Search() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
      <Text>Recherche par Nom et Prénom</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher..."
        value={name}
        onChangeText={setName}
      />
      </View>
      <View style={styles.searchContainer}>
      <Text>Recherche par Téléphone</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher..."
        value={phone}
        onChangeText={setPhone}
      />
      </View>
      <View style={styles.searchContainer}>
      <Text>Recherche par Email</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher..."
        value={mail}
        onChangeText={setMail}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  searchContainer:{
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  searchBar: {
    backgroundColor: '#f9f9f9',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 15,
    width: '100%',
    marginTop: 16,
  },
});