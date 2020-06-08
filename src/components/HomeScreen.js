import React, { Component } from 'react';
import { Button, Text, View ,StatusBar} from 'react-native';
import styles from '../../styles';
import GoogleSheet from 'react-native-google-sheet';

const clientId = '339703190676-8ebrdeplcjvlmh0v4uchm1pq5v0dsqom.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = 'http://localhost';



const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
      <GoogleSheet
        credentialsDetails={{
        redirectUrl: GOOGLE_REDIRECT_URI,
        clientId,
        }}
        // spreadsheetId='1HJMwaKCAgdZO32jjZludFXCRIzv02es01z-w2fxFhsE'
      /> 
    <StatusBar backgroundColor='#445BFB' barStyle="dark-content"/>
    <Text style={styles.title}>Welcome to VisionScan : Meter Reading App</Text>
    <Text style={styles.instructions}>
      The following examples have been created using two of the most
      {' '}
      popular RN modules to select images from the device library or
      {' '}
      directly from the camera .You can also save the readings in excel sheet
      {' '}
      and can see all the readings by navigating to reading section.
    </Text>
    {/* <View style={styles.button}>
      <Button
        title="Camera Example"
        onPress={() => navigation.navigate('Camera')}
        color="#445BFB"
      /> */}
    {/* </View> */}
    <View style={styles.button}>
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('ImagePicker')}
      
        style={styles.button}
        color="#445BFB"
      />
    </View>
  </View>
);

// HomeScreen.navigationOptions = {
//   header: null,
// };

export default HomeScreen;
