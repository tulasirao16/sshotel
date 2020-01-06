import { StyleSheet, Dimensions, Platform } from 'react-native';
import colors from '../../../../node_modules/react-native-datepicker-modal/config/colors'
import spacing from '../../../../node_modules/react-native-datepicker-modal/config/spacing'
import fontSize from '../../../../node_modules/react-native-datepicker-modal/config/fontSize'

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  headerStyle: {
    // backgroundColor: 'rgba(69,85,117,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

  },
  linearGradientOne: {
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
    opacity: (Platform.OS === 'android' ? 0.8 : 0.91 )
  },

  priceTagColorStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  parentView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: (Platform.OS === 'android' ? 50 : 60) ,
    marginTop: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerLeft: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
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

  bell_button:{
    marginRight: 5,
    paddingTop:6,
    paddingBottom:6,
    paddingLeft:8,
    paddingRight:8,
    borderRadius:30,
    justifyContent:'center',
    alignItems:'center'
  },

  map_button:{
    marginRight: 5,
    paddingTop:6,
    paddingBottom:8,
    paddingLeft:8,
    paddingRight:8,
    borderRadius:30,
    justifyContent:'center',
    alignItems:'center'
  },

  iconMenuStyle: {
    color: '#fff',
    fontSize: 30,
  },
  headerBody: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitleStyle: {
    marginTop:-3,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
    // fontWeight: '700'
  },
  headerRight: {
    flex: 3,
    flexDirection: 'row',
    marginLeft:10, 
    marginRight:10,
    paddingLeft:0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIconView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  notificationCont: {
    // flex:1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row'
  },

  notificationIconView: {
    // width: 40,
    // height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  headerbellIcon: {
    width: 22,
    height: 22,
  },
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 22,
    backgroundColor: 'transparent',
    elevation: 0
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
    borderColor:'#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#b479b5'
  },
  headermapIcon: {
    width: 20,
    height: 20,
    // marginRight: 20
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  searchAndFilterView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH - 20,
    left: 10,
  },
  searchViewContainer: {
    flex:6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 4
  },
  searchTitleView: {
    flex: 5,
    paddingHorizontal: 5,
    // marginBottom:7,
  },
  searchIconView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#01a4a2',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  funnelIconView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: 5,
    borderRadius:4
  },
  funnelIcon: {
    color: '#01a4a2',
    fontSize: 22,
  },
  itemBorderBottomWidth: {
    borderWidth: 0,

  },
  searchIcon: {
    color: '#025d8c',
    fontSize: 22,
  },
  searchTitle: {
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
    fontSize: 13,
  },
  searchCaption: {
    fontSize: 12,
    fontFamily: 'Roboto_medium',
    paddingHorizontal: 20,
    marginTop: 3,
    color: '#fff'
  },
  checkInOutTitle: {
    color: '#fff',
    fontFamily: 'Roboto_medium',
    marginBottom: 3,
    fontSize: 15,
  },
  calenderTxt: {
    color: '#fff'
  },
  dateSelectContainer: {
    marginHorizontal: 10,
    flexDirection: 'row',
    width: DEVICE_WIDTH - 20,
    marginVertical: 15,
    backgroundColor: 'transparent'
  },
  checkInView: {
    flex: 2,
    padding: 10
  },

  checkOutView: {
    flex: 2,
    padding: 10
  },
  peopleContainerView: {
    width: DEVICE_WIDTH - 30,
    marginVertical: 2,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  pickerView: {
    backgroundColor: '#fff'
  },
  // modal css
  modalView: {
    position:'absolute',
    left:20,
    right:20,
    top:DEVICE_HEIGHT/6,
    bottom:DEVICE_HEIGHT/6
  },
  labelView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 15
  },
  view: {
    padding: 10,
    margin: 2,
    backgroundColor: '#025d8c',
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
  btnModalSubmit: {
    paddingHorizontal: 50,
    backgroundColor: '#3fc13e',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  },
  btnTxt: {
    color: '#fff'
  },
  guestInfoView: {
    flexDirection: 'row',
  },
  guestTypeTitleView: {
    flex: 3
  },
  title: {
    color: '#fff'
  },
  minusIconView: {
    flex: 1,
    alignItems: 'flex-end'
  },
  guestNumberView: {
    flex: 1,
    alignItems: 'center'
  },
  plusIconView: {
    flex: 1,
    alignItems: 'flex-start'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#777',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchCircle:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  guestNumberTxtView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  guestNumberTxt: {
    fontSize: 14,
    fontFamily: 'Roboto_light',
    paddingVertical: 7
  },
  guestTypeTxt: {
    paddingVertical: 6,
    fontFamily: 'Roboto_medium',
    fontSize: 15,
  },
  ageinfoTxt: {
    fontSize: 10,
    fontFamily: 'Roboto_light',
  },
  // calendar styles
  container: {
    backgroundColor: colors.white,
    borderBottomColor: colors.gray.veryLight,
    borderBottomWidth: 1,
    marginVertical: spacing[1],
    marginHorizontal: spacing[0],
    justifyContent: 'center',
    borderRadius: 2,
    height: 50
  },
  placeholderText: {
    color: colors.gray.light
  },
  text: {
    width: '100%',
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[0],
    fontFamily: 'Montserrat',
    fontSize: fontSize.medium,
    color: colors.gray.dark
  },
  pickerStyle: {
    width: DEVICE_WIDTH - 40
  },
  // anotherTheame css

  DetailsViewContainer: {
    flexDirection: 'row',
    height: DEVICE_HEIGHT / 14,
    width: DEVICE_WIDTH - 20,
    left: 10,
    marginVertical: 4
  },
  DateViewContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 2,
    borderRadius:4
  },
  filterViewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 2,
    borderRadius:4
  },
  filterIconsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  filterIcons: {
    color: '#25c5df',
    paddingTop: 10
  },
  infoIconView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoIconViewG: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  
  GuestsViewContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 2,
    borderRadius:4
  },
  RoomsViewContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 2
  },
  infoTitle: {
    fontSize: 12,
    color: '#ea9545',
    paddingVertical: 3,
    fontFamily: 'Roboto_medium'
  },
  iconStyle: {
    fontSize: 15,
    paddingHorizontal: 7,
    color: '#b479b5',
    justifyContent: 'flex-start'
  },
  titleStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: -15
  },
  iconGuestViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  globeIconViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: -50,
    paddingHorizontal: 17
  },
  productsTabContainer: {
    backgroundColor: '#fff',
    left: 10,
    width: DEVICE_WIDTH - 20,
    height: DEVICE_HEIGHT / 4 + 40,
    marginTop: 5,
    borderRadius: 4
  },
  imageContainer: {
    width: DEVICE_WIDTH - 28,
    left: 4,
    top: 4,
    height: DEVICE_HEIGHT / 4 - 30,
    backgroundColor: 'pink',
  },
  productInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    width: DEVICE_WIDTH - 30,
    left: 5,
    top: 5,
    height: 50,

  },
  imageFitContainer: {
    flex: 1,
    width: null,
    width: null,
    resizeMode: 'cover'

  },

  iconPlusView: {
    position: 'absolute',
    justifyContent: 'space-between',
    right: 8,
    top: 8
  },
  iconSearchView: {
    position: 'absolute',
    justifyContent: 'space-between',
    right: 10,
    top: (Platform.OS === 'android' ? -130 : -143 )
  },
  compareTick: {
    position: 'absolute',
    right: 16,
    top: -7,
    color:'green',
    fontSize:45,
    fontWeight:'700'
  },
  iconFavView: {
    position: 'absolute',
    justifyContent: 'space-between',
    right: 8,
    bottom: 75,
  },
  favIconStyle: {
    color: '#e2151f',
    fontSize: 26
  },
  plusIconStyle: {
    color: '#2598fb'
  },
  productPriceView: {
    position: 'absolute',
    justifyContent: 'space-between',
    left: 4,
    top: 4
  },
  square: {
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:10,
    paddingHorizontal:15
  },
  timingTxt: {
    fontSize: 10,
    color: '#fff',
    paddingVertical: 3,
    fontFamily: 'Roboto_medium'
  },
  priceTxt: {
    fontFamily: 'Roboto_medium',
    fontSize: 18,
    color: '#fff',
  },
  bottomFilterContainer: {
    backgroundColor: '#fff',
    width: 80,
    height: 30,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    left: DEVICE_WIDTH/2.5,
  },
  bottomFilterRadius: {
    borderRadius: 3
  },
  filterBottomContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7
  },
  filterTxtIconGapView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  filterTxt: {
    color: '#fff',
    fontFamily: 'Roboto_light',
    fontSize: 16,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection:'row',
    marginTop: -4
  },
  filterIconView: {
    width: 22,
    height: 22,
  },
  filterFitContainer: {
    flex: 1,
    width: null,
    width: null,
    resizeMode: 'contain'
  },
  ratingContainer: {
    flexDirection: 'row',
    width: DEVICE_WIDTH / 3,
    justifyContent:'flex-end',
    paddingTop:5
  },
  rBox: {
    flex: 1,
    width: 20,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -5
  },

  ratingBox: {
    backgroundColor:'#025d8c',
    width:60,
    height:30,
    borderRadius:4,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  linearGradientRating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ratingContent: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical:5,
    paddingHorizontal:8   
  },
  starIcon: {
    fontSize:18,
    color:'#fff',
  },
  ratingTxt: {
    color:'#fff',
    fontFamily:'Roboto_medium',    
  },

  infoViewContainer: {
    flexDirection: 'row',
    width: DEVICE_WIDTH/2,
    marginTop: 5
  },
  personIconView: {
    width: 27
  },
  doublebedIconView: {
   width: 31
  },
  infoIconStyle: {
    fontSize: 15,
    marginRight: 3
  },
  infoTextStyle: {
    fontSize: 8,
    fontFamily: 'Roboto_medium',
    marginHorizontal: 3,
    color: '#000',
  },
  infoTextStyleOne: {
    fontSize: 8,
    fontFamily: 'Roboto_medium',
    marginHorizontal: 3,
    color: '#333',
    left:-4
  },
  bathView:{
    width: 10,
    height: 10,
  },
  personView: {
    width: 10,
    height: 10,
  },
  doublebedView: {
    width: 15,
    height: 10,
  },
  singlebedView: {
    width: 8,
    height: 10,
  },
  aminitiesInfoViewContainer: {
    flexDirection: 'row',
    // width: DEVICE_WIDTH / 1.7,
    width: DEVICE_WIDTH - 30,
    marginTop: 3,
    marginBottom:2
  },
  aminitiesInfoView: {
    width:25,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  carParkAminitiesInfoView: {
    width:55,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  wifiAminitiesInfoView: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  aminityWifiIcon: {
    color:'#cf363e',
    fontSize: 10
  },
  tooSmallFont: {
    fontSize:5
  },
  aminityImageView: {
    width:10,
    height:10,
  },

  compareIconView: {
    width:DEVICE_HEIGHT/13, 
    height:DEVICE_HEIGHT/13, 
    borderColor:'#FFF', 
    borderWidth:1, 
    borderRadius:50, 
    backgroundColor:'#fff',
    padding:5,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
   },

   heaertIconView:{
    width:DEVICE_HEIGHT/17, 
    height:DEVICE_HEIGHT/17, 
    borderColor:'#FFF', 
    borderWidth:1, 
    borderRadius:50, 
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
   },

   compareTxt: { 
    fontSize: 10, 
    color:'red', 
    fontFamily:'Roboto_medium'
   },
   cColor: {
    color: '#025d8c'
   },
   oColor: {
    color: 'red'
   },
   mColor: {
    color: 'rgb(223, 123, 66)'
   },
   pColor: {
    color: '#0d00ff'
   },
   aColor: {
    color: '#ff0d00'
   },
   rColor: {
    color: 'green'
   },
   eColor: {
    color: '#ff0073'
   },
   btnModalSubmitCompare: {
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: '#3fc13e',
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:6,
  },
//   modalContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center'
// },
modalContent:{
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH - 50,
    height: DEVICE_HEIGHT / 2,
    backgroundColor:'#fff',
    padding:15,
    borderRadius:10,
},
modalHeader: {
  alignItems: 'center',
  textAlign: 'center'
},
otpText: {
  alignItems: 'center',
  textAlign: 'center',
  fontSize: 14,
  paddingBottom: 5,
  fontFamily: 'Roboto_medium'
},

  MenuStyle: {
    borderBottomColor: '#dbdbdb',
    borderBottomWidth: 1,
  },

  textStyle: {
    color: '#777',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },

  modalTxt:{
    color: '#777',
    fontSize: 14,
    lineHeight:22,
    fontFamily: 'Roboto_medium',
  },

  bigTxt: {
    color: '#777',
    fontSize: 16,
    fontFamily: 'Roboto_medium',
  },

  sortTxt: {
    paddingTop: 2,
    color: '#777',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },

  list: {
    marginTop: 10,
    marginLeft: 0,
  },

  leftView: {
    flex: 1,
  },

  rightView: {
    flex: 6,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  GuestlistItem: {
    marginLeft: 0,
    paddingTop: 10,
    paddingBottom:10,
    paddingRight: 0,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  listItem: {
    marginLeft: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 0,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  BtnText: {
    fontFamily: 'Roboto_light',
    fontSize: 14,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    padding: 15,
  },

  mainView: {
    // width: DEVICE_WIDTH-40,
    // height: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  addIcon: {
    color: '#777'
  },
  modalClose: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  closeIcon: {
    color: 'red',
    fontSize:30
  },

  removeIcon: {
    color: '#777'
  },

  // router styles
  linearGradientRouter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

  },
  routerLogoImageView: {
    width: 170,
    height: 130,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  imageFit: {
    flex: 1,
    width: null,
    width: null,
    resizeMode: 'contain'

  },
  regularFontStyle: {
    fontFamily: 'Roboto_medium',
    fontSize:14,
  },
  mediumBoldFontStyle: {
    fontFamily: 'Roboto_light'
  },
  titleGap: {
    paddingBottom: 2
  },
  deleteIconStyle: {
    color: '#fff'
  },
  smallFont: {
    fontSize: 13
  },
  titleColor: {
    color: '#01a4a2'
  },

  leftIcon:{
    fontSize: 21, 
    color: '#01a4a1', 
    width: 20, 
    marginRight: 10
  },
  aminityText: {
    fontSize:3,
    color:'red',
    fontFamily:'Roboto_medium'
  },
  noDataViewStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:DEVICE_WIDTH - 20,
    height:DEVICE_HEIGHT - 200
  },
  noDataText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600'
  },
  eachPropertyDetail: {
    flexDirection: 'row',
    paddingLeft: 4,
    paddingTop: 5,
  },
  eachPropertyMainView: {
    flexDirection: 'row',
  },
  eachPropertyMainViewAminity: {
    left: 5,
    top: -5,
    // height: 50,
    flexDirection: 'row',
  
  },
  imageBox: {
    width: DEVICE_HEIGHT/57,
    height: DEVICE_HEIGHT/57,
    marginRight: 5,
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  propertyTxt: {
    color: '#333',
    fontSize: 10,
    fontFamily: 'Roboto_light',
    paddingRight:4
  },
  moreCircle: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 50,
    top:-6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
    // paddingLeft:3
  },
  more: {
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  // compare modal css
  modalViewCompare: {
    position:'absolute',
    left:2,
    right:2,
    top:DEVICE_HEIGHT/3.5,
    bottom:DEVICE_HEIGHT/6
  },
  modalContainerCompare: {
    flex: 1,
    padding: 5,
  },
  mainViewCompare: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  modalCompareInfoView: {
    position:'absolute',
    left:20,
    right:20,
    top:DEVICE_HEIGHT/3.5,
    bottom:DEVICE_HEIGHT/6
  },
  // WebView chat Styles
  chatButtonView: {
    position: 'absolute',
    bottom:20,
    right: 20,
    width: DEVICE_HEIGHT/10,
    height: DEVICE_HEIGHT/10,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatButton: {
    position: 'absolute',
    bottom:20,
    right: 20,
    width: DEVICE_HEIGHT/10,
    height: DEVICE_HEIGHT/10,
    borderRadius: 50,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    borderColor: 'orange',
    opacity:1,
    zIndex: 99999
  },
  activeBg: {
    backgroundColor: '#01a4a2',
    marginLeft:0,
    paddingLeft:18
  },
  leftIconActive:{
    fontSize: 21, 
    color: '#ffffff', 
    width: 20, 
    marginRight: 10
  },
  regularActiveFontStyle: {
    fontFamily: 'Roboto_medium',
    fontSize:14,
    color: '#ffffff',
  },
  checkHours: {
    width: DEVICE_WIDTH-26,
    // backgroundColor: '#025d8c',
    justifyContent: 'center',
    alignItems: 'center',
    left:13,
    borderRadius: 6
  },
  nearByServices: {
    width: DEVICE_WIDTH-26,
    // backgroundColor: '#025d8c',
    justifyContent: 'center',
    alignItems: 'center',
    left:13,
    borderRadius: 6,
    marginTop:2
  },
  nearByServicesPadding: {
    paddingVertical: 7
  },
  
  activeIndicatorView: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    top:0,
    position: 'relative',
    zIndex: 1,
  },
  errorMessage : {
    fontFamily: 'Roboto_medium',
    fontSize: 11,
    color: 'red',
    paddingVertical:5
  }
});

export default styles;
