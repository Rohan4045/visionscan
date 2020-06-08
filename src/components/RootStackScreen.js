import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import Firstscreen from './Firstscreen';
import Loginscreen from './Loginscreen';
import Signupscreen from './Signupscreen';


const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="First"  component={Firstscreen}/>
        <RootStack.Screen name="Login"  component={Loginscreen}/>
        <RootStack.Screen name="Signup" component={Signupscreen}/>
    </RootStack.Navigator>
);

export default RootStackScreen;