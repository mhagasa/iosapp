import React from 'react';
import {
  View, 
  Image, 
  Text,
  StyleSheet
} from 'react-native';
import strings from '../localizations/screen';
import { Card } from 'react-native-paper';


export default function AboutScreen({navigation}) {

  return (
    <View style={{flex: 1}}>
      <Card style={styles.card}>
        {/* <Image source={require('../assets/img/ic_launcher_round.png')}
              style={styles.image}/> */}
        <Text style={styles.textVersion}>{strings.appVersion}</Text>
        <Text style={styles.text}>{strings.aboutInfo}</Text>
        <Text style={styles.textCopyright}>© Mhagasa Technologies Pvt. Ltd. 2024</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{
    margin: '3%',
    borderRadius: 10,
    padding: '3%',
  },
  image: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  text:{
    margin: '2%',
    textAlign: 'justify',
    alignSelf: 'center'
  },
  textCopyright:{
    margin: '2%',
    textAlign: 'justify',
    alignSelf: 'center',
    fontSize : 10
  },
  textVersion:{
    margin: '2%',
    textAlign: 'justify',
    alignSelf: 'center',
    fontSize : 30,
    fontWeight: 'bold'
  }
});
