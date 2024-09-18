import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import Oggetto from './Oggetto';
import CommunicationController from './CommunicationController';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Scanner extends React.Component {

  state = {
    datiPlayer: null,
  }

  async componentDidMount() {
    playerJSON = await AsyncStorage.getItem("datiPlayer")
    player = JSON.parse(playerJSON)

    this.setState({ datiPlayer: player })
  }


  render() {

    if (this.state.datiPlayer != null) {

      return (

        <View style={[styles.container, styles.scanner]}>
          

          <View style={styles.contenitoreHeader}>
            <TouchableOpacity onPress={this.props.closeScanner} style={styles.pulsante}>
              <Image source={require('../assets/tornaback.png')} style={{ width: 60, height: 60 }} />
            </TouchableOpacity>
            <Text style={styles.titolo}>Lista Oggetti</Text>
          </View>

          <View style={styles.contenitoreLista}>
            <FlatList style={styles.flatList}
              data={this.props.data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Oggetto puntaOggetto={(lat, lon) => this.props.puntaOggetto(lat, lon)} data={[item, this.state.datiPlayer, item.type]} />
              )}
            />
          </View>

        </View>
      );

    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cccccc',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
  contenitoreHeader: {
    flexDirection: 'row', // Disponi gli elementi in fila
    justifyContent: 'flex-start', // Centra il titolo
    alignItems: 'center', // Centra gli elementi verticalmente
    height: 100, // Aumentato l'altezza della barra del titolo
    paddingHorizontal: 20, // Padding orizzontale
    paddingTop: 30, // Aggiungi un padding superiore per abbassare il titolo
  },
  titolo: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 35,
  },
  contenitoreLista: {
    flex: 0.9,
  },
});

export default Scanner;