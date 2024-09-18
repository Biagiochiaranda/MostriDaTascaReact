import React from 'react';
import PermissionRequester from './PermissionRequester';
import CommunicationController from './CommunicationController';
import StorageManager from './StorageManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';


class MappaVM extends React.Component{

    static richiestaLocation = async () => {
      return location = await PermissionRequester.locationPermissionAsync();
    }

    /*40.768072470740535, -73.98189543421499*/
    /*45.47611899581627, 9.23188393610772*/


    static richiestaOggettiUtentiVicini = async () => {
      let oggettiUtenti = []
      oggetti = await CommunicationController.getOggettiVicini('45.47611899581627', '9.23188393610772');
      utenti = await CommunicationController.getUtentiVicini('45.47611899581627', '9.23188393610772');
      oggettiUtenti.push(oggetti)
      oggettiUtenti.push(utenti)
      return oggettiUtenti
    }

//----------------------------------------GESTIONE OGGETTI----------------------------------------

    static async aggiuntaDatabaseOggetti(oggetti){
      for(let oggetto of oggetti){
        dettagliOggetto = await CommunicationController.getDettagliOggetto(oggetto.id)
        immagineBase64 = null
        if(dettagliOggetto.image != null){
          immagineBase64 = `data:image/jpeg;base64,${dettagliOggetto.image}`;
          dettagliOggetto.image = immagineBase64
        }
        await StorageManager.inserisciDettagliOggetto(dettagliOggetto)
      }
    }

    static async aggiornamentoDatabaseOggetti(oggetti){

      for(let oggetto of oggetti){
        dettagliOggetto = await CommunicationController.getDettagliOggetto(oggetto.id)
        res = await StorageManager.selezionaDettagliOggetto(dettagliOggetto.id)
        if (res.length == 0){
          immagineBase64 = null
          if(dettagliOggetto.image != null){
            immagineBase64 = `data:image/jpeg;base64,${dettagliOggetto.image}`;
            dettagliOggetto.image = immagineBase64
          }
          await StorageManager.inserisciDettagliOggetto(dettagliOggetto)
        }
      }

    }

//----------------------------------------GESTIONE UTENTI----------------------------------------

    static async aggiuntaDatabaseUtenti(utenti){
      for(let utente of utenti){
        dettagliUtente = await CommunicationController.getDettagliUtente(utente.uid)
        immagineBase64 = null
        if(dettagliUtente.picture != null){
          immagineBase64 = `data:image/jpeg;base64,${dettagliUtente.picture}`;
          dettagliUtente.picture = immagineBase64
        }
        await StorageManager.inserisciDettagliUtente(dettagliUtente)
      }
    }

    static async aggiornamentoDatabaseUtenti(utenti){

      for(let utente of utenti){
        dettagliUtente = await CommunicationController.getDettagliUtente(utente.uid)
        res = await StorageManager.selezionaDettagliUtente(dettagliUtente.uid)
        if (res.length == 0){
          immagineBase64 = null
          if(dettagliUtente.picture != null){
            immagineBase64 = `data:image/jpeg;base64,${dettagliUtente.picture}`;
            dettagliUtente.picture = immagineBase64
          }
          await StorageManager.inserisciDettagliUtente(dettagliUtente)
        }
      }

    }

    static async getAmuleto(){
      datiPlayer = await AsyncStorage.getItem("datiPlayer")
      datiPlayer = JSON.parse(datiPlayer)
      amuleto = null
      if(datiPlayer.amulet != null){
        amuleto = await CommunicationController.getDettagliOggetto(datiPlayer.amulet) 
        AsyncStorage.setItem("amuleto", JSON.stringify(amuleto))
      }
      return amuleto
    }

}
export default MappaVM;