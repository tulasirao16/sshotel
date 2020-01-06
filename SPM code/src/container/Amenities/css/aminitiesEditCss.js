import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    // marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },
  headerLeft: {
    flex: 1
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

  activeIndicatorStyle: {
    color: '#ffffff'
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

  noAmenities: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  noAmenitiesText:{
    color:'#01a4a2',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 3,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
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

  title: {
    fontSize: 16,
    color: '#333'
  },

  button: {
    width: DEVICE_WIDTH - 40,
    alignItems: 'center',
    justifyContent: 'center'
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
    // flexDirection:'row',
    paddingRight:0,
    paddingTop:7,
    paddingBottom:7,
    marginLeft:0,
  },
  listItemBottomWidth: {
    borderBottomWidth: 0
  },

  LeftView: {
    flex: 1, 
    marginRight: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#009688',
  },

  CenterView: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  dropdownView:{
    flexDirection:'row',
    marginBottom:8,
  },

  leftListItem:{
    flex:3,
  },

  centerListItem:{
    flex:4
  },

  aminityCharge: {
    marginTop: 5,
  },

  RightView: {
    flex: 2,
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
  serviceTitle: {
    fontSize: 15,
    color: '#333333',
    fontFamily: 'Roboto_medium',
  },
  serviceType: {
    fontSize: 13,
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
  },
  TextStyle: {
    fontSize: 15,
    color: '#222222',
    fontFamily: 'Roboto_light',
  },
  textInputStyle: {
    width:DEVICE_WIDTH/2,
    borderWidth:0.5,
    paddingHorizontal:10,
    marginLeft:5,
    paddingVertical:6,
    marginVertical:10,
    borderRadius:5,
    borderColor:'#019fa0',
    fontFamily:'Roboto_light'
},
topGap: {
    paddingTop:10
},
linearBtnStyles: {
    borderRadius: 22
},
status: {
  zIndex: 10,
  elevation: 2,
  width: DEVICE_WIDTH,
  height: 21,
  backgroundColor: 'transparent',
  elevation:0
},
pickerView: {
  width: DEVICE_WIDTH/2, 
  height:40, 
  borderWidth:0.7, 
  borderColor: '#01a4a2', 
  borderRadius: 5,
  marginBottom:5,
  paddingLeft:5
},
pickerViewCreateAmenity: {
  width: DEVICE_WIDTH/3.6, 
  height:38,
  borderWidth:0.5, 
  borderColor: '#01a4a2', 
  borderRadius: 5,
  marginBottom:5,
  paddingLeft:5
},
businessNameView: {
  width: DEVICE_WIDTH-20,
  left: 10,
  backgroundColor: '#dcf4ff',
  marginTop: 10
},
leftImageView: {
  width: Device_Height/9, 
  height: Device_Height/9,
},
imageBusinessBox: {
  width: Device_Height/9, 
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
imgBusinessStyle: {
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
serviceTitle: {
  fontSize: 15,
  color: '#333333',
  fontFamily: 'Roboto_medium',
},
serviceType: {
  fontSize: 13,
  color: '#01a4a2',
  fontFamily: 'Roboto_medium',
},
contentAmenityView: {
  flex: 1,
  backgroundColor: '#fff',
  borderColor: '#01a4a2',
  borderWidth: 1,
  borderRadius: 10,
  padding: 15,
  // paddingTop:25,
  marginLeft: 15,
  marginRight: 15,
  marginBottom: 15,
  marginTop:45,
},
eachAminityCenterView: {
  width: DEVICE_WIDTH,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  position:'absolute',
  top: 10,
  zIndex: 999,
},
eachAminityView: {
  width: DEVICE_WIDTH/2.3,
  height: Device_Height/15,
  borderRadius:27,
  backgroundColor: '#ffffff',
  elevation: 2,
  borderWidth:1, 
  borderColor: '#01a4a2', 
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},

imgAmenityStyle: {
  width:Device_Height/20, 
  height: Device_Height/23,
  borderRadius: 5,
  resizeMode: 'cover'
},
imgAmenityStyleOne: {
  flex: 1,
  width:null, 
  height: null,
  resizeMode: 'cover'
},
imageAmenityBox: {
  width:Device_Height/20, 
  height: Device_Height/23,
  borderRadius: 5,
  borderWidth: 0.5,
  borderColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'flex-start',
  left:-4
},
titleTypeWhite: {
  fontSize: 13,
  color: '#01a4a2',
  fontFamily: 'Roboto_medium',
  paddingLeft:3
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
headerBodyReload: {
  flex: 4,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  // left:-20
},
serverNotText: {
  fontSize: 14,
  fontFamily: 'Roboto_medium',
  marginTop:10
},

});

export default styles;