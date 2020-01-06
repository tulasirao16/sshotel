import { StyleSheet, Dimensions, Platform } from 'react-native';
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
  

  title: {
    color: '#fff'
  },

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 30,
    // marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },

  headerLeft: {
    flex: 1,
    marginTop:-5,
  },

  headerBody: {
    flex: 6
  },

  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },

  headermapIcon: {
    width: 25,
    height: 25,
  },

  headerRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0
  },

  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
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
    marginLeft: 0
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
    padding: 10
  },
  floatingInputViewOne: {
    paddingHorizontal: 20
  },
  DateGenderView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH - 20,
    left: 10,
  },
  DatePicker: {
    flex: 2
  },
  genderView: {
    flex: 2
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
  getCenterView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  activeIndicatorView: {
    width: DEVICE_WIDTH,
    height: Device_Height,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 999,
  },
  activeIndicatorStyle: {
    color: '#ffffff'
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
  titleRadio: {
    fontSize: 14,
    fontWeight: '400',
    color: '#454545',
    fontFamily: 'Roboto_light',
    marginTop:10
  },
  titleError: {
    fontSize: 14,
    fontWeight: '400',
    color: 'red',
    fontFamily: 'Roboto_light',
    marginTop:10
  },
  required: {
    color: 'red'
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