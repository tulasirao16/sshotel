import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({

  linearBtnStyles: {
    borderRadius: 22
  },

  getLocation:{
    position:'absolute',
    top:44,
    right:10,
    zIndex:99
  },

  getLatitude:{
    position:'absolute',
    top:0,
    right:-10,
    zIndex:99
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
    flex: 1,
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
    flex: 6
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

  noAmenities: {
    paddingVertical: Device_Height/6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
    fontFamily: 'Roboto_medium',
  },

  noAmenitiesText:{
    color:'#025d8c',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },
  status: {
    zIndex: 10,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
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
    fontSize: 13,
    color: '#025d8c',
    fontFamily:'Roboto_medium'
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
  ServiceProvideName: {
    backgroundColor: '#5cb85c',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  textAreaContainer: {
    marginBottom:7,
  },

  textArea: {
    height: 100,
    justifyContent: "flex-start",
    color: '#333',
    fontFamily: 'Roboto_light',
    fontSize: 16,
    borderColor: '#009688',
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    width: DEVICE_WIDTH - 25,
    marginTop: 5
  },
  textAreaError: {
    height: 100,
    justifyContent: "flex-start",
    color: '#333',
    fontFamily: 'Roboto_light',
    fontSize: 16,
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    width: DEVICE_WIDTH - 25,
    marginTop: 5
  },

  picker:{
    width: undefined,
    marginTop:-10
  },

  title: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Roboto_medium',
  },

  pincodestyle:{
    flex:2,
    marginRight:20,
  },

  floatingInputView:{
    flexDirection:'row',
    marginRight:12,
    marginBottom:12,
    position:'relative'
  },
  floatingInputBusinessView: {
    padding: 10,
    paddingLeft: 0
  },
  dropdownView:{
    flexDirection:'row',
    marginBottom:8,
  },

  leftinputView:{
    flex:2,
    marginRight:20,
  },

  rightinputView:{
    flex:2,
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
  card: {
    position: 'relative',
    zIndex:10,
    marginBottom:0,
    marginLeft:0,
    marginTop:0,
    marginRight:0
  },
  businessNameView: {
    width: DEVICE_WIDTH-20,
    left: 10,
    backgroundColor: '#dcf4ff',
    marginVertical: 10
  },
  leftImageView: {
    width: Device_Height/11, 
    height: Device_Height/11,
  },
  // imageBusinessBox: {
  //   width: Device_Height/11.5, 
  //   height: Device_Height/11.5,
  //   borderRadius: 50,
  //   borderWidth: 1,
  //   borderColor: '#eee',
  //   backgroundColor:'#eee'
  // },
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

  imageBox: {
    width: Device_Height/9, 
    height: Device_Height/9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee', 
    backgroundColor:'#eee',
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
    fontFamily: 'Roboto_medium',
    paddingTop: 3
  },
  titleLocationType: {
    fontSize: 11,
    color: '#025d8c',
    fontFamily: 'Roboto_medium',
    paddingTop: 1
  },
  // create location
  DateGenderView: {
    flexDirection: 'row',

    // width: DEVICE_WIDTH-20,
    // left:10,
  },
  DatePicker: {
    flex: 2
  },
  genderView: {
    flex: 2
  },
  DatePickerView: {
    width: DEVICE_WIDTH / 2.5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#009688',
    marginBottom: 3
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom:0,
    marginRight:0,
    marginLeft:0,
  },
  imageBusinessBox: {
    width:Device_Height/9, 
    height: Device_Height/9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee', 
    backgroundColor:'#eee'
  },
  imgStyle: {
    width:Device_Height/9, 
    height: Device_Height/9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor:'#eee'
  },
  imgStyle1: {
    width: Device_Height/9, 
    height: Device_Height/9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee', 
    backgroundColor:'#eee',
    resizeMode: 'cover',
  },
  activeIndicatorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 1,
    top:0,
    bottom:0,left:0,right:0
  },
  activeIndicatorStyle: {
    color: '#ffffff'
  },

  addBtn:{
    position:'absolute',
    right:0,
    bottom:10,
    zIndex:99,
    borderRadius:5,
    color:'#333',
    borderWidth:1,
    borderColor:'#3db285',
    backgroundColor:'#3db285',
    height:null,
  },

  minusIcon:{
    width:30, 
    height:30, 
    justifyContent:'center', 
    alignItems:'center', 
    borderWidth:1, 
    borderColor:'#ccc', 
    borderRadius:25
  },
  errorIconView: {
    position: 'absolute',
    right:10,
    top: 10
  },

  errorIcon: {
    fontSize: 25,
    color: 'red',
    fontFamily: 'Roboto_medium',
  },
  successIcon: {
    fontSize: 25,
    color: 'green',
    fontFamily: 'Roboto_medium',
  },
  errorIconViewAddress: {
    position: 'absolute',
    right:10,
    bottom: 15
  },
  required: {
    color: 'red'
  },
  titleRadio: {
    fontSize: 14,
    fontWeight: '400',
    color: '#454545',
    fontFamily: 'Roboto_light',
    marginTop:10
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconMenuStyle1: {
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
    marginTop: -3,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
    // fontWeight: '700'
  },
  serverNotText: {
    fontSize: 14,
    fontFamily: 'Roboto_medium',
    marginTop: 10
  },

});

export default styles;