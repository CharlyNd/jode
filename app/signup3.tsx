import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import TrafficLightBar from '@/components/TrafficLightBar';
import { TypeAnimation } from 'react-native-type-animation';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import "moment/locale/fr";

const Signup3 = () => {
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
        setDateSelected(currentDate.toISOString());
    };

    return (
        <View style={styles.container}>
            {/* <ImageBackground source={require("../assets/images/background3.png")} resizeMode="cover" style={styles.image}> */}
            <View style={styles.step}>
                <TrafficLightBar light1={true} light2={true} light3={true} light4={false} light5={false} />
            </View>
            <View style={styles.containerView}>
            <Image source={require('../assets/images/birthday.png')} style={{ width: 300, height: 300, alignSelf:"center" }} resizeMode='contain' />

                <TypeAnimation
                    sequence={[
                        { text: "Quelle est ta date de naissance ?" },
                    ]}
                    style={{
                        alignSelf: 'center',
                        color: '#e0e0e0',
                        fontSize: 18,
                        fontFamily: 'SpaceMono-Regular',
                        width: '80%',
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
                                style={{ backgroundColor: dateSelected === '' ? '#5e60ce' : '#54b8b3' }}
                            />)
                            }
                        </View>
                        {Platform.OS === 'android' && (
                            <Text style={{ fontSize: 25, fontFamily: "SpaceMono-Regular", marginBottom: 20, color:"#e0e0e0" }}>
                                {dateSelected ? moment(dateSelected).format('dddd D MMMM YYYY') : ''}
                            </Text>)}

                            <Text style={styles.textAge}>Nous devons nous assurer que tu as l'âge pour utiliser Jode</Text>

                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => router.navigate({
                pathname: "signup4",
                params: { prenom: local.prenom, name: local.name, email: local.email, birth: dateSelected, genre: local.genre }
            })}
                style={dateSelected !== '' ? styles.button : styles.buttonDisabled}
                disabled={dateSelected !== '' ? false : true}>
                <Text style={{ color: '#fff', fontFamily: "bold" }}>Suivant</Text>
            </TouchableOpacity>
            {/* </ImageBackground> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: "#000"
    },
    textAge: {
        width: "70%",
        alignSelf: "center",
        fontSize: 14,
        bottom: "15%",
        color: "#8e8e8e",
        marginTop: '10%',
        textAlign: "center"
    },
    containerInput: {
        flexDirection: 'column',
        gap: 50,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    containerForm: {
        marginTop: 10,
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
    button: {
        alignSelf: 'center',
        width: '80%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        backgroundColor: '#5e60ce',
        padding: 12,
        borderRadius: 25,
    },
    buttonDate: {
        // width: "80%",
        paddingHorizontal: 20,
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
    containerView: {
        flexDirection: 'column',
        width: '100%',
        height: '90%',
        marginTop: '20%',
        // justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Signup3;