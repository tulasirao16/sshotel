import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },
  
  linearStyles: {
    width: DEVICE_WIDTH,
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
  },

  input:{
    marginTop:10,
  },

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 45,
    marginTop: 33,
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
  },

  headerRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  headerTitle: {
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

  guestTxt: {
    color: '#fff',
    fontSize: 20
  },

  button_main: {
    marginVertical: 10,
  },

  gradientBtn: {
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto_medium'
  },

  textSmall: {
    fontSize: 14,
    fontFamily: 'Roboto_medium',
    color: '#333'
  },

  // labelView: {
  //   justifyContent: 'flex-start',
  //   alignItems: 'flex-start',
  //   paddingVertical: 15
  // },

  view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bigText:{
    fontFamily:'Roboto_medium',
    fontSize:14,
    color:'#333'
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
  list: {
    flexDirection: 'row',
    // justifyContent:'center', 
    // alignItems:'center',
    // borderBottomWidth:1, 
    // borderColor:'#ccc', 
    // height: 50,
  },
  

  listitem:{
    flexDirection:'row',
    paddingRight:0,
    paddingTop:0,
    paddingBottom:4,
    marginLeft:0,
  },

  LeftView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  CenterView: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

    RightView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  dropdownView:{
    flexDirection:'row',
    marginBottom:8,
  },

  leftListItem:{
    flex:2,
  },

  centerListItem:{
    flex:4
  },

  aminityCharge: {
    marginTop: 5,
  },


  images: {
    resizeMode: 'contain',
    width: 30,
    height: 30
  },

  textSmall: {
    fontSize: 12,
    fontFamily: 'Roboto_medium',
  },

  textColor:{
    color: '#019c9e'
  },

  
  textLight: {
    fontSize: 13,
    fontFamily: 'Roboto_light',
    color: '#333',
  },

  textMedium: {
    fontSize: 14,
    fontFamily: 'Roboto_medium',
    color: '#333',
  },

  textBig: {
    fontSize: 14,
    fontFamily: 'Roboto_bold',
    color: '#333',
  },

  labelView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  labelTxt: {
    color: '#333',
    fontSize: 12,
    fontFamily: 'Roboto_light'
  },
  bigTxt: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Roboto_medium'
  },

  btnModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop:10,
  },

  BtnText: {
    fontFamily: 'Roboto_light',
    fontSize: 14,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },



});

export default styles;