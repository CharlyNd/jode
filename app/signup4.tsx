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


const Signup = () => {
    const local = useLocalSearchParams();

    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState(local.name);
    const [prenom, setPrenom] = useState(local.prenom);
    const [email, setEmail] = useState<string | undefined>(Array.isArray(local.email) ? local.email[0] : local.email);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(local.birth);
    const [genre, setGenre] = useState(local.genre);

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
            .insert({ name: name, email: email, prenom: prenom, birthday: date, userId: User?.id, phone: User?.phone, avatarUrl: url, situation: 'libre', showStatut: false, genre: genre });

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
            router.replace('/(auth)/');
        })
    };

    return (
        <Animated.View entering={FadeIn.duration(1500)} style={styles.container}>
            <ImageBackground source={require("../assets/images/background1.png")} resizeMode="cover" style={styles.image}>
                <View style={styles.step}>
                    <TrafficLightBar light1={true} light2={true} light3={true} light4={true} />
                </View>
                <TypeAnimation
                    sequence={[
                        { text: "Ajoute une photo de profil 📷 " },
                    ]}
                    style={{
                        alignSelf: 'center',
                        position: 'absolute',
                        top: 100,
                        color: '#000',
                        fontSize: 22,
                        fontFamily: 'SpaceMono-Regular',
                        width: '90%',
                        textAlign: 'center',
                    }}
                    blinkSpeed={800}
                    typeSpeed={50}
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
                                <Ionicons name="add-circle" size={70} color="#FFF" />
                            </View>
                        </TouchableOpacity>}
                        {!image &&
                            <TouchableOpacity onPress={pickImage}>
                                <View style={styles.avatar}>
                                    <Image source={require("../assets/images/user.png")} style={styles.avatarStyle} />
                                </View>
                                <View style={styles.editButtonContainer}>
                                    <Ionicons name="add-circle" size={70} color="#FFF" />
                                </View>
                            </TouchableOpacity>}
                    </View>
                </Animated.View>
                <TouchableOpacity onPress={validateImage} style={image !== null ? styles.button : styles.buttonDisabled} disabled={image === null}>
                    <Text style={{ color: '#fff', fontWeight: "bold" }}>Créer mon compte</Text>
                </TouchableOpacity>
            </ImageBackground>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
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
        width: 200,
        height: 200,
        alignSelf: 'center',
        borderRadius: 100,
        justifyContent: "center",
        backgroundColor: '#2F215F',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.58,
        shadowRadius: 5.00,
        zIndex: 0,
    },
    editButtonContainer: {
        marginTop: -50,
        alignSelf: 'center',
    },
    avatarStyle: {
        width: 120,
        height: 120,
        alignSelf: "center",
    },
    editButtonStyle: {
        width: 50,
        height: 50,
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
        backgroundColor: '#2F215F',
        padding: 12,
        borderRadius: 25,
    },
    buttonDisabled: {
        alignSelf: 'center',
        width: '80%',
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
        backgroundColor: '#a1a1a1',
        padding: 12,
        borderRadius: 25,
    },
});

export default Signup;