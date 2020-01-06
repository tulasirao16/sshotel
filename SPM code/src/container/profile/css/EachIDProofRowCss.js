
import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff'
  },

  content: {
    margin: 10,
  },
  linearStyles: {
    width: DEVICE_WIDTH,

  },
  iconSearchStyle: {
    color: '#fff',
    fontSize:22,
    marginRight: 20,
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
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },
  headerLeft: {
    flex: 1
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 25
  },
  headerBody: {
    flex: 6
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_light',
  },
  headerRight: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginRight:10
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
  iconPlusMenuStyle: {
    color: '#fff',
    paddingHorizontal: 10
  },
  headermapIcon: {
    width: 25,
    height: 25,
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
  textheading: {
    fontSize: 13,
    color: '#fff',
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
  noLocations:{
    color:'#333',
    fontSize:14,
    fontFamily: 'Roboto_medium',
  },
  noDataViewStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:DEVICE_WIDTH - 20,
    height:Device_Height - 150
  },
  List: {
    marginTop: 20,
    padding: 10,
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
    height: Device_Height / 5,
    marginVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    elevation: 1,
  },
  eachViewTwoIcon: {
    width: DEVICE_WIDTH / 4.5,
    height: Device_Height / 7.5,
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
    height: Device_Height / 7.5,
    padding: 5
  },
  imgStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
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
  iconPlusStyle: {
    color: '#fff',
    marginRight: 20,
  },
  eachViewTwoPrice: {
    flex: 1,
    borderRadius: 6,
    paddingRight: 10,
    paddingTop: 3,
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
    color: '#025d8c',
  },
  tabTitleOne: {
    fontFamily: 'Roboto_light',
    fontSize: 15,
    color: '#019fa0',
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

  locationListStyle: {
    backgroundColor: 'pink'
  },
  imageBox: {
    width: 13,
    height: 13,
    marginRight: 5,

  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  eachLocationDetail: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  eachLocationMainView: {
    flexDirection: 'row',
  },
  propertyTxt: {
    color: '#333',
    fontSize: 10,
    fontFamily: 'Roboto_light'
  },
  propertyValueTxt: {
    color: 'green',
    fontSize: 11,
    fontFamily: 'Roboto_light',
    paddingTop: 5
  },
  locationStyle: {
    marginTop: 20,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 14,
    color: 'green',
    fontFamily: 'Roboto_light',
  },

  ServiceProvideName: {
    backgroundColor: '#5cb85c',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  card: {
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0,
    marginTop:2
  },

  cardItem: {
    flexDirection: 'row',
    marginLeft: 0,
    paddingLeft: 0,
    paddingTop: 2,
    paddingBottom: 2,
    marginBottom: 0,
    paddingRight: 0,
    // borderColor: '#e2e2e2',
    // borderBottomWidth: 0.5,
  },
  listMain: {
    flexDirection: 'row',
    // width:DEVICE_WIDTH,
  },
  bookingText: {
    fontSize: 14,
    fontFamily: 'Roboto_light'
  },
  boldFontStyle: {
    fontSize: 14,
    fontFamily:'Roboto_medium',
  },
  idText: {
    fontSize: 14,
    fontFamily: 'Roboto_light'
  },
  ServiceTitle: {
    fontSize: 14,
    fontFamily: 'Roboto_medium'
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
  floatingInputView: {
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
  modalView: {
    backgroundColor: '#fff',
    width: DEVICE_WIDTH - 50,
    height: Device_Height / 2
  },
  profileImageView: {
    width: DEVICE_WIDTH - 100,
    height: Device_Height / 3,
  },
  fitImage: {
    width: null,
    height: null,
    flex: 1,
    resizeMode: 'cover'
  },
  idProofView: {
    position: 'absolute',
    top:50,
    right:10
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25
  },
  btnModalSubmit: {
    paddingHorizontal: 50,
    backgroundColor: '#3fc13e',
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:6
  },
  btnTxt: {
    color: '#fff'
  },


});

export default styles;