import { View, Text, TextInput, StyleSheet, Image, Platform, ActivityIndicator, ScrollView, Alert, Button, TouchableOpacity } from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function index() {

    const googleKey = ApiKeys.googleApiKey.googleKey;

    interface User {
        adresse: Lieu | null;
        prenom: string;
        userId: string;
        id: number;
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
    const [voeux, setVoeux] = useState('');
    const [prenom, setPrenom] = useState('');
    const [demande, setNft] = useState(false)

    useEffect(() => {
        setLoading(true);
        loadUser();
        loadNft().then(() => loadNftImage());
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
        const { data: { publicUrl } } = await supabase.storage.from('nft')
            .getPublicUrl(`${User}/nft.png`)

        setImgUrl(publicUrl);
        return publicUrl;
    };

    const loadNftImage = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        supabase.storage
            .from('nft')
            .download(`${User?.id}/nft.png`)
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

    const loadNft = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('nft')
            .select('*')
            .eq('userId1', User?.id);

        if (data && data.length > 0) {
            console.log(data);

            setNft(true);
            setData(data[0]);
        }
        setLoading(false)
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
            createNft(result).then(() => {
                loadNft();
                loadNftImage();
                setLoading(false);
            });
            setImgUrl(result);
        })

        // .then(() => {
        //     setLoading(false);
        //     setNft(true);
        //     loadDemandeImage();
        // });
    };

    const createNft = async (url: string) => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('nft')
            .upsert({
                name1: user?.prenom,
                name2: prenom,
                phone: phone,
                userId1: user?.userId,
                lieuRencontre: lieuRencontre,
                dateRencontre: dateSelected,
                voeux1: voeux,
                nftImage: imgUrl,
                code: 123 * user!.id
            },
                { onConflict: 'userId1' })
            .select();
        console.log(error);

        if (error) {
            console.log(error);
        }
    };

    const deleteDemande = async () => {
        const { error } = await supabase
            .from('nft')
            .delete()
            .eq('userId1', user?.userId);

        if (error) {
            console.log(error);
        }

        Alert.alert("Demande supprimée", "Ta demande a été supprimée avec succès 🥳", [
            {
                text: 'Ok'
                // onPress: () => router.navigate('/(auth)/(tabs)'),
            },
        ]);
        setLoading(false);
    }

    const sendMessage = async () => {
        const isAvailable = await SMS.isAvailableAsync();

        if (isAvailable) {
            await SMS.sendSMSAsync(
                data.phone,
                `Bonjour ${data.name2}, clique sur le lien ci dessous, une surprise t'y attends... \n\n https://apps.apple.com/fr/app/the-kut/id1601107524 `,
                {
                    // attachments: {
                    //   uri: 'path/myfile.png',
                    //   mimeType: 'image/png',
                    //   filename: 'myfile.png',
                    // },
                }
            );
        } else {
            // misfortune... there's no SMS available on this device
        }
    }

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
            {!data ?
                (<View style={styles.formContainer}>
                    <View style={styles.containerTop}>
                        <TouchableOpacity
                            onPress={() => router.navigate('/(auth)/(tabs)')} >
                            <Ionicons name="close" size={35} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Mon Union Digital</Text>
                    </View>
                    <View style={styles.containerLocationInput}>
                        <View style={{ flexDirection: "row", width: "90%", alignItems: "center" }}>
                            {/* <View>
                            <Text style={styles.inputTitle}>Prénom du Partenaire</Text>
                        </View> */}
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="person-outline" size={18} color={prenom === '' ? "#8b9fb3" : "#5e60ce"} />
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
                                <Ionicons name="call-outline" size={18} color={phone === '' ? "#8b9fb3" : "#5e60ce"} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Téléphone partenaire"
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
                                <Ionicons name={lieuRencontre === null ? "location-outline" : "location"} size={21} color={lieuRencontre === null ? "#8b9fb3" : "#5e60ce"} />

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
                                        color: "#5e60ce"
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
                                />
                            </View>
                        </View>
                    </View>
                    <ScrollView style={styles.bottomForm} contentContainerStyle={{ flexGrow: 1 }} automaticallyAdjustKeyboardInsets scrollEnabled={true} showsVerticalScrollIndicator={false}>
                        <View style={styles.containerNewDemande}>
                            <View style={{ display: showNext ? "none" : "flex" }}>
                                <View style={styles.inputContainer}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <Ionicons name={dateSelected === undefined ? "calendar-outline" : "calendar"} size={21} color={dateSelected === undefined ? "#8b9fb3" : "#5e60ce"} />
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
                                        <Entypo name="new-message" size={21} color={voeux === '' ? "#8b9fb3" : "#5e60ce"} />
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
                            <Ionicons name={image === null ? "image-outline" : "image"} size={21} color={image === null ? "#8b9fb3" : "#5e60ce"} />
                            <View style={{ alignItems: "center" }}>
                                <Text style={styles.imageTitle}>Photo qui représente ta demande</Text>
                                {/* <Text style={styles.imageSubTitle}>Tu pourras la modifier si vous n'êtes pas d'accord</Text> */}
                            </View>
                        </View>
                        {image && <TouchableOpacity onPress={pickImage}>
                            <Image source={{ uri: image }} style={styles.avatar} />
                            <View style={styles.editButtonContainer}>
                                <Ionicons name="add-circle-outline" size={40} color="#5e60ce" />
                            </View>
                        </TouchableOpacity>}
                        {!image &&
                            <TouchableOpacity onPress={pickImage}>
                                <View style={styles.avatar}>
                                    <FontAwesome5 name="images" size={50} color="#c5c5c5" />
                                </View>
                                <View style={styles.editButtonContainer}>
                                    <Ionicons name="add-circle-outline" size={40} color="#5e60ce" />
                                </View>
                            </TouchableOpacity>}
                    </ScrollView>
                    <TouchableOpacity style={voeux !== ""
                        && prenom !== ""
                        && phone !== ""
                        && dateSelected !== undefined
                        && lieuRencontre !== null ? styles.button : styles.buttonDisable}
                        disabled={voeux === ""
                            && prenom !== ""
                            && phone !== ""
                            && dateSelected === undefined
                            && lieuRencontre === null
                        }
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
                        <Text style={voeux !== ""
                            && prenom !== ""
                            && phone !== ""
                            && dateSelected !== undefined
                            && lieuRencontre !== null ? styles.buttonText : styles.buttonTextDisabled}>
                            Valider mon engagement
                        </Text>
                    </TouchableOpacity>
                </View>
                ) :
                <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 }}>
                    <View style={styles.containerTop}>
                        <TouchableOpacity
                            onPress={() => router.navigate('/(auth)/(tabs)')} >
                            <Ionicons name="close" size={35} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Mon Union Digital</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={{ color: "#e0e0e0", fontSize: 14, marginVertical: "5%", alignSelf: "center" }}>Voici ce que verra {data.name2} après avoir créé son compte sur Jode</Text>
                        <View style={{ backgroundColor: "#151515", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 25, alignItems: "center" }}>
                            <Text style={styles.textHistoire}>{` Votre histoire a débuté le ${moment(data.dateRencontre).format("LL")}, à ${data.lieuRencontre.ville}`}</Text>
                            {imgUrl && <Image source={{ uri: imgUrl }} style={styles.avatar} />}
                            {!imgUrl && <View style={styles.avatar} />}
                            <Text style={styles.textHistoire}>"{data.voeux1}"</Text>
                            <Text style={styles.demandeText}>Acceptes-tu de t'unir digitalement avec {data.name1} ?</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: "100%", marginVertical: 30 }}>
                                <TouchableOpacity style={styles.buttonSecond}
                                    disabled={true}
                                    onPress={() => console.log("ok")} >
                                    <Text style={styles.buttonTextSecond}>Oui</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonSecond}
                                    disabled={true}
                                    onPress={() => console.log("ok")} >
                                    <Text style={styles.buttonTextSecond}>Non</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.explication}>En cas de réponse positive, vous formaliserez et publierez, ensemble, votre engagement sur la blockchain</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonSendSms}
                            onPress={() => sendMessage()} >
                            <Text style={styles.buttonText}>Envoyer ma demande à Josia par sms</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                            <Text style={styles.textHistoire}>Code: {data.code}</Text>
                            <Text style={styles.textHistoire}>Le {moment(data.created_at).format("LL")}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonUpdate}
                            onPress={() => {
                                Alert.alert("Attention", "Es-tu sure de vouloir supprimer ta demande ?", [
                                    {
                                        text: 'Non, je veux garder ma demande',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Oui, je veux supprimer ma demande', onPress: () => {
                                            setLoading(true); deleteDemande(); setData(null)
                                        }
                                    }])
                            }} >
                            <Text style={styles.buttonTextUpdate}>Supprimer ma demande</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            }
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    bottomForm: {
        width: "100%",
        marginTop: 0,
    },
    containerTop: {
        width: "90%",
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerNewDemande: {
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    questionButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        gap: 20
    },
    buttonDate: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#5e60ce",
    },
    avatar: {
        marginTop: 20,
        width: "70%",
        height: 150,
        backgroundColor: "#202020",
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
        fontSize: 17,
        textAlign: 'center',
        marginTop: 25,
        color: "#fff"
    },
    textHistoire: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 25,
        color: "#c3c3c3"
    },
    explication: {
        fontSize: 13,
        textAlign: 'center',
        color: "#a8a8a8"
    },
    button: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignSelf: 'center',
        borderRadius: 50,
        minWidth: 130,
        alignItems: 'center',
        backgroundColor: '#5e60ce',
        padding: 12,
    },
    buttonSendSms: {
        marginTop: 30,
        alignSelf: 'center',
        borderRadius: 50,
        minWidth: 130,
        alignItems: 'center',
        backgroundColor: '#5e60ce',
        paddingVertical: 12,
        paddingHorizontal: 20
    },
    buttonUpdate: {
        // backgroundColor: '#b2004d',
        // borderWidth: 1,
        // borderColor: "#e0e0e0",
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 10,
        minWidth: 130,
        alignItems: 'center',
        padding: 12,
    },
    buttonTextUpdate: {
        fontSize: 15,
        textAlign: 'center',
        color: '#5e60ce',
        textDecorationLine: 'underline'
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
        color: '#000'
    },
    buttonTextDisabled: {
        fontSize: 15,
        textAlign: 'center',
        color: '#373737'
    },
    formContainer: {
        height: "100%",
        alignSelf: 'center',
        alignItems: 'center',

    },
    inputTitle: {
        color: "#fff",
        fontSize: 15,
        marginLeft: 10,
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
        marginBottom: 10
    },
    inputContainer: {
        marginTop: 30,

    },
    input: {
        padding: 12,
        backgroundColor: '#202020',
        borderRadius: 50,
        marginHorizontal: 10,
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
        backgroundColor: '#202020',
        minHeight: 100,
        minWidth: 300,
        paddingVertical: 15,
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
        backgroundColor: '#202020',
        borderRadius: 50,
        minWidth: '97%',
        marginHorizontal: 10,
        color: "#000",
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
    buttonSecond: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignSelf: 'center',
        borderRadius: 50,
        width: 130,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        padding: 12,
    },
    buttonTextSecond: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff'
    },
});