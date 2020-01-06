
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    flex: 1
  },
  linearStyles: {
    width: DEVICE_WIDTH,
  },

  container: {
    flex: 1,
    backgroundColor: '#f5fcff'
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
  iconSearchStyle:{
    color: '#fff',
    fontSize: 25
  },
  iconHomeStyle: {
    color: '#fff',
    fontSize: 25
  },
  headerBody: {
    flex: 5
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
  iconPlusMenuStyle: {
    color: '#fff',
    paddingHorizontal: 15
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
    left: 10,
    backgroundColor: '#ffffff',
    height: Device_Height / 8.5,
    marginVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    elevation: 1,
  },
  eachViewTwoIcon: {
    width: DEVICE_WIDTH / 4.5,
    height: Device_Height / 8.5,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  eachViewTwoIconBg: {
    backgroundColor: '#8c74fa',
  },
  leftPropertyImage: {
    width: DEVICE_WIDTH / 4.5,
    height: Device_Height / 8.5,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6

  },
  imgStyle: {
    width: DEVICE_WIDTH / 4.5,
    height: Device_Height / 8.5,
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
    paddingRight: 8,
    paddingTop: 8,
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
    paddingLeft: 4,
    color: '#025d8c',
    paddingTop: 4
  },
  tabTitleOne: {
    fontFamily: 'Roboto_light',
    fontSize: 15,
    color: '#019fa0',
    paddingLeft: 4,
    paddingVertical: 2
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
    width: DEVICE_WIDTH / 9 + 3,
    height: 22,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
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
    paddingVertical: 2,
    paddingHorizontal: 6
  },
  starIcon: {
    fontSize: 14,
    color: '#e2b148',
    marginTop: 10

  },
  ratingTxt: {
    fontFamily: 'Roboto_medium',
    fontSize: 11,
    color: '#333'
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
  contentContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Device_Height / 3.5
  },
  propertyCountStyle: {
    marginTop: 4,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center'
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
    paddingLeft: 4,
    paddingTop: 5,
  },
  eachPropertyMainView: {
    flexDirection: 'row',
   
  },
  propertyTxt: {
    color: '#333',
    fontSize: 10,
    fontFamily: 'Roboto_light',
    paddingRight:2
  },
  propertyValueTxt: {
    color: 'green',
    fontSize: 11,
    fontFamily: 'Roboto_light',
    paddingTop: 5
  },
  aminitiesTopGap: {
    position: 'absolute',
    left:4,
    bottom:2.5
  },
  linearBtnStyles1: {
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