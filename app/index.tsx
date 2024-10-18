import {
    Alert,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Image
} from 'react-native';
import { useRef, useState } from 'react';
import React from 'react';
import { supabase } from '@/utils/supabase';
import { Link, useRouter } from 'expo-router';
import PhoneInput from "react-native-phone-number-input";
import { TypeAnimation } from 'react-native-type-animation';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';


const Login = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const phoneInput = useRef(null);

    const router = useRouter();

    const onSendOtpPress = async () => {
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithOtp({
            phone: phone,
        })

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
            return false;
        } else {
            setLoading(false);
            return true;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'>
                {/* <ImageBackground source={require("../assets/images/background1.png")} resizeMode="cover" style={styles.image}> */}
                <Animated.View entering={FadeInUp.duration(3000)} style={styles.containerForm}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.title}>Jode</Text>
                        <Image source={require('../assets/images/bgAccueil.png')} style={{ width: 250, height: 250 }} resizeMode='contain' />
                    </View>
                    <View style={{  width: "98%" }}>
                        <TypeAnimation
                            sequence={[
                                { text: 'Entre ton numéro de téléphone' },
                            ]}
                            style={{
                                alignSelf: 'center',
                                // position: 'absolute',
                                // top: '25%',
                                color: '#e0e0e0',
                                marginBottom: "2%",
                                fontSize: 20,
                                fontFamily: 'SpaceMono-Regular',
                                width: '90%',
                                textAlign: 'center',
                            }}
                            blinkSpeed={800}
                            typeSpeed={50}
                            cursor={false}
                        />
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
                            <PhoneInput
                                ref={phoneInput}
                                defaultValue={value}
                                defaultCode="FR"
                                layout="second"
                                onChangeText={(text) => {
                                    setValue(text);
                                }}
                                onChangeFormattedText={(text) => {
                                    setPhone(text);
                                }}
                                countryPickerProps={{ withAlphaFilter: true }}
                                placeholder="06 "
                                textContainerStyle={{ backgroundColor: "#FFF", height: 60, borderRadius: 20 }}
                                codeTextStyle={{
                                    color: "#151515",
                                    fontSize: 15,
                                }}
                                countryPickerButtonStyle={{ width: 100, height: 60, backgroundColor: "#f1eeee", borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
                                containerStyle={{
                                    backgroundColor: "#FFF",
                                    width: "80%",
                                    height: 60,
                                    borderRadius: 20,
                                }}
                            />
                            <TouchableOpacity onPress={() => { onSendOtpPress().then((result) => { result ? router.navigate({ pathname: "codeValidation", params: { phone: phone } }) : console.log("une erreur est survenue") }) }} style={phone.length > 11 ? styles.button : styles.buttonDisabled} disabled={phone.length > 11 ? false : true}>
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
                <Text style={styles.textCGU}>En continuant, tu acceptes notre Politique de Confidentialité et Condition Générales d'Utilisation.</Text>
                {/* </ImageBackground> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    containerInput: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 10,
    },
    textCGU: {
        width: "90%",
        alignSelf: "center",
        fontSize: 14,
        bottom: "15%",
        color: "#8e8e8e",
        marginTop: '10%',
        textAlign: "center"
    },
    containerForm: {
        padding: 20,
        alignItems: 'center',
        marginTop: "5%",
        height: '100%',
        justifyContent: 'flex-start',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    containerTitle: {
        // position: "absolute",
        // gap: 10,
        // top: '5%',
        alignSelf: "center",
        justifyContent: "center"
    },
    title: {
        alignSelf: "center",
        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold",
        color: "#e0e0e0",
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        color: '#000',
    },
    button: {
        alignSelf: 'center',
        width: '15%',
        justifyContent: 'center',
        height: 60,
        alignItems: 'center',
        backgroundColor: '#5e60ce',
        padding: 12,
        borderRadius: 20,
    },
    buttonDisabled: {
        alignSelf: 'center',
        width: '15%',
        justifyContent: 'center',
        height: 60,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "#8e8e8e",
        backgroundColor: '#010101',
        padding: 12,
        borderRadius: 50,
    },
});

export default Login;