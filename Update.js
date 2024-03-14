import React, { Component } from "react";
import {Text, View, ImageBackground, StyleSheet, SafeAreaView, StatusBar, Platform,
Alert, FlatList, TouchableOpacity, Linking, Image} from 'react-native';
import axios from "axios";

export default class UpdateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            reports: [],
            blogs: []
        };
    }

    componentDidMount() {
        this.getArticles()
    }

    getArticles = () => {
        axios
        .get("https://api.spaceflightnewsapi.net/v4/articles/")
        .then(response => {
            this.setState({ articles: response.data.results })
            this.getReports()
        })
        .catch(error => {
            Alert.alert(error.message)
        })
    }
    getReports = () => {
        axios
        .get("https://api.spaceflightnewsapi.net/v4/reports/")
        .then(response => {
            this.setState({ reports: response.data.results })
            this.getBlogs()
        })
        .catch(error => {
            Alert.alert(error.message)
        })
    }
    getBlogs = () => {
        axios
        .get("https://api.spaceflightnewsapi.net/v4/blogs/")
        .then(response => {
            this.setState({ blogs: response.data.results })
        })
        .catch(error => {
            Alert.alert(error.message)
        })
    }

    addFlag = (arr, value) => {
        for (let i = 0; i < arr.length; i++) {
            console.log(arr[i])
            arr[i].type = value
        }
        return arr
    }

    renderItem = ({ item }) => {
        let url;
        if(item.type == "Report") {
            url = require("../assets/iss_icon.png")
        } else {
            url = require("../assets/blog_icon.png")
        }
        if(item.type == "Article") {
            console.log(item.featured_image)
            return(
                <TouchableOpacity style={styles.listContainer}
                onPress={() => Linking.openURL(item.url).catch(err => console.error("No se puede cargar ls página", err))}
                >
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.iconContainer}>
                        <Image source={{ "uri": item.image_url }} style={{ width: "100%", height: 100 }}></Image>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity style={styles.listContainer}
                onPress={() => Linking.openURL(item.url).catch(err => console.error("No se puede cargar la página", err))}
                >
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.iconContainer}>
                        <Image source={url} style={{ width: 50, height: 50 }}></Image>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    keyExtractor = (item, index) => index.toString();

    render(){
        let articles = this.addFlag(this.state.articles, "Article")
        let reports = this.addFlag(this.state.reports, "Report")
        let blogs = this.addFlag(this.state.blogs, "Blog")
        let events = articles.concat(reports).concat(blogs)
        
        events = events.sort(function(a,b) {
            return new Date(b.published_date) - new Date(a.published_date);
        })

        if(events.length == 0) {
            return (
                <View
                style={{
                    flex:1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Text>CARGANDO</Text>
                </View>
            )
        } else {
        return(
            <View style={styles.container}>
                <SafeAreaView style={styles.droidSafeArea} />
                <ImageBackground source={require('../assets/bg_updates.jpg')} style={styles.backgroundImage}>
                    <View style={styles.titleBar}>
                        <Text style={styles.titleText}>Pantalla de Actualizaciones</Text>
                    </View>
                    <View style={styles.eventContainer}>
                            <FlatList
                            keyExtractor={this.keyExtractor}
                            data={events}
                            renderItem={this.renderItem}
                            horizontal={false}
                            />
                            </View>
                </ImageBackground>
            </View>
        )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover'
    },
    titleBar: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white'
    },
    listContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 10,
        padding: 10
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "white"
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    eventContainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 1,
        marginRight: 1,
        marginTop: 15,
        borderRadius: 10,
        padding: 10
    },
})
