// Importazione dei moduli e componenti necessari da React Native, Expo e altri file
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import MapView from 'react-native-maps'; // Utilizzato per visualizzare la mappa
import { Marker, Circle } from 'react-native-maps'; // Componenti per marcatori e cerchi sulla mappa
import MarcatoreOggetto from './MarcatoreOggetto'; // Componente personalizzato per marcatori di oggetti
import MarcatoreUtente from './MarcatoreUtente'; // Componente personalizzato per marcatori di utenti
import Scanner from './Scanner'; // Componente per la funzionalità di scansione
import PermissionRequester from './PermissionRequester'; // Potenzialmente un helper per gestire le richieste di permessi
import MappaVM from './MappaVM'; // Gestore della logica di business per la mappa
import AsyncStorage from '@react-native-async-storage/async-storage'; // Utilizzato per il salvataggio locale
import StorageManager from './StorageManager'; // Gestore dello storage per operazioni su database
import DettagliOggetto from './DettagliOggetto'; // Componente per visualizzare dettagli di un oggetto
import * as Location from 'expo-location'; // Modulo per la gestione della localizzazione

// Creazione di un'istanza del StorageManager per utilizzare nelle operazioni di database
let sm = new StorageManager()

// Definizione della classe Mappa che estende React.Component
class Mappa extends React.Component {
  state = {
    oggettiMappa: [], // Array degli oggetti da visualizzare sulla mappa
    utentiMappa: [], // Array degli utenti da visualizzare sulla mappa
    latitudine: null, // Latitudine corrente
    longitudine: null, // Longitudine corrente
    region: {
      latitude: 45.47927862101172, // Latitudine iniziale, da aggiornare
      longitude: 9.21417605311493, // Longitudine iniziale, da aggiornare
      latitudeDelta: 0.01, // Dimensione iniziale dell'area visibile della mappa
      longitudeDelta: 0.01,
    },
    scannerOpen: false, // Stato per gestire la visibilità del componente Scanner
    oggettoOpen: false, // Stato per gestire la visibilità dei dettagli dell'oggetto
    imagesLoaded: false, // Gestione dello stato di caricamento delle immagini
    locationAccettata: null, // Stato per la gestione dell'accettazione dei permessi di localizzazione
  }

  // Metodo eseguito dopo che il componente è montato
  async componentDidMount() {
    let locationAccettata = false;
    const grantedPermission = await Location.getForegroundPermissionsAsync();
    if (grantedPermission.status !== "granted") {
      const permissionResponse = await Location.requestForegroundPermissionsAsync();
      if (permissionResponse.status === "granted") {
        locationAccettata = true;
      }
    } else {
      locationAccettata = true;
    }

    if (locationAccettata) {
      const location = await Location.getCurrentPositionAsync();
      this.setState({
        region: {
          ...this.state.region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      });

      const oggettiUtenti = await MappaVM.richiestaOggettiUtentiVicini();
      const selezionaDettagliOggetti = await sm.selezionaDettagliOggetti();

      // Aggiornamento del database locale con i dettagli degli oggetti
      if (selezionaDettagliOggetti.length === 0 || selezionaDettagliOggetti.length > oggettiUtenti[0].length) {
        await sm.dropTabellaDettagliOggetto();
        await sm.creaTabellaDettagliOggetto();
        MappaVM.aggiuntaDatabaseOggetti(oggettiUtenti[0]);
      } else if (selezionaDettagliOggetti.length < oggettiUtenti[0].length) {
        MappaVM.aggiornamentoDatabaseOggetti(oggettiUtenti[0]);
      }

      const selezionaDettagliUtenti = await StorageManager.selezionaDettagliUtenti();
      if (selezionaDettagliUtenti.length === 0 || selezionaDettagliUtenti.length > oggettiUtenti[1].length) {
        await sm.dropTabellaDettagliUtente();
        await sm.creaTabellaDettagliUtente();
        MappaVM.aggiuntaDatabaseUtenti(oggettiUtenti[1]);
      } else if (selezionaDettagliUtenti.length < oggettiUtenti[1].length) {
        MappaVM.aggiornamentoDatabaseUtenti(oggettiUtenti[1]);
      }

      const amuleto = await MappaVM.getAmuleto();

      await AsyncStorage.setItem("lat", location.coords.latitude.toString());
      await AsyncStorage.setItem("lon", location.coords.longitude.toString());
      let datiPlayer = await AsyncStorage.getItem('datiPlayer');
      if (datiPlayer) {
        datiPlayer = JSON.parse(datiPlayer);
      }

      this.richiestaPosizione();
      console.log("Latitudine:", location.coords.latitude, "Longitudine:", location.coords.longitude);

      this.setState({
        oggettiMappa: oggettiUtenti[0],
        utentiMappa: oggettiUtenti[1],
        latitudine: location.coords.latitude,
        longitudine: location.coords.longitude,
        dettagliOggetto: selezionaDettagliOggetti,
        amuleto: amuleto,
        datiPlayer: datiPlayer,
        locationAccettata: true
      });
    } else {
      this.setState({ locationAccettata: false });
    }
  }

  // Metodo per aumentare lo zoom sulla mappa
  zoomIn = () => {
    this.setState(prevState => ({
      region: {
        ...prevState.region,
        latitudeDelta: prevState.region.latitudeDelta / 2,
        longitudeDelta: prevState.region.longitudeDelta / 2,
      }
    }));
  }

  // Metodo per ridurre lo zoom sulla mappa
  zoomOut = () => {
    this.setState(prevState => ({
      region: {
        ...prevState.region,
        latitudeDelta: prevState.region.latitudeDelta * 2,
        longitudeDelta: prevState.region.longitudeDelta * 2,
      }
    }));
  }

  // Metodo per trovare i dettagli di un oggetto specifico tramite ID
  trovaDettagliOggetto = (id) => {
    for (let i = 0; i < this.state.dettagliOggetto.length; i++) {
      if (this.state.dettagliOggetto[i].id === id) {
        return this.state.dettagliOggetto[i];
      }
    }
  }

  // Metodo per renderizzare i marcatori degli oggetti sulla mappa
  renderOggetti() {
    return this.state.oggettiMappa.map((oggetto) => (
      <MarcatoreOggetto
        key={oggetto.id}
        data={[oggetto, this.state.datiPlayer]}
        visualizzaDettagliOggetto={(id) => {
          const dettagli = this.trovaDettagliOggetto(id);
          this.setState({ oggettoAperto: dettagli, oggettoOpen: true });
        }}
      />
    ));
  }

  // Metodo per renderizzare i marcatori degli utenti sulla mappa
  renderUtenti() {
    return this.state.utentiMappa.map((utente) => (
      <MarcatoreUtente key={utente.uid} data={utente} />
    ));
  }

  // Metodo per attivare la visualizzazione del componente Scanner
  renderScanner() {
    this.setState({ scannerOpen: true });
  }

  // Metodo per chiudere il componente Scanner
  closeScanner = () => {
    this.setState({ scannerOpen: false });
  };

  // Metodo per renderizzare un cerchio sulla mappa intorno alla posizione dell'utente
  renderCerchio() {
    if (this.state.amuleto) {
      return (
        <Circle
          center={{ latitude: this.state.latitudine, longitude: this.state.longitudine }}
          radius={100 + this.state.amuleto.level}
          fillColor="transparent"
          strokeColor="purple"
          strokeWidth={4}
        />
      );
    } else {
      return (
        <Circle
          center={{ latitude: this.state.latitudine, longitude: this.state.longitudine }}
          radius={100}
          fillColor="transparent"
          strokeColor="purple"
          strokeWidth={4}
        />
      );
    }
  }

  // Metodo per monitorare continuamente la posizione dell'utente
  richiestaPosizione() {
    Location.watchPositionAsync(
      {
        timeInterval: 60000,
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 10,
      },
      (location) => {
        this.setState({ latitudine: location.coords.latitude, longitudine: location.coords.longitude });
      }
    );
  }

  // Metodo per richiedere i permessi di localizzazione, se necessario
  async richiestaPermessi() {
    const grantedPermission = await Location.getForegroundPermissionsAsync();
    if (grantedPermission.status === "denied") {
      const permissionResponse = await Location.requestForegroundPermissionsAsync();
      if (permissionResponse.status === "granted") {
        this.setState({ locationAccettata: true });
      }
    } else {
      this.setState({ locationAccettata: true });
    }
  }

  // Metodo render principale per visualizzare la componente
  render() {
    if (this.state.locationAccettata !== null) {
      if (this.state.locationAccettata) {
        if (this.state.oggettiMappa.length !== 0) {
          return (
            <View style={styles.container}>
              {this.state.coordOggetto ? (
                <MapView
                  key={`${this.state.latOggetto}-${this.state.lonOggetto}`}
                  style={styles.map}
                  showsUserLocation
                  initialRegion={{
                    latitude: this.state.latOggetto,
                    longitude: this.state.lonOggetto,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                  }}
                >
                  {this.renderCerchio()}
                  {this.renderOggetti()}
                  {this.renderUtenti()}
                </MapView>
              ) : (
                <MapView
                  key={`${this.state.latitudine}-${this.state.longitudine}`}
                  style={styles.map}
                  showsUserLocation
                  region={this.state.region}
                >
                  {this.renderCerchio()}
                  {this.renderOggetti()}
                  {this.renderUtenti()}
                </MapView>
              )}

              <TouchableOpacity
                style={[styles.zoomInButton, this.state.coordOggetto ? styles.disabledButton : null]}
                onPress={this.zoomIn}
                disabled={this.state.coordOggetto}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.zoomOutButton, this.state.coordOggetto ? styles.disabledButton : null]}
                onPress={this.zoomOut}
                disabled={this.state.coordOggetto}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.props.cambioPaginaRanking}
                style={styles.classifica}
              >
                <Image source={require('../assets/button_ranking.png')} style={styles.scannerImage} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.renderScanner()}
                style={styles.scanner}
              >
                <Image source={require('../assets/button_object.png')} style={styles.scannerImage} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.props.cambioPaginaProfilo}
                style={styles.profilo}
              >
                <Image source={require('../assets/button_user.png')} style={styles.scannerImage} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.setState({ coordOggetto: false, latitudine: this.state.latitudine + 0.000000000001 })}
                style={styles.bussola}
              >
                <Image source={require('../assets/position.png')} style={styles.scannerImage1} />
              </TouchableOpacity>

              {this.state.scannerOpen && (
                <Scanner
                  data={this.state.dettagliOggetto}
                  closeScanner={this.closeScanner}
                  puntaOggetto={(lat, lon) => {
                    this.setState({
                      latOggetto: lat,
                      lonOggetto: lon,
                      scannerOpen: false,
                      coordOggetto: true,
                    });
                  }}
                />
              )}

              {this.state.oggettoOpen && (
                <DettagliOggetto
                  data={[this.state.oggettoAperto, this.state.datiPlayer]}
                  closeOggetto={() => this.setState({ oggettoOpen: false })}
                  oggettoEquipaggiato={(dati) => {
                    if (dati[0].type === "amulet") {
                      this.setState({ amuleto: dati[0], oggettoOpen: false, datiPlayer: dati[1] });
                    } else {
                      this.setState({ oggettoOpen: false, datiPlayer: dati[1] });
                    }
                  }}
                  mostroAttaccato={(pre, post) => this.props.mostroAttaccato(pre, post)}
                />
              )}
            </View>
          );
        }
      } else {
        // Gestione del caso in cui i permessi di localizzazione non sono stati concessi
        return (
          <View style={styles.container}>
            <Text>Fornisci i permessi di geolocalizzazione per usare l'app</Text>
            <TouchableOpacity
              onPress={async () => await this.richiestaPermessi()}
              style={styles.scanner}
            >
              <Text>Riprova</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  }
}

// Stili utilizzati nella componente
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanner: {
    backgroundColor: '#5D529A', // Colore di sfondo del pulsante, viola
    position: 'absolute',
    bottom: 30,
    center: 30,
  },
  profilo: {
    backgroundColor: '#5D529A', // Colore di sfondo del pulsante, viola
    position: 'absolute',
    bottom: 30,
    center: 30,
    right: 30,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Colore grigio per indicare il pulsante disabilitato
  },
  classifica: {
    backgroundColor: '#5D529A', // Colore di sfondo del pulsante, viola
    position: 'absolute',
    bottom: 30,
    center: 30,
    left: 30,
  },
  bussola: {
    position: 'absolute',
    backgroundColor: '#5D529A',
    borderRadius: 30,
    padding: 10,
    right: 20,
    top: '13%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 50,
  },
  scannerImage: {
    width: 100,
    height: 100,
  },
  scannerImage1: {
    width: 30,
    height: 30,
  },
  zoomInButton: {
    position: 'absolute',
    backgroundColor: '#5D529A',
    borderRadius: 30,
    padding: 10,
    right: 20,
    top: '22%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 60,
  },
  zoomOutButton: {
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: '#5D529A',
    padding: 10,
    right: 20,
    top: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 60,
  },
  buttonText: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

// Esportazione del componente per l'utilizzo esterno
export default Mappa;
