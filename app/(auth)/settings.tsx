import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { router } from 'expo-router';

const settings = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <Text>settings</Text>
            <Button
                title="Go to Home"
                onPress={() => {
                    router.back();
                    navigation.dispatch(DrawerActions.openDrawer());
                }}
            />
        </SafeAreaView>
    );
};

export default settings;