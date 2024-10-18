import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const TrafficLight = (props: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundLight}>
        <View style={[styles.light, props.color === "couple" ? styles.redLight : null]} />
      </View>
      <View style={styles.backgroundLight}>
        <View style={[styles.light, props.color === "libre" ? styles.yellowLight : null]} />
      </View>
      <View style={styles.backgroundLight}>
        <View style={[styles.light, props.color === "celibataire" ? styles.greenLight : null]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
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
  },
  backgroundLight: {
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    width: "200%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70
  },
  light: {
    zIndex: 1,
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: 30,
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
  },
  redLight: {
    backgroundColor: '#db1685',
    shadowColor: "#db1685",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.00,
  },
  yellowLight: {
    backgroundColor: '#f49c19',
    shadowColor: "#fab739",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.00,
  },
  greenLight: {
    backgroundColor: '#3fb57e',
    shadowColor: "#3fb57e",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.00,
  },
});

export default TrafficLight;