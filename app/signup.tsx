import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import TrafficLightBar from '@/components/TrafficLightBar';
import { TypeAnimation } from 'react-native-type-animation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Signup = () => {
    const [name, setName] = useState('');
    const [prenom, setPrenom] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false}>
                {/* <ImageBackground source={require("../assets/images/background1.png")} resizeMode="cover" style={styles.image}> */}
                <View style={styles.step}>
                    <TrafficLightBar light1={true} light2={false} light3={false} light4={false} light5={false} />
                </View>

                <View style={styles.image}>
                <Image source={require('../assets/images/prenom3.png')} style={{ width: 250, height: 250, marginBottom:"15%", alignSelf:"center" }} resizeMode='contain' />
                    <TypeAnimation
                        sequence={[
                            { text: "Comment t'appelles-tu ? " },
                        ]}
                        style={{
                            alignSelf: 'center',
                            color: '#e0e0e0',
                            fontSize: 18,
                            fontFamily: 'SpaceMono-Regular',
                            width: '90%',
                            textAlign: 'center',
                        }}
                        blinkSpeed={800}
                        typeSpeed={50}
                        cursor={false}
                    />
                    <View style={styles.containerForm}>
                        {loading && (
                            <View
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1,
                                    elevation: 1,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    gap: 10,
                                }}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 20 }}></Text>
                            </View>
                        )}
                        <View style={styles.infoContainer}>
                            <TextInput
                                autoCapitalize="none"
                                placeholder="Pénom"
                                placeholderTextColor={"#808080"}
                                value={prenom}
                                onChangeText={setPrenom}
                                style={prenom !== "" ? styles.inputField : styles.inputFieldError}
                            />
                            <TextInput
                                autoCapitalize="none"
                                placeholder="Nom"
                                placeholderTextColor={"#808080"}
                                value={name}
                                onChangeText={setName}
                                style={name !== "" ? styles.inputField : styles.inputFieldError}
                            />
                            <TouchableOpacity onPress={() => router.navigate({ pathname: "signup2", params: { prenom: prenom, name: name } })} style={prenom !== "" && name !== "" ? styles.button : styles.buttonDisabled} disabled={prenom !== "" && name !== "" ? false : true}>
                                <Ionicons name="arrow-forward" size={24} color={prenom !== "" && name !== "" ? "#fff" : "#8e8e8e"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* </ImageBackground> */}
            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        backgroundColor: "#000"
    },
    containerForm: {
        padding: 20,
    },
    step: {
        alignSelf: 'center',
        position: 'absolute',
        top: 10,
    },
    image: {
        flex: 1,
        marginTop:"15%"
    },
    infoContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    inputFieldError: {
        width: '37%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#e0e0e0',
        borderWidth: 0.5,
        backgroundColor: '#202020',
    },
    inputField: {
        width: '37%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#e0e0e0',
        borderWidth: 0.5,
        borderColor: '#54b8b3',
    },
    button: {
        alignSelf: 'center',
        width: '15%',
        alignItems: 'center',
        backgroundColor: '#5e60ce',
        padding: 12,
        borderRadius: 20,
    },
    buttonDisabled: {
        alignSelf: 'center',
        width: '15%',
        alignItems: 'center',
        borderColor: "#8e8e8e",
        borderWidth: 1,
        padding: 12,
        borderRadius: 50,
    },
});

export default Signup;