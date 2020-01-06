import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },

  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
  },

  headerTitle:{
    fontSize: 16, 
    justifyContent: 'flex-start', 
    fontFamily: 'Roboto_medium', 
    paddingTop: 10, 
    color: '#fff', 
  },

  button_main: {
    marginHorizontal: 10,
    marginVertical: 10,
  },

  gradientBtn: {
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto_medium'
  },

  headerStyle: {
    paddingTop: 20,
    paddingBottom: 10,
    height: 80
  },


  circle: {
    borderWidth: 1,
    width: 35,
    height: 35,
    borderColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },

  removeIcon: {
    textAlign: 'center',
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },

  addIcon: {
    textAlign: 'center',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },

  button_main: {
    marginTop: 40,
  },

  button: {
    width: DEVICE_WIDTH - 40,
    alignItems: 'center',
    justifyContent: 'center'
  },

  list: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    height: 50,
  },

  buttonNext: {
    width: DEVICE_WIDTH - 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#009688',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },

  images: {
    resizeMode: 'contain',
    width: 30,
    height: 30
  },

  bigText:{
    fontFamily:'Roboto_medium',
    fontSize:14,
    color:'#333'
  }


});

export default styles;