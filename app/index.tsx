import {
    Alert,
    View,
    Button,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import React from 'react';
import { supabase } from '@/utils/supabase';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState(false);

    // Sign in with phone and otp
    const onSendOtpPress = async () => {
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithOtp({
            phone: phone,
        })

        if (error) Alert.alert(error.message);
        setLoading(false);
    };

    // Create a new user
    const onVerifyOtpPress = async () => {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.verifyOtp({
            phone: phone,
            token: otp,
            type: 'sms',
        })

        if (error) Alert.alert(error.message);
        if (!session) Alert.alert('Please check your inbox for phone verification!');

        setLoading(false);
    };

    return (
        <View style={styles.container}>
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
                    <Text style={{ color: '#fff', fontSize: 20 }}>Loading...</Text>
                </View>
            )}

            <Text style={styles.header}>Jode</Text>

            <TextInput
                autoCapitalize="none"
                placeholder="add your Phone number"
                value={phone}
                onChangeText={setPhone}
                style={styles.inputField}
            />
            <TextInput
                placeholder="otp"
                value={otp}
                onChangeText={setOTP}
                secureTextEntry
                style={styles.inputField}
            />

            <TouchableOpacity onPress={onSendOtpPress} style={styles.button}>
                <Text style={{ color: '#fff' }}>Send OTP</Text>
            </TouchableOpacity>
            <Button onPress={onVerifyOtpPress} title="Verify OTP" color={'#000'}></Button>
            <View style={{ alignItems: 'center', marginTop: 10, gap: 10 }}>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 200,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        margin: 50,
        color: '#000',
    },
    inputField: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderColor: '#2b825b',
        borderRadius: 4,
        padding: 10,
        color: '#000',
    },
    button: {
        marginVertical: 15,
        alignItems: 'center',
        backgroundColor: '#2b825b',
        padding: 12,
        borderRadius: 4,
    },
});

export default Login;