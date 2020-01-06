import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // logoImage: {
  //   width: 150, 
  //   height: 117,
  //   resizeMode:'contain'
  // },

  // loginField: {
  //   flex: 1,
  //   marginTop: 20,
  //   marginBottom: 20,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // }

  logoImage: {
    flex: 1,
    width: null,
    width: null,
    resizeMode: 'contain'
  },

  loginField: {
    width: 250,
    height: 130,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },


});

export default styles;