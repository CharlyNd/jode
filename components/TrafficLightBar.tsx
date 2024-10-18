import React from 'react';
import { View, StyleSheet } from 'react-native';

const TrafficLightBar = (props: any) => {
  return (
    <View style={styles.container}>
      <View style={[styles.light, props.light1 ? styles.redLight : null]} />
      <View style={[styles.light, props.light2 ? styles.redLight : null]} />
      <View style={[styles.light, props.light3  ? styles.orangeLight : null]} />
      <View style={[styles.light, props.light4  ? styles.orangeLight : null]} />
      <View style={[styles.light, props.light5 ? styles.greenLight : null]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: "60%",
    alignSelf: 'center',
    height: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 40,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: "#777777",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.58,
    shadowRadius: 1.00,
  },
  light: {
    width: 10,
    height: 10,
    borderRadius: 30,
    backgroundColor: '#7a7a7a',
  },
  redLight: {
    backgroundColor: '#db1685',
    shadowColor: "#db1685",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16.00,
  },
  orangeLight: {
    backgroundColor: '#f49c19',
    shadowColor: "#fab739",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16.00,
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
  },
});

export default TrafficLightBar;