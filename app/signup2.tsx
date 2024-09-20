import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import TrafficLightBar from '@/components/TrafficLightBar';
import { TypeAnimation } from 'react-native-type-animation';
import Checkbox from 'expo-checkbox';
import Animated, { FadeIn } from 'react-native-reanimated';


const Signup = () => {
    const local = useLocalSearchParams();
    const [email, setEmail] = useState<string | undefined>('');
    const [loading, setLoading] = useState(false);
    const [isValidMail, setIsValidMail] = useState(false);
    const [isChecked, setChecked] = useState(false);
    const [isChecked2, setChecked2] = useState(false);
    const [isChecked3, setChecked3] = useState(false);
    const [genre, setGenre] = useState('');

    const checkMails = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const checkMail = (email: string) => {
        const isValidEmail = checkMails(email);
        if (isValidEmail) {
            setIsValidMail(true);
        } else {
            setIsValidMail(false);
        };
    }
    return (
        <Animated.View entering={FadeIn.duration(1500)} style={styles.container}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false}>
                <ImageBackground source={require("../assets/images/background2.png")} resizeMode="cover" style={styles.image}>
                    <View style={styles.step}>
                        <TrafficLightBar light1={true} light2={true} light3={false} light4={false} />
                    </View>

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
                            </View>
                        )}
                        <View style={styles.containerInput}>
                            <TypeAnimation
                                sequence={[
                                    { text: `Bienvenue ${local.prenom},\n merci d'ajouter ton email ✉️ ` },
                                ]}
                                style={{
                                    alignSelf: 'center',
                                    color: '#000',
                                    fontSize: 20,
                                    fontFamily: 'SpaceMono-Regular',
                                    width: '90%',
                                    textAlign: 'center',
                                }}
                                blinkSpeed={800}
                                typeSpeed={50}
                                cursor={false}
                            />
                            <TextInput
                                autoCapitalize="none"
                                placeholder="Email"
                                keyboardType='email-address'
                                placeholderTextColor={"#808080"}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    checkMail(text)
                                }}
                                style={isValidMail ? styles.inputField : styles.inputFieldError}
                            />
                        </View>

                        <View style={styles.containerInput}>
                            <TypeAnimation
                                sequence={[
                                    { text: `Ton genre ⚧️ ?` },
                                ]}
                                style={{
                                    alignSelf: 'center',
                                    color: '#000',
                                    fontSize: 20,
                                    fontFamily: 'SpaceMono-Regular',
                                    width: '90%',
                                    textAlign: 'center',
                                }}
                                blinkSpeed={800}
                                typeSpeed={50}
                            />
                            <View style={[styles.checkboxContainer, { borderColor: genre === '' ? '#b2004d' : '#54b8b3' }]}>
                                <View style={styles.section}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isChecked}
                                        onValueChange={() => { setChecked(true); setChecked2(false); setChecked3(false); setGenre('femme'); }}
                                        color={isChecked ? '#2F215F' : undefined}
                                    />
                                    <Text style={styles.paragraph}>Femme</Text>
                                </View>
                                <View style={styles.section}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isChecked2}
                                        onValueChange={() => { setChecked(false); setChecked2(true); setChecked3(false); setGenre('homme'); }}
                                        color={isChecked2 ? '#2F215F' : undefined}
                                    />
                                    <Text style={styles.paragraph}>Homme</Text>
                                </View>
                                <View style={styles.section}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isChecked3}
                                        onValueChange={() => { setChecked(false); setChecked2(false); setChecked3(true); setGenre('binaire'); }}
                                        color={isChecked3 ? '#2F215F' : undefined}
                                    />
                                    <Text style={styles.paragraph}>Non-binaire</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.navigate({ pathname: "signup3", params: { prenom: local.prenom, name: local.name, email: email, genre: genre } })} style={isValidMail && genre !== '' ? styles.button : styles.buttonDisabled} disabled={!isValidMail || genre === ''}>
                        <Text style={{ color: '#fff', fontWeight: "bold" }}>Suivant</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
    },
    containerInput: {
        flexDirection: 'column',
        gap: 25,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    containerForm: {
        flexDirection: 'column',
        gap: 70,
        padding: 0,
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
    inputField: {
        width: '80%',
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
    },
    inputFieldError: {
        width: '80%',
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
        shadowOpacity: 0.8,
        shadowRadius: 0.50,

        elevation: 24,
        zIndex: 0,
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
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 17,
        fontFamily: 'SpaceMono-Regular',
    },
    checkbox: {
        margin: 8,
    },
    checkboxContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 15,
        borderWidth: 2,
    },
});

export default Signup;