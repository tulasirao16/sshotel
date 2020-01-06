import { StyleSheet, Dimensions, Platform } from 'react-native';
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

  iconSearchStyle:{
    color: '#fff',
    fontSize: 25
  },

  headerBody: {
    flex: 4
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
  checkmarkStyle:{
    color: '#fff',
    fontSize: 25,
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

  serviceType:{
    fontSize:12,
    fontFamily: 'Roboto_medium',
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
  title: {
    fontSize: 16,
    color: '#333'
  },
  input:{
    marginTop:10,
  },

 
  button_main: {
    marginHorizontal: 10,
    marginVertical: 10,
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
  gradientBtn: {
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto_medium'
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
    // flexDirection:'row',
    paddingRight:0,
    paddingTop:7,
    paddingBottom:7,
    marginLeft:0,
  },

  LeftView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    flex:2,
  },

  centerListItem:{
    flex:4
  },

  aminityCharge: {
    marginTop: 5,
  },

  RightView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    fontFamily: 'Roboto_bold'
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
    marginTop:5,
  },

  BtnText: {
    fontFamily: 'Roboto_medium',
    fontSize: 15,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTxt: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Roboto_medium'
  },
  businessNameView: {
    width: DEVICE_WIDTH-20,
    left: 10,
    backgroundColor: '#dcf4ff',
    marginTop: 10,
    marginBottom:8
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
    backgroundColor:'#eee',
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
  list: {
    flexDirection: 'row',
    // justifyContent:'center', 
    // alignItems:'center',
    // borderBottomWidth:1, 
    // borderColor:'#ccc', 
    // height: 50,
  },
  linearBtnStyles: {
    borderRadius: 22
  },
  makeNoteLabelTxt: {
    color: '#025d8c',
    fontSize: 13,
    fontFamily: 'Roboto_bold',
    marginLeft:5,
  },
  middle: {
    marginVertical:10
  },
  makeNoteView: {
    margin:10, 
    paddingHorizontal:10,
    paddingVertical:20, 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    borderWidth: 0, 
    borderRadius:6, 
    backgroundColor: '#ffffff',
    padding:5, 
    elevation:1 
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
    color: '#FFFFFF'
  },

});

export default styles;