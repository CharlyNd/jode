import React from 'react';
import { View, StyleSheet } from 'react-native';

const TrafficLight = (props: any) => {
  console.log(props);

  return (
    <View style={styles.container}>
      <View style={[styles.light, props.color === "couple" ? styles.redLight : null]} />
      <View style={[styles.light, props.color === "libre" ? styles.yellowLight : null]} />
      <View style={[styles.light, props.color === "celibataire" ? styles.greenLight : null]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.58,
    shadowRadius: 3.00,

    elevation: 24,
  },
  light: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#7a7a7a',
  },
  redLight: {
    backgroundColor: '#c60000',
    shadowColor: "#c60000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16.00,

    elevation: 24,
  },
  yellowLight: {
    backgroundColor: '#f49c19',
    shadowColor: "#fab739",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16.00,

    elevation: 24,
  },
  greenLight: {
    backgroundColor: '#3fb57e',
    shadowColor: "#3fb57e",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16.00,

    elevation: 24,
  },
});

export default TrafficLight;