import axios from "axios";
import React, { Component } from "react";
import {Text, View, StyleSheet, ImageBackground, StatusBar, SafeAreaView, Platform, Image} from 'react-native';
import MapView, { Marker } from "react-native-maps";

export default class IssLocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {},
        };
    }

    componentDidMount() {
        this.getIssLocation()
        try {
            setInterval(async () => {
                this.getIssLocation()
            }, 5000);
        } catch (e) {
            console.log(e);
        }
    }

    getIssLocation = () => {
        axios
        .get("https://api.wheretheiss.at/v1/satellites/25544")
        .then(response => {
            this.setState({ location: response.data })
        })
        .catch(error => {
            Alert.alert(error.message)
        })
    }

    render(){
        if(Object.keys(this.state.location).length ===0) {
            return (
                <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Text>Cargando</Text>
                </View>
            )
        } else {
            return(
                <View style={styles.container}>
                    <SafeAreaView styles={styles.droidSafeArea}/>
                    <ImageBackground source={require('../assets/iss_bg.jpg')} style={styles.backGroundImage}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>¡Pantalla Localización EEI!</Text>
                        </View>
                        <View style={styles.mapContainer}>
                            <MapView style={styles.map}
                                region={{
                                    latitude: this.state.location.latitude,
                                    longitude: this.state.location.longitude,
                                    latitudeDelta: 100,
                                    longitudeDelta: 100
                                }}
                            >
                                <Marker
                                coordinate={{ latitude: this.state.location.latitude, longitude: this.state.location.longitude }}
                                >
                                    <Image source={require('../assets/iss_icon.png')} style={{height: 50, width: 50}} />
                                </Marker>
                            </MapView>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Latitud: {this.state.location.latitude}</Text>
                            <Text style={styles.infoText}>Longitud: {this.state.location.longitude}</Text>
                            <Text style={styles.infoText}>Altitud (KM): {this.state.location.altitude}</Text>
                            <Text style={styles.infoText}>Velocidad (KM/H): {this.state.location.velocity}</Text>
                        </View>
                    </ImageBackground>
                    
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight: 0
    },
    backGroundImage: {
        flex: 1,
        resizeMode: "cover"
    },
    titleContainer: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color:"white"
    },
    mapContainer: {
        flex: 0.6
    },
    map: {
        width: "100%",
        height: "100%"
    },
    infoContainer: {
        flex: 0.2,
        backgroundColor: "white",
        marginTop: -10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30
    },
    infoText: {
        fontSize: 15,
        color: "black",
        fontWeight: "bold"
    }
})
