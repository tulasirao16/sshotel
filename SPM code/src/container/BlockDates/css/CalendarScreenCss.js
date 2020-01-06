
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

  iconRefreshStyle: {
    color: '#fff',
    fontSize: 25
  },

  iconSearchStyle: {
    color: '#fff',
    fontSize: 25,
  },
  iconMenuPlusStyle: {
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
    marginRight: 6,
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

  menu_button: {
    marginVertical: Platform.OS === 'ios' ? -6 : -6,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },

  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
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


  headerStyle: {
    paddingTop: 20,
    paddingBottom: 10,
    height: 80
  },

  linearStyles: {
    width: DEVICE_WIDTH,

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
    alignItems: 'center',

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
  bodyViewContainer: {
    marginHorizontal: 15,
    marginVertical: 30,
    width: DEVICE_WIDTH
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

  bodyContainer: {
    marginHorizontal: 15,
    width: DEVICE_WIDTH - 30,
    marginTop: 20
  },

  displaySelectedDates: {
    flexDirection: 'column',
  },
  timePickerView: {
    backgroundColor: '#01a4a2',
    height: 50
  },
  startEndHeadings: {
    // paddingHorizontal: 16,
    // marginVertical: 10,
    fontFamily: 'Roboto_medium',
    fontSize: 12,
  },
  timeHeadings: {
    paddingHorizontal: 1,
    marginVertical: 10
  },
  timeContainer: {
    width: DEVICE_WIDTH,
    marginHorizontal: 15,
    marginVertical: 10
  },
  startDateView: {
    width: DEVICE_WIDTH,
    flexDirection: 'row',
  },
  dateTxt: {
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
    fontSize: 12,
  },
  businessNameView: {
    width: DEVICE_WIDTH - 20,
    left: 10,
    backgroundColor: '#dcf4ff',
    marginVertical: 10
  },
  leftImageView: {
    width: Device_Height / 9.5,
    height: Device_Height / 9.5,
  },
  imageBox: {
    width: Device_Height / 10,
    height: Device_Height / 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#eee'
  },
  imgStyle: {
    width: Device_Height / 10,
    height: Device_Height / 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#eee'
  },
  card: {
    marginBottom: 0,
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0
  },
  cardItemStyle: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10
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
    paddingTop: 5
  },
  pickerTextStyle: {
    fontSize: 13,
    color: '#222222',
    fontFamily: 'Roboto_light',
    paddingHorizontal: 10
  },
  thumbmailsView: {
    width: DEVICE_WIDTH - 20,
    height: Device_Height / 12,
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'pink',
    flexDirection: 'row'
  },
  thumbnail: {
    position: 'relative',
    width: DEVICE_WIDTH / 5,
    height: Device_Height / 12,
    borderColor: '#fff',
    borderWidth: 1,
    margin: 3,
    zIndex: 99,
  },
  pickerStyle: {
    width: DEVICE_WIDTH - 20,
    height: Device_Height / 15
  },
  pickerViewStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#01a4a2',
    marginTop: 1,
    width: DEVICE_WIDTH - 20,
    left: 10,
    backgroundColor: '#fff'
  },
  linearBtnStyles: {
    borderRadius: 22
  },
  titleLocationType: {
    fontSize: 11,
    color: '#025d8c',
    fontFamily: 'Roboto_medium',
    paddingTop: 1
  },
  BtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
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

  DateGenderView: {
    flexDirection: 'column',
  },

  floatingInputView: {
    marginBottom: 15,
    position: 'relative'
  },

  radioTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
    fontFamily: 'Roboto_medium',
  },
  blockingTypeView: {
    flexDirection: 'row',
    // paddingHorizontal:10,
    padding: 10,
  },
  blockingView: {
    flexDirection: 'row',
    marginRight: 12,
    marginBottom: 12,
    position: 'relative'
  },
  randomBlockdateView: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 6,
    margin: 1
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
});

export default styles;