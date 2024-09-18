import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import MapView from 'react-native-maps';
import CommunicationController from './CommunicationController';
import { Marker, Circle } from 'react-native-maps';
import MarcatoreOggetto from './MarcatoreOggetto'
import MarcatoreUtente from './MarcatoreUtente'
import Scanner from './Scanner';
import PermissionRequester from './PermissionRequester';
import MappaVM from './MappaVM';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageManager from './StorageManager';
import ClassificaVM from './ClassificaVM';
import ElementoClassifica from './ElementoClassifica';






class Classifica extends React.Component {
    state = {
        ranking: [],
        counter: 1,
    }

    async componentDidMount() {
        ranking = await ClassificaVM.richiestaClassifica();
        this.setState({ ranking });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contenitoreHeader}>
                    <TouchableOpacity onPress={this.props.cambioPaginaMappa} style={styles.pulsante}>
                        <Image source={require('../assets/tornaback.png')} style={{ width: 60, height: 60 }} />
                    </TouchableOpacity>
                    <Text style={styles.titolo}>Classifica</Text>
                </View>
                <FlatList
                    style={styles.flatList}
                    data={this.state.ranking}
                    renderItem={({ item, index }) => (
                        <ElementoClassifica data={item} counter={this.state.counter + index} oggettoCliccato={() => { this.props.cambioPaginaUtente() }} />
                    )}
                    keyExtractor={(item) => item.uid.toString()}
                    onEndReached={() => this.setState((prevState) => ({ counter: prevState.counter++ }))}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cccccc',
        padding: 25,

    },
    contenitoreHeader: {
        flexDirection: 'row', // Disponi gli elementi in fila
        justifyContent: 'flex-start', // Centra il titolo
        alignItems: 'center', // Centra gli elementi verticalmente
        height: 100, // Aumentato l'altezza della barra del titolo
        paddingHorizontal: 0, // Padding orizzontale
        paddingTop: 40, // Aggiungi un padding superiore per abbassare il titolo


    },
    titolo: {
        fontSize: 40,
        fontWeight: 'bold',
        paddingLeft: 40,
    },
    headerText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 43,
    },
    flatList: {
        width: '100%',
        marginTop: 11,
    },

    chiusura: {
        marginTop: 20,
    },
});

export default Classifica;
