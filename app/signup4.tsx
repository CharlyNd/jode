import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground, Platform, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import TrafficLightBar from '@/components/TrafficLightBar';
import { TypeAnimation } from 'react-native-type-animation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/utils/supabase';
import Checkbox from 'expo-checkbox';
import moment from "moment";
import "moment/locale/fr";

const Signup4 = () => {
    const local = useLocalSearchParams();

    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [dateSelected, setDateSelected] = useState('');
    const [mode, setMode] = useState<'date' | 'datetime' | 'time'>('date');
    const [datePickerVisible, setDatePickerVisible] = useState(Platform.OS === "android" ? false : true);
    const [prenom, setPrenom] = useState("");
    const [isChecked, setChecked] = useState(false);
    const [isChecked2, setChecked2] = useState(false);
    const [isCouple, setIsCouple] = useState(false)

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
                <TrafficLightBar light1={true} light2={true} light3={true} light4={true} light5={false} />
            </View>
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
            <View style={styles.containerView}>
                <ScrollView automaticallyAdjustKeyboardInsets keyboardDismissMode='on-drag'
                    style={{ height: '100%', alignSelf: "center", paddingTop: '30%' }}>
                    <View style={styles.containerInput}>
                        <TypeAnimation
                            sequence={[
                                { text: `Es-tu en couple ?` },
                            ]}
                            style={{
                                alignSelf: 'center',
                                color: '#e0e0e0',
                                fontSize: 18,
                                fontFamily: 'SpaceMono-Regular',
                                width: '100%',
                                textAlign: 'center',
                            }}
                            blinkSpeed={800}
                            typeSpeed={50}
                        />
                        <View style={[styles.checkboxContainer, { borderColor: isCouple === false ? '#000' : '#54b8b3', backgroundColor: "#000" }]}>
                            <View style={styles.section}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked}
                                    onValueChange={() => { setChecked(true); setChecked2(false); setIsCouple(true); }}
                                    color={isChecked ? '#5e60ce' : undefined}
                                />
                                <Text style={styles.paragraph}>Oui</Text>
                            </View>
                            <View style={styles.section}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked2}
                                    onValueChange={() => { setChecked(false); setChecked2(true); setIsCouple(true); }}
                                    color={isChecked2 ? '#5e60ce' : undefined}
                                />
                                <Text style={styles.paragraph}>Non</Text>
                            </View>
                        </View>
                    </View>
                    {isChecked && (
                        <View style={styles.containerCouple}>
                            <View style={styles.containerInput}>
                                <TypeAnimation
                                    sequence={[
                                        { text: `Quel est son prénom ? ` },
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
                                <TextInput
                                    autoCapitalize="none"
                                    placeholder="Prénom"
                                    placeholderTextColor={"#808080"}
                                    value={prenom}
                                    onChangeText={(text) => {
                                        setPrenom(text);
                                    }}
                                    style={prenom !== "" ? styles.inputField : styles.inputFieldError}
                                />
                            </View>
                            <View style={styles.containerInput}>
                                <TypeAnimation
                                    sequence={[
                                        { text: "Quand vous êtes-vous rencontrés ?" },
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
                                    <Text style={{ fontSize: 20, fontFamily: "SpaceMono-Regular", marginBottom: 20, color:"#e0e0e0" }}>
                                        {dateSelected ?  moment(dateSelected).format('dddd D MMMM YYYY') : ''}
                                    </Text>)}
                            </View>
                        </View>)}
                </ScrollView>
            </View>
            <TouchableOpacity onPress={() => router.navigate({
                pathname: "signup5",
                params: {
                    prenom: local.prenom,
                    name: local.name,
                    email: local.email,
                    birth: local.birth,
                    genre: local.genre,
                    situation: isChecked ? "couple" : "celibataire",
                    prenomPartenaire: prenom,
                    dateRencontrePartenaire: dateSelected
                }
            })}
                style={isChecked2 ? styles.button : (dateSelected !== '' && prenom !== "" ? styles.button : styles.buttonDisabled)}
                disabled={isChecked2 ? false : ((dateSelected !== '' && prenom !== "") ? false : true)}>
                <Text style={{ color: '#fff', fontFamily: "bold" }}>Suivant</Text>
            </TouchableOpacity>
            {/* </ImageBackground> */}
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: "#000"
    },
    containerInput: {
        flexDirection: 'column',
        gap: 20,
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
        gap: 20
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
        width: "80%",
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
        justifyContent: 'center',
        gap: 30,
        alignItems: 'center',
    },
    inputField: {
        width: '80%',
        minWidth: 200,
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#e0e0e0',
        borderWidth: 0.5,
        borderColor: '#54b8b3',
    },
    inputFieldError: {
        minWidth: 200,
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#e0e0e0',
        borderWidth: 0.5,
        backgroundColor: "#202020"
    },
    checkbox: {
        margin: 8,
    },
    checkboxContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
        padding: 20,
        borderRadius: 15,
        borderWidth: 0.5,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 17,
        fontFamily: 'SpaceMono-Regular',
        color: "#e0e0e0"
    },
    containerCouple: {
        marginTop: 50,
        flexDirection: "column",
        gap: 30,
        alignItems: "center"
    }
});

export default Signup4;