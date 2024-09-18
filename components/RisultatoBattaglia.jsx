import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class RisultatoBattaglia extends React.Component{

    state = {
        vita: null,
        esperienza: null,
    }

    async componentDidMount(){
        profiloPost = await AsyncStorage.getItem("datiPlayer")
        profiloPost = JSON.parse(profiloPost)  
    }

    renderVinto(){ 

        return(
        <View style={styles.gameTextContainer}>
        <Text style={styles.gameText}>COMPLIMENTI, HAI VINTO!{'\n'}</Text>
        <Text style={styles.gameText}>
            Hai ottenuto {this.props.data[1].experience - this.props.data[0].experience} EXP! Ora hai{' '}
            {this.props.data[1].experience} EXP {'\n\n'}
            Hai perso {this.props.data[0].life - this.props.data[1].life} HP! Ora hai{' '}
            {this.props.data[1].life} HP
        </Text>
        </View>)

    }

    renderPerso(){
        return(
            <View>
                <View style={styles.contenitoreMostro}>
                    <Image source={require('../assets/monster.png')} style={{width: 200, height: 200}}/>
                </View>
                <View style={styles.gameTextContainer}>
                    <Text style={styles.gameText}>Sei morto</Text>
                    <Text style={styles.gameText}>Hai perso {this.props.data[0].experience} punti esperienza e tutti i tuoi oggetti</Text>
                </View>
            </View>
        )
    }

    render(){
        return(
            <View style={styles.contenitoreEsterno}>

                {this.props.data[1].died != true ? this.renderVinto() : this.renderPerso()}

                <TouchableOpacity style = {{paddingTop:10}}onPress={() => this.props.mostraMappa()}>
                    <Image source={require('../assets/x.png')} style={{width: 50, height: 50}}/>
                </TouchableOpacity>

            </View>
        );
    }

}

const styles = StyleSheet.create({

    contenitoreEsterno: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contenitoreRisultatoCombattimento: {
        flex: 0.5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    contenitoreMostro: {
        flex: 0.8,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    gameTextContainer: {
        backgroundColor: '#333',
        padding: 20, 
        borderRadius: 10,
        marginTop: 20,
      },
      gameText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
      },

});

export default RisultatoBattaglia;