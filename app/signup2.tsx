import { View, Text, StyleSheet, ScrollView, TouchableOpacity,Image, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import TrafficLightBar from '@/components/TrafficLightBar';
import { TypeAnimation } from 'react-native-type-animation';
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';

const Signup2 = () => {
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
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }} >
                {/* <ImageBackground source={require("../assets/images/background2.png")} resizeMode="cover" style={styles.image}> */}
                <View style={styles.step}>
                    <TrafficLightBar light1={true} light2={true} light3={false} light4={false} light5={false} />
                </View>
                <View style={styles.image}>

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
                                    { text: `Bienvenue ${local.prenom} ` },
                                ]}
                                style={{
                                    alignSelf: 'center',
                                    color: '#e0e0e0',
                                    fontSize: 20,
                                    fontFamily: 'SpaceMono-Regular',
                                    width: '90%',
                                    textAlign: 'center',
                                }}
                                blinkSpeed={800}
                                typeSpeed={50}
                                cursor={false}
                            />
                        <Image source={require('../assets/images/prenom3.png')} style={{ width: 150, height: 150, alignSelf:"center" }} resizeMode='contain' />
                            <TextInput
                                autoCapitalize="none"
                                placeholder="Entre ton email"
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
                                    color: '#e0e0e0',
                                    fontSize: 20,
                                    fontFamily: 'SpaceMono-Regular',
                                    width: '90%',
                                    textAlign: 'center',
                                }}
                                blinkSpeed={800}
                                typeSpeed={50}
                                cursor={false}
                            />
                            <View style={[styles.checkboxContainer, { borderColor: genre === '' ? '#000' : '#54b8b3', backgroundColor:'#000' }]}>
                                <View style={styles.section}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isChecked}
                                        onValueChange={() => { setChecked(true); setChecked2(false); setChecked3(false); setGenre('femme'); }}
                                        color={isChecked ? '#5e60ce' : undefined}
                                    />
                                    <Text style={styles.paragraph}>Femme</Text>
                                </View>
                                <View style={styles.section}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isChecked2}
                                        onValueChange={() => { setChecked(false); setChecked2(true); setChecked3(false); setGenre('homme'); }}
                                        color={isChecked2 ? '#5e60ce' : undefined}
                                    />
                                    <Text style={styles.paragraph}>Homme</Text>
                                </View>
                                <View style={styles.section}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isChecked3}
                                        onValueChange={() => { setChecked(false); setChecked2(false); setChecked3(true); setGenre('binaire'); }}
                                        color={isChecked3 ? '#5e60ce' : undefined}
                                    />
                                    <Text style={styles.paragraph}>Non-binaire</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.navigate({ pathname: "signup3", params: { prenom: local.prenom, name: local.name, email: email, genre: genre } })} style={isValidMail && genre !== '' ? styles.button : styles.buttonDisabled} disabled={!isValidMail || genre === ''}>
                        <Text style={{ color: '#fff', fontWeight: "bold" }}>Suivant</Text>
                    </TouchableOpacity>
                </View>
                {/* </ImageBackground> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor:"#000"
    },
    containerInput: {
        flexDirection: 'column',
        gap: 25,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    containerForm: {
        flexDirection: 'column',
        gap: 50,
        padding: 0,
    },
    step: {
        alignSelf: 'center',
        position: 'absolute',
        top: 10,
    },
    image: {
        flex: 1,
        marginTop:"15%",
        // justifyContent: 'center',
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
        color: '#e0e0e0',
        borderWidth: 0.5,
        borderColor: '#54b8b3',
    },
    inputFieldError: {
        width: '80%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#e0e0e0',
        borderWidth: 0.5,
        backgroundColor: '#202020',
    },
    button: {
        alignSelf: 'center',
        width: '80%',
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
        backgroundColor: '#5e60ce',
        padding: 12,
        borderRadius: 25,
    },
    buttonDisabled: {
        alignSelf: 'center',
        width: '80%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        backgroundColor: '#303030',
        padding: 12,
        borderRadius: 25,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 17,
        color:"#e0e0e0",
        fontFamily: 'SpaceMono-Regular',
    },
    checkbox: {
        margin: 8,
    },
    checkboxContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
        padding: 10,
        borderRadius: 15,
        borderWidth: 0.5,
    },
});

export default Signup2;