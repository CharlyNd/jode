import { View, Image, Text, Button, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { router } from 'expo-router';

const Signup = () => {
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

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
            .insert({ name: name, userId: User?.id, phone: User?.phone, avatarUrl: url })

        const { data } = await supabase.auth.updateUser(
            { email: email }
        )
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
            const filePath = `${User?.id}/avatar.png`;
            const contentType = 'image/png';
            await supabase.storage.from('avatars').upload(filePath, decode(base64), { contentType });
        }

        getAvatarUrl(User!.id).then((result) => {
            createUser(result);
        }).then(() => {
            setLoading(false);
            router.replace('/(auth)/');
        })
    };

    return (
        <View style={styles.container}>
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
                    <Text style={{ color: '#fff', fontSize: 20 }}>Loading...</Text>
                </View>
            )}

            {image && <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: image }} style={styles.avatar} />
                <View style={styles.editButtonContainer}>
                    <Image source={require("../assets/images/edit.png")} style={styles.editButtonStyle} />
                </View>
            </TouchableOpacity>}
            {!image &&
                <TouchableOpacity onPress={pickImage}>
                    <View style={styles.avatar}>
                        <Image source={require("../assets/images/user.png")} style={styles.avatarStyle} />
                    </View>
                    <View style={styles.editButtonContainer}>
                        <Image source={require("../assets/images/edit.png")} style={styles.editButtonStyle} />
                    </View>
                </TouchableOpacity>}
            <View style={styles.infoContainer}>
                <TextInput
                    autoCapitalize="none"
                    placeholder="Prénom"
                    placeholderTextColor={"#808080"}
                    value={name}
                    onChangeText={setName}
                    style={styles.inputField}
                />
                <TextInput
                    autoCapitalize="none"
                    placeholder="Email"
                    placeholderTextColor={"#808080"}
                    value={email}
                    onChangeText={setEmail}
                    style={styles.inputField}
                />
            </View>
            <TouchableOpacity onPress={validateImage} style={styles.button}>
                <Text style={{ color: '#fff' }}>Valider</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 200,
        height: 200,
        backgroundColor: '#ccc',
        alignSelf: 'center',
        borderRadius: 100,
        justifyContent: "center"
    },
    editButtonContainer: {
        marginTop: -30,
        alignSelf: 'center',
    },
    avatarStyle: {
        width: 120,
        height: 120,
        alignSelf: "center",
    },
    editButtonStyle: {
        width: 70,
        height: 70,
        alignSelf: "center",
    },
    infoContainer: {
        marginTop: 30
    },
    container: {
        flex: 1,
        paddingTop: 200,
        paddingHorizontal: 40,
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        margin: 50,
        color: '#fff',
    },
    inputField: {
        marginVertical: 15,
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#2b825b',
        borderRadius: 4,
        padding: 10,
        color: '#000',
    },
    button: {
        marginVertical: 30,
        alignItems: 'center',
        backgroundColor: '#2b825b',
        padding: 12,
        borderRadius: 4,
    },
});

export default Signup;