import { View, Text, TextInput, StyleSheet, SafeAreaView, Image, ActivityIndicator, ScrollView, Alert, Button, TouchableOpacity } from 'react-native';
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


export default function Demande() {

    const googleKey = ApiKeys.googleApiKey.googleKey;

    const [voeux, setVoeux] = useState('');
    const [demande, setDemande] = useState(false)
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
    const [mode, setMode] = useState<'date' | 'datetime' | 'time'>('date');

    const [lieuRencontre, setLieuRencontre] = useState<Lieu | null>(null);

    const [adresse, setAdresse] = useState<Lieu | null>(null);


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        setDateSelected(currentDate);
    };

    useEffect(() => {
        // setLoading(true);
        loadUser();
        // loadDemande().then(() => loadDemandeImage());
    }, []);

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
                        onPress={() => router.replace('/(auth)')} >
                        <Ionicons name="chevron-back-sharp" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Notre NFT</Text>
                </View>
                <View style={styles.containerLocationInput}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Lieu de votre rencontre *</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "85%" }}>
                            <Ionicons name={lieuRencontre === null ? "location-outline" : "location"} size={21} color={lieuRencontre === null ? "#8b9fb3" : "#63cd78"} />

                            <GooglePlacesAutocomplete
                                placeholder="Ville ou adresse"
                                onPress={(data, details = null) => {
                                    setLieuRencontre({ adressName: details?.formatted_address, coords: details?.geometry.location, ville: details?.vicinity ? details?.vicinity : "" });
                                    console.log(typeof (details?.vicinity));
                                }}
                                enablePoweredByContainer={false}
                                // suppressDefaultStyles
                                textInputProps={{
                                    placeholderTextColor: "#C2D4E1",
                                    fontSize: 17
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
                    {user && user.adresse === null ?
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputTitle}>Ta ville</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "85%" }}>
                                <Ionicons name={adresse === null ? "location-outline" : "location"} size={21} color={adresse === null ? "#8b9fb3" : "#63cd78"} />
                                <GooglePlacesAutocomplete
                                    placeholder="Ville ou adresse"
                                    onPress={(data, details = null) => {
                                        setAdresse({ adressName: details?.formatted_address, coords: details?.geometry.location, ville: details?.vicinity ? details?.vicinity : "" });
                                    }}
                                    enablePoweredByContainer={false}
                                    // suppressDefaultStyles
                                    textInputProps={{
                                        placeholderTextColor: "#C2D4E1",
                                        fontSize: 17
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
                        </View> : null}
                </View>
                <ScrollView style={styles.bottomForm}>
                    <View style={{ flexDirection: "row", gap: 5 }}>
                        <Ionicons name={image === null ? "image-outline" : "image"} size={21} color={image === null ? "#8b9fb3" : "#63cd78"} />
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.imageTitle}>Ajoute une image qui représente ta demande</Text>
                            <Text style={styles.imageSubTitle}>Tu pourras la modifier si vous n'êtes pas d'accord</Text>
                        </View>
                    </View>
                    {image && <TouchableOpacity onPress={pickImage}>
                        <Image source={{ uri: image }} style={styles.avatar} />
                        <View style={styles.editButtonContainer}>
                            <Image source={require("../../../assets/images/edit.png")} style={styles.editButtonStyle} />
                        </View>
                    </TouchableOpacity>}
                    {!image &&
                        <TouchableOpacity onPress={pickImage}>
                            <View style={styles.avatar}>
                                <FontAwesome5 name="images" size={50} color="#c5c5c5" />
                            </View>
                            <View style={styles.editButtonContainer}>
                                <Image source={require("../../../assets/images/edit.png")} style={styles.editButtonStyle} />
                            </View>
                        </TouchableOpacity>}
                    <View style={styles.containerNewDemande}>
                        <View style={{ display: showNext ? "none" : "flex" }}>
                            <View style={styles.inputContainer}>
                                <View style={{ flexDirection: "row" }}>
                                    <Ionicons name={dateSelected === undefined ? "calendar-outline" : "calendar"} size={21} color={dateSelected === undefined ? "#8b9fb3" : "#63cd78"} />
                                    <Text style={styles.inputTitle}>Date de votre rencontre *</Text>
                                </View>
                                <View style={{ alignItems: "center", marginTop: 10 }}>
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        onChange={onChange}
                                        locale='fr'
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainerVoeux}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Entypo name="new-message" size={21} color={voeux === '' ? "#8b9fb3" : "#63cd78"} />
                                    <View>
                                        <Text style={styles.inputTitle}>Ton voeu d'engagement *</Text>
                                        <Text style={styles.imageSubTitle}>Écris le message qui durera pour toujours...</Text>
                                    </View>
                                </View>
                                <TextInput
                                    style={styles.inputVoeux}
                                    placeholder="Je m'engage à..."
                                    multiline
                                    value={voeux}
                                    onChangeText={setVoeux}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity style={voeux !== "" && dateSelected !== undefined && lieuRencontre !== null ? styles.button : styles.buttonDisable} disabled={voeux === "" && dateSelected === undefined && lieuRencontre === null && (adresse === null && user?.adresse === null)}
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
                    <Text style={styles.buttonText}>Valider mon engagement</Text>
                </TouchableOpacity>
            </View>
            {/* } */}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: "#faf7f7",
    },
    bottomForm: {
        marginTop: 30,
    },
    containerTop: {
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerNewDemande: {
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: "#faf7f7"
    },
    questionButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        gap: 20
    },
    avatar: {
        width: "70%",
        height: 150,
        backgroundColor: '#e0e0e0',
        alignSelf: 'center',
        alignItems: "center",
        borderRadius: 20,
        justifyContent: "center"
    },
    editButtonContainer: {
        marginTop: -30,
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
        backgroundColor: '#B18CE5',
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
        backgroundColor: '#b7b7b7',
        paddingVertical: 12,
        paddingHorizontal: 20
    },
    buttonSecond: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignSelf: 'center',
        borderRadius: 10,
        width: 130,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B18CE5',
        padding: 12,
    },
    buttonTextSecond: {
        fontSize: 15,
        textAlign: 'center',
        color: '#B18CE5'
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff'
    },
    formContainer: {
        height: "100%",
        width: '90%',
        alignSelf: 'center',
    },
    inputTitle: {
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 5
    },
    imageTitle: {
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 5
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
        backgroundColor: '#FFF',
        paddingVertical: 15,
        borderColor: '#ccc',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    containerLocationInput: {
        marginTop: 30,
        // alignItems: "center"
    },
    inputContainerVoeux: {
        marginTop: 30,
        marginBottom: 70
    },
    inputVoeux: {
        backgroundColor: '#FFF',
        minHeight: 100,
        minWidth: 300,
        paddingVertical: 15,
        borderColor: '#ccc',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        color: "#B18CE5",
    },
    autocompleteContainer: {
        color: "#C2D4E1",
        top: 0,
    },
    textInput: {
        padding: 12,
        backgroundColor: '#fff',
        minWidth: '97%',
        // maxWidth: '92%',
        marginHorizontal: 10,
        borderRadius: 10,
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