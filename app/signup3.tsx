import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import TrafficLightBar from '@/components/TrafficLightBar';
import { TypeAnimation } from 'react-native-type-animation';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn } from 'react-native-reanimated';

const Signup = () => {
    const local = useLocalSearchParams();

    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [dateSelected, setDateSelected] = useState('');
    const [mode, setMode] = useState<'date' | 'datetime' | 'time'>('date');
    const [datePickerVisible, setDatePickerVisible] = useState(Platform.OS === "android" ? false : true);

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        if (Platform.OS === 'android') {
            setDatePickerVisible(false);
        }
        setDate(currentDate);
        setDateSelected(currentDate.toLocaleDateString());
    };


    return (
        <Animated.View entering={FadeIn.duration(3500)} style={styles.container}>
            <ImageBackground source={require("../assets/images/background3.png")} resizeMode="cover" style={styles.image}>
                <View style={styles.step}>
                    <TrafficLightBar light1={true} light2={true} light3={true} light4={false} />
                </View>
                <TypeAnimation
                    sequence={[
                        { text: "Quel est le jour de ton anniversaire 🎂 🎁 ?" },
                    ]}
                    style={{
                        alignSelf: 'center',
                        position: 'absolute',
                        top: 100,
                        color: '#000',
                        fontSize: 25,
                        fontFamily: 'SpaceMono-Regular',
                        width: '85%',
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
                        </View>
                    )}
                    <View style={styles.containerInput}>

                        <View style={styles.infoContainer}>
                            {Platform.OS === 'android' && (
                                <TouchableOpacity onPress={showDatePicker} style={styles.buttonDate}>
                                    <Text style={{ color: '#fff', fontWeight: "bold" }}>Choisir date</Text>
                                </TouchableOpacity>)}
                            {datePickerVisible && (<DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                onChange={onChange}
                                locale='fr'
                                textColor='#fff'
                                style={{ backgroundColor: dateSelected === '' ? '#2F215F' : '#54b8b3' }}
                            />)
                            }
                        </View>
                        {Platform.OS === 'android' && (
                            <Text style={{ fontSize: 30, fontFamily: "SpaceMono-Regular", marginBottom: 20 }}>
                                {dateSelected ? dateSelected : ''}
                            </Text>)}
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.navigate({ pathname: "signup4", params: { prenom: local.prenom, name: local.name, email: local.email, birth: dateSelected, genre: local.genre } })} style={dateSelected !== '' ? styles.button : styles.buttonDisabled} disabled={dateSelected !== '' ? false : true}>
                    <Text style={{ color: '#fff', fontFamily: "bold" }}>Suivant</Text>
                </TouchableOpacity>
            </ImageBackground>
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
    inputField: {
        width: '80%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#000',
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
    buttonDate: {
        width: "80%",
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