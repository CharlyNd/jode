
import { View, TouchableOpacity, StyleSheet, Image, Text, Switch, ImageBackground } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Link, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CustomDrawerContent(props: any) {
    const navigation = useNavigation();

    const [image, setImage] = useState<string | null>(null);
    const [celib, setCelib] = useState(true);
    const [libre, setLibre] = useState(false);
    const [couple, setCouple] = useState(false)
    const [hideStatus, setHideStatus] = useState(true);

    useEffect(() => {
        loadUserAvatar();
    }, []);

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

    return (
        <View style={styles.container}>
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
                    <View style={styles.optionSettingsRow}>
                        <Text style={hideStatus ? styles.statusTextInactive : styles.statusTextActive}>Visible</Text>
                        <Switch
                            trackColor={{ false: '#cacaca', true: '#2F215F' }}
                            thumbColor={hideStatus ? '#e1e1e1' : '#e1e1e1'}
                            ios_backgroundColor={hideStatus ? '#2F215F' : '#cacaca'}
                            onValueChange={() => setHideStatus(previousState => !previousState)}
                            value={hideStatus}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                        <Text style={hideStatus ? styles.statusTextActive : styles.statusTextInactive}>Masqué</Text>
                    </View>
                    <Text style={styles.containerTitle}>Recherchable par</Text>
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
                </View>
                <View style={styles.statusContainer}>
                    <Text style={styles.containerTitle}>Mon statut</Text>
                    <View style={styles.optionSettingsRow}>
                        <Text style={styles.text}>Célibataire</Text>
                        <Switch
                            trackColor={{ false: '#cacaca', true: '#2F215F' }}
                            thumbColor={celib ? '#e1e1e1' : '#e1e1e1'}
                            ios_backgroundColor={celib ? '#2F215F' : '#cacaca'}
                            onValueChange={() => { setCelib(previousState => !previousState); setLibre(false); setCouple(false) }}
                            value={celib}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                    <View style={styles.optionSettingsRow}>
                        <Text style={styles.text}>Dans une relation libre</Text>
                        <Switch
                            trackColor={{ false: '#cacaca', true: '#2F215F' }}
                            thumbColor={libre ? '#e1e1e1' : '#858585'}
                            ios_backgroundColor={libre ? '#2F215F' : '#cacaca'}
                            onValueChange={() => { setLibre(previousState => !previousState); setCelib(false); setCouple(false) }}
                            value={libre}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                    <View style={styles.optionSettingsRow}>
                        <Text style={styles.text}>En couple</Text>
                        <Switch
                            trackColor={{ false: '#cacaca', true: '#2F215F' }}
                            thumbColor={couple ? '#858585' : '#858585'}
                            ios_backgroundColor={couple ? '#2F215F' : '#cacaca'}
                            onValueChange={() => { setCouple(previousState => !previousState); setLibre(false); setCelib(false) }}
                            value={couple}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
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

        elevation: 24,
    },
    containerTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#000',
        marginBottom: 15
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

        elevation: 24,
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
});


