import React from 'react';
import CommunicationController from './CommunicationController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageManager from './StorageManager';

class DettagliOggettoVM extends React.Component{

    static async getDettagliOggettoEquipaggiato(tipoDaCercare){
        profiloPlayerJSON = await AsyncStorage.getItem("datiPlayer")
        profiloPlayer = JSON.parse(profiloPlayerJSON)

        let oggettoUtente = null
        switch(tipoDaCercare){
            case "weapon":
                if(profiloPlayer.weapon != null){
                    oggettoUtente = await StorageManager.selezionaDettagliOggetto(profiloPlayer.weapon)
                    /*oggettoUtente = await CommunicationController.getDettagliOggetto(profiloPlayer.weapon)*/
                }
                break;
            case "armor":
                if(profiloPlayer.armor != null){
                    oggettoUtente = await StorageManager.selezionaDettagliOggetto(profiloPlayer.armor)
                    /*oggettoUtente = await CommunicationController.getDettagliOggetto(profiloPlayer.armor)*/
                }
                break;
            case "amulet":
                if(profiloPlayer.amulet != null){
                    oggettoUtente = await StorageManager.selezionaDettagliOggetto(profiloPlayer.amulet)
                    /*oggettoUtente = await CommunicationController.getDettagliOggetto(profiloPlayer.amulet)*/
                }
                break;
            default:
                oggettoUtente = null
                break;
        }
        return oggettoUtente
    }

    static getImmagineOggettoToccato(oggetto){
        if (oggetto.image != null){
            return oggetto.image;
        }else{
            return null
        }
    }

    static getImmagineOggettoEquipaggiato(oggetto){
        if (oggetto[0].image != null){
            return oggetto[0].image;
            //return `data:image/jpeg;base64,${oggetto.image}`;
        }else{
            return null
        }
    }

    static async getAmuleto(){
        amuletoJSON = await AsyncStorage.getItem("amuleto")
        return JSON.parse(amuletoJSON)
    }

}
export default DettagliOggettoVM;