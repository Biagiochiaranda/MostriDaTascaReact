import React from 'react';
import CommunicationController from './CommunicationController';
import StorageManager from './StorageManager';

class ElementoClassificaVM extends React.Component {

    static async richiestaDettagliUtente(uid) {
        return await CommunicationController.getDettagliUtente(uid);
    }


    static async aggiornaUtenteDatabase(utente) {
        
        let dettagliUtenteServer = null;
        let dettagliUtenteDatabase = null;

        dettagliUtenteDatabase = await StorageManager.selezionaDettagliUtente(utente.uid);
        dettagliUtenteServer = await CommunicationController.getDettagliUtente(utente.uid);

        if(dettagliUtenteDatabase[0] != undefined){
            if (dettagliUtenteServer.profileversion != dettagliUtenteDatabase[0].profileversion) {
                await StorageManager.aggiornaDettagliUtente(dettagliUtenteServer.uid, dettagliUtenteServer);
            }
        }
    }


}
export default ElementoClassificaVM;