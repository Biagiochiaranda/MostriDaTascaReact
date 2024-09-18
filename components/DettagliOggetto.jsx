import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';
import CommunicationController from './CommunicationController';
import DettagliOggettoVM from './DettagliOggettoVM';

class DettagliOggetto extends React.Component {

    state = {
        amuleto: null,
        oggettoUtente: null,
        immagineOggettoToccato: null,
        immagineOggettoEquipaggiato: null,
        datiCaricati: false,
        latitudine: null,
        longitudine: null,
    }

    async componentDidMount() {

        lat = await AsyncStorage.getItem("lat")
        lon = await AsyncStorage.getItem("lon")

        oggettoUtente = await DettagliOggettoVM.getDettagliOggettoEquipaggiato(this.props.data[0].type)

        amuleto = await DettagliOggettoVM.getAmuleto()

        immagineOggettoToccato = DettagliOggettoVM.getImmagineOggettoToccato(this.props.data[0])

        immagineOggettoEquipaggiato = null
        if (oggettoUtente != null) {
            immagineOggettoEquipaggiato = DettagliOggettoVM.getImmagineOggettoEquipaggiato(oggettoUtente)
        }

        this.setState({ amuleto: amuleto, oggettoUtente: oggettoUtente, immagineOggettoToccato: immagineOggettoToccato, immagineOggettoEquipaggiato: immagineOggettoEquipaggiato, datiCaricati: true, latitudine: lat, longitudine: lon })
    }

    renderPulsanteEquipaggia() {
        if (this.state.amuleto == null) {
            distanza = 100
        } else {
            distanza = 100 + this.state.amuleto.level
        }



        if (getDistance({ latitude: this.props.data[0].lat, longitude: this.props.data[0].lon }, { latitude: this.state.latitudine/*45.47605430420977*/, longitude: this.state.longitudine/*9.231794617118883*/ }) > distanza) {
            return
        } else {
            return (
                <View style={styles.xContainer}>
                    <TouchableOpacity onPress={async () => {
                        res = await CommunicationController.postAttivazioneOggetto(this.props.data[0].id)
                        profilo = await CommunicationController.getMieiDettagli()
                        await AsyncStorage.setItem('datiPlayer', JSON.stringify(profilo))
                        this.props.oggettoEquipaggiato([this.props.data[0], profilo])
                    }} style={styles.equiCombatti}>
                        <Text style={styles.equiCombattiTesto}>Equipaggia</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    renderPulsanteAttacca(tipo) {

        if (tipo == "Mostro") {
            if (getDistance({ latitude: this.props.data[0].lat, longitude: this.props.data[0].lon }, { latitude: 45.47605430420977, longitude: 9.231794617118883 }) > 100 + amuleto.level) {
                return
            } else {
                return (
                    <View style={styles.xContainer}>
                        <TouchableOpacity onPress={async () => {
                            playerPreJSON = await AsyncStorage.getItem('datiPlayer')
                            playerPre = JSON.parse(playerPreJSON)
                            playerPost = await CommunicationController.postAttivazioneOggetto(this.props.data[0].id)
                            profilo = await CommunicationController.getMieiDettagli()
                            await AsyncStorage.setItem('datiPlayer', JSON.stringify(profilo))
                            this.props.mostroAttaccato(playerPre, playerPost)
                        }} style={styles.equiCombatti}>
                            <Text style={styles.equiCombattiTesto}>Combatti</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
    }
    //--------------------------------------------------------------

    getImageSourceVecchio() {
        let imageSource = null;
        if (this.state.immagineOggettoEquipaggiato == null) {
            switch (this.state.oggettoUtente[0].type) {
                case "weapon":
                    imageSource = require('../assets/weapon.png')
                    break;
                case "armor":
                    imageSource = require('../assets/armor.png')
                    break;
                case "amulet":
                    imageSource = require('../assets/amulet.png')
                    break;
            }
        } else {
            imageSource = { uri: this.state.immagineOggettoEquipaggiato }
        }
        return imageSource
    }

    renderEquipaggiamentoVecchio() {
        if (this.state.oggettoUtente != null) {
            imageSource = this.getImageSourceVecchio()
            return (
                <View style={styles.contenitorePrimo}>
                    <View style={styles.contenitoreHeader}>
                    <TouchableOpacity onPress={() => this.props.closeOggetto()}>
                            <Image source={require('../assets/tornaback.png')} style={styles.xImage} />
                        </TouchableOpacity>
                        <Text style={styles.titolo}>Oggetto</Text>
                    </View>
                    

                    <View style={styles.titleContainer}>
                        <Text>EQUIPAGGIAMENTO CORRENTE</Text>
                    </View>

                    <View style={styles.textContainer}>
                        <Text>{this.state.oggettoUtente[0].name}</Text>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image source={imageSource} style={{ width: 180, height: 180, aspectRatio: 1, backgroundColor: '#c3c9d6' }} />
                    </View>

                    <View style={styles.levelContainer}>
                        <Text>Livello {this.state.oggettoUtente[0].level}</Text>
                    </View>

                        
                </View>
            )
        } else {
            return ( ////////////////////////
                <View style={styles.contenitorePrimo}>
                    <View style={styles.contenitoreHeader}>
                    <TouchableOpacity onPress={() => this.props.closeOggetto()}>
                            <Image source={require('../assets/tornaback.png')} style={styles.xImage} />
                        </TouchableOpacity>
                        <Text style={styles.titolo}>Oggetto</Text>
                        </View>
                    <View style={styles.contenitoreOggettoNonPosseduto}>
                        <Text>NON POSSIEDI ANCORA QUESTO TIPO DI EQUIPAGGIAMENTO</Text>
                    </View>
                </View>
            )
        }
    }

    //--------------------------------------------------------------

    getImageSourceNuovo() {
        let imageSource = null;
        if (this.state.immagineOggettoToccato == null) {
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
            }
        } else {
            imageSource = { uri: this.state.immagineOggettoToccato }
        }
        return imageSource
    }

    renderEquipaggiamentoNuovo() {
        imageSourceNuovo = this.getImageSourceNuovo()
        return (
            <View style={styles.contenitorePrimo}>
                <View style={styles.titleContainer}>
                    <Text>EQUIPAGGIAMENTO NUOVO</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text>{this.props.data[0].name}</Text>
                </View>
                <View style={styles.imageContainer}>
                <Image source={imageSourceNuovo} style={{ width: 200, height: 200, aspectRatio: 1, backgroundColor: '#c3c9d6' }} />
                </View>

                <View style={styles.levelContainer}>
                    <Text>Livello {this.props.data[0].level}</Text>
                </View>

                {this.renderPulsanteEquipaggia()}

            </View>
        )
    }

    //--------------------------------------------------------------
    getImageSourceMostro() {
        let imageSource = null;
        if (this.state.immagineOggettoToccato == null) {
            imageSource = require('../assets/monster.png')
        } else {
            imageSource = { uri: this.state.immagineOggettoToccato }
        }
        return imageSource
    }

    renderMostro() {
        imageSource = this.getImageSourceMostro()
        return (
            <View style={styles.contenitoreSecondo}>

                <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => this.props.closeOggetto()}>
                        <Image source={require('../assets/tornaback.png')} style={styles.xImage} />
                    </TouchableOpacity>
                    <Text style={styles.titolo}>Mostro</Text>
                </View>
                <Text style={styles.titolo1}>{this.props.data[0].name}</Text>

                <View style={styles.monsterCandyContainer}>
                    <Image source={imageSource} style={{ width: 200, height: 200, aspectRatio: 1, backgroundColor: '#c3c9d6' }} />
                </View>

            </View>
        )
    }

    renderCombattimento() {
        return (
            <View style={styles.contenitoreSecondo}>

                <View style={styles.levelContainerMostroCandy}>
                    <Text style={styles.titolo1}>Livello {this.props.data[0].level}</Text>
                </View>

                {this.renderPulsanteAttacca("Mostro")}

            </View>
        )
    }
    //--------------------------------------------------------------
    getImageSourceCaramella() {
        let imageSource = null;
        if (this.state.immagineOggettoToccato == null) {
            imageSource = require('../assets/candy.png')
        } else {
            imageSource = { uri: this.state.immagineOggettoToccato }
        }
        return imageSource
    }

    renderCaramella() {
        imageSource = this.getImageSourceCaramella()
        return (
            <View style={styles.contenitoreSecondo}>

                <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => this.props.closeOggetto()}>
                        <Image source={require('../assets/tornaback.png')} style={styles.xImage} />
                    </TouchableOpacity>
                    <Text style={styles.titolo}>Oggetto</Text>
                </View>
                <Text style={styles.titolo1}>{this.props.data[0].name}</Text>

                <View style={styles.monsterCandyContainer}>
                    <Image source={imageSource} style={{ width: 200, height: 200, aspectRatio: 1, backgroundColor:'#c3c9d6'}} />
                </View>

            </View>
        )
    }

    renderMangia() {
        return (
            <View style={styles.contenitoreSecondo}>

                <View style={styles.levelContainerMostroCandy}>
                    <Text style={styles.titolo1}>Livello {this.props.data[0].level}</Text>
                </View>

                {this.renderPulsanteEquipaggia()}

            </View>
        )
    }
    //--------------------------------------------------------------

    render() {

        if (this.state.datiCaricati) {
            switch (this.props.data[0].type) {
                case "weapon":
                case "armor":
                case "amulet":
                    return (
                        <View style={[styles.container, styles.scanner]}>
                            {this.renderEquipaggiamentoVecchio()}
                            {this.renderEquipaggiamentoNuovo()}
                        </View>
                    );

                case "monster":
                    return (
                        <View style={[styles.container, styles.scanner]}>
                            {this.renderMostro()}
                            {this.renderCombattimento()}
                        </View>
                    );
                case "candy":
                    return (
                        <View style={[styles.container, styles.scanner]}>
                            {this.renderCaramella()}
                            {this.renderMangia()}
                        </View>
                    );
            }
        }

    }

}
styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cccccc',
        justifyContent: 'center', // Centra il contenuto verticalmente e orizzontalmente
        alignItems: 'center',
    },
    scanner: {
        ...StyleSheet.absoluteFillObject,
    },

    contenitoreOggettoNonPosseduto: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    contenitorePrimo: {
        flex: 1,
        backgroundColor: '#cccccc',
        alignItems: 'center',
        justifyContent: 'center',
         
    },
    contenitoreHeader: {
        flexDirection: 'row', // Disponi gli elementi in fila
        justifyContent: 'flex-start', // Centra il titolo
        alignItems: 'center', // Centra gli elementi verticalmente
        height: 100, // Aumentato l'altezza della barra del titolo
        paddingHorizontal: 20, // Padding orizzontale
        paddingTop: 30, // Aggiungi un padding superiore per abbassare il titolo
        marginRight: 150,
    },

    titleContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    textContainer: {
        flex: 0.3,
    },
    headerContainer: {
        flexDirection: 'row', // Disponi gli elementi in fila
        justifyContent: 'flex-start', // Centra il titolo
        alignItems: 'center', // Centra gli elementi verticalmente
        height: 100, // Aumentato l'altezza della barra del titolo
        paddingHorizontal: 20, // Padding orizzontale
        paddingTop: 30, // Aggiungi un padding superiore per abbassare il titolo
        marginRight: 130,
    },
    monsterCandyContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        marginBottom: 140,
        height:300,
        width:300,
        aspectRatio: 1,
        backgroundColor: '#c3c9d6',
    },
    levelContainerMostroCandy: {
        flex: 0.8,
        justifyContent: 'center',
    },
    levelContainer: {
        flex: 0.6,
        justifyContent: 'center',
    },

    titolo: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingLeft: 60,

    },
    titolo1: {
        fontSize: 30,
        paddingBottom:70,
    },

    xImage: {
        width: 70,
        height: 70,
    },

    contenitoreSecondo: {
        flex: 0.5,
        backgroundColor: '#cccccc',
        alignItems: 'center',
        flexDirection: 'column',
    },
    equiCombatti: {
        backgroundColor: 'green', // Colore di sfondo verde, puoi cambiarlo a tuo piacimento
        padding: 30, // Padding del pulsante
        borderRadius: 40, // Angoli arrotondati
        alignItems: 'center', // Allinea il testo al centro
        justifyContent: 'center', // Allinea il testo al centro
    },
    equiCombattiTesto: {
        color: 'white', // Colore del testo bianco, puoi cambiarlo a tuo piacimento
        fontSize: 16, // Dimensione del testo
    }


});
export default DettagliOggetto;