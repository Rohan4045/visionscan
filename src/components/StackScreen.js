import  React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen1 from './DrawerScreen';

const Stack= createStackNavigator();

export default function StackScreen(){
 
 return(
    <Stack.Navigator
    screenOptions={{
    headerShown: false
    }}
    >
   <Stack.Screen name="Home1" component={HomeScreen1} options={{ title: null }} />
   </Stack.Navigator>  
 );
}