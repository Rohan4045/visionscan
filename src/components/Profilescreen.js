import React from 'react';
import {
    View,
    Text
} from 'react-native'
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component{
    constructor(){
        super()
        this.state={
            username:"",
            
        }
    }
    UNSAFE_componentWillMount(){
        const user= firebase.auth().currentUser;
        if(user != null) {
            this.setState({
                username:user.email,
                
            })
        }
    }
    
    render(){
        console.log("hello",this.state.username,firebase.auth().currentUser)
        return(
    
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <View>
                <Text style={{fontSize:30,color:"red"}}>Username: </Text>
            
                <Text style={{fontSize:30,color:"black"}}>{this.state.username}</Text>
                </View>
                {/* <View style={{flexDirection:"row",padding:10}}>
                <Text>Password</Text>
                <Text>{this.state.password}</Text>
                
                </View> */}
            </View>
            
        )
    }
}