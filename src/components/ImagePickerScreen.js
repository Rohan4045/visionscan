import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  NativeModules,
  Alert,
  TextInput,
  ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import styles from '../../styles';
import GoogleSheet, { append } from 'react-native-google-sheet';

const clientId = '339703190676-8ebrdeplcjvlmh0v4uchm1pq5v0dsqom.apps.googleusercontent.com';
const SHEET_ID = '1HJMwaKCAgdZO32jjZludFXCRIzv02es01z-w2fxFhsE';
const GOOGLE_REDIRECT_URI = 'http://localhost';
const Button = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableOpacity;
const imagePickerOptions = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};
const tessOptions = {
  whitelist: null,
  blacklist: null
};

class ImagePickerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      extractedText: null,
      hasErrored: false,
      imageSource: null,
      isLoading: false,
      buttonClicked:false,
      flatno:null,
    };
    this.selectImage = this.selectImage.bind(this);
  }

  saveresult(text1,text2){
    if(text1!==null && text2!==null){
    const param = {
      data: {
        "majorDimension": "ROWS",
        "range": "A1",
        "values": [
          [
            text1,text2
          ]
        ] 
          
      }
    }
    append(param).then(Alert.alert("Saved successfully")).then(()=>this.setState({flatno:""})).catch((e)=>console.log(e));}
    else{
      if(text1=null){
        Alert.alert("please enter flatno.");
      }
      else if(text2=null){
        Alert.alert("Reading cannot be null");
      }
      else{
        Alert.alert("flatno. and reading cannot be null");
      }
    }
     // fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:append?insertDataOption=INSERT_ROWS&valueInputOption=RAW`, {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ya29.a0Ae4lvC2yz0go75UPWfZtDW9ucn0p-4VU76cLIc9ZOcAZ8cn-FxTwvI1wLXJMopPpXS7wQvYRSwiHrwNMqDEm2u3YUYqhmbzinIBRmDDPLei27oKOQgkwCdbTxTu6LgAM8U9NrHT2M3Z4DRufG95eldFf7nY-FyWYNYw`,
  //     },
  //     body: JSON.stringify({
  //       "majorDimension": "ROWS",
  //       "range": "A1",
  //       "values": [
  //         [
  //           text
            
  //         ]
  //       ] 
  //     })
  // }).then(res=>console.log("res",res)).catch((e)=>console.log(e));
  }

 

  selectImage() {
    this.setState({ isLoading: true });

    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        this.setState({ isLoading: false });
      } else if (response.error) {
        this.setState({ isLoading: false, hasErrored: true, errorMessage: response.error });
      } else {
        let source2;
        let source1;
        NativeModules.Imagecnv.imgconv(response.data)
        .then(item=>{
          source2=item;
          source1 = {uri: `data:image/jpeg;base64,${item},`};         
          this.setState({ imageSource: source1, hasErrored: false, errorMessage: null }, this.extractTextFromImage(source2));
        });
      }
    });
    }

  extractTextFromImage(imagePath) {
    RNTesseractOcr.recognize(imagePath, 'LANG_ENGLISH', tessOptions)
      .then((result) => {
        this.setState({ isLoading: false, extractedText: result });
      })
      .catch((err) => {
        this.setState({ hasErrored: true, errorMessage: err.message });
      });
  }

  render() {

    const { errorMessage, extractedText, hasErrored, imageSource, isLoading } = this.state;
    return (
     
      // <ScrollView style={{flex:1}}>
      <View style={styles.container}>
        <Button onPress={this.selectImage} >
          <View style={[styles.image, styles.imageContainer, !imageSource && styles.rounded]}>
            {
              imageSource === null
                ? <Text>Tap me!</Text>
                : <Image style={styles.image} source={imageSource} />
            }
          </View>
        </Button>
        {
          isLoading
            ? <ActivityIndicator size="large" />
            : (
              hasErrored
                ? <Text>{errorMessage}</Text>
                : <Text>{extractedText}</Text>
            )
        }
        <View style={{margin:10,padding:5}}>
        
        <TextInput placeholder="Enter Flatno." style={{
        borderWidth:1,
        
        height:35,
        width:150,
        padding:10,
        
        }}
         onChangeText={(text)=>this.setState({flatno:text})}/>
        </View>

        <Button onPress={()=>this.saveresult(this.state.flatno,extractedText)} >
          <View style={{backgroundColor:"#445BFB",marginTop:10}}>
            <Text style={{textAlign:"center",color:"white",width:200,padding:10}}>Save Result</Text>
          </View>
        </Button>
       
         
        </View>
      // </ScrollView>
    );
  }
}

// ImagePickerScreen.navigationOptions = {
//   title: 'Image Picker Example',
// };

export default ImagePickerScreen;
