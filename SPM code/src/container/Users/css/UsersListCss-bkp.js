
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 35,
    marginHorizontal: 20,
    marginBottom: 0,

  },
  headerLeft: {
    flex: 1
  },
  iconMenuStyle: {
    color: '#fff',
  },
  headerBody: {
    flex: 4
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_light',
  },
  fitImage: {
    height: 50,
    width: 50
  },

  headerRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
});

export default styles;