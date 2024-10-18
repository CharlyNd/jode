import {
    Animated,
    Text,
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Alert,
    ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { supabase } from '@/utils/supabase';
import { router, useLocalSearchParams, } from 'expo-router';

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { TypeAnimation } from "react-native-type-animation";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const CELL_SIZE = height * 0.05;

const CELL_BORDER_RADIUS = 20;
const DEFAULT_CELL_BG_COLOR = "#fff";
const NOT_EMPTY_CELL_BG_COLOR = "#5e60ce";
const ACTIVE_CELL_BG_COLOR = "#acacac";

const { Value, Text: AnimatedText } = Animated;

const CELL_COUNT = 6;


const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }: { hasValue: boolean; index: number; isFocused: boolean }) => {
    Animated.parallel([
        Animated.timing(animationsColor[index], {
            useNativeDriver: false,
            toValue: isFocused ? 1 : 0,
            duration: 250,
        }),
        Animated.spring(animationsScale[index], {
            useNativeDriver: false,
            toValue: hasValue ? 0 : 1,
            // duration: hasValue ? 300 : 250,
        }),
    ]).start();
};

export default function () {
    const local = useLocalSearchParams();
    const [phone, setPhone] = useState(local.phone);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [otp, setOTP] = useState('');


    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const renderCell = ({ index, symbol, isFocused }: { index: number; symbol: string; isFocused: boolean }) => {
        const hasValue = Boolean(symbol);
        const animatedCellStyle = {
            backgroundColor: hasValue
                ? animationsScale[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
                })
                : animationsColor[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
                }),
            borderRadius: animationsScale[index].interpolate({
                inputRange: [0, 1],
                outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
            }),
            transform: [
                {
                    scale: animationsScale[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1],
                    }),
                },
            ],
        };

        setTimeout(() => {
            animateCell({ hasValue, index, isFocused });
        }, 0);

        return (
            <AnimatedText
                key={index}
                style={[styles.cell, animatedCellStyle]}
                onLayout={getCellOnLayoutHandler(index)}
            >
                {symbol || (isFocused ? <Cursor /> : null)}
            </AnimatedText>
        );
    };

    // Create a new user
    const onVerifyOtpPress = async () => {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.verifyOtp({
            phone: typeof phone === 'string' ? phone : '',
            token: value,
            type: 'sms',
        })

        if (error) Alert.alert(error.message);
        if (!session) Alert.alert('Please check your inbox for phone verification!');

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {/* <ImageBackground source={require("../assets/images/background2.png")} resizeMode="cover" style={styles.image}> */}
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, height: "100%", justifyContent: "center" }}
                    keyboardShouldPersistTaps="handled"
                >
                    <TypeAnimation
                        sequence={[
                            { text: `Entre le code de vérification reçu par sms au : \n\n ${phone}` },
                        ]}
                        style={{
                            alignSelf: 'center',
                            color: '#e0e0e0',
                            fontSize: 22,
                            marginBottom: 20,
                            fontFamily: 'SpaceMono-Regular',
                            width: '90%',
                            textAlign: 'center',
                        }}
                        blinkSpeed={800}
                        typeSpeed={50}
                        cursor={false}
                    />
                    <View>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={setValue}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFiledRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={renderCell}
                        />
                        <TouchableOpacity onPress={() => onVerifyOtpPress()}>
                            <View style={styles.validateButton}>
                                <Text style={styles.validateButtonText}>Valider le code</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonResendCode}
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Text style={styles.sendAgain}>Renvoyer le code par sms</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            {/* </ImageBackground> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor:"#000"
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    bottomContainer: {
        borderRadius: 40,
        backgroundColor: "#151515",
        paddingHorizontal: width * 0.1,
        paddingTop: height * 0.05,
        paddingBottom: height * 0.5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 3.35,
        shadowRadius: 3.84,
    },
    iconContainer: {
        paddingVertical: height * 0.1,
        alignItems: "center",
        backgroundColor: "#151515",
    },
    codeFiledRoot: {
        height: CELL_SIZE,
        marginTop: 30,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    sendCode: {
        marginTop: 15,
        padding: 15,
        backgroundColor: "#000",
    },
    cell: {
        marginHorizontal: 8,
        height: CELL_SIZE,
        width: CELL_SIZE,
        lineHeight: CELL_SIZE - 5,
        fontSize: 30,
        textAlign: "center",
        borderRadius: CELL_BORDER_RADIUS,
        color: "#5e60ce",
        backgroundColor: "#fff",
    },
    icon: {
        width: 217 / 2.4,
        height: 158 / 2.4,
        marginLeft: "auto",
        marginRight: "auto",
    },
    subTitle: {
        width: width * 0.8,
        fontFamily: "Montserrat_500Medium",
        color: "#e0e0e0",
        fontSize: 14,
        textAlign: "center",
    },
    validateButton: {
        marginTop: height * 0.1,
        padding: 10,
        borderRadius: 50,
        backgroundColor: "#5e60ce",
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignSelf: "center",
    },
    validateButtonText: {
        textAlign: "center",
        fontSize: 17,
        color: "#fff",
        fontFamily: "Montserrat_700Bold",
    },
    buttonText: {
        fontSize: 12,
        fontFamily: "Montserrat_500Medium",
        color: "#fff",
    },
    sendAgain: {
        textAlign: "center",
        fontSize: 17,
        color: "#5e60ce",
        fontFamily: "Montserrat_600SemiBold",
    },
    buttonResendCode: {
        marginTop: height * 0.05,
        padding: 15,
        borderRadius: 15,
        color: "#e0e0e0",
        alignSelf: "center",
    },
    title: {
        fontFamily: "Montserrat_500Medium",
        color: "#000",
        fontSize: 16,
        textAlign: "center",
    },
    containerTitle: {
        alignItems: "center",
    },
    phone: {
        alignSelf: "center",
        fontFamily: "Montserrat_500Medium",
        paddingVertical: height * 0.02,
        color: "#000",
        fontSize: 28,
    },
});
