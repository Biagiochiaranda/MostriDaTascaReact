import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Switch, TextInput } from 'react-native';
import CommunicationController from './CommunicationController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfiloVM from './ProfiloVM';
import StorageManager from './StorageManager';

class Profilo extends React.Component {

  state = {
    dati: null,
    immagine: null,
    modificaNome: false,
    mostraNome: true,
    nome: "",
    condividiPosizione: null,

    amuleto: false,
    arma: false,
    armatura: false,

    livelloAmuleto: null,
    livelloArmatura: null,
    livelloArma: null,

    imageSourceAmuleto: null,
    imageSourceArma: null,
    imageSourceArmatura: null,
  }

  async componentDidMount() {

    dati = await ProfiloVM.getDati()

    sources = await this.extractImageSource(dati[0])


    if (dati[0].amulet != null) {
      amuleto = true
    } else {
      amuleto = false
    }
    if (dati[0].weapon != null) {
      arma = true
    } else {
      arma = false
    }
    if (dati[0].armor != null) {
      armatura = true
    } else {
      armatura = false
    }

    this.setState({ dati: dati[0], immagine: dati[1], nome: dati[0].name, condividiPosizione: dati[0].positionshare, imageSourceAmuleto: sources[0], imageSourceArma: sources[1], imageSourceArmatura: sources[2], amuleto: amuleto, arma: arma, armatura: armatura, livelloAmuleto: dati[2], livelloArmatura: dati[3], livelloArma: dati[4] })

  }

  imageSource() {
    if (this.state.immagine == null) {
      return require('../assets/playeruser.png')
    } else {
      return { uri: this.state.immagine }
    }
  }

  async scegliImmagine() {
    dati = await ProfiloVM.scegliImmagine()
    return dati
  }

  async extractImageSource(player) {

    let immagineAmuleto = null
    let immagineArma = null
    let immagineArmatura = null

    if (player.armor != null) {
      armatura = await StorageManager.selezionaDettagliOggetto(player.armor)
      if (armatura[0].image != null) {
        immagineArmatura = armatura[0].image
      }
    }

    if (player.armor != null) {
      arma = await StorageManager.selezionaDettagliOggetto(player.weapon)
      if (arma[0].image != null) {
        immagineArma = arma[0].image
      }
    }

    if (player.amulet != null) {
      amuleto = await StorageManager.selezionaDettagliOggetto(player.amulet)
      if (amuleto[0].image != null) {
        immagineAmuleto = amuleto[0].image
      }
    }


    sources = [immagineAmuleto, immagineArma, immagineArmatura]

    return sources
  }


  render() {

    if (this.state.dati != null) {

      let imageSourceAm
      if (this.state.imageSourceAmuleto == null) {
        imageSourceAm = require('../assets/amulet.png')
      } else {
        imageSourceAm = { uri: this.state.imageSourceAmuleto }
      }

      let imageSourceAr
      if (this.state.imageSourceArma == null) {
        imageSourceAr = require('../assets/weapon.png')
      } else {
        imageSourceAr = { uri: this.state.imageSourceArma }
      }

      let imageSourceArm
      if (this.state.imageSourceArmatura == null) {
        imageSourceArm = require('../assets/armor.png')
      } else {
        imageSourceArm = { uri: this.state.imageSourceArmatura }
      }

      return (
        <View style={styles.contenitoreEsterno}>

          <View style={styles.contenitoreHeader}>
            <TouchableOpacity onPress={this.props.cambioPagina}>
              <Image source={require('../assets/tornaback.png')} style={{ width: 60, height: 60 }} />
            </TouchableOpacity>

            <Text style={styles.titolo}>Profilo Utente</Text>
          </View>

          <View style={styles.contenitoreNome}>
            {this.state.mostraNome && (
              <TouchableOpacity onPress={() => { this.setState({ modificaNome: true, mostraNome: false }) }}>
                <Text style={styles.nome}>{this.state.nome}</Text>
              </TouchableOpacity>
            )}


            {this.state.modificaNome && (
              <View>

                <View>
                  <TextInput
                    style={styles.inputNome}
                    //value={this.state.dati.name}
                    onChangeText={(text) => this.setState({ nome: text })}
                    maxLength={15}
                  />
                </View>

                <View style={styles.contenitoreVX}>
                  <TouchableOpacity onPress={() => { this.setState({ mostraNome: true, modificaNome: false, nome: this.state.dati.name }) }}>
                    <Image source={require('../assets/deny.png')} style={{ width: 50, height: 50 }} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={async () => {
                    await CommunicationController.aggiornaNome(this.state.nome)
                    datiPlayer = await CommunicationController.getMieiDettagli()
                    await AsyncStorage.setItem("datiPlayer", JSON.stringify(datiPlayer))
                    this.setState({ mostraNome: true, modificaNome: false, nome: datiPlayer.name, dati: datiPlayer })
                  }}
                  >
                    <Image source={require('../assets/confirm.png')} style={{ width: 50, height: 50 }} />
                  </TouchableOpacity>
                </View>

              </View>
            )}

          </View>

          <View style={styles.contenitoreCentrale}>

            <View style={styles.contenitoreImmagine}>
              <TouchableOpacity style={styles.photoImmagine}>
                <Image source={this.imageSource()} style={styles.immagine} />
                <TouchableOpacity style={styles.pulsanteImmagine} onPress={async () => {
                  let dati = await this.scegliImmagine();
                  if (dati !== undefined) {
                    this.setState({ dati: dati[0], immagine: dati[1] });
                  }
                }}>
                  <Image source={require('../assets/changephoto.png')} style={{ width: 40, height: 40 }} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            <View style={styles.contenitoreColonna}>

              <View style={styles.contenitoreEsperienza}>
                <Image source={require('../assets/xp_icon.png')} style={{ width: 100, height: 56 }} />
                <Text style={styles.esperienza}>      {this.state.dati.experience}</Text>
              </View>
              <View style={styles.contenitoreVita}>
                <Image source={require('../assets/life_points_icon.png')} style={{ width: 60, height: 56 }} />
                <Text style={styles.vita}>{this.state.dati.life}</Text>
              </View>


            </View>

          </View>
          <Text style={styles.titolo1}>Artefatti</Text>

          <View style={styles.contenitoreArtefatti}>

            <View style={styles.contenitoreArma}>

              <View style={styles.bgArtefatti}>
                {this.state.arma && <Image source={imageSourceAr} style={styles.immaginiArtefatti} />}
              </View>
              {this.state.arma && <Text style={styles.livelliArtefatti}>Livello {this.state.livelloArma}</Text>}

            </View>




            <View style={styles.contenitoreArmatura}>

              <View style={styles.bgArtefatti}>
                {this.state.armatura && <Image source={imageSourceArm} style={styles.immaginiArtefatti} />}
              </View>
              {this.state.armatura && <Text style={styles.livelliArtefatti}>Livello {this.state.livelloArmatura}</Text>}

            </View>

            <View style={styles.contenitoreAmuleto}>

              <View style={styles.bgArtefatti}>
                {this.state.amuleto && <Image source={imageSourceAm} style={styles.immaginiArtefatti} />}
              </View>
              {this.state.amuleto && <Text style={styles.livelliArtefatti}>Livello {this.state.livelloAmuleto}</Text>}

            </View>

          </View>
          <View style={styles.contenitorePosizione}>
            <View style={styles.contenitoreCondividiPosizione}>
              <Text style={styles.condividiPosizione}>Condivisione Posizione</Text>
            </View>
            <View style={styles.contenitoreSwitch}>

              <Switch
                style={styles.switch}
                value={this.state.condividiPosizione}
                onValueChange={async (nuovoValore) => {
                  await CommunicationController.aggiornaPositionshare(nuovoValore)
                  datiPlayer = await CommunicationController.getMieiDettagli()
                  await AsyncStorage.setItem("datiPlayer", JSON.stringify(datiPlayer))
                  this.setState({ condividiPosizione: nuovoValore })
                }}
              />

            </View>

          </View>

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  contenitoreEsterno: {
    flex: 1.2,
    backgroundColor: '#cccccc',
  },
  contenitoreHeader: {
    flexDirection: 'row', // Disponi gli elementi in fila
    justifyContent: 'flex-start', // Centra il titolo
    alignItems: 'center', // Centra gli elementi verticalmente
    height: 100, // Aumentato l'altezza della barra del titolo
    paddingHorizontal: 2, // Padding orizzontale
    paddingTop: 39, // Aggiungi un padding superiore per abbassare il titolo
  },
  titolo: {
    fontWeight: 'bold',
    fontSize: 40,
    paddingLeft: 25,
  },
  contenitoreNome: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputNome: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 5,
    paddingHorizontal: 90,
    //display: "none"
  },
  nome: {
    color: '#000',
    fontSize: 30,
  },
  contenitoreVX: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contenitoreCentrale: {
    flex: 0.5,
    //backgroundColor: '#ccc',
    justifyContent: 'space-between',
    flexDirection: 'center',
  },
  contenitoreImmagine: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Per posizionare assolutamente il pulsante di modifica
  },
  photoImmagine: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  pulsanteImmagine: {
    backgroundColor: '#5D529A', // Scegli un colore appropriato
    borderRadius: 30, // Bordi arrotondati
    position: 'absolute',
    top: 150, // Posizione in alto
    left: 220, // Posizione a sinistra
    padding: 10,

  },
  immagine: {
    aspectRatio: 1,
    height: '70%',
    borderRadius: 100,
  },
  contenitoreColonna: {
    flex: 1,
    flexDirection: 'row', // Cambia la disposizione a row per allineare i figli orizzontalmente
  },
  contenitoreEsperienza: {
    flex: 0.8,
    //backgroundColor: 'yellow',
    justifyContent: 'center',
    paddingLeft: 60,
    alignItems: 'flex-start',
  },
  esperienza: {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  contenitoreVita: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vita: {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  contenitoreSwitch: {
    flex: 0.3,
    //backgroundColor: '#fff',
    //justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  titolo1: {
    fontSize: 40,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    paddingLeft: 120,

  },
  contenitoreArtefatti: {
    flex: 0.2,
    //backgroundColor: '#fca',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  contenitoreAmuleto: {
    flex: 1,
    //backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgArtefatti: {
    height: '80%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c3c9d6',
  },
  contenitoreArmatura: {
    flex: 1,
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  immaginiArtefatti: {
    width: "75%",
    height: "75%",
  },
  contenitoreArma: {
    flex: 1,
    //backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  livelliArtefatti: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tastoX: {
    alignItems: 'center',
  },
  contenitorePosizione: {
    flex: 0.3,
    justifyContent: 'center',
  },
  contenitoreCondividiPosizione: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  condividiPosizione: {
    fontSize: 20,
    fontWeight: 'bold',
    bottom: 10,
    position: 'absolute',
  },
  immagineX: {
    width: 50,
    height: 50,
  },
});

export default Profilo;
