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

  iconSearchStyle: {
    color: '#fff',
    fontSize: 25,
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
  headerBody: {
    flex: 5
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
    alignItems:'center'
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

  NoInternet:{
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:20,
    paddingVertical:20,
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 0,
    marginRight: 10,
    marginLeft: 10,
  },
  contentAmenityView: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#01a4a2',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingTop:25,
    margin: 15
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

  imgAmenityStyle: {
    width:Device_Height/23, 
    height: Device_Height/23,
    borderRadius: 5,
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
  imgStyle: {
    width:Device_Height/9, 
    height: Device_Height/9,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor:'#eee'
  },
  floatingInputView: {
    padding: 10,
    paddingLeft: 0
  },
  propertyTitle: {
    fontSize: 15,
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
  },
  titleType: {
    fontSize: 13,
    color: '#025d8c',
    fontFamily: 'Roboto_light',
    paddingTop: 5
  },
  titleTypeWhite: {
    fontSize: 13,
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
    paddingLeft:3
  },
  cardItemStyle: {
    paddingLeft:10,
    paddingTop:5,
    paddingBottom:5,
    paddingRight:10
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
    paddingTop:9,
    paddingBottom:0,
    marginLeft:0,
    borderBottomWidth: 0
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
  leftListItemAmenitiesEditView :{
    flex:3,
  },
  leftListItem:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  centerListItemAmenitiesEditView: {
    flex:4
  },
  
  centerListItem:{
    width: DEVICE_WIDTH-120,
    left:40,
    flexDirection: 'row',
    justifyContent: 'center',
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
    fontSize: 14,
    fontFamily: 'Roboto_light',
    color: '#019c9e'
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
    fontSize: 15,
    fontFamily: 'Roboto_medium',
    color: '#025d8c',
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
    fontFamily: 'Roboto_bold',
    fontSize: 16,
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
    borderColor: '#025d8c', 
    borderRadius: 5,
    marginBottom:5
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
  },

  aminityView:{
    paddingTop:20,
    position:'relative'
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
  pickerViewCreateAmenity: {
    width: DEVICE_WIDTH/3.6, 
    height:38,
    borderWidth:0.5, 
    borderColor: '#01a4a2', 
    borderRadius: 5,
    marginBottom:5,
    paddingLeft:5
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
  BtnText1: {
    fontFamily: 'Roboto_medium',
    fontSize: 15,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

linearBtnStyles: {
borderRadius: 22
},


});

export default styles;