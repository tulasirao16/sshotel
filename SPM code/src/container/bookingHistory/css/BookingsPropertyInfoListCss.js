
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
  },
  linearStyles: {
    width: DEVICE_WIDTH,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#dcf4ff'
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
    fontSize: 30,
  },
  iconSearchStyle: {
    color: '#fff',
    fontSize: 25,
  },
  iconPlusStyle: {
    color: '#fff',
    fontSize: 28,
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

  status: {
    zIndex: 10,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
  },
  noAmenities: {
    paddingVertical: Device_Height / 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noAmenitiesText: {
    color: '#025d8c',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },
  label: {
    flexGrow: 1,
    fontSize: 20,

    textAlign: 'left',
    marginVertical: 8,
    paddingVertical: 3,
    color: '#f5fcff',
    backgroundColor: 'transparent'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 40,
    marginTop: 40,
    borderRadius: 2,
    backgroundColor: '#ff5722'
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
    fontWeight: '600'
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchHeaderStyle: {
    position: 'absolute',
    top: -20
  },
  txtFont: {
    fontFamily: 'Roboto_light',
  },
  title: {
    fontSize: 13,
    color: 'green',
    fontFamily: 'Roboto_light',
  },
  regularTxt: {
    color: '#8a8786'
  },
  button_main: {
    marginTop: 40,
  },
  button: {
    width: DEVICE_WIDTH - 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  List: {
    marginTop: 20,
  },
  ListItem: {
    marginLeft: 0,
  },
  button_main: {
    marginHorizontal: 8,
    marginVertical: 8,

  },
  gradientBtn: {
    backgroundColor: 'transparent',
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Roboto_light'
  },
  linearBtnStyles: {
    borderRadius: 5
  },
  notificationIconView: {
    width: 40,
    height: 26,
  },
  headerbellIcon: {
    width: 21,
    height: 21,
    // marginRight: 20
  },
  notifyTxt: {
    fontSize: 9,
    fontFamily: 'Roboto_medium',
    color: '#fff',
    justifyContent: 'center'
  },
  notifyBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b479b5'
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },

  viewTwo: {
    width: DEVICE_WIDTH - 20,
    backgroundColor: '#ffffff',
    height: Device_Height / 6,
    marginVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    elevation: 1,

  },
  eachViewTwoIcon: {
    width: DEVICE_WIDTH / 4,
    height: Device_Height / 6,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  eachViewTwoIconBg: {
    backgroundColor: '#8c74fa',
  },
  leftPropertyImage: {
    width: DEVICE_WIDTH / 4,
    height: Device_Height / 6,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6
  },
  imgStyle: {
    width: DEVICE_WIDTH / 4,
    height: Device_Height / 6,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor:'#eee'
  },
  eachViewTwoBody: {
    flex: 4,
    borderRadius: 6,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  eachViewTwoBodyBg: {
    backgroundColor: '#51e9c9',
  },
  eachViewTwoPrice: {
    flex: 1,
    borderRadius: 6,
    paddingRight: 10,
    paddingTop: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  countFont: {
    fontFamily: 'Roboto_light',
    fontSize: 24,
    color: '#070706'
  },
  tabTitle: {
    fontFamily: 'Roboto_medium',
    fontSize: 12,
    paddingLeft: 5,
    color: '#025d8c',
  },
  tabTitleLabel: {
    fontFamily: 'Roboto_light',
    fontSize: 11,
    paddingLeft: 5,
    color: '#025d8c',
  },
  tabTitleValue: {
    fontFamily: 'Roboto_light',
    fontSize: 11,
    paddingLeft: 5,
    color: '#282828',
  },
  tabTitleOne: {
    fontFamily: 'Roboto_medium',
    fontSize: 14,
    color: '#019fa0',
    paddingLeft: 5,
    paddingTop: 2
  },
  bathView: {
    width: 10,
    height: 10,
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  infoTextStyle: {
    fontSize: 8,
    fontFamily: 'Roboto_medium',
    marginHorizontal: 3,
    color: '#000',
  },
  ratingBox: {
    backgroundColor: '#025d8c',
    width: 60,
    height: 30,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  linearGradientRating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ratingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8
  },
  starIcon: {
    fontSize: 14,
    color: '#e2b148',
  },
  ratingTxt: {
    color: '#fff',
    fontFamily: 'Roboto_medium',
  },

  logoutIconView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 10
  },
  searchIconView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 10
  },
  headerHomeIconView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 10
  },
  iconPlusMenuStyle: {
    color: '#fff',
    paddingHorizontal: 10
  },
  contentContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Device_Height / 3.5
  },
  propertyListStyle: {
    backgroundColor: 'pink'
  },
  imageBox: {
    width: Device_Height/57,
    height: Device_Height/57,
    marginRight: 2,
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  eachPropertyDetail: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingTop: 5,
  },
  eachPropertyMainView: {
    flexDirection: 'row',
  },
  propertyTxt: {
    color: '#333333',
    fontSize: 10,
    fontFamily: 'Roboto_light',
    paddingRight: 2
  },
  propertyValueTxt: {
    color: 'green',
    fontSize: 11,
    fontFamily: 'Roboto_light',
    paddingTop: 5
  },
  propertyCountStyle: {
    marginTop: 4,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  businessNameView: {
    width: DEVICE_WIDTH-20,
    backgroundColor: '#dcf4ff',
    marginTop: 10
  },
  leftImageView: {
    width: Device_Height/11, 
    height: Device_Height/11,
  },
  imageBusinessBox: {
    width: Device_Height/11, 
    height: Device_Height/11,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'transparent'
  },
  imgBusinessStyle: {
    width: Device_Height/11, 
    height: Device_Height/11,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
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
    color: '#FFFFFF'
  },
  aminitiesTopGap: {
    position: 'absolute',
    left:4,
    bottom:2,
  },
  modalView: {
    flex: 1, 
    padding: 15, 
    marginTop: Device_Height/4,
    justifyContent: 'center', 
    alignItems: 'center', 
},
modalContainerStyles: {
    width: 300, 
    height: 180, 
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 10
},
txtInfoViewStyle: {
    // flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical:20 
},
txtInfo: {
    color: '#333333', 
    fontSize: 14, 
    fontFamily: 'Roboto_medium'
},
btnsParentView: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 10,
},
eachBtnView: {
    width:140,  
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 10
},
btnStyle: { 
    width: 110, 
    marginLeft:20, 
    backgroundColor: '#01a4a2', 
    borderRadius:8, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
},
cancelBtn: {
    width: 110, 
    backgroundColor: '#025d8c', 
    marginLeft:10, 
    borderRadius:8, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
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
  linearBtnStyles: {
      borderRadius: 22
  },
  statusTxt: {
    fontSize: 14, 
    fontFamily: 'Roboto_medium',
    color: '#025d8c'
  },
  statusActiveTxt: {
    fontSize: 15, 
    fontFamily: 'Roboto_medium',
    color: '#4da424'
  },
  statusInactiveTxt: {
    fontSize: 15, 
    fontFamily: 'Roboto_medium',
    color: '#ef5649'
  },
  HotelTxt: {
    fontSize: 15, 
    fontFamily: 'Roboto_medium',
    color: '#01a4a2'
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