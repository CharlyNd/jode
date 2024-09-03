
import { View, TouchableOpacity, StyleSheet, Image, Text, SafeAreaView, Switch } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Link, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CustomDrawerContent(props: any) {
    const navigation = useNavigation();

    const [image, setImage] = useState<string | null>(null);
    const [isEnabled, setIsEnabled] = useState(true);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
                // console.log(data);
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


    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                        <Ionicons name="chevron-forward-sharp" size={40} color="#bbbbbb" />
                    {/* <Ionicons name="arrow-forward" size={40} color="#bbbbbb" /> */}
                </TouchableOpacity>
            </View>
            <View style={styles.settingsContainer}>
                <Text style={styles.containerTitle}>Activer la recherche par</Text>
                <View style={styles.optionSettingsRow}>
                    <Text>Nom et Prénom</Text>
                    <Switch
                        trackColor={{ false: '#bbbbbb', true: '#2F215F' }}
                        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor={isEnabled ? '#2F215F' : '#bbbbbb'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                </View>
                <View style={styles.optionSettingsRow}>
                    <Text>Téléphone</Text>
                    <Switch
                        trackColor={{ false: '#bbbbbb', true: '#2F215F' }}
                        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor={isEnabled ? '#2F215F' : '#bbbbbb'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                </View>
                <View style={styles.optionSettingsRow}>
                    <Text>Email</Text>
                    <Switch
                        trackColor={{ false: '#bbbbbb', true: '#2F215F' }}
                        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor={isEnabled ? '#2F215F' : '#bbbbbb'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                </View>
            </View>
            <View style={styles.statusContainer}>
                <Text style={styles.containerTitle}>Mon statut</Text>
                <View style={styles.optionSettingsRow}>
                    <Text style={isEnabled ? styles.statusTextInactive : styles.statusTextActive}>Disponible</Text>
                    <Switch
                        trackColor={{ false: '#bbbbbb', true: '#2F215F' }}
                        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor={isEnabled ? '#2F215F' : '#bbbbbb'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text style={isEnabled ? styles.statusTextActive : styles.statusTextInactive}>En relation</Text>
                </View>
                <View style={styles.optionSettingsRow}>
                    <Text style={isEnabled ? styles.statusTextInactive : styles.statusTextActive}>Profil masqué</Text>
                    <Switch
                        trackColor={{ false: '#bbbbbb', true: '#2F215F' }}
                        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor={isEnabled ? '#2F215F' : '#bbbbbb'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text style={isEnabled ? styles.statusTextActive : styles.statusTextInactive}>Profil visible</Text>
                </View>
            </View>

            <DrawerContentScrollView {...props} scrollEnabled={false}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View>
                <TouchableOpacity style={styles.button}
                    onPress={() => console.log("logout")} >
                    <Text style={styles.buttonText}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

}


const styles = StyleSheet.create({
    avatar: {
        width: 150,
        height: 150,
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
        justifyContent: "center",
        alignItems: 'center',
    },
    backContainer: {
        width: '90%',
        borderRadius: 20,
        justifyContent: "center",
        alignItems: 'flex-end',
        marginVertical: 20,
    },
    statusTextActive: {
        // borderWidth: 2,
        padding: 5,
        borderRadius: 10,
        borderColor: '#2F215F',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2F215F'
    },
    statusTextInactive: {
        fontSize: 15,
        textAlign: 'center',
        color: '#7d7b7b'
    },
    statusContainer: {
        width: '90%',
        backgroundColor: '#efefefdf',
        borderRadius: 20,
        justifyContent: "center",
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
        marginVertical: 20,
    },
    containerTitle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000',
        marginBottom: 20
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
        backgroundColor: '#efefefdf',
        borderRadius: 20,
        justifyContent: "center",
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
    },
    button: {
        alignSelf: 'center',
        borderRadius: 10,
        // width: '90%',
        marginVertical: 15,
        alignItems: 'center',
        // backgroundColor: '#2F215F',
        padding: 12,
      },
      buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#2F215F'
      },
});


