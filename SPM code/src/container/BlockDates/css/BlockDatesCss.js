import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {

    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#eef5fb'
  },

  content: {
    width: DEVICE_WIDTH,
    backgroundColor: '#eef5fb',
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: Device_Height - (Device_Height / 11 + 100 + 41)
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
    flex: 1
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 30
  },
  iconSearchStyle: {
    color: '#fff',
    fontSize: 25,
  },
  iconMenuPlusStyle: {
    color: '#fff',
    fontSize: 33
  },
  headerBody: {
    flex: 5
  },
  menu_button: {
    marginTop: -5,
    marginVertical: Platform.OS === 'ios' ? -6 : -6,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
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
  status: {
    zIndex: 10,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
  },
  // ==================================================
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    elevation: 0,
    marginTop: 0,
    marginBottom: 4
  },

  cardItem: {
    marginLeft: 0,
    paddingLeft: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 0,
    marginBottom: 0
    // borderColor: '#e2e2e2',
    // borderBottomWidth: 0.5,
  },
  listMain: {
    flexDirection: 'row',
    width: DEVICE_WIDTH - 20,
  },
  ServiceTitle: {
    fontSize: 14,
    fontFamily: 'Roboto_medium'
  },
  bookingTextLabel: {
    fontSize: 13,
    fontFamily: 'Roboto_light',
    color: '#707070'
  },
  bookingTextToLabel: {
    fontSize: 13,
    fontFamily: 'Roboto_light',
    color: '#707070',
    paddingLeft: 20
  },
  bookingTextEnd: {
    fontSize: 13,
    fontFamily: 'Roboto_light',
    // color: '#333333',
    color: '#f66a4b'
  },
  // =================================================

  headerPlusButton: {
    width: 15,
    height: 15,
  },
  filterIconsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  filterIcons: {
    color: '#fff'
  },

  label: {
    flexGrow: 1,
    fontSize: 20,
    fontWeight: `600`,
    textAlign: `left`,
    marginVertical: 8,
    paddingVertical: 3,
    color: `#f5fcff`,
    backgroundColor: `transparent`
  },
  businessNameView: {
    width: DEVICE_WIDTH,
    backgroundColor: '#dcf4ff',
    marginTop: 1
  },
  leftImageView: {
    width: Device_Height / 9,
    height: Device_Height / 9,
  },
  imageBusinessBox: {
    width: Device_Height / 9,
    height: Device_Height / 9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#eee'
  },
  imgBusinessStyle: {
    width: Device_Height / 9,
    height: Device_Height / 9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#eee',
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
  linearBtnStyles: {
    borderRadius: 22
  },
  BtnText: {
    fontFamily: 'Roboto_medium',
    fontSize: 15,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  headerTitleStyle: {
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

  // container: {
  //   flex: 1,
  //   backgroundColor: '#eef5fb'
  // },
  // headerMainView: {
  //   flexDirection: 'row',
  //   width: DEVICE_WIDTH,
  //   height: 50,
  //   marginTop: 10,
  //   paddingHorizontal: 15,
  //   paddingVertical: 10,
  //   marginBottom: 0,
  //   justifyContent: 'center'
  // },
  // headerLeft: {
  //   flex: 1
  // },
  // iconMenuStyle: {
  //   color: '#fff',
  //   fontSize: 25
  // },
  // iconMenuPlusStyle: {
  //   color: '#fff',
  //   fontSize: 30
  // },
  // headerBody: {
  //   flex: 4
  // },
  // headerTitleStyle: {
  //   color: '#fff',
  //   fontSize: 18,
  //   fontFamily: 'Roboto_light',
  // },
  // headerRight: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginRight:7
  // },

  // noAmenities: {
  //   paddingVertical: Device_Height/6,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },

  // noAmenitiesText:{
  //   color:'#025d8c',
  //   fontSize: 14,
  //   fontFamily: 'Roboto_medium',
  // },
  // status: {
  //   zIndex: 10,
  //   elevation: 2,
  //   width: DEVICE_WIDTH,
  //   height: 21,
  //   backgroundColor: 'transparent',
  //   elevation:0
  // },
  // content: {
  //   margin:0,
  // },
  // button_main: {
  //   marginHorizontal: 10,
  //   marginVertical: 10,
  // },

  // gradientBtn: {
  //   backgroundColor: 'transparent',
  //   fontSize: 16,
  //   color: '#fff',
  //   fontFamily: 'Roboto_medium'
  // },

  // listItem: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   marginBottom: 10,
  //   paddingBottom: 10,
  //   borderBottomWidth: 1,
  //   borderColor: '#d9d9d9'
  // },

  // text: {
  //   color: '#fff',
  //   fontSize: 30,
  // },

  // textSmall: {
  //   fontSize: 14,
  //   fontFamily: 'Roboto_medium',
  //   color:'#333'
  // },

  // textBig: {
  //   fontSize: 14,
  //   fontFamily: 'Roboto_medium',
  //   color: '#333'
  // },
  // card:{
  //   backgroundColor: '#fff',
  //   borderRadius:10,
  //   padding:10,
  //   elevation:0,
  //   marginTop:0,
  //   marginBottom:7
  // },

  // cardItem:{
  //   marginLeft:0,
  //   paddingLeft:0,
  //   paddingTop:2,
  //   paddingBottom:2,
  //   paddingRight:0,
  //   marginBottom:0
  //   // borderColor: '#e2e2e2',
  //   // borderBottomWidth: 0.5,
  // },

  // listMain:{
  //   flexDirection:'row',
  //   width:DEVICE_WIDTH-20,
  // },
  // bookingText:{
  //   fontSize: 14,
  //   fontFamily:'Roboto_light',
  //   color: '#333333',
  //   // color:'#4da424'
  // },
  // bookingTextLabel:{
  //   fontSize: 14,
  //   fontFamily:'Roboto_light',
  //   color:'#707070'
  // },
  // bookingTextToLabel:{
  //   fontSize: 14,
  //   fontFamily:'Roboto_light',
  //   color:'#707070',
  //   paddingLeft:20
  // },
  // bookingTextEnd:{
  //   fontSize: 14,
  //   fontFamily:'Roboto_light',
  //   // color: '#333333',
  //   color:'#f66a4b'
  // },
  // ServiceTitle:{
  //   fontSize: 14,
  //   fontFamily:'Roboto_medium'
  // },
  // contentContainerStyle: { 
  //   flex:1, 
  //   flexDirection: 'row', 
  //   justifyContent:'center', 
  //   alignItems:'center',
  //   paddingVertical: Device_Height/3.5
  // },
  // propertyCountStyle: {
  //   marginTop:20, 
  //   paddingVertical:4, 
  //   alignItems: 'center', 
  //   justifyContent: 'center' 
  // },
  // noInternetStyle: {
  //   marginTop: Device_Height/4, 
  //   flexDirection: 'column', 
  //   alignItems: 'center', 
  //   justifyContent: 'center'
  // },
  // businessNameView: {
  //   width: DEVICE_WIDTH-20,
  //   left: 10,
  //   backgroundColor: '#dcf4ff',
  //   marginTop: 10
  // },
  // leftImageView: {
  //   width: Device_Height/11, 
  //   height: Device_Height/11,
  // },
  // imageBusinessBox: {
  //   width: Device_Height/11.5, 
  //   height: Device_Height/11.5,
  //   borderRadius: 50,
  //   borderWidth: 0.5,
  //   borderColor: 'transparent'
  // },
  // imgBusinessStyle: {
  //   width: Device_Height/11.5, 
  //   height: Device_Height/11.5,
  //   borderRadius: 50,
  //   resizeMode: 'cover'
  // },
  // cardBusiness: {
  //  marginBottom: 0,
  //  marginLeft: 0,
  //  marginTop: 0,
  //  marginRight: 0
  // },
  // cardItemBusinessStyle: {
  //   paddingLeft: 10,
  //   paddingTop: 5,
  //   paddingBottom: 5,
  //   paddingRight: 10
  // },
  // floatingInputView: {
  //   padding: 10,
  //   paddingLeft: 0
  // },
  // propertyTitle: {
  //   fontSize: 15,
  //   color: '#01a4a2',
  //   fontFamily: 'Roboto_medium',
  // },
  // reapetingDateTxt: {
  //   fontSize: 14,
  //   color: '#333333',
  //   fontFamily: 'Roboto_medium',
  // },
  // titleType: {
  //   fontSize: 13,
  //   color: '#025d8c',
  //   fontFamily: 'Roboto_light',
  //   paddingTop: 3
  // },
  // titleLocationType: {
  //   fontSize: 11,
  //   color: '#025d8c',
  //   fontFamily: 'Roboto_medium',
  //   paddingTop: 1
  // },

});

export default styles;
