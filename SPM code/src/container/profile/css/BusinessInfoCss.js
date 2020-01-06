import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },

  linearStyles: {
    width: DEVICE_WIDTH,
  },
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    // marginHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },
  headerLeft: {
    flex: 1
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize:30,
  },
  headerBody: {
    flex: 6
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },
  headerRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  menu_button: {
    marginVertical: Platform.OS === 'ios' ? -6 : -6,
    paddingTop:6,
    paddingBottom:6,
    paddingLeft:8,
    paddingRight:8,
    borderRadius:30,
    justifyContent:'center',
    alignItems:'center'
  },

  noAmenities: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  noAmenitiesText:{
    color:'#999',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },
  
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },
  
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    margin:10
  },
  verifyTxt: {
    position: 'absolute',
    right: 0,
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

  DatePickerView: {
    width: DEVICE_WIDTH - 50,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    marginTop: 3,
    color: '#9a9a9a',
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
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    width: DEVICE_WIDTH - 30
  },


  modalinput: {
    paddingTop: 10,
    width: 200,
  },

  getCenterView: {
    // { marginHorizontal: 10, marginTop: 30 }
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnText: {
    fontFamily: 'Roboto_medium',
    fontSize: 15,
    color: '#ffffff',
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
  linearBtnStyles: {
    borderRadius: 22
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
  }
});

export default styles;