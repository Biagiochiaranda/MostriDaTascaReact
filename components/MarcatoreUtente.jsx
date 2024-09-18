import React from 'react';
import { Marker } from 'react-native-maps';
import StorageManager from './StorageManager'; // Importa il gestore del database

class MarcatoreUtente extends React.Component {
  state = {
    nomeUtente: '', // Aggiungi uno stato per memorizzare il nome dell'utente
    userId: null, // Aggiungi uno stato per memorizzare l'ID dell'utente
  };

  async componentDidMount() {
    // Recupera i dettagli dell'utente utilizzando lo StorageManager
    const dettagliUtente = await StorageManager.selezionaDettagliUtente(this.props.data.uid);
    
    // Assicurati che il risultato sia valido e contiene il nome dell'utente
    if (dettagliUtente && dettagliUtente.length > 0) {
      const { name, uid } = dettagliUtente[0];
      this.setState({ nomeUtente: name, userId: uid });
    }
  }

  render() {
    const { data } = this.props;
    const { lat, lon } = data; // Assicurati che le coordinate siano presenti nei dati passati

    return (
      <Marker
        coordinate={{ latitude: lat, longitude: lon }}
        title={this.state.nomeUtente} // Utilizza il nome dell'utente come titolo del marker
        image={require('../assets/marker_user.png')}
        />
    );
  }
}

export default MarcatoreUtente;
