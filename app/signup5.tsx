import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { router, useLocalSearchParams } from 'expo-router';
import TrafficLightBar from '@/components/TrafficLightBar';
import { TypeAnimation } from 'react-native-type-animation';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { PinwheelIn, FadeIn } from 'react-native-reanimated';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ApiKeys from '@/constants/ApiKeys';

const Signup5 = () => {

    const local = useLocalSearchParams();

    const googleKey = ApiKeys.googleApiKey.googleKey;

    interface Coords {
        lat: number;
        lng: number;
    }

    interface Lieu {
        adressName: string | undefined;
        coords: Coords | undefined;
        ville: string;
    }

    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [adresse, setAdresse] = useState<Lieu | null>(null);


    const getAvatarUrl = async (User: string) => {
        const { data: { publicUrl } } = await supabase.storage.from('avatars')
            .getPublicUrl(`${User}/avatar.png`)

        return publicUrl;
    };

    const createUser = async (url: string) => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .insert({
                name: local.name,
                email: local.email,
                prenom: local.prenom,
                birthday: local.birth,
                userId: User?.id,
                phone: User?.phone,
                avatarUrl: url,
                situation: local.situation,
                showStatut: true,
                genre: local.genre,
                snapshat: "",
                instagram: "",
                snapVerified: false,
                instaVerified: false,
                adresse: adresse,
                prenomPartenaire: local.prenomPartenaire,
                dateRencontrePartenaire: local.dateRencontrePartenaire
            });

        if (error) {
            console.log(error);
        }
    };

    const updatePhoneVerification = async () => {
        const { data, error } = await supabase.auth.updateUser({
            data: { phone_verified: true }
        });
        if (error) {
            console.log(error);
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const validateImage = async () => {
        setLoading(true);
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        if (image) {
            const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
            const filePath = `${User?.id}/avatar.png`;
            const contentType = 'image/png';
            await supabase.storage.from('avatars').upload(filePath, decode(base64), { contentType });
        }

        getAvatarUrl(User!.id).then((result) => {
            createUser(result);
        }).then(() => {
            updatePhoneVerification();
        }).then(() => {
            setLoading(false);
            router.replace('/(auth)/(tabs)');
        })
    };

    return (
        <View style={styles.container}>
            {/* <ImageBackground source={require("../assets/images/background1.png")} resizeMode="cover" style={styles.image}> */}
                <View style={styles.step}>
                    <TrafficLightBar light1={true} light2={true} light3={true} light4={true} light5={true} />
                </View>
                <View style={styles.containerView}>
                    <View style={styles.subContainer}>
                        <TypeAnimation
                            sequence={[
                                { text: "Quelle est ta ville de résidence  📍 ?" },
                            ]}
                            style={{
                                alignSelf: 'center',
                                color: '#e0e0e0',
                                fontSize: 18,
                                fontFamily: 'SpaceMono-Regular',
                                width: '85%',
                                textAlign: 'center',
                            }}
                            blinkSpeed={800}
                            typeSpeed={50}
                            cursor={false}
                        />
                        <View style={styles.inputContainer}>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "85%" }}>
                                <GooglePlacesAutocomplete
                                    placeholder="Ajoute ta ville"
                                    onPress={(data, details = null) => {
                                        setAdresse({
                                            adressName: details?.formatted_address,
                                            coords: details?.geometry.location,
                                            ville: details?.vicinity ? details?.vicinity : ""
                                        });
                                    }}
                                    enablePoweredByContainer={false}
                                    textInputProps={{
                                        placeholderTextColor: "#9f9f9f",
                                        fontSize: 15,
                                        color: "#e0e0e0"
                                    }}
                                    currentLocation={false}
                                    currentLocationLabel='Current location'
                                    styles={{
                                        textInput: adresse === null ? styles.textInputError : styles.textInput,
                                        container: styles.autocompleteContainer,
                                        listView: styles.listView,
                                        separator: styles.separator,
                                    }}
                                    fetchDetails
                                    query={{
                                        key: googleKey,
                                        language: "fr",
                                        components: "country:fr",
                                        location: "48.817223, 1.949075",
                                        radius: "800000", //800 km
                                        strictbounds: true,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.subContainer}>
                        <TypeAnimation
                            sequence={[
                                { text: "Ajoute une photo de profil" },
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
                        <Animated.View entering={PinwheelIn.duration(2000)} style={styles.containerForm}>
                            <View>
                                {image && <TouchableOpacity onPress={pickImage}>
                                    <Image source={{ uri: image }} style={styles.avatar} />
                                    <View style={styles.editButtonContainer}>
                                        <Ionicons name="add-circle" size={50} color="#5e60ce" />
                                    </View>
                                </TouchableOpacity>}
                                {!image &&
                                    <TouchableOpacity onPress={pickImage}>
                                        <View style={styles.avatar}>
                                            <Image source={require("../assets/images/user.png")} style={styles.avatarStyle} />
                                        </View>
                                        <View style={styles.editButtonContainer}>
                                            <Ionicons name="add-circle" size={50} color="#5e60ce" />
                                        </View>
                                    </TouchableOpacity>}
                            </View>
                        </Animated.View>
                    </View>
                </View>
                <TouchableOpacity onPress={validateImage}
                    style={image !== null && adresse !== null ? styles.button : styles.buttonDisabled}
                    disabled={image === null || adresse === null}>
                    <Text style={{ color: '#fff', fontWeight: "bold" }}>Créer mon compte</Text>
                </TouchableOpacity>
            {/* </ImageBackground> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor:"#000"
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
    avatar: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        borderRadius: 100,
        justifyContent: "center",
        borderWidth: 2,
        borderColor:"#5e60ce"
        // backgroundColor: 'rgba(0,0,0,0.4)',
    },
    editButtonContainer: {
        // marginTop: -10,
        alignSelf: 'center',
    },
    avatarStyle: {
        width: 120,
        height: 120,
        alignSelf: "center",
    },
    infoContainer: {
        marginTop: 30
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        margin: 50,
        color: '#fff',
    },
    inputField: {
        marginVertical: 8,
        height: 50,
        borderRadius: 15,
        padding: 10,
        color: '#e0e0e0',
        backgroundColor: '#303030',
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
        bottom: 40,
        alignItems: 'center',
        backgroundColor: '#303030',
        padding: 12,
        borderRadius: 25,
    },
    autocompleteContainer: {
        color: "#C2D4E1",
        top: 0,
    },
    textInput: {
        width: '80%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#e0e0e0',
        borderWidth: 0.5,
        borderColor: '#54b8b3',
        backgroundColor: "transparent",
    },
    textInputError: {
        width: '80%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#e0e0e0',
        borderWidth: 0.5,
        backgroundColor: '#202020',
    },
    containerView: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent:"center",
        alignItems: 'center',
        gap: 40
    },
    subContainer: {
        minHeight:"25%",
        width: '90%',
    },
    separator: {
        backgroundColor: '#e0e0e0',
        height: 1,
    },
    listView: {
        maxHeight: "70%",
        paddingRight: 20,
        borderRadius: 10,
        color: "#e0e0e0",
        marginLeft: 10,
    },
    inputContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
});

export default Signup5;