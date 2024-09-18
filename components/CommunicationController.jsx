import AsyncStorage from '@react-native-async-storage/async-storage';

let sid 
let myUid

class CommunicationController {

    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/mostri/";

    //RICHIESTA GENERICA
    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
        //console.log("sending " + verb + " request to: " + url);

        let fetchData = {
          method: verb,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        };

        if (verb !== 'GET') {
          fetchData.body = JSON.stringify(bodyParams);
        }

        const httpResponse = await fetch(url, fetchData);
      
        const status = httpResponse.status;
        if (status === 200) {
          const deserializedObject = await httpResponse.json();
          return deserializedObject;
        } else {
          //console.log(httpResponse);
          const message = await httpResponse.text();
          const error = new Error("Error message from the server. HTTP status: " + status + " " + message);
          throw error;
        }
    }

    //RICHIESTA PER SID E UID
    static async getSidUid() {
        const endPoint = "users/"
        const verb = 'POST';
        const queryParams = {}; 
        const bodyParams = {};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    //RICHIESTA OGGETTI VICINI
    static async getOggettiVicini(lat, lon) {
        const endPoint = "objects"; 
        const verb = 'GET';
        const queryParams = {sid: sid, lat: lat, lon: lon};
        const bodyParams = {};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    } 

    //RICHIESTA DETTAGLI OGGETTO
    static async getDettagliOggetto(id) {
      const endPoint = "objects/"+id.toString();
      const verb = 'GET';
      const queryParams = {sid: sid};
      const bodyParams = {};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }


    //RICHIESTA OGGETTI VICINI
    static async getUtentiVicini(lat, lon) {
      const endPoint = "users";
      const verb = 'GET';
      const queryParams = {sid: sid, lat: lat, lon: lon};
      const bodyParams = {};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    
    }    

    
    //RICHIESTA DATI UTENTE
    static async getDatiUtente(uid) {
      const endPoint = "users/"+uid.toString();
      const verb = 'GET';
      const queryParams = {sid: sid};
      const bodyParams = {};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    //RICHIESTA DETTAGLI UTENTE
    static async getDettagliUtente(uid) {
      const endPoint = "users/"+uid.toString();
      const verb = 'GET';
      const queryParams = {sid: sid};
      const bodyParams = {};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getMieiDettagli() {
      const endPoint = "users/"+myUid.toString();
      const verb = 'GET';
      const queryParams = {sid: sid};
      const bodyParams = {};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }


    //RICHIESTA CLASSIFICA
    static async getClassifica() {
      const endPoint = "ranking";
      const verb = 'GET';
      const queryParams = {sid: sid};
      const bodyParams = {};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async postAttivazioneOggetto(id){
      const endPoint = "objects/"+id.toString()+"/activate";
      const verb = 'POST';
      const queryParams = {}; 
      const bodyParams = {sid: sid};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async aggiornaNome(name){
      const endPoint = "users/"+myUid.toString();
      const verb = 'PATCH';
      const queryParams = {}; 
      const bodyParams = {sid: sid, name: name};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async aggiornaImmagine(picture){ 
      const endPoint = "users/"+myUid.toString();
      const verb = 'PATCH';
      const queryParams = {}; 
      const bodyParams = {sid: sid, picture: picture};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async aggiornaPositionshare(positionshare){
      const endPoint = "users/"+myUid.toString();
      const verb = 'PATCH';
      const queryParams = {}; 
      const bodyParams = {sid: sid, positionshare: positionshare};
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }



    static async setSidUid(sidParametro, uidParametro) {
      sid = sidParametro;
      myUid = uidParametro;
    }

}
export default CommunicationController;