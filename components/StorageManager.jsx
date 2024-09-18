import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

//let sid = await AsyncStorage.getItem("sid")

class StorageManager {

    constructor() {
        this.db = SQLite.openDatabase("myDB") 
        this.creaTabellaDettagliOggetto()
        this.creaTabellaDettagliUtente()
    }

//----------------------------------------GESTIONE OGGETTI----------------------------------------
    
    async dropTabellaDettagliOggetto() {
        const db = SQLite.openDatabase('myDB'); 
        const querySQL = "DROP TABLE IF EXISTS DETTAGLI_OGGETTO";
        const query = { args: [], sql: querySQL }
        await db.execAsync([query], false)
            .then((result) => { /*console.log("TABELLA DETTAGLI OGGETTO CANCELLATA")*/ })
            .catch((error) => { /*console.log("ERRORE CANCELLAZIONE TABELLA OGGETTI"+error)*/ })
    }

    async creaTabellaDettagliOggetto() {
        const db = SQLite.openDatabase('myDB'); 
        const querySQL = "CREATE TABLE IF NOT EXISTS DETTAGLI_OGGETTO (id INT PRIMARY KEY, image varchar, lat DECIMAL(10, 8) NOT NULL, level INTEGER NOT NULL, lon DECIMAL(11, 8) NOT NULL, name VARCHAR(20) NOT NULL, type VARCHAR(20) NOT NULL)";
        const query = { args: [], sql: querySQL }
        await db.execAsync([query], false)
            .then((result) => { /*console.log("TABELLA DETTAGLI OGGETTI CREATA")*/ })
            .catch((error) => { /*console.log("ERRORE CREAZIONE TABELLA OGGETTI"+error)*/ })
    }

    static async inserisciDettagliOggetto(oggetto) {
        const db = SQLite.openDatabase('myDB')
        const querySQL = "INSERT INTO DETTAGLI_OGGETTO (id, image, lat, level, lon, name, type) VALUES (?, ?, ?, ?, ?, ?, ?)"
        const query = { args: [oggetto.id, oggetto.image, oggetto.lat, oggetto.level, oggetto.lon, oggetto.name, oggetto.type], sql: querySQL }
        return await db.execAsync([query], false)
            .then((result) => { /*console.log(result)*/ })
            .catch((error) => { /*console.log("ERRORE CREAZIONE TABELLA OGGETTI"+error)*/ })
    }

    async selezionaDettagliOggetti() {
        const db = SQLite.openDatabase('myDB')
        const querySQL = "SELECT * FROM DETTAGLI_OGGETTO"
        const query = { args: [], sql: querySQL }
        result = await db.execAsync([query], false) 
        return result[0].rows
    }

    static async selezionaDettagliOggetto(id) {
        const db = SQLite.openDatabase('myDB')
        const querySQL = "SELECT * FROM DETTAGLI_OGGETTO WHERE id = ?"
        const query = { args: [id], sql: querySQL }
        result = await db.execAsync([query], false) 
        return result[0].rows
    }

//----------------------------------------GESTIONE UTENTI----------------------------------------


    async dropTabellaDettagliUtente() {
        const db = SQLite.openDatabase('myDB'); 
        const querySQL = "DROP TABLE IF EXISTS DETTAGLI_UTENTE";
        const query = { args: [], sql: querySQL }
        await db.execAsync([query], false)
            .then((result) => { /*console.log("TABELLA DETTAGLI UTENTE CANCELLATA")*/ })
            .catch((error) => { /*console.log("ERRORE CANCELLAZIONE TABELLA UTENTI"+error)*/ })
    }

    async creaTabellaDettagliUtente() {
        const db = SQLite.openDatabase('myDB'); 
        const querySQL = "CREATE TABLE IF NOT EXISTS DETTAGLI_UTENTE (uid INT PRIMARY KEY, amulet INT, armor INT, experience INT NOT NULL, lat DECIMAL(10, 8), life INT NOT NULL, lon DECIMAL(11, 8), name VARCHAR(20) NOT NULL, picture varchar, positionshare BOOLEAN NOT NULL, profileversion INT, time DATETIME NOT NULL, weapon INT)";
        const query = { args: [], sql: querySQL }
        await db.execAsync([query], false)
            .then((result) => { /*console.log("TABELLA DETTAGLI UTENTE CREATA")*/ })
            .catch((error) => { /*console.log("ERRORE CREAZIONE TABELLA UTENTI"+error)*/ })
    }

    static async inserisciDettagliUtente(utente) {
        const db = SQLite.openDatabase('myDB')
        const querySQL = "INSERT INTO DETTAGLI_UTENTE (uid, amulet, armor, experience, lat, life, lon, name, picture, positionshare, profileversion, time, weapon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        const query = { args: [utente.uid, utente.amulet, utente.armor, utente.experience, utente.lat, utente.life, utente.lon, utente.name, utente.picture, utente.positionshare, utente.profileversion, utente.time, utente.weapon], sql: querySQL }
        await db.execAsync([query], false)
            .then((result) => { /*console.log("UTENTE AGGIUNTO CORRETTAMENTE")*/ })
            .catch((error) => { /*console.log("ERRORE AAGIUNTA UTENTE"+error)*/ })
    }

    static async selezionaDettagliUtenti() {
        const db = SQLite.openDatabase('myDB')
        const querySQL = "SELECT * FROM DETTAGLI_UTENTE"
        const query = { args: [], sql: querySQL }
        result = await db.execAsync([query], true) 
        return result[0].rows
    }

    static async selezionaDettagliUtente(uid) {
        const db = SQLite.openDatabase('myDB')
        const querySQL = "SELECT * FROM DETTAGLI_UTENTE WHERE uid = ?"
        const query = { args: [uid], sql: querySQL }
        result = await db.execAsync([query], true) 
        return result[0].rows
    }

    static async aggiornaDettagliUtente(uid, utenteNuovo) {
        const db = SQLite.openDatabase('myDB')
        const querySQL = "UPDATE DETTAGLI_UTENTE SET amulet = ?, armor = ?, experience = ?, lat = ?, life = ?, lon = ?, name = ?, picture = ?, positionshare = ?, profileversion = ?, time = ?, weapon = ? WHERE uid = ?"
        const query = { args: [utenteNuovo.amulet, utenteNuovo.armor, utenteNuovo.experience, utenteNuovo.lat, utenteNuovo.life, utenteNuovo.lon, utenteNuovo.name, utenteNuovo.picture, utenteNuovo.positionshare, utenteNuovo.profileversion, utenteNuovo.time, utenteNuovo.weapon, uid], sql: querySQL }
        result = await db.execAsync([query], true) 
        return result[0].rows
    }

//-----------------------------------------------------------------------------------------------

}

export default StorageManager;