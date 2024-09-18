import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView from 'react-native-maps';
import {Marker, Circle} from 'react-native-maps';

class ProfiloUtente extends React.Component {

    state = {
        dettagli: {},
        picture: null,
    }

    async componentDidMount() {
        const dettagliOgg = await AsyncStorage.getItem('dettagliUtente');
        const dettagli = await JSON.parse(dettagliOgg);
        const picture = await dettagli.picture ? `data:image/jpeg;base64,${dettagli.picture}` : null;
        this.setState({ dettagli, picture });
    }

    renderImmagineMappa() {
        if (this.state.dettagli.positionshare == false) {
        return (
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image}/>
                <View style={styles.header}>
                <Text style={styles.text}>Condivisone della posizione non attiva</Text>
                </View>
            </View>
        )}else{
            return(
                <View style={styles.imageContainer}>
                    <View style={styles.immagineCont}>
                        <Image source={imageSource} style={styles.image} />
                    </View>
                    <View style={styles.mappaCont}>
                        
                        <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: this.state.dettagli.lat,
                                    longitude: this.state.dettagli.lon,
                                    latitudeDelta: 0.0045,
                                    longitudeDelta: 0.0045,
                                }}
                        >
                            <Marker
                                coordinate={{ latitude: this.state.dettagli.lat, longitude: this.state.dettagli.lon }}
                                title={this.state.dettagli.name}
                                description="" 
                                image={/*imageSource*/require('../assets/marker_user.png')}
                            />
                        </MapView>

                    </View>
                </View>
            )
        }
    }

    render() {
        
        if(this.state.dettagli.uid != undefined) {
            
            if(this.state.dettagli.picture == null) {
                imageSource = require('../assets/playeruser.png') 
            }else{
                imageSource = { uri: this.state.picture }
            }

            return (

                <View style={styles.container}>
                <View style={styles.contenitoreHeader}>
                <TouchableOpacity onPress={this.props.cambioPaginaClassifica} style={styles.classificaButton} >
                        <Image source={require('../assets/tornaback.png')} style={{ width: 60, height: 60 }} />
                    </TouchableOpacity>
                    <Text style={styles.name}>{this.state.dettagli.name}</Text>
                </View>

                {this.renderImmagineMappa()}


                <View style={styles.infoContainer}>
                    <View style={styles.infoLife}>
                    <Image source={require('../assets/xp_icon.png')} style={{ width: 100, height: 56 }} />
                        <Text>{this.state.dettagli.experience} PUNTI</Text>
                    </View>
                    <View style={styles.infoExperience}>
                    <Image source={require('../assets/life_points_icon.png')} style={{ width: 60, height: 56 }} />
                        <Text>{this.state.dettagli.life} HP</Text>
                        
                    </View>
                </View>
                
                </View>

            )

        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    contenitoreHeader: {
        flexDirection: 'row', // Disponi gli elementi in fila
        justifyContent: 'flex-start', // Centra il titolo
        alignItems: 'center', // Centra gli elementi verticalmente
        height: 100, // Aumentato l'altezza della barra del titolo
        paddingHorizontal: 0, // Padding orizzontale
        paddingTop: 40, // Aggiungi un padding superiore per abbassare il titolo

    },

    text: {
        fontSize:20,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 40,
        fontWeight: 'bold',
        paddingLeft: 30,
    },
    imageContainer: {
        flex: 3.5,
        marginTop: 30,
        alignItems: 'center',
       
    },
    immagineCont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mappaCont: {
        flex: 1,
        marginTop: 192,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: "50%",
        aspectRatio: 1,
        borderRadius: 100,
    },
    map: {
        width: "98%",
        aspectRatio: 1.3
       
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 120,
    },
    classificaButton: {
        marginTop: 16,
        marginBottom: 16,
    },
    buttonIcon: {
        width: 50,
        height: 50,
    },
    
});

export default ProfiloUtente;
8