import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },
  linearStyles: {
    borderRadius:5
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    margin: 10,
  },

  gradientBtn:{
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight:'bold',
    color: '#fff',
    fontFamily: 'Roboto_light'
  },

  listItem: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },

  headerStyle: {
    paddingTop: 20,
    paddingBottom: 10,
    height: 80
  },

  backgroundImage: {
    resizeMode: 'contain',
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },

  textBig: {
    fontSize: 14,
    fontFamily: 'Roboto_light',
    color:'#333'
  },

  button_main:{
    marginHorizontal:8,
    marginVertical:8,
  },
  radioBtnStyle: {
    paddingRight: 8
  },
  linearBtnStyles: {
    borderRadius:5
  }
});

export default styles;
