import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationController from './CommunicationController';
import * as ImagePicker from 'expo-image-picker';
import StorageManager from './StorageManager';

class ProfiloVM extends React.Component{

    static async getDati(){
        dati = []

        datiPlayerJSON = await AsyncStorage.getItem("datiPlayer")
        datiPlayer = JSON.parse(datiPlayerJSON)

        if (datiPlayer.picture == null){
            picture = null 
        }else{
            picture = `data:image/jpeg;base64,${datiPlayer.picture}`;
        }

        livelloAmuleto = null
        if (datiPlayer.amulet != null){
            amuleto = await StorageManager.selezionaDettagliOggetto(datiPlayer.amulet)
            livelloAmuleto = amuleto[0].level
        }

        livelloArmatura = null
        if (datiPlayer.armor != null){
            armatura = await StorageManager.selezionaDettagliOggetto(datiPlayer.armor)
            livelloArmatura = armatura[0].level
        }

        livelloArma = null
        if (datiPlayer.weapon != null){
            arma = await StorageManager.selezionaDettagliOggetto(datiPlayer.weapon)
            livelloArma = arma[0].level
        }
   
        dati.push(datiPlayer)
        dati.push(picture)
        dati.push(livelloAmuleto)
        dati.push(livelloArmatura)
        dati.push(livelloArma)

        return dati
    }

    static async scegliImmagine() {

        let result = await ImagePicker.launchImageLibraryAsync({
          base64: true, quality: 1,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });
    
    
        if (!result.canceled) {
          fotoBase64 = result.assets[0].base64
          fotoIntestata = `data:image/jpeg;base64,${fotoBase64}`; 
          await CommunicationController.aggiornaImmagine(fotoBase64)   
          datiPlayer = await CommunicationController.getMieiDettagli()
          await AsyncStorage.setItem("datiPlayer", JSON.stringify(datiPlayer))
          dati=[]
          dati.push(datiPlayer)
          dati.push(fotoIntestata)
          return dati 
        } 
    }

    

}
export default ProfiloVM;