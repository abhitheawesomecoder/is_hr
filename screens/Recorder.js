import React, { useEffect, useRef } from 'react'
import { View, Text } from '../components/Themed'
import { useState } from 'react'
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Modal, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native'
import { FlashMode } from 'expo-camera/build/Camera.types'
import * as FileSystem from 'expo-file-system';

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

import { ActivityIndicator } from 'react-native'
// const YOUR_SERVER_URL = "http://192.168.1.27/EXPO/iswitch-hr-server/public/";
const YOUR_SERVER_URL = "https://iswitchhr.portmap.io/api/media_upload";

const Recorder = ({ navigation }) => {

    let [fontsLoaded] = useFonts({
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_700Bold_Italic,
        Montserrat_800ExtraBold,
        Montserrat_800ExtraBold_Italic,
        Montserrat_900Black,
        Montserrat_900Black_Italic,
    });

    const camera = useRef(null);

    const [values, setValues] = useState({
        hasPermission: [],
        cameraType: Camera.Constants.Type.back,
        isFlashLightOn: Camera.Constants.FlashMode.off,
        videoStatus: 0,
        ShowLoader: 0,
        ShowPopup: 0,
        ShowModal: false,
        excess_size: 0,
    })

    const { hasPermission, cameraType, isFlashLightOn, videoStatus, ShowLoader, ShowPopup, ShowModal, excess_size } = values;

    useEffect(() => {
        getPermission();
    }, []);

    const Loading = () => {
        setTimeout(() => {
            setValues({ ...values, ShowLoader: 0 })
        }, 5000)
    }

    const LongVID = () => {
        console.log({ShowModal});

        setTimeout(() => {
            setValues({ ...values, ShowModal: false });
        }, 3000)
        
    }


    const __saveMedia = async (uri) => {

        let localUri = uri;
        let filename = localUri.split('/').pop();



        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;



        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        formData.append('media', { uri: localUri, name: filename, type });
        // formData.append('orderno', number);
        // formData.append('orderemail', email);
        //startUploading(true);
        const response = await fetch(YOUR_SERVER_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
        //startUploading(false);
        const responseAgain = await response.text();
        console.log(responseAgain);
        setValues({ ...values, ShowLoader: 0 });
        setValues({ ...values, ShowPopup: 1 });
        return response;

    }

    const videoRecord = async () => {

        if (!videoStatus && camera.current) {

            setValues({ ...values, videoStatus: 1, isFlashLightOn: isFlashLightOn ? Camera.Constants.FlashMode.torch : 0 });

            await camera.current.recordAsync({
                maxDuration: 60,
                VideoPlaybackQuality: 0.5,
            }).then((data) => {
                console.log(data);

                FileSystem.getInfoAsync(data.uri, {size : true})
                .then((result)=>{
                    console.log(result.size);

                    if(result.size > 90000000)
                    {
                        setValues({ ...values, excess_size: result.size/1000000, ShowModal: true ,videoStatus: 0, isFlashLightOn: Camera.Constants.FlashMode.off });
                        LongVID();
                        return;
                    }
                    else
                    {                       
                        setValues({ ...values, ShowLoader: 1 });     

                        __saveMedia(data.uri);
                    }

                }).catch((err) => console.log(err));

            }).catch((err) => console.log(err));
        }
        else {
            try {
                await camera.current.stopRecording();
                setValues({ ...values, videoStatus: 0, isFlashLightOn: Camera.Constants.FlashMode.off });
            } catch (err) {
                console.log(err);
            }

        }
    };

    const getPermission = async () => {
        try {
            const { status } = await Camera.requestPermissionsAsync();
            const AudioStatus = await Audio.requestPermissionsAsync();
            setValues({ ...values, hasPermission: [status, AudioStatus.status] });
        }
        catch (err) {
            console.log(err)
        }
    }

    if (hasPermission.length === 0) {
        return <View />
    }

    if (!hasPermission.every((element) => element == "granted")) {
        return <View><Text>Please Allow All Permission</Text></View>
    }

    if (!fontsLoaded)
        return (
            <View style={styles.container}><Image style={styles.img} source={require('./logo.png')} /></View>
        )
    else {
        return (
            <View style={styles.container}>

                {ShowModal ?
                    <>              
                        <Modal transparent={true} >
                            <View style={{backgroundColor:"000000aa", flex: 1}}>
                                <View style={{backgroundColor:"#ffffff", margin:50, marginBottom: 170, marginTop: 160, padding:30, borderRadius:20, flex:1}}>
                                    <Text style={{fontSize: 30}}>Interview video file size should be less than 40 mb, current size is {excess_size} mb.</Text>
                                </View>
                            </View>
                        </Modal>
                        
                    </>
                    :
                    <></>
                }
                

                {ShowLoader ?
                    <><ActivityIndicator style={styles.load} size="large" color="#ff0000" /><Text style={styles.loadtxt}>Saving Your Interview</Text></>
                    :
                    <>
                        {
                            ShowPopup ?
                                <>
                                    <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                                        <View style={{ width: "100%", flex: 1 }}><Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 40, margin: 15, marginTop: 100, fontFamily: 'Montserrat_600SemiBold' }}>Your interview was saved successfully</Text></View>
                                    </View>
                                </>
                                :
                                <>

                                    <Camera style={styles.camera} ref={camera}
                                        flashMode={isFlashLightOn}
                                        type={cameraType} >

                                        <View style={styles.icons}>

                                            <TouchableOpacity style={styles.icon} onPress={() => videoRecord()}>
                                                {videoStatus ?
                                                    <><Text style={{ fontSize: 25, color: '#000000', marginTop: 5, fontFamily: 'Montserrat_800ExtraBold_Italic' }}>Stop Interview</Text></>
                                                    :
                                                    <><Text style={{ fontSize: 25, color: '#000000', marginTop: 5, fontFamily: 'Montserrat_800ExtraBold_Italic' }}>Start Interview</Text></>
                                                }
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.icon}

                                                onPress={() => {
                                                    if (!videoStatus) {
                                                        setValues({ ...values, cameraType: cameraType ? Camera.Constants.Type.back : Camera.Constants.Type.front })
                                                    }
                                                }} >
                                                <MaterialCommunityIcons name={cameraType ? "camera-rear" : "camera-front"} color="black" size={50} />
                                            </TouchableOpacity>
                                        </View>

                                    </Camera>
                                </>
                        }
                    </>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1
    },
    icons: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-around',
        width: "100%",
        padding: 5,
        backgroundColor: "#00bfff",
    },
    load: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    loadtxt: {
        textAlign: 'center',
        backgroundColor: '#ffffff',
        fontSize: 30,
        marginBottom: 50,
        marginLeft: 30,
        marginRight: 30,
        fontFamily: 'Montserrat_600SemiBold',
    },
    img: {
        height: 300,
        width: 500,
    },
    icon: {},
})

export default Recorder