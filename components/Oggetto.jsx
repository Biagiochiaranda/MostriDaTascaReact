import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import OggettoVM from './OggettoVM';
import StorageManager from './StorageManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';

class Oggetto extends React.Component {

    state = {
        latitudine: null,
        longitudine: null,
        picture: null,
        amuleto: null,
        datiPlayer: null,
    }

    async componentDidMount() {
        latitudine = await AsyncStorage.getItem("lat")
        longitudine = await AsyncStorage.getItem("lon")
        //datiPlayer = await AsyncStorage.getItem("datiPlayer")
        amuletoJSON = await AsyncStorage.getItem("amuleto")
        amuleto = JSON.parse(amuletoJSON)

        this.setState({ latitudine: latitudine, longitudine: longitudine, picture: this.props.data[0].image, datiPlayer: this.props.data[1], amuleto: amuleto })
    }

    renderImmagine(source) {

        lat1 = this.state.latitudine
        lon1 = this.state.longitudine
        distanza = getDistance(
            { latitude: this.state.latitudine/*45.47607364728559*/, longitude: this.state.longitudine/*9.231890920245869*/ },
            { latitude: this.props.data[0].lat, longitude: this.props.data[0].lon }
        );

        if (distanza > 100 + this.props.data[0].level) {
            return (
                <View style={styles.imageContainer}>
                    <Image source={source} style={styles.image} />
                </View>
            )
        } else {
            return (
                <View style={styles.imageContainerVicino}>
                    <Image source={source} style={styles.image} />
                </View>
            )
        }


    }

    controlloEquipaggiamento(tipo) {

        switch (tipo) {
            case "weapon":
                if (this.state.datiPlayer.weapon == this.props.data[0].id) {
                    return true
                }
                return false
            case "armor":
                if (this.state.datiPlayer.armor == this.props.data[0].id) {
                    return true
                }
                return false
            case "amulet":
                if (this.state.datiPlayer.amulet == this.props.data[0].id) {
                    return true
                }
                return false
            default:
                return false
        }
    }

    render() {
        let imageSource;

        if (this.state.latitudine != null && this.state.longitudine != null) {

            if (!this.controlloEquipaggiamento(this.props.data[2])) {



                if (this.props.data[0].image == null) {
                    switch (this.props.data[0].type) {
                        case "weapon":
                            imageSource = require('../assets/weapon.png')
                            break;
                        case "armor":
                            imageSource = require('../assets/armor.png')
                            break;
                        case "amulet":
                            imageSource = require('../assets/amulet.png')
                            break;
                        case "monster":
                            imageSource = require('../assets/monster.png')
                            break;
                        case "candy":
                            imageSource = require('../assets/candy.png')
                            break;
                    }
                } else {
                    imageSource = { uri: this.state.picture }
                }


                return (
                    <TouchableOpacity onPress={() => this.props.puntaOggetto(this.props.data[0].lat, this.props.data[0].lon)}>
                        <View style={styles.card}>
                            <View style={styles.contentContainer}>

                                {this.renderImmagine(imageSource)}

                                <View style={styles.textContainer}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.props.data[0].name}</Text>
                                    <Text style={{ fontSize: 15 }}>{this.props.data[0].type}</Text>
                                    <Text style={{ fontSize: 15 }}>Livello: {this.props.data[0].level}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }

        }
    }

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: '5%',
        width: '90%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    contentContainer: {
        flexDirection: 'row',
    },
    imageContainer: {
        flex: 0.5,
        /*width: 100,
        height: 100,*/
        marginRight: 20,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: "red"
    },
    imageContainerVicino: {
        flex: 0.5,
        width: 100,
        height: 100,
        marginRight: 20,
        borderWidth: 5,
        borderColor: 'blue',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
    textContainer: {
        flex: 1,
    },
});
export default Oggetto;