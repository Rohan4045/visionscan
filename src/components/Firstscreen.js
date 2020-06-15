import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Image,
    StatusBar,
    Button

    } from 'react-native';

import styles from '../../styles';

import LinearGradient from 'react-native-linear-gradient';
export default class Firstscreen extends React.Component{
   
    static navigationOptions={
        headerShown:false
    }
  
    
    render(){
        return(
            <View style={styles.fcontainer}>
            <StatusBar backgroundColor='#3447C3' barStyle="light-content"/>
           
            <View
             style={{flexDirection:"row" ,justifyContent:"center",alignItems:"center",padding:15}}>
         
            <Image source={require('../../android/app/src/main/assets/icon13.png')}/>

            </View>
            
            <TouchableOpacity  style={{margin:10,alignItems:"stretch"}} onPress={()=>this.props.navigation.navigate("Signup")}>
            <LinearGradient colors={['#445BFF','#4B59B6']}>
            <Text style={{textAlign:"center",color:"white",fontSize:20,padding:10}}> Create New Account </Text>  
            </LinearGradient>
                                                                
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Login")}>
            
            <Text style={{color:"#445BFB",textAlign:"center",marginTop:20,fontSize:20}}>Log In</Text>
            </TouchableOpacity>


            </View>
           
        );
    }
}


