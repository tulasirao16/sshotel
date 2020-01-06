
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'#eef5fb'
    backgroundColor: '#fff',
  },

  content: {
    backgroundColor: '#fff',
    padding: 12,
  },

  linearStyles: {
    width: DEVICE_WIDTH,
  },

  headerStyle: {
    paddingTop: 20,
    paddingBottom: 10,
    height: 80
  },

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 55,
    marginTop: 40,
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
    fontSize: 20,
    fontFamily: 'Roboto_medium',
    fontWeight: '700'
  },
  headerRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headermapIcon: {
    width: 25,
    height: 25,
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  bodyContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: DEVICE_WIDTH-20
  },
  


});

export default styles;