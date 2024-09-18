import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import ClassificaVM from './ClassificaVM';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ElementoClassificaVM from './ElementoClassificaVM';

class ElementoClassifica extends React.Component {

    state = {
        dettagli: {},
        picture: null
    }
         
    async componentDidMount() {
        const dettagli = await ElementoClassificaVM.richiestaDettagliUtente(this.props.data.uid);
        const picture = `data:image/jpeg;base64,${dettagli.picture}`;     

        await ElementoClassificaVM.aggiornaUtenteDatabase(dettagli)             
        
        this.setState({ dettagli, picture }); 
    }

    async settaDettagli() {
        await AsyncStorage.setItem('dettagliUtente', JSON.stringify(this.state.dettagli));
    }

    renderPosizionamento(counter) {               
        switch (counter){
            case 1:
                return (
                    <View style={styles.posizionamentoContainer}>
                        <Image source={require('../assets/primoclassificato.png')} style={styles.posizionamento} />
                    </View>
                ) 
            case 2:
                return (
                    <View style={styles.posizionamentoContainer}>
                        <Image source={require('../assets/secondoclassificato.png')} style={styles.posizionamento} />
                    </View>
                )
            case 3:
                return (
                    <View style={styles.posizionamentoContainer}>
                        <Image source={require('../assets/terzoclassificato.png')} style={styles.posizionamento} />
                    </View>
                )
            default:
                return(
                    <View style={styles.posizionamentoContainerTesto}>
                        <Text style={styles.posizionamentoTesto}>{counter}</Text>
                    </View>
                )
        }
    }

    render() {
        const { counter } = this.props;

        if(this.state.dettagli.uid != undefined) {

            if(this.state.dettagli.picture == null) {
                imageSource = require('../assets/playeruser.png') 
            }else{
                imageSource = { uri: this.state.picture }
            }


            return (
                <TouchableOpacity onPress={() => {
                    this.settaDettagli()
                    this.props.oggettoCliccato()
                }}
                >
                <View style={styles.cardContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={imageSource} style={styles.image} />
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.titolo}>{this.state.dettagli.name}</Text>
                        <Text>{this.props.data.experience}</Text>
                    </View>

                    {this.renderPosizionamento(counter)}


                </View>
                </TouchableOpacity>
            );
        
        }

    }
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor:'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20,
        marginBottom: 8,
    },
    titolo: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    imageContainer: {
        marginRight: 16,
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 50,
    },
    posizionamentoContainer: {
        marginLeft: 16,
    },
    posizionamento: {
        width: 75,
        height: 75,
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
    },
    posizionamentoContainerTesto: {
        marginRight: 30,
    },
    posizionamentoTesto: {
        fontSize: 40,
    },
});

export default ElementoClassifica;
