
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'#eef5fb'
    backgroundColor: '#fff',
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

  heading: {
    marginBottom: 7,
  },
  headerLeft: {
    flex: 1,
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 25
  },
  iconHomeStyle: {
    color: '#fff',
    fontSize: 22
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
    justifyContent: 'flex-end',
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
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
  },
  iconGap: {
    paddingRight: 16
  },

  // bodyContainer: {
  //   width: DEVICE_WIDTH,
  //   height: Device_Height - 100
  // },

  content: {
    height: Device_Height - 100,
    marginHorizontal: 15,
    paddingVertical: 5,
  },

  basePrice: {
    // marginHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#01a4a2',
    flexDirection: 'row',
  },

  floatingInputView: {
    // marginHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#01a4a2',
    flexDirection: 'row',
    flex: 1,
  },

  floatingLabelInput: {
    // marginHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row'
  },

  floatingInputOneView: {
    marginHorizontal: 10,
    paddingVertical: 5,

  },
  topPadding: {
    top: 5
  },
  floatingInputFieldView: {
    marginHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#01a4a2',
  },
  labelGap: {
    paddingVertical: 8
  },
  textGap: {
    paddingVertical: 8
  },
  regularFontSize: {
    fontSize: 13,
    color: '#8a8786'
  },

  mediumTextFontSize:{
    fontSize: 16,
    color: '#333'
  },

  aminities: {
    marginHorizontal: 15,
    paddingVertical: 5,
    height: 60,
    borderBottomColor: '#01a4a2',
    borderBottomWidth: 0.5,
  },

  smallFont: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'Roboto_medium'
  },
  regularTextFontSize: {
    fontSize: 13,
    color: '#333333'
  },
  amountTextFontSize: {
    fontSize: 19,
    color: '#333333',
    fontFamily: 'Roboto_medium',
    marginLeft:7,
  },
  regularFontStyle: {
    fontFamily: 'Roboto_medium',
  },
  input: {
    paddingBottom: 10,
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
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
  errorTxt: {
    color: 'red',
    fontFamily: 'Roboto_medium',
    fontSize: 13,
  },
  errorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    width: DEVICE_WIDTH,
    height: Device_Height / 3,
    marginBottom: 1,
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  details: {
    position: 'absolute',
    top: 8,
    right: 10
  },
  details_text: {
    fontSize: 11,
    fontFamily: 'Roboto_medium',
    color: '#01a4a2',
  },
  images: {
    resizeMode: 'cover',
    width: 25,
    height: 25,
    marginRight: 10,
  },
  minusCircle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    width: Device_Height / 25,
    height: Device_Height / 25,
    position: 'absolute',
    left: 0,
    bottom: 4,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusCircle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    width: Device_Height / 25,
    height: Device_Height / 25,
    position: 'absolute',
    right: 50,
    bottom: 4,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusIcon: {
    fontSize: 20,
    color: '#025d8c'
  },
  parentView: {
    flex:1,
    flexDirection: 'row',
    // marginHorizontal: 10,
    // paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#01a4a2',
  },
  labelView: {
    flex: 2,
    // alignItems: 'flex-start',
    justifyContent: 'center'
  },
  plusView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    position:'relative'
  },
  minusView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    position:'relative'
  },
  ValueView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  clockIcon: {
    position: 'absolute',
    left:5,
    top: 2,
  },

  // plusCircle: {
  //   borderColor: 'black',
  //   borderWidth: 1,
  //   borderRadius: 50,
  //   width: Device_Height/10,
  //   height: Device_Height/10,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  // =========================================

  slide1: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#9DD6EB',
  },

  slide2: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#97CAE5',
  },

  slide3: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#92BBD9',
  },
  Title: {
    fontSize: 14,
    fontFamily: 'Roboto_medium',
    paddingTop: 0,
    paddingBottom: 7,
    marginTop: 0,
  },
  aminitiesStyles: {
    flexDirection: 'row',
    flexGrow: 1,
    marginBottom: 5,
    paddingBottom: 5,
  },
  // images: {
  //   width: 30,
  //   height: 30,
  //   resizeMode: 'contain'
  // },

  // modal css
  // modalView: {
  //   position: 'absolute',
  //   left: 10,
  //   right: 10,
  //   top: Device_Height / 5,
  //   bottom: Device_Height / 5,
  // },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    // height: 300,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },

  modalContainerStyles: {
    width: 300,
    height: 200,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10
  },

  modalClose: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 999,
    padding: 5
  },

  closeIcon: {
    color: 'red',
    fontSize: 30
  },

  btnok: {
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#eee'
  },

  btncancel: {
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#eee'
  },

  bigTxt: {
    color: '#777',
    fontSize: 16,
    fontFamily: 'Roboto_light',
  },

  txtInfoViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  txtInfo: {
    color: '#333333',
    fontSize: 14,
    fontFamily: 'Roboto_medium'
  },
  pickerParentView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  btnsParentView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  eachBtnView: {
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },
  btnStyle: {
    width: 110,
    marginLeft: 20,
    backgroundColor: '#01a4a2',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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

});

export default styles;
