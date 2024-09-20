import {
    Alert,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    ScrollView
} from 'react-native';
import { useRef, useState } from 'react';
import React from 'react';
import { supabase } from '@/utils/supabase';
import { Link, useRouter } from 'expo-router';
import PhoneInput from "react-native-phone-number-input";
import { TypeAnimation } from 'react-native-type-animation';
import Animated, { FadeInUp } from 'react-native-reanimated';


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
        <View style={styles.container}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'>
                <ImageBackground source={require("../assets/images/background1.png")} resizeMode="cover" style={styles.image}>
                    <TypeAnimation
                        sequence={[
                            { text: 'Entre ton numéro de téléphone 📱 ' },
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
                    <Animated.View entering={FadeInUp.duration(3500)} style={styles.containerForm}>
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
                        <TouchableOpacity onPress={() => { onSendOtpPress().then((result) => { result ? router.navigate({ pathname: "codeValidation", params: { phone: phone } }) : console.log("une erreur est survenue") }) }} style={phone.length > 11 ? styles.button : styles.buttonDisabled} disabled={phone.length > 11 ? false : true}>
                            <Text style={{ color: '#e0e0e0', fontWeight: "bold" }}>Envoyer le code</Text>
                        </TouchableOpacity>
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
                            textContainerStyle={{ backgroundColor: "#FFF", borderTopLeftRadius: 50, height: 60, borderRadius: 20 }}
                            codeTextStyle={{
                                color: "#151515",
                                fontSize: 15,
                            }}
                            countryPickerButtonStyle={{ width: 100, height: 60, backgroundColor: "#f1eeee", borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
                            containerStyle={{
                                backgroundColor: "#FFF",
                                width: "90%",
                                height: 60,
                                borderRadius: 20,
                            }}
                        />
                    </Animated.View>
                </ImageBackground>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerForm: {
        padding: 20,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    containerBtn: {
        height: "50%",
        alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: 15,
        marginTop: 10,
    },
    titlePhone: {
        textAlign: "center",
        fontSize: 17,
        color: "#000",
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 20,
    },
    textInput: {
        height: 50,
        fontSize: 27,
        borderRadius: 10,
        textAlign: "center",
        color: "#22303a",
        fontFamily: "Montserrat_500Medium",
        backgroundColor: "#e0e0e0",
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        color: '#000',
    },
    inputField: {
        marginVertical: 8,
        height: 50,
        borderRadius: 15,
        padding: 10,
        color: '#e0e0e0',
        backgroundColor: '#202020',
    },
    button: {
        alignSelf: 'center',
        width: '80%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        backgroundColor: '#2F215F',
        padding: 12,
        borderRadius: 25,
    },
    buttonDisabled: {
        alignSelf: 'center',
        width: '80%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        backgroundColor: '#a1a1a1',
        padding: 12,
        borderRadius: 25,
    },
});

export default Login;