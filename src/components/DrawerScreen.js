import  React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CameraScreen from './CameraScreen';
import HomeScreen from './HomeScreen';
import ImagePickerScreen from './ImagePickerScreen';
import Reading from './Reading';
import ProfileScreen from './Profilescreen';
import { DrawerContent } from './DrawerContent';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const HomeStack = createStackNavigator();
const ImageStack = createStackNavigator();
const CameraStack = createStackNavigator();
const ReadingStack = createStackNavigator();
const ProfileStack = createStackNavigator();

export default function HomeScreen1(){
    return(
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home1" component={HomeStackScreen1} />
        {/* <Drawer.Screen name="Home" component={HomeStackScreen} />
        <Drawer.Screen name="ImagePicker" component={ImageStackScreen} />
        <Drawer.Screen name="CameraScreen" component={CameraStackScreen} />
        <Drawer.Screen name="ReadingScreen" component={ReadingStackScreen} />
        <Drawer.Screen name="Profile" component={ProfileStackScreen} /> */}
      </Drawer.Navigator>
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
    options={{
            
    headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
    )
    }}> 
    <HomeStack.Screen name="Home" component={HomeScreen} options={{title:"Home"}}/>
    <HomeStack.Screen name="ImagePicker" component={ImagePickerScreen} options={{title:"ImagePicker"}}/>
    <HomeStack.Screen name="Camera" component={CameraScreen} options={{title:"Camera"}}/>
    <HomeStack.Screen name="Reading" component={Reading} options={{title:"Readings"}}/>
    <HomeStack.Screen name="Profile" component={ProfileScreen} options={{title:"Profile"}}/>

    </HomeStack.Navigator>  

  );

//   const HomeStackScreen = ({navigation}) => (
    // <HomeStack.Navigator screenOptions={{
    //         headerStyle: {
    //         backgroundColor: '#445BFB',
    //         },
    //         headerTitleAlign:"center",
    //         headerTintColor: '#fff',
    //         headerTitleStyle: {
    //         fontWeight: 'bold'
    //         }
    //     }}>
            // <HomeStack.Screen name="Home" component={HomeScreen} options={{
            // title:'Home',
            // headerLeft: () => (
            //     <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
            // )
            // }} />
//     </HomeStack.Navigator>
//     );
  
//     const ImageStackScreen = ({navigation}) => (
//       <ImageStack.Navigator screenOptions={{
//               headerStyle: {
//               backgroundColor: '#445BFB',
//               },
//               headerTitleAlign:"center",
//               headerTintColor: '#fff',
//               headerTitleStyle: {
//               fontWeight: 'bold'
//               }
//           }}>
//               <ImageStack.Screen name="ImagePicker" component={ImagePickerScreen} options={{
//               title:'ImagePicker',
//               headerLeft: () => (
//                   <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
//               )
//               }} />
//       </ImageStack.Navigator>
//       );
  
//       const CameraStackScreen = ({navigation}) => (
//         <CameraStack.Navigator screenOptions={{
//                 headerStyle: {
//                 backgroundColor: '#445BFB',
//                 },
//                 headerTitleAlign:"center",
//                 headerTintColor: '#fff',
//                 headerTitleStyle: {
                
//                 fontWeight: 'bold'
//                 }
//             }}>
//                 <CameraStack.Screen name="Camera" component={CameraScreen} options={{
//                 title:'Camera',
              
//                 headerLeft: () => (
//                     <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
//                 )
//                 }} />
//         </CameraStack.Navigator>
//         );
  
//         const ReadingStackScreen = ({navigation}) => (
//           <ReadingStack.Navigator screenOptions={{
//                   headerStyle: {
//                   backgroundColor: '#445BFB',
//                   },
//                   headerTitleAlign:"center",
//                   headerTintColor: '#fff',
//                   headerTitleStyle: {
//                   fontWeight: 'bold'
//                   }
//               }}>
//                   <ReadingStack.Screen name="Reading" component={Reading} options={{
//                   title:'Reading',
//                   headerLeft: () => (
//                       <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
//                   )
//                   }} />
//           </ReadingStack.Navigator>
//           );

//           const ProfileStackScreen = ({navigation}) => (
//             <ProfileStack.Navigator screenOptions={{
//                     headerStyle: {
//                     backgroundColor: '#445BFB',
//                     },
//                     headerTitleAlign:"center",
//                     headerTintColor: '#fff',
//                     headerTitleStyle: {
//                     fontWeight: 'bold'
//                     }
//                 }}>
//                     <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{
//                     title:'Profile',
//                     headerLeft: () => (
//                         <Icon.Button name="ios-menu" size={25} backgroundColor="#445BFB" onPress={() => navigation.openDrawer()}></Icon.Button>
//                     )
//                     }} />
//             </ProfileStack.Navigator>
//             );