import React from 'react';
import {
    View,
    Text,
    TextInput,
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert
} from 'react-native'
import {Avatar} from 'react-native-paper'
import ImagePicker from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import Dialog from "react-native-dialog";
import { AuthContext } from '../../components/content';

import * as firebase from 'firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Button = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableOpacity;
const imagePickerOptions = {
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
      skipBackup: true,
    },
  };



export default function ProfileScreen(){
    const [data, setdata]=React.useState({
        username: "",
        previousUserName:"",
        email:"",
        previousEmail:"",
        password:"",
        imageSource: null,
        isLoading: false,
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3:false,
    });

    React.useEffect(()=> {
        const bootstrapasync = async() => {
            let user=null;
            user=firebase.auth().currentUser;
            if(user != null){
               
                setdata({
                    ...data,
                    username: user.displayName,
                    previousUserName: user.displayName,
                    email: user.email,  
                    previousEmail: user.email                  
                })
            }
            
            };
          bootstrapasync();
        },[]);
    
        selectImage = () => {
            setdata({...data, isLoading: true });
        
            ImagePicker.showImagePicker(imagePickerOptions, (response) => {
              if (response.didCancel) {
                setdata({...data, isLoading: false });
              } else if (response.error) {
                setdata({...data, isLoading: false });
              } else {
                const source = { uri: response.uri }; 
                
                console.log("uri",response.path) 
                  setdata({
                      ...data,
                      imageSource: source
                  })
                
              }
            });
            }
     
        const showDialog = () => {
            setdata({
                ...data,
                dialogVisible: true
            })
           
          }

          const showDialog2 = () => {
            setdata({
                ...data,
                dialogVisible2: true
            })
           }

           const showDialog3 = () => {
            setdata({
                ...data,
                dialogVisible3: true
            })
           }

           const textInputChange = (val) => {
           
                setdata({
                    ...data,
                    username: val
                    
                })     
        }
        const textInputChange2 = (val) => {
           
            setdata({
                ...data,
                email:val
                
            })     
    }
        const handleCancel = () => {
            setdata({
                ...data,
                username: data.previousUserName,
                
                dialogVisible: false,
                
            })
        };
        const handleCancel2 = () => {
            setdata({
                ...data,
                email: data.previousEmail,
                
                dialogVisible2: false,
                
            })
        };
         
        const handleOK = () => {
                setdata({
                    ...data,
                    previousUserName: data.username,
                    dialogVisible: false,
                })
                let user = firebase.auth().currentUser
                if(user != null){
              user.updateProfile({
                  displayName: data.username
              }) 
            }
          };

          const { signOut } = React.useContext(AuthContext);

         const reauthenticate = () => {
            let user = firebase.auth().currentUser;
        
            let cred = firebase.auth().signInWithEmailAndPassword(
                user.email, data.password).catch((e)=>Alert.alert(e));
                console.log("cred",cred);
            return user.reauthenticateWithCredential(cred);
          }

          const handleOK2 = () => {
            setdata({
                ...data,
                previousEmail: data.email,
                dialogVisible2: false,
            })

            showDialog3();
            reauthenticate().then(() => {
            let user = firebase.auth().currentUser;
            user.updateEmail(data.email).then(() => {
                console.log("Email updated!");
            }).catch((error) => { console.log(error); });
            }).catch((error) => { console.log(error); });
              
          
    
}
    //    const signout = () => { 
    //     firebase.auth().signOut().then( function(){
            
    //         signOut();
    //         })
    // }

    return(
        <View style={{flex:1}}>
        <Button onPress={()=>selectImage()} >
        <View style={{justifyContent:"center",alignItems:"center",marginTop:80,marginBottom:20}}>
            
             {
              data.imageSource === null ?
               <Avatar.Icon size={120} icon="account-question" color="#F0EAEA"
                   style={{backgroundColor:"#A0A0A0"}}
               />
                : 
                <Avatar.Image size={120} source={data.imageSource} /> 
            }
        </View>
        </Button>
     
        <View style={{paddingVertical:10,paddingHorizontal:20}}>
        <Text style={[styles.text_footer, {
                marginTop: 10
            }]}>Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    value={data.username}
                    editable={false}
                    style={styles.textInput}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    onPress={showDialog}
                >
                <Feather 
                    name="edit-2"
                    color="#445BFB"
                    size={20}
                />
                </TouchableOpacity>  
            </View>
        
            <Text style={[styles.text_footer, {
                marginTop: 10
            }]}>E-mail</Text>
            <View style={styles.action}>
                <Feather 
                    name="mail"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    value={data.email}
                    editable={false}
                    style={styles.textInput}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    onPress={() =>
                       showDialog2()
                    }
                >
                <Feather 
                    name="edit-2"
                    color="#445BFB"
                    size={20}
                />
                </TouchableOpacity>     
            </View>

            <Dialog.Container visible={data.dialogVisible}>
            <Dialog.Title>Enter Name</Dialog.Title>
            <Dialog.Description>
                Please enter your full name
            </Dialog.Description>
            <Dialog.Input             
            value={data.username}
            autoCapitalize="none" 
            onChangeText={(val) => textInputChange(val)}
            editable={true} />
            
            <Dialog.Button label="Cancel" onPress={() => handleCancel()} />
            <Dialog.Button label="OK" onPress={() => handleOK()} on/>
            </Dialog.Container>


            <Dialog.Container visible={data.dialogVisible2}>
             <Dialog.Title>Enter E-mail</Dialog.Title>
             <Dialog.Description>
                 Please enter your e-mail address
             </Dialog.Description>
             <Dialog.Input 
             value={data.email}
             autoCapitalize="none" 
             onChangeText={(val) => textInputChange2(val)}
             editable={true} />
             <Dialog.Button label="Cancel" onPress={() => handleCancel2()} />
             <Dialog.Button label="Update" onPress={() => Alert.alert('Alert!', 'Do you want to update?', [
{ text: "Cancel", onPress: () => console.log("back") },

{ text: "YES", onPress: () => handleOK2() }
],
{ cancelable: true })
              } />
             </Dialog.Container>

             <Dialog.Container visible={data.dialogVisible3}>
            <Dialog.Title>Enter password </Dialog.Title>
            <Dialog.Description>
                Please enter your account password
            </Dialog.Description>
            <Dialog.Input             
            autoCapitalize="none" 
            onChangeText={(val) => setdata({
                ...data,
                password: val
            })}
            editable={true} />
            
            <Dialog.Button label="Cancel" onPress={() => setdata({
                ...data,
                password:"",
                dialogVisible3: false
            })}  />
            <Dialog.Button label="OK" onPress={() => setdata({
                ...data,
                dialogVisible3: false
            })} />
            </Dialog.Container>
            

         </View>
        </View>
    );
} 

const styles = StyleSheet.create({

    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#A0A0A0',
        paddingBottom: 5
    },

    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
})

  // let user = firebase.auth().currentUser
            // if(user != null){
            //     let Credential
            //     user.updateEmail(data.email).then(function(){
            //         user.reauthenticateWithCredential(Credential).then(function(){
            //             Alert.alert('Update Successful','Login again')
            //         })
                   
                //     ,[
                //        { text: "OK", onPress: () => user.updateEmail(data.email).then(function(){
                //            signout()
                //        }) }
                //    ],
                   
                //    { cancelable: false }
                    
                //    }
                    
            
    //   })