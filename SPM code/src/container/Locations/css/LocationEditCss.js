
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({

  linearBtnStyles: {
    borderRadius: 22
  },
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    // paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },
  headerLeft: {
    flex: 1
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 30
  },
  iconLocationStyle:{
    color: '#fff',
    fontSize: 25
  },
  headerBody: {
    flex: 5
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },
  headerRight: {
    flex: 1,
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
  status: {
    zIndex: 10,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
  },

  noAmenities: {
    paddingVertical: Device_Height/6,
    justifyContent: 'center',
    alignItems: 'center'
  },

  noAmenitiesText:{
    color:'#025d8c',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },
  floatingInputView: {
    padding: 10
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
    width: DEVICE_WIDTH - 20
  },
  labelTxt: {
    fontSize: 17,
    marginVertical: 5,
    fontFamily: 'Roboto_medium',
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bodyContainer: {
    width: DEVICE_WIDTH
  },

  fitImage: {
    width: null,
    height: null,
    flex: 1,
    resizeMode: 'cover'
  },
  optionTitle: {
    marginHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#01a4a2'
  },
  regularFont: {
    color: '#8a8786'
  },
  button_main: {
    marginTop: 60,
  },
  mediumFont: {
    fontFamily: 'Roboto_medium',
    fontSize: 12
  },

  button: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },

  content: {
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 15,
    marginRight: 15,
  },

  styleOne: {
    margin: 30,
    marginTop: 100,
    marginBottom: 100,
  },
  noteFont: {
    fontSize: 12,
  },
  textCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'Roboto_medium',
    fontSize: 80, marginVertical: 10,
  },
  textCenterNote: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 12,
    color: 'red',
    fontFamily: 'Roboto_medium'
  },
  textCenterNoteSuccess: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 12,
    color: 'green',
    fontFamily: 'Roboto_medium'
  },
  buttonNext: {
    width: 140,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#009688',
  },
  buttonNext: {
    width: 140,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#009688',
  },

  plusIcon: {
    flex: 1,
    backgroundColor: 'gray',
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 50,
    position: 'absolute',
    left: (Platform.OS === 'ios') ? 140 : 13,
    bottom: 16,
    zIndex: 1,
  },
  input: {
    paddingBottom: 10,
  },
  dropdownView:{
    flexDirection:'row',
    marginBottom:8,
  },
  pincodestyle:{
    flex:2,
    marginRight:20,
  },

  textAreaContainer: {
    borderColor: '#009688',
    borderBottomWidth: 1,
    padding: 5,
    width: DEVICE_WIDTH - 30,
    marginBottom:7
  },
  textArea: {
    height: 50,
    justifyContent: "flex-start",
    fontFamily: 'Roboto_medium'
  },

  verified: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  inputFieldStyle: {
    width: DEVICE_WIDTH - 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#009688',
    marginBottom: 15
  },
  dobLeft: {
    width: 100
  },
  dobRight: {
    marginBottom: 13
  },
  labels: {
    fontSize: 14,
    color: '#454545',
    fontFamily:'Roboto_light'
  },
  floatingInputView:{
    padding:10
  },
  leftView:{
    flex:2,
    borderBottomWidth: 1, 
    borderBottomColor: '#009688',
    marginRight:20,
  },

  rightView:{
    flex:2,
    borderBottomWidth: 1, 
    borderBottomColor: '#009688'
  },
  
  mapIconView: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    top: -30,
    right: 10
  },
  mapIcon: {
    color: '#009688',
  },
  updateBtnView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'center'
  },
  centerLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },

  BtnText: {
    fontFamily: 'Roboto_medium',
    fontSize: 15,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessNameView: {
    width: DEVICE_WIDTH-20,
    left: 10,
    backgroundColor: '#dcf4ff',
    marginTop: 10
  },
  leftImageView: {
    width: Device_Height/11, 
    height: Device_Height/11,
  },
  imageBusinessBox: {
    width: Device_Height/11.5, 
    height: Device_Height/11.5,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: 'transparent'
  },
  imgBusinessStyle: {
    width: Device_Height/11.5, 
    height: Device_Height/11.5,
    borderRadius: 50,
    resizeMode: 'cover'
  },
  cardBusiness: {
   marginBottom: 0,
   marginLeft: 0,
   marginTop: 0,
   marginRight: 0
  },
  cardItemBusinessStyle: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10
  },
  floatingInputBusinessView: {
    padding: 10,
    paddingLeft: 0
  },
  propertyTitle: {
    fontSize: 15,
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
  },
  reapetingDateTxt: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Roboto_medium',
  },
  titleType: {
    fontSize: 13,
    color: '#025d8c',
    fontFamily: 'Roboto_light',
    paddingTop: 3
  },
  titleLocationType: {
    fontSize: 11,
    color: '#025d8c',
    fontFamily: 'Roboto_medium',
    paddingTop: 1
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



});

export default styles;