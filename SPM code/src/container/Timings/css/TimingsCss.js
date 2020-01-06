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
    color: '#fff',
    fontFamily: 'Roboto_medium'
  },

  headerStyle: {
    paddingTop: 20,
    paddingBottom: 10,
    height: 80
  },

  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },

  textBig: {
    fontSize: 15,
    fontFamily: 'Roboto_medium',
    color:'#333'
  },

  textHover:{
    fontSize: 13,
    fontFamily: 'Roboto_medium',
    color:'#025d8c'
  }



});

export default styles;