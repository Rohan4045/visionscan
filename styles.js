import { PixelRatio, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    margin: 5,
    color:"#445BFB"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  imageContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  image: {
    width: 400,
    height: 80,
  },
  rounded: {
    borderRadius: 75,
  },
  fcontainer:{
    flex:1,
    backgroundColor:'#EEF2F7',
    justifyContent:"center",
    alignItems:"stretch"
  },
  ftext1:{
    textAlign:"center",fontFamily:"ComicSans",color:"#CC6600",fontSize:45
  },



});

export default styles;
