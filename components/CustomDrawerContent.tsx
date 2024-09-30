
import { View, ScrollView, TouchableOpacity, StyleSheet, Image, Text, Switch, Platform, ImageBackground, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Link, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import TrafficLight from './TrafficLight';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import "moment/locale/fr";
import { TextInput } from 'react-native';

export default function CustomDrawerContent(props: any) {
    const navigation = useNavigation();

    const [image, setImage] = useState<string | null>(null);
    const [celib, setCelib] = useState(true);
    const [libre, setLibre] = useState(false);
    const [couple, setCouple] = useState(false)
    const [hideStatus, setHideStatus] = useState(true);
    const [date, setDate] = useState(new Date());
    const [dateSelected, setDateSelected] = useState('');
    const [dateFormatted, setDateFormated] = useState('');
    const [mode, setMode] = useState<'date' | 'datetime' | 'time'>('date');
    const [datePickerVisible, setDatePickerVisible] = useState(Platform.OS === "android" ? false : true);
    const [snapshat, setSnapshat] = useState('');
    const [oldInsta, setOldInsta] = useState('cend');
    const [oldSnap, setOldSnap] = useState('cend');
    const [instagram, setInstagram] = useState('');
    const [codeInsta, setCodeInsta] = useState('');
    const [codeSnap, setCodeSnap] = useState('');
    const [newCodeSnap, setNewCodeSnap] = useState('');
    const [newCodeInsta, setNewCodeInsta] = useState('');
    const [prenom, setPrenom] = useState('');
    const [instagramVisible, setInstagramVisible] = useState(false);
    const [snapshatVisible, setSnapshatVisible] = useState(false);
    const [snapVerified, setSnapVerified] = useState(true);
    const [instaVerified, setInstaVerified] = useState(false);

    useEffect(() => {
        loadUserAvatar();
        loadUser();
    }, []);


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
        let dateFormat = (moment(currentDate).format('dddd D MMMM YYYY'))
        setDateFormated(dateFormat);
    };

    const loadUser = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('userId', User?.id);

        if (data) {
            console.log(data[0].birthday);
            let test = new Date(data[0].birthday);
            console.log(test);

            setDate(test);
            setPrenom(data[0].prenomPartenaire);
            setInstagram(data[0].instagram);
            setSnapshat(data[0].snapchat);
            setInstaVerified(data[0].instaVerified);
            setSnapVerified(data[0].snapVerified);
            setHideStatus(data[0].showStatut);
            switch (data[0].situation) {
                case "celibataire":
                    setCelib(true);
                    break;
                case "libre":
                    setLibre(true);
                    setCelib(false);
                    setCouple(false);
                    break;
                case "couple":
                    setCouple(true);
                    setLibre(false);
                    setCelib(false);
                    break;

                default:
                    break;
            }
        }
    };

    const loadUserAvatar = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        supabase.storage
            .from('avatars')
            .download(`${User?.id}/avatar.png`)
            .then(({ data }) => {
                if (!data) return;
                const fr = new FileReader();
                fr.readAsDataURL(data!);
                fr.onload = () => {
                    setImage(fr.result as string);
                };
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const logUserOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log('Error logging out:', error.message);
        } else {
            console.log('Logged out successfully');
        }
    }

    const updateDate = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .update({
                birthday: dateSelected,
            })
            .eq('userId', User?.id);

        console.log(error);
    };

    const updatePartenaire = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .update({
                prenomPartenaire: prenom,
            })
            .eq('userId', User?.id);

        console.log(error);
        Alert.alert("Votre partenaire a bien été enregistré");
    };

    const updateInstagram = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .update({
                instagram: instagram,
            })
            .eq('userId', User?.id);

        console.log(error);
        Alert.alert("Ton Instagram a bien été enregistré");
    };

    const updateInstaVerified = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .update({
                instaVerified: true,
            })
            .eq('userId', User?.id);

        console.log(error);
        Alert.alert("Ton Insta a bien été vérifié 🥳");
    }

    const updateSnapVerified = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .update({
                snapVerified: true,
            })
            .eq('userId', User?.id);

        console.log(error);
        Alert.alert("Ton Snap a bien été vérifié 🥳");
    }

    const updateSnapshat = async () => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .update({
                snapchat: snapshat,
            })
            .eq('userId', User?.id);

        console.log(error);
        Alert.alert("Ton Snapchat a bien été enregistré");
    };

    const updateSituation = async (newSituation: string) => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .update({
                situation: newSituation,
            })
            .eq('userId', User?.id);

        console.log(error);
        Alert.alert("Ta Jode a bien été modifiée");
    };

    const updateVisible = async (newStatus: boolean) => {
        const {
            data: { user: User },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .update({
                showStatut: newStatus,
            })
            .eq('userId', User?.id);

        console.log(error);
        Alert.alert(newStatus ? "Ton profil est désormais masqué 🫣" : "Ton profil est désormais visible 🥳");
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }} automaticallyAdjustKeyboardInsets>
                <ImageBackground source={require("../assets/images/background1.png")} resizeMode="cover" style={styles.image}>
                    <View style={styles.imageSection}>
                        <Link href='/(tabs)/home' asChild>
                            <TouchableOpacity>
                                {image && <Image source={{ uri: image }} style={styles.avatar} />}
                                {!image && <View style={styles.avatar} />}
                            </TouchableOpacity>
                        </Link>
                    </View>
                    <View style={styles.backContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.dispatch(DrawerActions.closeDrawer())} >
                            <Ionicons name="chevron-forward-sharp" size={40} color="#cacaca" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.settingsContainer}>
                        <View style={styles.containerTitleVisibility}>
                            <View>
                                <Text style={styles.containerTitle}>Recherche et visibilité</Text>
                            </View>
                            <View style={{
                                backgroundColor: hideStatus ? "#3fb57e" : "#bb3838", borderRadius: 50, paddingHorizontal: 10, paddingVertical: 3
                            }}>
                                <Text style={{ color: hideStatus ? "#000" : "#FFF", fontSize: 12 }}>{hideStatus ? "activée" : "désactivée"}</Text>
                            </View>
                        </View>
                        <View style={styles.optionSettingsRow}>
                            <Text style={!hideStatus ? styles.statusTextInactive : styles.statusTextActive}>visible</Text>
                            <Switch
                                trackColor={{ false: '#cacaca', true: '#2F215F' }}
                                thumbColor={!hideStatus ? '#e1e1e1' : '#e1e1e1'}
                                ios_backgroundColor={!hideStatus ? '#2F215F' : '#cacaca'}
                                onValueChange={() => { setHideStatus(previousState => !previousState); updateVisible(hideStatus); }}
                                value={!hideStatus}
                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            />
                            <Text style={!hideStatus ? styles.statusTextActive : styles.statusTextInactive}>masqué</Text>
                        </View>
                        <View style={styles.optionSettingsRow}>
                            <Text style={styles.text}>Nom et Prénom</Text>
                            <Switch
                                trackColor={{ false: '#cacaca', true: '#2F215F' }}
                                thumbColor={hideStatus ? '#e1e1e1' : '#e1e1e1'}
                                ios_backgroundColor={hideStatus ? '#2F215F' : '#cacaca'}
                                onValueChange={() => setHideStatus(previousState => !previousState)}
                                value={hideStatus}
                                disabled
                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            />
                        </View>
                        <View style={styles.optionSettingsRow}>
                            <Text style={styles.text}>Téléphone</Text>
                            <Switch
                                trackColor={{ false: '#cacaca', true: '#2F215F' }}
                                thumbColor={hideStatus ? '#e1e1e1' : '#e1e1e1'}
                                ios_backgroundColor={hideStatus ? '#2F215F' : '#cacaca'}
                                onValueChange={() => setHideStatus(previousState => !previousState)}
                                disabled
                                value={hideStatus}
                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            />
                        </View>
                        <View style={styles.optionSettingsRow}>
                            <View style={styles.socialContainer}>
                                {oldInsta === "" && (<Text style={styles.text}>Instagram</Text>)}
                                <Ionicons name="logo-instagram" size={20} color="black" />
                                {oldInsta !== "" ?
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                        <Text style={{ color: '#2F215F', fontSize: 14 }}>@{oldInsta}</Text>
                                        <View style={{
                                            backgroundColor: instaVerified ? "#3fb57e" : "#bb3838", borderRadius: 50, paddingHorizontal: 10, paddingVertical: 3
                                        }}>
                                            <Text style={{ color: instaVerified ? "#000" : "#FFF", fontSize: 11 }}>{instaVerified ? "vérifié" : "non vérifié"}</Text>
                                        </View>
                                    </View> : null}

                            </View>
                            <TouchableOpacity onPress={() => { setInstagramVisible(!instagramVisible) }} style={!instagramVisible ? styles.buttonSocial : styles.buttonSocialActive}>
                                <Text style={{ color: !instagramVisible ? '#fff' : '#2F215F', fontSize: 12 }}>{oldInsta === "" ? (!instagramVisible ? "Ajouter" : "Fermer") : (!instaVerified ? "Vérifier" : "Modifier")}</Text>
                            </TouchableOpacity>
                        </View>

                        {instagramVisible && (
                            <View>
                                {(oldInsta !== "" && !instaVerified) && (
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 }}>
                                        <TextInput
                                            autoCapitalize="none"
                                            placeholder="code reçu"
                                            placeholderTextColor={"#808080"}
                                            value={newCodeInsta}
                                            onChangeText={setNewCodeInsta}
                                            style={styles.inputFieldSocial}
                                        />
                                        <TouchableOpacity onPress={() => { updateInstaVerified() }} style={newCodeInsta !== "" ? styles.buttonSocial : styles.buttonSocialDisabled}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>  Vérifier le code</Text>
                                        </TouchableOpacity>
                                    </View>)}
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 20 }}>
                                    <Text style={styles.text}>@</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder={oldInsta !== "" ? oldInsta : "ton_insta"}
                                        placeholderTextColor={"#808080"}
                                        value={instagram}
                                        onChangeText={setInstagram}
                                        style={styles.inputFieldSocial}
                                    />
                                    <TouchableOpacity onPress={() => { updateInstagram() }} style={instagram !== "" ? styles.buttonSocial : styles.buttonSocialDisabled}>
                                        <Text style={{ color: '#fff', fontSize: 12 }}>modifier</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <View style={styles.optionSettingsRow}>
                            <View style={styles.socialContainer}>
                                {oldSnap === "" && (<Text style={styles.text}>Snapshat</Text>)}
                                <MaterialIcons name="snapchat" size={20} color="black" />
                                {oldSnap !== "" ?
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                        <Text style={{ color: '#2F215F', fontSize: 14 }}>@{oldSnap}</Text>
                                        <View style={{
                                            backgroundColor: snapVerified ? "#3fb57e" : "#bb3838", borderRadius: 50, paddingHorizontal: 10, paddingVertical: 3
                                        }}>
                                            <Text style={{ color: snapVerified ? "#000" : "#FFF", fontSize: 11 }}>{snapVerified ? "vérifié" : "non vérifié"}</Text>
                                        </View>
                                    </View> : null}

                            </View>
                            <TouchableOpacity onPress={() => { setSnapshatVisible(!snapshatVisible) }} style={!snapshatVisible ? styles.buttonSocial : styles.buttonSocialActive}>
                                <Text style={{ color: !snapshatVisible ? '#fff' : '#2F215F', fontSize: 12 }}>{oldSnap === "" ? (!snapshatVisible ? "Ajouter" : "Fermer") : (!snapVerified ? "Vérifier" : "Modifier")}</Text>
                            </TouchableOpacity>
                        </View>

                        {snapshatVisible && (
                            <View>
                                {(oldSnap !== "" && !snapVerified) && (
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 }}>
                                        <TextInput
                                            autoCapitalize="none"
                                            placeholder="code reçu"
                                            placeholderTextColor={"#808080"}
                                            value={codeSnap}
                                            onChangeText={setCodeSnap}
                                            style={styles.inputFieldSocial}
                                        />
                                        <TouchableOpacity onPress={() => { updateSnapVerified() }} style={codeSnap !== "" ? styles.buttonSocial : styles.buttonSocialDisabled}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>  Vérifier le code</Text>
                                        </TouchableOpacity>
                                    </View>)}
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 20 }}>
                                    <Text style={styles.text}>@</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder={oldSnap !== "" ? oldSnap : "ton_snap"}
                                        placeholderTextColor={"#808080"}
                                        value={snapshat}
                                        onChangeText={setSnapshat}
                                        style={styles.inputFieldSocial}
                                    />
                                    <TouchableOpacity onPress={() => { updateSnapshat() }} style={snapshat !== "" ? styles.buttonSocial : styles.buttonSocialDisabled}>
                                        <Text style={{ color: '#fff', fontSize: 12 }}>modifier</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}


                        {/* {snapshatVisible && (
                            <View>
                                {snapshat !== "" && (
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 }}>
                                        <TextInput
                                            autoCapitalize="none"
                                            placeholder="code reçu"
                                            placeholderTextColor={"#808080"}
                                            value={code}
                                            onChangeText={setCode}
                                            style={code !== "" ? styles.inputFieldSocial : styles.inputFieldSocialError}
                                        />
                                        <TouchableOpacity onPress={() => { updateSnapVerified() }} style={code !== "" ? styles.buttonSocial : styles.buttonSocialDisabled}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>  Vérifier le code</Text>
                                        </TouchableOpacity>
                                    </View>)}
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 20 }}>
                                    <Text style={styles.text}>@</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder={snapshat !== "" ? snapshat : "ton_snap"}
                                        placeholderTextColor={"#808080"}
                                        value={snapshat}
                                        onChangeText={setSnapshat}
                                        style={snapshat !== "" ? styles.inputFieldSocial : styles.inputFieldSocialError}
                                    />
                                    <TouchableOpacity onPress={() => { updateSnapshat() }} style={snapshat !== "" ? styles.buttonSocial : styles.buttonSocialDisabled}>
                                        <Text style={{ color: '#fff', fontSize: 12 }}>modifier</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )} */}

                    </View>
                    <View style={styles.statusContainer}>
                        <Text style={styles.containerTitle}>Ma situation</Text>
                        <View style={styles.statusSection}>
                            <View>
                                <View style={styles.optionSettingsRow}>
                                    <Text style={styles.text}>En couple</Text>
                                    <Switch
                                        trackColor={{ false: '#cacaca', true: '#2F215F' }}
                                        thumbColor={couple ? '#e1e1e1' : '#e1e1e1'}
                                        ios_backgroundColor={couple ? '#2F215F' : '#cacaca'}
                                        disabled={couple}
                                        onValueChange={() => { setCouple(previousState => !previousState); setLibre(false); setCelib(false); }}
                                        value={couple}
                                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    />
                                </View>
                                <View style={styles.optionSettingsRow}>
                                    <Text style={styles.text}>Relation libre</Text>
                                    <Switch
                                        trackColor={{ false: '#cacaca', true: '#2F215F' }}
                                        thumbColor={libre ? '#e1e1e1' : '#e1e1e1'}
                                        ios_backgroundColor={libre ? '#2F215F' : '#cacaca'}
                                        disabled={libre}
                                        onValueChange={() => { setLibre(previousState => !previousState); setCelib(false); setCouple(false); updateSituation("libre") }}
                                        value={libre}
                                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    />
                                </View>
                                <View style={styles.optionSettingsRow}>
                                    <Text style={styles.text}>Célibataire</Text>
                                    <Switch
                                        trackColor={{ false: '#cacaca', true: '#2F215F' }}
                                        thumbColor={celib ? '#e1e1e1' : '#e1e1e1'}
                                        ios_backgroundColor={celib ? '#2F215F' : '#cacaca'}
                                        disabled={celib}
                                        onValueChange={() => { setCelib(previousState => !previousState); setLibre(false); setCouple(false); updateSituation("celibataire") }}
                                        value={celib}
                                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    />
                                </View>

                            </View>
                            <View>
                                <TrafficLight color={celib ? "celibataire" : libre ? "libre" : couple ? "couple" : "celibataire"} />
                            </View>
                        </View>
                        {couple && (
                            <View style={styles.containerDate}>
                                <View style={{ maxWidth: "50%" }}>
                                    <Text style={styles.text}>Jour de votre rencontre</Text>
                                </View>
                                <View style={styles.dateContainer}>
                                    {Platform.OS === 'android' && (
                                        <TouchableOpacity onPress={showDatePicker} style={styles.buttonDate}>
                                            <Text style={{ fontSize: 15, fontFamily: "SpaceMono-Regular", color: "#fff" }}>
                                                {dateFormatted !== "" ? dateFormatted : 'Choisir la date'}
                                            </Text>
                                        </TouchableOpacity>)}
                                    {datePickerVisible && (<DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        onChange={onChange}
                                        locale='fr'
                                        textColor='#fff'
                                    // style={{ backgroundColor: dateSelected === '' ? '' : '#54b8b3' }}
                                    />)
                                    }
                                </View>
                            </View>
                        )}
                        {couple && dateSelected !== '' ? (
                            <View style={{ width: "100%" }}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholder={prenom !== "" ? prenom : "Son prénom"}
                                    placeholderTextColor={"#808080"}
                                    value={prenom}
                                    onChangeText={setPrenom}
                                    style={prenom !== "" ? styles.inputField : styles.inputFieldError}
                                />
                                <TouchableOpacity onPress={() => { updateDate(); updatePartenaire(); updateSituation("couple"); }} style={styles.buttonUpdateDate}>
                                    <Text style={{ color: '#fff', fontSize: 16 }}>Enregistrer</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null
                        }
                    </View>
                    <DrawerContentScrollView {...props} scrollEnabled={false}>
                        <DrawerItemList {...props} />
                    </DrawerContentScrollView>
                    <View>
                        <TouchableOpacity style={styles.button}
                            onPress={() => logUserOut()} >
                            <Text style={styles.buttonText}>Déconnexion</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </ScrollView>
        </View>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonDate: {
        alignItems: 'center',
        backgroundColor: '#2F215F',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 5,
    },
    buttonUpdateDate: {
        alignItems: 'center',
        backgroundColor: '#2F215F',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonSocial: {
        alignItems: 'center',
        backgroundColor: '#2F215F',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 5,
    },
    buttonSocialActive: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2F215F',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 5,
    },
    buttonSocialDisabled: {
        alignItems: 'center',
        backgroundColor: '#a1a1a1',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 5,
    },
    containerTitleVisibility: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 15
    },
    avatar: {
        width: 125,
        height: 125,
        backgroundColor: '#ccc',
        alignSelf: 'center',
        borderRadius: 100,
    },
    statusSection: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        alignItems: 'center',
        maxHeight: 170
    },
    containerDate: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    imageSection: {
        marginTop: 50,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: 'center',
    },
    backContainer: {
        position: 'absolute',
        width: '95%',
        borderRadius: 20,
        justifyContent: "center",
        alignItems: 'flex-end',
        top: 100,
    },
    statusTextActive: {
        padding: 5,
        borderRadius: 10,
        borderColor: '#2F215F',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
    },
    statusTextInactive: {
        fontSize: 15,
        textAlign: 'center',
        color: '#8d8d8d'
    },
    text: {
        fontSize: 15,
        textAlign: 'center',
        color: '#000'
    },
    statusContainer: {
        width: '90%',
        borderRadius: 20,
        justifyContent: "center",
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
    },
    socialContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    containerTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#000',
        // marginBottom: 15
    },
    optionSettingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginBottom: 10
    },
    settingsContainer: {
        width: '90%',
        borderRadius: 20,
        justifyContent: "center",
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
    },
    button: {
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 15,
        alignItems: 'center',
        padding: 12,
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#2F215F'
    },
    inputField: {
        marginTop: 15,
        width: '100%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#000',
        borderWidth: 1,
        borderColor: '#54b8b3',
        zIndex: 0,
    },
    inputFieldSocial: {
        minWidth: '40%',
        // height: 30,
        borderRadius: 15,
        fontSize: 16,
        padding: 10,
        color: '#000',
        borderWidth: 1,
        borderColor: '#54b8b3',
        zIndex: 0,
    },
    inputFieldSocialError: {
        minWidth: '40%',
        height: 30,
        borderRadius: 10,
        fontSize: 16,
        padding: 10,
        color: '#000',
        borderWidth: 1,
        borderColor: '#b2004d',
        zIndex: 0,
    },
    inputFieldError: {
        marginTop: 15,
        width: '100%',
        height: 50,
        borderRadius: 15,
        fontSize: 18,
        padding: 10,
        color: '#000',
        borderWidth: 1,
        borderColor: '#b2004d',
        zIndex: 0,
    },
});


