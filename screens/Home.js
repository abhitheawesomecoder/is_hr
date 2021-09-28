import React, { Component } from 'react'
import { Button, TouchableOpacityBase } from 'react-native'
import { View, Text } from '../components/Themed'
import { AppRegistry, TextInput } from 'react-native';
import { StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Video } from 'expo-av'
import { validate } from '@babel/types';
import { color } from 'react-native-reanimated';
import { useState } from 'react'

import {
    useFonts,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black,
    Montserrat_900Black_Italic,
} from '@expo-google-fonts/montserrat';

const Login = ({ navigation }) => {

    let [fontsLoaded] = useFonts({
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_700Bold_Italic,
        Montserrat_800ExtraBold,
        Montserrat_800ExtraBold_Italic,
        Montserrat_900Black,
        Montserrat_900Black_Italic,
    });

    var username = "", password = "";

    const [values, setValues] = useState({
        showMessage: 0,
    })

    const { showMessage } = values;

    const [text, setText] = useState('');
    const [Pass, setPass] = useState('');

    const validateLogin = () => {

        if (text == "Admin" && Pass == "Admin")
            navigation.navigate("camera");
        else {
            setValues({ ...values, showMessage: 1 })

            setTimeout(() => {
                setValues({ ...values, showMessage: 0 })
            }, 3000);
        }
    };

    if (!fontsLoaded)
        return (
            <View style={styles.container}><Image style={styles.img} source={require('./logo.png')} /></View>
        )
    else {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={require('./logo.png')} />

                <TextInput
                    style={{ height: 40, width: 250, backgroundColor: 'azure', fontSize: 20, marginBottom: 20, fontFamily: 'Montserrat_600SemiBold' }}
                    placeholder="Username"
                    onChangeText={text => setText(text)}
                    defaultValue={text}
                />

                <TextInput
                    style={{ height: 40, width: 250, backgroundColor: 'azure', fontSize: 20, marginBottom: 20, fontFamily: 'Montserrat_600SemiBold' }}
                    placeholder="Password"
                    onChangeText={text => setPass(text)}
                    defaultValue={Pass}
                />

                <TouchableOpacity style={styles.button} onPress={() => validateLogin()}>
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>

                {
                    showMessage ?
                        <>
                            <Text style={{ color: 'red' }}>
                                Wrong Username or Password.
                            </Text>
                        </>
                        :
                        <>
                            <Text style={{ color: 'red' }}></Text>
                        </>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: "#0092f3",
        marginBottom: 10,
        color: "#fff",
        borderRadius: 10,
        width: 150,
    },
    text: {
        color: "#fff",
        fontSize: 25,
        textAlign: 'center',
        fontFamily: 'Montserrat_800ExtraBold',
    },
    img: {
        height: 150,
        width: 250,
    },
})

export default Login