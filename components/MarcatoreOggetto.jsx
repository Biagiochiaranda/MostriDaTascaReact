import React from 'react';
import { Marker } from 'react-native-maps';

class MarcatoreOggetto extends React.Component {
  render() {
    switch (this.props.data[0].type) {
      case "weapon":
        imageSource = require('../assets/marker_sword.png')
        title = "Arma"
        if (this.props.data[0].id == this.props.data[1].weapon){
          return
        }
        break;
      case "armor":
        imageSource = require('../assets/marker_sword.png')
        title = "Armatura"
        if (this.props.data[0].id == this.props.data[1].armor){
          return
        }
        break;
      case "amulet":
        imageSource = require('../assets/marker_sword.png')
        title = "Amuleto"
        if (this.props.data[0].id == this.props.data[1].amulet){
          return
        }
        break;
      case "monster":
        imageSource = require('../assets/marker_moster.png')
        title = "Mostro"
        break;
      case "candy":
        imageSource = require('../assets/marker_candy.png')
        title = "Caramella"
        break;
    }

    return (
      <Marker
        coordinate={{ latitude: this.props.data[0].lat, longitude: this.props.data[0].lon }}
        title={title}
        image={imageSource}
        style={{ width: 20, height: 20 }}
        onCalloutPress={() => this.props.visualizzaDettagliOggetto(this.props.data[0].id)}
      />
    )
  }


};
export default MarcatoreOggetto;