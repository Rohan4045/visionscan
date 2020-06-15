import {
    Avatar,
    Drawer,
    Text,
    Title,
    Caption,
} from 'react-native-paper';
import React, { useState, useEffect }  from 'react';
import { View, StyleSheet , Image} from 'react-native';
// import {Avatar,Icon as icon1} from 'react-native-elements';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import * as firebase from 'firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

import { AuthContext } from '../../components/content';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



export function DrawerContent(props) {
    const [data, setdata]=useState({
        username: null,
        email:"",
        photourl:null
    });

    useEffect(()=> {
        const bootstrapasync = async() => {
            let user=null;
            user=await firebase.auth().currentUser;
            if(user != null){
               
                setdata({
                    ...data,
                    username: user.displayName,
                    email: user.email,
                    photourl: user.photoURL
                    
                })
            }
            
            //     setdata({
                            
            //                 username:  await AsyncStorage.getItem('username'),
            //                 email: await AsyncStorage.getItem('userToken')
            //             })
             
            };
          bootstrapasync();
        },[]);
 
    const { signOut } = React.useContext(AuthContext);

    const signout = () => {
        firebase.auth().signOut().then( function(){
            
            signOut();
            })
    }
    
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                    <View style={{flexDirection:'row',marginTop: 15}}>
                    <Avatar.Icon size={80} icon="account" color="#fff" style={{backgroundColor:"#445BFB"}}/>

                        <View style={{marginLeft:15,marginTop:15, flexDirection:'column'}}>
                            <Title style={styles.title}>{data.username}</Title>
                            <Caption style={styles.caption}>{data.email}</Caption>
                        </View>
                        </View>   
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Readings"
                            onPress={() => {props.navigation.navigate('Reading')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-details" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="bookmark-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Bookmarks"
                            onPress={() => {props.navigation.navigate('BookmarkScreen')}}
                        /> */}
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="settings-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('SettingScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-check-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => {props.navigation.navigate('SupportScreen')}}
                        /> 
                    </Drawer.Section>
                     
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress = {() => signout()}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });