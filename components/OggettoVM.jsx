import React from 'react';
import PermissionRequester from './PermissionRequester';
import CommunicationController from './CommunicationController';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OggettoVM extends React.Component{
    
    //RICHIEDE I DETTAGLI DI UN OGGETTO
    static async richiestaDettagliOggetto(id){
        return await CommunicationController.getDettagliOggetto(id);
    }

}
export default OggettoVM;