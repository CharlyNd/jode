import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import TrafficLightBar from '@/components/TrafficLightBar';
import { TypeAnimation } from 'react-native-type-animation';
import Animated, { FadeIn } from 'react-native-reanimated';

const Signup = () => {
    const [name, setName] = useState('');
    const [prenom, setPrenom] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <Animated.View entering={FadeIn.duration(3500)} style={styles.container}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false}>
                <ImageBackground source={require("../assets/images/background1.png")} resizeMode="cover" style={styles.image}>
                    <View style={styles.step}>
                        <TrafficLightBar light1={true} light2={false} light3={false} light4={false} />
                    </View>
                    <TypeAnimation
                        sequence={[
                            { text: "🤚 Comment t'appelles-tu ? " },
                        ]}
                        style={{
                            alignSelf: 'center',
                            position: 'absolute',
                            top: 100,
                            color: '#000',
                            fontSize: 25,
                            fontFamily: 'SpaceMono-Regular',
                            width: '90%',
                            textAlign: 'center',
                        }}
                        blinkSpeed={800}
                        typeSpeed={50}
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
                        <View style={styles.containerInput}>

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
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.navigate({ pathname: "signup2", params: { prenom: prenom, name: name } })} style={prenom !== "" && name !== "" ? styles.button : styles.buttonDisabled} disabled={prenom !== "" && name !== "" ? false : true}>
                        <Text style={{ color: '#fff', fontWeight: "bold" }}>Suivant</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </ScrollView>
        </Animated.View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
    },
    containerInput: {
        flexDirection: 'column',
        gap: 50,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    containerForm: {
        padding: 20,
    },
    step: {
        alignSelf: 'center',
        position: 'absolute',
        top: 50,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    inputFieldError: {
        width: '48%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#000',
        borderWidth: 2,
        borderColor: '#b2004d',
        backgroundColor: "#FFF",
        shadowColor: "#b2004d",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 4.8,
        shadowRadius: 0.50,

        elevation: 24,
        zIndex: 0,
        // opacity: 0.5,
    },
    inputField: {
        width: '48%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#000',
        borderWidth: 2,
        borderColor: '#54b8b3',
        backgroundColor: "#FFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 0.50,

        elevation: 24,
        zIndex: 0,
        // opacity: 0.5,
    },
    button: {
        alignSelf: 'center',
        width: '80%',
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
        backgroundColor: '#2F215F',
        padding: 12,
        borderRadius: 25,
    },
    buttonDisabled: {
        alignSelf: 'center',
        width: '80%',
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
        backgroundColor: '#a1a1a1',
        padding: 12,
        borderRadius: 25,
    },
});

export default Signup;