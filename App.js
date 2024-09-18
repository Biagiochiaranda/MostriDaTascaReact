// Importazione dei componenti necessari e moduli da React Native, Expo e AsyncStorage
import { StatusBar } from 'expo-status-bar'; 
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importazione dei componenti personalizzati dell'applicazione
import Mappa from './components/Mappa';
import AppVM from './components/AppVM'; 
import Profilo from './components/Profilo';
import Classifica from './components/Classifica';
import ProfiloUtente from './components/ProfiloUtente';
import RisultatoBattaglia from './components/RisultatoBattaglia';
import DettagliOggetto from './components/DettagliOggetto';

import CommunicationController from './components/CommunicationController';

// Classe principale dell'applicazione
class App extends React.Component {
  // Stato iniziale dell'app, con gestione della sessione e navigazione
  state = {
    sid: null, // ID della sessione
    paginaVisitata: 0, // indice della pagina attualmente visualizzata
    pre: null, // dati pre-battaglia
    post: null, // dati post-battaglia
  }

  // Metodo eseguito al montaggio del componente
  async componentDidMount() {
    // Recupero dell'ID della sessione e dell'ID utente dallo storage locale
    let sid = await AsyncStorage.getItem("sid");
    let uid = await AsyncStorage.getItem("uid");
    // Controllo se gli ID non esistono e, in tal caso, richiesta di nuovi ID
    if(sid == null || uid == null){
      await AppVM.richiestaSidUid();
    }
    // Configurazione dei valori SID e UID nel controller di comunicazione
    await CommunicationController.setSidUid(sid, uid);
    // Impostazione dell'ID utente nello storage per sessioni future
    await AppVM.setUserAsyncStorage(uid);
    // Aggiornamento dello stato con l'ID della sessione ottenuto
    this.setState({sid: sid});
  }

  // Metodo per cambiare la pagina visualizzata basato sull'indice di pagina
  cambioPagina = (pagina) => {
    this.setState({paginaVisitata: pagina});
  }

  // Metodo render per visualizzare l'interfaccia utente
  render() {
    if(this.state.sid != null){ // Controllo se l'ID di sessione è disponibile
      // Gestione della navigazione tra diverse pagine
      switch(this.state.paginaVisitata) {
        case 0:
          // Pagina della mappa principale
          return <Mappa cambioPaginaProfilo={() => this.cambioPagina(1)}
                        cambioPaginaRanking={() => this.cambioPagina(2)}
                        cambioPaginaDettagliOggetto={(dettagli) => {
                          this.setState({dettagliOggetto: dettagli});
                          this.cambioPagina(4)}}
                        ricaricaMappa={() => {this.cambioPagina(6)}}
                        mostroAttaccato={(pre, post) => {
                          this.setState({pre: pre, post: post});
                          this.cambioPagina(5)}}
                        errorePosizione={() => {console.log("Errore posizione")}}
                        />;
        case 1:
          // Pagina del profilo utente
          return <Profilo cambioPagina={() => this.cambioPagina(0)} />
        case 2:
          // Pagina della classifica degli utenti
          return <Classifica cambioPaginaMappa={() => this.cambioPagina(0)} cambioPaginaUtente={() => {this.cambioPagina(3)}}/>
        case 3:
          // Pagina del profilo di un altro utente
          return <ProfiloUtente cambioPaginaClassifica={() => this.cambioPagina(2)} />
        case 4:
          // Pagina dei dettagli di un oggetto
          return <DettagliOggetto data={this.state.dettagliOggetto}/>
        case 5:
          // Pagina risultante dopo una battaglia
          return <RisultatoBattaglia data={[this.state.pre, this.state.post]} mostraMappa={() => this.cambioPagina(0)}/> 
        case 6:
          // Forza il ritorno alla mappa dopo un aggiornamento
          this.setState({paginaVisitata: 0});
          break;
      }
    } else {
      // Visualizza una schermata di attesa se l'ID di sessione non è disponibile
      return <View style={styles.container}>
          <StatusBar style="auto" />
      </View>
    }
  }
}

// Definizione degli stili usati nell'app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Esportazione del componente App per essere usato nell'applicazione
export default App;
