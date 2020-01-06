import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  // header styles start

  container: {
    flex: 1,
    backgroundColor: '#eef5fb',
  },
  
  linearStyles: {
    width: DEVICE_WIDTH,
  },

  iconMenuStyle: {
    color: '#fff',
    fontSize:30
  },

  view: {
    padding: 10,
    margin: 2,
    backgroundColor: '#025d8c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    color: '#fff'
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
    paddingVertical: Device_Height/6,
    justifyContent: 'center',
    alignItems: 'center'
  },

  noAmenitiesText:{
    color:'#025d8c',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },

  content: {
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0,
    margin:10,
  },

  // header styles end
  headermapIcon: {
    width: 30,
    height: 25,
    marginLeft: 20
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  bodyContainer: {
    height: Device_Height - 90
    // width: DEVICE_WIDTH-20,
    // left:10,
    // padding: 10
  },
  listLeftStyle: {
    width: DEVICE_WIDTH / 11,
    backgroundColor: '#ddd'
  },
  label: {
    fontSize: 12,
    color: '#989898'
  },
  regularFont: {
    fontFamily: 'Roboto_light'
  },
  mediumFont: {
    fontFamily: 'Roboto_medium'
  },
  txtStyle: {
    fontSize: 13,
    color: '#333'
  },
  listItemView: {
    marginLeft: 0,
    paddingLeft:0
  },
  listItemBody: {
    marginLeft: 4,
    paddingBottom: 7,
    paddingTop: 7,
    marginRight: 14
  },
  iconStyle: {
    color: '#adabb1'
  },

  inputRadio: {
    padding: 10,
    paddingLeft:0,
  },

  floatingInputView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:0,
    paddingLeft: 0
  },

  roomCategory:{

  },

  DateGenderView: {
    flexDirection: 'row',
    marginVertical:5,
    // marginHorizontal:5,
    width: DEVICE_WIDTH-30,
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
  datePickerRow: {
    flexDirection: 'row',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical:10,
    borderBottomWidth: 1,
    borderColor: '#01a4a2',
    paddingLeft:0,
    paddingRight:0,
  },
  listItemStatus: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#01a4a2',
    marginHorizontal: 5,
    marginTop:5,
    marginBottom:4,
  },

  title: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
    fontFamily: 'Roboto_medium',
  },
  routingTitleStyle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Roboto_medium',
  },
  routingTitleValidateStyle: {
    fontSize: 14,
    color: 'red',
    fontFamily: 'Roboto_medium',
  },
  propertyTitle: {
    fontSize: 15,
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
  },
  titleType: {
    fontSize: 13,
    color: '#025d8c',
    fontFamily: 'Roboto_medium',
    paddingTop: 5
  },

  titleDropdown: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Roboto_light',
  },

  titleRadio: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Roboto_medium',
  },
  titleError: {
    fontSize: 14,
    color: 'red',
    fontFamily: 'Roboto_medium',
  },
  leftSpace: {
    paddingLeft:3
  },
  listBtnSpace: {
    paddingVertical: 10
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
  businessNameView: {
    width: DEVICE_WIDTH-20,
  },
  leftImageView: {
    width:Device_Height/8.5, 
    height: Device_Height/8.5,
  },
  imageBox: {
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
    borderWidth: 2,
    borderColor: '#eee', 
    backgroundColor:'#eee'
  },

  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },
  businessNameView: {
    width: DEVICE_WIDTH,
  },
  leftImageView: {
    width:Device_Height/8.5, 
    height: Device_Height/8.5,
  },

  card: {
   marginBottom:0,
   marginLeft:0,
   marginTop:0,
   marginRight:0,
   backgroundColor: '#fff',
   borderRadius: 10,
   elevation: 0,
  },

  cardItemStyle: {
    paddingLeft:10,
    paddingTop:5,
    paddingBottom:5,
    paddingRight:10
  },

  margintop: {
    top:-11,
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
  titleRouting: {
    color: '#019fa0',
    paddingVertical:4
  },
  titleLocationType: {
    fontSize: 11,
    color: '#025d8c',
    fontFamily: 'Roboto_medium',
    paddingTop: 1
  },
  Left: {
    left:-8
  },
  linearBtnStyles: {
    borderRadius: 22
  },
  bottomStatusGap: {
    paddingBottom:10,
    marginBottom:6,
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
  required: {
    color: 'red'
  },
  errorIconView: {
    position: 'absolute',
    right:17,
    bottom: 15
  },
  errorIcon: {
    fontSize: 20,
    color: 'red',
    fontFamily: 'Roboto_medium',
  },
  successIcon: {
    fontSize: 20,
    color: 'green',
    fontFamily: 'Roboto_medium',
  },
  routingTitleIconValidateStyle: {
    fontSize: 20,
    color: 'red',
    fontFamily: 'Roboto_medium',
  },

  routingTitleIconStyle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Roboto_medium',
  },

  routingTitleSuccessStyle: {
    fontSize: 25,
    color: 'green',
    fontFamily: 'Roboto_medium',
  },
});

export default styles;