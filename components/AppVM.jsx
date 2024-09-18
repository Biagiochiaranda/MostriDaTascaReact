import React from 'react';
import PermissionRequester from './PermissionRequester';
import CommunicationController from './CommunicationController';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AppVM extends React.Component{
    
    //RICHIEDE SID E UID E LI SALVA NELLO STATO
    static async richiestaSidUid(){
        res = await CommunicationController.getSidUid();
        await AsyncStorage.setItem("sid", res.sid);
        await AsyncStorage.setItem("uid", res.uid.toString());
    }

    static async setUserAsyncStorage(uid){
        utente = await CommunicationController.getDatiUtente(uid)
        await AsyncStorage.setItem("datiPlayer", JSON.stringify(utente));
    }

}
export default AppVM;