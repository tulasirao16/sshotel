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

  headerMainView: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 30,
    marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 0,
  },

  contentOne: {
   flex: 1,
  //  flexDirection: 'row',
   justifyContent:'center',
   alignItems:'center',
   height: Device_Height-Device_Height/4-100
  },

  headerLeft: {
    flex: 1
  },

  errorMessage: { 
    color: 'red',
    fontFamily: 'Roboto_light',
    fontSize:13
  },

  landingView: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    width: DEVICE_WIDTH,
    height: Device_Height/4,
  },

  imageBox: {
    width:Device_Height/3, 
    height: Device_Height/6,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'transparent'
  },

  imgStyle: {
    width:Device_Height/3, 
    height: Device_Height/6,
    borderRadius: 5,
    resizeMode: 'cover'
  },

  headerBody: {
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Roboto_medium',
    left:-20
  },

  // headerRight: {
  //   flex: 2,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   opacity: 0
  // },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  container: {
    flex:1,
    paddingLeft:16,
    paddingRight:16,
    paddingTop:Device_Height/14,
},

  content: {
    backgroundColor: '#fff',
    padding:10,
    borderRadius: 10,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
    marginHorizontal: 10,
    marginVertical: 25,
    position:'relative'
  },

  getLocation:{
    position: 'absolute',
    right: 10,
    top: 0,
    zIndex:99
  },

  verifyTxt: {
    position: 'absolute',
    right: 0,
    bottom: 15
  },
  visibilityBtn: {
    position: 'absolute',
    right: 5,
    bottom: 15
  },
  button_main: {
    marginHorizontal: 15,
    marginVertical: 15,
  },

  gradientBtn: {
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto_light'
  },

  pickerView:{
    borderBottomWidth:1,
    borderBottomColor:'#01a4a2'
  },

  DatePickerView: {
    width: DEVICE_WIDTH - 50,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    marginTop: 3,
    borderColor: '#009688'
  },

  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },

  textSmall: {
    fontSize: 13,
    color: '#01a4a1',
    fontFamily: 'Roboto_light'
  },
  textFont: {
    fontFamily: 'Roboto_light'
  },

  title: {
    fontSize: 14,
    color: '#6d6d6d',
    fontFamily: 'Roboto_light'
  },

  headerTitleView: {
    flex: 4,
  },

  headerRight: {
    flex: 1,
    opacity: 0
  },
  textInputStyle: {
    width: DEVICE_WIDTH - 50,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: '#019fa0',
    fontFamily: 'Roboto_light'
  },
  fontStyle: {
    fontFamily: 'Roboto_light'
  },
  dobLeft: {
    width: 100
  },
  // dobRight: {
  //   marginBottom: 13
  // },

  // modalView: {
  //   backgroundColor: '#fff',
  //   height: 200,
  // },

  doneBtn: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
    backgroundColor: '#025d8c',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },

  closeBtn: {
    marginTop: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#025d8c',
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },

  dont:{
    marginVertical:20, 
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },

  signupText:{
    color: '#025d8c', 
    fontSize:14,
    fontFamily:'Roboto_medium', 
  },

  dontText:{
    color: '#999999', 
    fontSize:14,
    fontFamily:'Roboto_medium', 
  },

  modalContainer: {
    // flex: 1,
    alignItems: 'center',
    textAlign: 'center'
  },

  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },

  modalHeader: {
    alignItems: 'center',
    textAlign: 'center'
  },

  firstName: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 5,
    fontFamily: 'Roboto_bold'
  },

  otpText: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    paddingBottom: 5,
    fontFamily: 'Roboto_medium'
  },


  closeIcon: {
    color: '#acacac',
    fontSize: 16,
  },

  input: {
    paddingBottom: 10,
  },

  labels: {
    color: '#025d8c',
    fontFamily: 'Roboto_medium',
    fontSize: 14,
  },

  textArea: {
    height: 60,
    justifyContent: "flex-start",
    color: '#333',
    fontFamily: 'Roboto_medium',
    fontSize: 14,
    borderColor: '#009688',
    borderBottomWidth: 1,
    paddingRight: 5,
    flexDirection: 'row',
    width: DEVICE_WIDTH - 40
  },


  modalinput: {
    paddingTop: 10,
    width: 200,
  },

  linearBtnStyles: {
    borderRadius: 22
  },

  getCenterView: {
    // { marginHorizontal: 10, marginTop: 30 }
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnText: {
    fontFamily: 'Roboto_bold',
    fontSize: 14,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  accounttext: {
    color: '#999999',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },

  accounttextColor: {
    color: '#025d8c',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },
  activeIndicatorView: {
    width: DEVICE_WIDTH,
    height: Device_Height,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 1,
  },
  activeIndicatorStyle: {
    color: '#ffffff'
  },
  iconMenuStyle: {
    color: '#f7931e',
    fontSize: 16
  },
  headerMainViewReload: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 30,
    marginBottom: 0,
    paddingVertical: 10,
  },
  headerLeftReload: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 30,
  },
  headerBodyReload: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // left:-20
  },
  headerTitleStyle1: {
    marginTop:-3,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
    // fontWeight: '700'
  },
  serverNotText: {
    fontSize: 14,
    fontFamily: 'Roboto_medium',
    marginTop:10
  },
});

export default styles;
