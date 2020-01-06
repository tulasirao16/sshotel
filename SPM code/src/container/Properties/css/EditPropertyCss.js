import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  // header styles start
  linearStyles: {
    width: DEVICE_WIDTH,
  },
  iconMenuStyle: {
    color: '#fff',
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
    fontSize: 16,
    fontFamily: 'Roboto_light',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    height: Device_Height - 90,
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
  floatingInputView: {
    padding: 10,
    paddingTop:0,
    paddingLeft: 0
  },
  DateGenderView: {
    flexDirection: 'row',
    marginTop:-13,

    // width: DEVICE_WIDTH-20,
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
    borderBottomWidth: 1,
    borderColor: '#01a4a2',
    marginHorizontal: 10
  },
  listItemStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#01a4a2',
    marginHorizontal: 10,
    marginTop:5,
    marginBottom:4,
    width: DEVICE_WIDTH -20,

  },
  title: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
    fontFamily: 'Roboto_light',
  },
  routingTitleStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#01a4a2',
    fontFamily: 'Roboto_light',
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
  titleRadio: {
    fontSize: 14,
    fontWeight: '400',
    color: '#454545',
    fontFamily: 'Roboto_light',
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
    left:10,
    backgroundColor: '#dcf4ff',
    marginVertical:10
  },
  leftImageView: {
    width:Device_Height/8.5, 
    height: Device_Height/8.5,
  },
  imageBox: {
    width:Device_Height/9, 
    height: Device_Height/9,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: 'transparent'
  },
  imgStyle: {
    width:Device_Height/9, 
    height: Device_Height/9,
    borderRadius: 50,
    resizeMode: 'cover'
  },
  card: {
   marginBottom:0,
   marginLeft:0,
   marginTop:0,
   marginRight:0
  },
  cardItemStyle: {
    paddingLeft:10,
    paddingTop:5,
    paddingBottom:5,
    paddingRight:10
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
    width: DEVICE_WIDTH-20,
    left:10,
    backgroundColor: '#dcf4ff',
    marginVertical:10
  },
  leftImageView: {
    width:Device_Height/8.5, 
    height: Device_Height/8.5,
  },
  imageBox: {
    width:Device_Height/9, 
    height: Device_Height/9,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: 'transparent'
  },
  imgStyle: {
    width:Device_Height/9, 
    height: Device_Height/9,
    borderRadius: 50,
    resizeMode: 'cover'
  },
  card: {
   marginBottom:0,
   marginLeft:0,
   marginTop:0,
   marginRight:0
  },
  cardItemStyle: {
    paddingLeft:10,
    paddingTop:5,
    paddingBottom:5,
    paddingRight:10
  },
  floatingInputView: {
    padding: 10,
    paddingLeft: 0
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
  pickerLabel: {
    fontSize: 14,
    color: '#222222',
    fontFamily: 'Roboto_light',
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
  required: {
    color: 'red'
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
    height: Device_Height/3,
    marginBottom: 1,
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  plusCircle: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: Device_Height/15,
    height: Device_Height/15,
    position: 'absolute',
    right:10,
    bottom:10,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusIcon: {
    fontSize: 27,
    color: '#025d8c'
  },
  scrollInfoView: {
    height: Device_Height-((Device_Height/3)+80),
    backgroundColor: '#fff',
    width: DEVICE_WIDTH,
    padding:10
  },
  
});
export default styles;