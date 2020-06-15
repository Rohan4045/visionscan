/**
 * Sample React Native Tesseract OCR App
 * https://github.com/jonathanpalma/react-native-tesseract-ocr
 * @author  Jonathan Palma <tanpalma04@gmail.com>
 * @flow
 */
import { Provider as PaperProvider } from 'react-native-paper';
import  React,{useEffect} from 'react';
import {View,ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStackScreen from './RootStackScreen';
import DrawerScreen from './DrawerScreen';
import * as firebase from 'firebase';
import {firebaseConfig} from '../../config';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CameraScreen from './CameraScreen';
import HomeScreen from './HomeScreen';
import ImagePickerScreen from './ImagePickerScreen';
import Reading from './Reading';
import ProfileScreen from './Profilescreen';
import Firstscreen from './Firstscreen';
import Loginscreen from './Loginscreen';
import Signupscreen from './Signupscreen';
import { DrawerContent } from './DrawerContent';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../components/content';
import AsyncStorage from '@react-native-community/async-storage';

firebase.initializeApp(firebaseConfig);
const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();
const RootStack = createStackNavigator();

// export default class App extends React.Component{
//   constructor(){
//     super()
//     this.state={
//     isUser : false
//     }
//   }
//   componentDidMount(){
//     SplashScreen.hide();
//     let user1 = firebase.auth().currentUser;
//     if(user1 !==null){
//       this.setState({
//         isUser : true
//       })
//     }
    
//     // this.unmount=firebase.auth().onAuthStateChanged((user)=>{
//     //   if(user!==null){
//     //       this.setState({
//     //         user:true
//     //       })
//     //   }   
//     // })
//   }
  
 
//   render(){
 const App = () => {

  const initialLoginState = {
    isLoading: true,
    
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
       
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
        
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
       
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(user) => {
      const userToken = user.email;
      
      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch(e) {
        console.log(e);
      }
      
      dispatch({ type: 'LOGIN',  token: userToken });
    },
    signOut: async() => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');

      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      
    },
  
  }), []);

  useEffect(() => {
    SplashScreen.hide();
    const bootstrapAsync = async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      await firebase.auth().onAuthStateChanged(function(user){
        if(user){
            if(user.displayName == null){
              user.updateProfile({
                displayName: "USER"
              })
            }
        }
      })
        // if(user.displayName = null){
        //   user.updateProfile({
        //     displayName: "user"
        //   }).then(console.log("e"),ok)
        // }
      

      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    };
    bootstrapAsync();
  },[]);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }
  return (
    
    <PaperProvider> 
    <AuthContext.Provider value={authContext}> 
    <NavigationContainer>
    
    {

       loginState.userToken == null ? 
     ( <RootStackScreen/>
     )
    : 
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home1" component={HomeStackScreen1} />
    </Drawer.Navigator>
    
    }
   
   
     
    </NavigationContainer>
    </AuthContext.Provider>
    </PaperProvider>
    
  );

}
const HomeStackScreen1= ({navigation}) => (
  <HomeStack.Navigator screenOptions={{
      headerStyle: {
      backgroundColor: '#445BFB',
      },
      headerTitleAlign:"center",
      headerTintColor: '#fff',
      headerTitleStyle: {
      fontWeight: 'bold'
      }
  }}
  > 
  <HomeStack.Screen name="Home" component={HomeScreen} options={{
    title:"Home",
    headerLeft: () => (
      <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
  )}}/>
  <HomeStack.Screen name="ImagePicker" component={ImagePickerScreen} options={{
    title:"ImagePicker",
    headerLeft: () => (
      <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
  )}}
    
  />
  <HomeStack.Screen name="Camera" component={CameraScreen} options={{
    title:"Camera",
    headerLeft: () => (
      <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
  )}}/>
  <HomeStack.Screen name="Reading" component={Reading} options={{
    title:"Readings",
    headerLeft: () => (
      <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
  )}}/>
  <HomeStack.Screen name="Profile" component={ProfileScreen} options={{
    title:"Profile",
    headerLeft: () => (
      <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
  )}}/>

  </HomeStack.Navigator>  

);

export default App;   
