import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView

    } from 'react-native';
import {
        GoogleSigninButton,
        GoogleSignin,
        statusCodes
      } from 'react-native-google-signin'
 
import {  Button } from 'native-base';
import * as firebase from 'firebase';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class Loginscreen extends React.Component{
    static navigationOptions={
        headerShown:false
    }
    constructor(){
        super()
        this.state = {
          email : "",
          password : "",
          userInfo :"",
          loggedIn:"",
          error:"",
        }
      }
      
      componentDidMount() {
        GoogleSignin.configure({
          webClientId: '454916408206-fqbn0k9jm5qu682ch88h9bofi3uqhd0l.apps.googleusercontent.com', 
          offlineAccess: true, 
          hostedDomain: '', 
          forceConsentPrompt: true, 
        });
      }
      login(email,password){
          firebase.auth().signInWithEmailAndPassword(email,password)
          .then(()=>{this.props.navigation.replace("Home1")})
          .catch(error=>{
              Alert.alert(error.message)})
      }
       signIn = async()=> {
        try {
          await GoogleSignin.hasPlayServices()
          const userInfo = await GoogleSignin.signIn()
          
          this.setState(
              { userInfo: userInfo,
                loggedIn: true,
                error:null,
             });
             const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken)
      // login with credential
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
      firebase.auth().onAuthStateChanged((user)=>{
                if(user){
                    this.props.navigation.replace("Home1")
                }
              })
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // when user cancels sign in process,
           // Alert.alert('Process Cancelled')
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // when in progress already
            Alert.alert('Process in progress')
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // when play services not available
            Alert.alert('Play services are not available')
          } else {
            // some other error
            Alert.alert('Something else went wrong... ', error.toString())
            setError(error)
          }
        }
      }

       getCurrentUserInfo = async()=> {
        try {
          const userInfo = await GoogleSignin.signInSilently()
          this.setState({ userInfo });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            // when user hasn't signed in yet
            Alert.alert('Please Sign in')
            setIsLoggedIn(false)
          } else {
            Alert.alert('Something else went wrong... ', error.toString())
            setIsLoggedIn(false)
          }
        }
      }

      signOut = async () => {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
      };


    render(){
        return(
          <KeyboardAvoidingView style={styles.container}>
            <View style={{flex:2,justifyContent:"center",alignItems:"stretch"}}>
            <View style={{justifyContent:"center",alignItems:"center"}}>
            <Text style={{textAlign:"center",color:"#CC6600",fontSize:45}}>OCR</Text>
            </View>
            <View style={{justifyContent:"center",alignItems:"stretch"}}>              
                  <TextInput placeholder="Email address" placeholderTextColor="#E0E0E0" style={styles.textinput} onChangeText={(text)=>this.setState({email:text})}                   
                />
                
                  <TextInput  placeholder="password" placeholderTextColor="#E0E0E0" secureTextEntry={true}  autoCapitalize="none" style={styles.textinput}
                   onChangeText={(text)=>this.setState({password:text})}                   
                />
               

                <Button rounded full info style={{margin:10}} onPress={()=>this.login(this.state.email,this.state.password)}>
                 <Text style={{color:"white",textAlign:"center",fontSize:25}}>Login</Text>
                </Button>
                <View style={{flexDirection: 'row',margin:5}}>
                  <View style={{backgroundColor: 'white', height: 2, flex: 1, alignSelf: 'center'}} />
                  <Text style={{color: "skyblue",alignSelf:'center', paddingHorizontal:5, fontSize: 24 }}>OR</Text>
                  <View style={{backgroundColor: 'white', height: 2, flex: 1, alignSelf: 'center'}} />
                </View>
                <View style={{marginTop:10,justifyContent:"center",alignItems:"center"}}>
                <GoogleSigninButton
                    style={{  height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.signIn}
                    disabled={this.state.isSigninInProgress} />
                </View>
                </View>
                </View>
                <View style={{justifyContent:"flex-end",alignItems:"stretch"}}>
                <TouchableOpacity
                 style={{borderTopWidth:2,borderTopColor:"white"}} 
                 onPress={()=>this.props.navigation.navigate("Signup")} >
                <Text style={{textAlign:"center",color:"white"}}>Do not have an account?
                <Text style={{color:"#99CCFF"}}>Signup</Text>
                </Text>
                </TouchableOpacity>
                </View>
          
            </KeyboardAvoidingView>
        );
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"black",
        // justifyContent:"center",
        // alignItems:"stretch"
    },
   textinput:{
       fontSize:20,
       color:"white",
       backgroundColor:"#606060",
       padding:10,
       margin:5
   }
})
