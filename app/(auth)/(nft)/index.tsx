import { View, Text, TextInput, StyleSheet, SafeAreaView, Image, Platform, ActivityIndicator, ScrollView, Alert, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/utils/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import * as Progress from 'react-native-progress';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import * as SMS from 'expo-sms';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Entypo from '@expo/vector-icons/Entypo';
import ApiKeys from '@/constants/ApiKeys';
import moment from "moment";
import "moment/locale/fr";

export default function index() {

    const googleKey = ApiKeys.googleApiKey.googleKey;

    interface User {
        adresse: Lieu | null;
        name: string;
        userId: string;
        // add other properties here if needed
    }

    interface Lieu {
        adressName: string | undefined;
        coords: Coords | undefined;
        ville: string;
        avatarUrl?: string;
    }

    interface Coords {
        lat: number;
        lng: number;
    }


    const [user, setUser] = useState<User | null>(null);
    const [showNext, setShowNext] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [data, setData] = useState<any | null>(null);
    const [date, setDate] = useState(new Date());
    const [dateSelected, setDateSelected] = useState(undefined);
    const [dateFormatted, setDateFormated] = useState('');
    const [mode, setMode] = useState<'date' | 'datetime' | 'time'>('date');
    const [datePickerVisible, setDatePickerVisible] = useState(Platform.OS === "android" ? false : true);
    const [phone, setPhone] = useState('');
    const [lieuRencontre, setLieuRencontre] = useState<Lieu | null>(null);
    const [adresse, setAdresse] = useState<Lieu | null>(null);
    const [voeux, setVoeux] = useState('');
    const [prenom, setPrenom] = useState('');
    const [demande, setDemande] = useState(false)

    useEffect(() => {
        // setLoading(true);
        // loadUser();
        // loadDemande().then(() => loadDemandeImage());
    }, []);


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        if (Platform.OS === 'android') {
            setDatePickerVisible(false);
        }
        setDate(currentDate);
        setDateSelected(currentDate.toISOString());
        let dateFormat = (moment(currentDate).format('dddd D MMMM YYYY'))
        setDateFormated(dateFormat);
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };
    const getAvatarUrl = async (User: string) => {
        const { data: { publicUrl } } = await supabase.storage.from('demandes')
            .getPublicUrl(`${User}/demande.png`)

        setImgUrl(publicUrl);
        return publicUrl;
    };

    const loadDemandeImage = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        supabase.storage
            .from('demandes')
            .download(`${User?.id}/demande.png`)
            .then(({ data }) => {
                setLoading(false);
                // console.log(data);
                if (!data) return;

                const fr = new FileReader();
                fr.readAsDataURL(data!);
                fr.onload = () => {
                    setImgUrl(fr.result as string);
                };
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const loadDemande = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('demandes')
            .select('*')
            .eq('userId', User?.id);

        if (data && data.length > 0) {
            setDemande(true);
            setData(data[0]);
        }
    }

    const loadUser = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('userId', User?.id);

        if (data) {
            setUser(data[0] || 'No name provided');
        }
    };


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
            const filePath = `${User?.id}/nft.png`;
            await supabase.storage.from('nft').upload(filePath, decode(base64));
        }

        getAvatarUrl(User!.id).then((result) => {
            console.log(result);
            createNft(result);
            setImgUrl(result);
        })
            .then(() => {
                // loadDemande()
                setLoading(false);
            })
        // .then(() => {
        //     setLoading(false);
        //     setDemande(true);
        //     loadDemandeImage();
        // });
    };

    const createNft = async (url: string) => {
        // const {
        //     data: { user: User },
        // } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('nft')
            .upsert({
                name1: user?.name,
                userId1: user?.userId,
                lieuRencontre: lieuRencontre,
                dateRencontre: dateSelected,
                voeux1: voeux,
                nftImage: imgUrl
            },
                { onConflict: 'userId1' })
            .select();
        console.log(error);
    };

    return (
        <SafeAreaView style={styles.container}>
            {
                loading && (
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
                )
            }
            {/* {data && */}
            <View style={styles.formContainer}>
                <View style={styles.containerTop}>
                    <TouchableOpacity
                        onPress={() => router.navigate('/(auth)/(tabs)')} >
                        <Ionicons name="close" size={35} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>NFT Union Digital</Text>
                </View>
                <View style={styles.containerLocationInput}>
                    <View style={{ flexDirection: "row", width: "90%", alignItems: "center" }}>
                        {/* <View>
                            <Text style={styles.inputTitle}>Prénom du Partenaire</Text>
                        </View> */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="person-outline" size={18} color={prenom === '' ? "#8b9fb3" : "#ccff33"} />
                            <TextInput
                                style={styles.input}
                                placeholder="Prénom partenaire"
                                value={prenom}
                                onChangeText={setPrenom}
                                placeholderTextColor={"#9f9f9f"}
                            />
                        </View>
                        {/* <View>
                            <Text style={styles.inputTitle}>Prénom du Partenaire</Text>
                        </View> */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="call-outline" size={18} color={phone === '' ? "#8b9fb3" : "#ccff33"} />
                            <TextInput
                                style={styles.input}
                                placeholder="Son numéro de téléphone"
                                value={phone}
                                onChangeText={setPhone}
                                placeholderTextColor={"#9f9f9f"}
                                keyboardType='phone-pad'
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        {/* <Text style={styles.inputTitle}>Lieu de votre rencontre *</Text> */}
                        <View style={{ flexDirection: "row", alignItems: "center", width: "85%" }}>
                            <Ionicons name={lieuRencontre === null ? "location-outline" : "location"} size={21} color={lieuRencontre === null ? "#8b9fb3" : "#ccff33"} />

                            <GooglePlacesAutocomplete
                                placeholder="Le lieu de votre rencontre"
                                onPress={(data, details = null) => {
                                    setLieuRencontre({ adressName: details?.formatted_address, coords: details?.geometry.location, ville: details?.vicinity ? details?.vicinity : "" });
                                    console.log(typeof (details?.vicinity));
                                }}
                                enablePoweredByContainer={false}
                                // suppressDefaultStyles
                                textInputProps={{
                                    placeholderTextColor: "#9f9f9f",
                                    fontSize: 15,
                                    color: "#ccff33"
                                }}
                                currentLocation={false}
                                currentLocationLabel='Current location'
                                styles={{
                                    textInput: styles.textInput,
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
                            // renderRow={(data) => <PlaceRow data={data} />}
                            // renderDescription={(data) => data.description || data.vicinity}
                            />
                        </View>
                    </View>
                    {/* {user && user.adresse === null ? */}
                    <View style={styles.inputContainer}>
                        {/* <Text style={styles.inputTitle}>Ta ville</Text> */}
                        <View style={{ flexDirection: "row", alignItems: "center", width: "85%" }}>
                            <Ionicons name={adresse === null ? "location-outline" : "location"} size={21} color={adresse === null ? "#8b9fb3" : "#ccff33"} />
                            <GooglePlacesAutocomplete
                                placeholder="Quelle est ta ville de résidence ?"
                                onPress={(data, details = null) => {
                                    setAdresse({ adressName: details?.formatted_address, coords: details?.geometry.location, ville: details?.vicinity ? details?.vicinity : "" });
                                }}
                                enablePoweredByContainer={false}
                                // suppressDefaultStyles
                                textInputProps={{
                                    placeholderTextColor: "#9f9f9f",
                                    fontSize: 15,
                                    color: "#ccff33"
                                }}
                                currentLocation={false}
                                currentLocationLabel='Current location'
                                styles={{
                                    textInput: styles.textInput,
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
                            // renderRow={(data) => <PlaceRow data={data} />}
                            // renderDescription={(data) => data.description || data.vicinity}
                            />
                        </View>
                    </View>
                    {/* : null} */}
                </View>
                <ScrollView style={styles.bottomForm} contentContainerStyle={{ flexGrow: 1 }} automaticallyAdjustKeyboardInsets scrollEnabled={true} showsVerticalScrollIndicator={false}>
                    <View style={styles.containerNewDemande}>
                        <View style={{ display: showNext ? "none" : "flex" }}>
                            <View style={styles.inputContainer}>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Ionicons name={dateSelected === undefined ? "calendar-outline" : "calendar"} size={21} color={dateSelected === undefined ? "#8b9fb3" : "#ccff33"} />
                                    <Text style={styles.inputTitle}>Date de votre rencontre</Text>
                                </View>
                                <View style={{ alignItems: "center", marginTop: 10 }}>
                                    {Platform.OS === 'android' && (
                                        <TouchableOpacity onPress={showDatePicker} style={styles.buttonDate}>
                                            <Text style={{ fontSize: 15, fontFamily: "SpaceMono-Regular", color: "#fff" }}>
                                                {dateFormatted !== "" ? dateFormatted : 'Choisir la date'}
                                            </Text>
                                        </TouchableOpacity>)}
                                    {datePickerVisible && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date}
                                            mode={mode}
                                            onChange={onChange}
                                            locale='fr'
                                        />)}
                                </View>
                            </View>

                            <View style={styles.inputContainerVoeux}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                                    <Entypo name="new-message" size={21} color={voeux === '' ? "#8b9fb3" : "#ccff33"} />
                                    <Text style={styles.inputTitle}>Ton voeu d'engagement</Text>
                                    {/* <Text style={styles.imageSubTitle}>Écris le message qui durera pour toujours...</Text> */}
                                </View>
                                <TextInput
                                    style={styles.inputVoeux}
                                    placeholder="Écris le message qui durera pour toujours..."
                                    multiline
                                    value={voeux}
                                    onChangeText={setVoeux}
                                    placeholderTextColor={"#9f9f9f"}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 5, justifyContent: "center" }}>
                        <Ionicons name={image === null ? "image-outline" : "image"} size={21} color={image === null ? "#8b9fb3" : "#ccff33"} />
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.imageTitle}>Photo qui représente ta demande</Text>
                            {/* <Text style={styles.imageSubTitle}>Tu pourras la modifier si vous n'êtes pas d'accord</Text> */}
                        </View>
                    </View>
                    {image && <TouchableOpacity onPress={pickImage}>
                        <Image source={{ uri: image }} style={styles.avatar} />
                        <View style={styles.editButtonContainer}>
                            <Ionicons name="add-circle-outline" size={40} color="#ccff33" />
                        </View>
                    </TouchableOpacity>}
                    {!image &&
                        <TouchableOpacity onPress={pickImage}>
                            <View style={styles.avatar}>
                                <FontAwesome5 name="images" size={50} color="#c5c5c5" />
                            </View>
                            <View style={styles.editButtonContainer}>
                                <Ionicons name="add-circle-outline" size={40} color="#ccff33" />
                            </View>
                        </TouchableOpacity>}
                </ScrollView>
                <TouchableOpacity style={voeux !== "" && prenom !== "" && phone !== "" && dateSelected !== undefined && lieuRencontre !== null ? styles.button : styles.buttonDisable} disabled={voeux === "" && prenom !== "" && phone !== "" && dateSelected === undefined && lieuRencontre === null && (adresse === null && user?.adresse === null)}
                    // onPress={() => image === null ? Alert.alert("Attention", "Es-tu sure de vouloir continuer sans image ?", [
                    //     {
                    //         text: 'Non, je veux ajouter une image',
                    //         onPress: () => console.log('Cancel Pressed'),
                    //         style: 'cancel',
                    //     },
                    //     { text: 'Oui, je continue', onPress: () => setShowNext(!showNext) },
                    // ]) : setShowNext(!showNext)} 
                    onPress={() => validateImage()}
                >
                    <Text style={voeux !== "" && prenom !== "" && phone !== "" && dateSelected !== undefined && lieuRencontre !== null ? styles.buttonText : styles.buttonTextDisabled}>Valider mon engagement</Text>
                </TouchableOpacity>
            </View>
            {/* } */}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "95%",
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    bottomForm: {
        width: "100%",
        marginTop: 0,
    },
    containerTop: {
        width: "90%",
        marginTop: 20,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerNewDemande: {
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    questionButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        gap: 20
    },
    buttonDate: {
        alignItems: 'center',
        // backgroundColor: '#2F215F',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#ccff33",
    },
    avatar: {
        width: "70%",
        height: 150,
        backgroundColor: "#202020",
        // borderWidth: 0.5,
        // borderColor: "#ccff33",
        alignSelf: 'center',
        alignItems: "center",
        borderRadius: 20,
        justifyContent: "center"
    },
    editButtonContainer: {
        marginTop: -20,
        alignSelf: 'center',
    },
    avatarStyle: {
        width: 70,
        height: 70,
        alignSelf: "center",
    },
    editButtonStyle: {
        width: 50,
        height: 50,
        alignSelf: "center",
    },
    demandeText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 15
    },
    explication: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 10,
        color: "#a8a8a8"
    },
    button: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignSelf: 'center',
        borderRadius: 10,
        minWidth: 130,
        alignItems: 'center',
        backgroundColor: '#ccff33',
        padding: 12,
    },
    buttonDisable: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignSelf: 'center',
        borderRadius: 10,
        // minwidth: 130,
        alignItems: 'center',
        backgroundColor: '#656565',
        paddingVertical: 12,
        paddingHorizontal: 20
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff'
    },
    buttonTextDisabled: {
        fontSize: 15,
        textAlign: 'center',
        color: '#373737'
    },
    formContainer: {
        height: "100%",
        // width: '90%',
        alignSelf: 'center',
        alignItems: 'center',

    },
    inputTitle: {
        color: "#fff",
        fontSize: 15,
        marginLeft: 10,
        // marginBottom: 10,
    },
    imageTitle: {
        color: "#fff",
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 10
    },
    imageSubTitle: {
        marginLeft: 10,
        fontSize: 13,
        color: "#9b9b9b",
        // alignSelf: "center",
        marginBottom: 10
    },
    inputContainer: {
        marginTop: 30,

    },
    input: {
        padding: 12,
        backgroundColor: 'transparent',
        // minWidth: '80%',
        // maxWidth: '92%',
        borderBottomWidth: 0.5,
        borderColor: '#ccff33',
        marginHorizontal: 10,
        // borderRadius: 10,
        color: "#e0e0e0",
    },
    containerLocationInput: {
        alignItems: 'center',
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 20,
    },
    inputContainerVoeux: {
        marginTop: 30,
        marginBottom: 30
    },
    inputVoeux: {
        color: "#fff",
        fontSize: 16,
        backgroundColor: 'transparent',
        minHeight: 100,
        minWidth: 300,
        paddingVertical: 15,
        borderColor: '#ccff33',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        color: "#fff",
    },
    autocompleteContainer: {
        color: "#C2D4E1",
        top: 0,
    },
    textInput: {
        padding: 12,
        backgroundColor: 'transparent',
        minWidth: '97%',
        // maxWidth: '92%',
        borderBottomWidth: 0.5,
        borderColor: '#ccff33',
        marginHorizontal: 10,
        // borderRadius: 10,
        color: "#000",
    },
    separator: {
        backgroundColor: '#e0e0e0',
        height: 1,
    },
    listView: {
        // minWidth: '90%',
        // maxWidth: '%',
        maxHeight: "70%",
        paddingRight: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        color: "#e0e0e0",
        marginLeft: 10,
    },
});