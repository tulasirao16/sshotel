import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  linearStyles: {
    width: DEVICE_WIDTH,

  },

  seacrBar: {
    marginTop: 0,
    paddingTop: 0,
  },

  container: {
    flex: 1,
    backgroundColor: '#eef5fb',
    height: Device_Height
  },

  content: {
    margin: 10,
    // flex:1,
    // backgroundColor: '#fff',
    // borderRadius: 10,
    // padding:8,
    // margin: 8,
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
  },

  cardItem: {
    flexDirection: 'row',
    marginLeft: 0,
    paddingLeft: 0,
    paddingTop: 2,
    paddingBottom: 4,
    marginBottom: 5,
    paddingRight: 0,
    borderColor: '#e2e2e2',
    borderBottomWidth: 0.5,
  },

  textmedium: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Roboto_medium',
  },
  textSmall: {
    fontSize: 12,
    color: '#7c7879',
    fontFamily: 'Roboto_medium',
    paddingBottom: 3,
  },
  textBig: {
    fontSize: 15,
    fontFamily: 'Roboto_light',
  },
  textColor: {
    color: '#008001'
  },

  button_main: {
    marginTop: 20,
    width: DEVICE_WIDTH - 30
  },

  iconSearchStyle: {
    color: '#fff',
    fontSize: 25
  },

  gradientBtn: {
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto_medium'
  },

  labels: {
    color: '#777',
    fontFamily: 'Roboto_light',
    fontSize: 13,
  },

  input: {
    marginBottom: 10,
  },

  item: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#c9c9c9'
  },

  textArea: {
    height: 50,
    justifyContent: "flex-start",
    color: '#333',
    fontFamily: 'Roboto_medium',
    fontSize: 14,
    borderColor: '#c9c9c9',
    borderBottomWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    width: DEVICE_WIDTH - 30
  },

  getCenterView: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnText: {
    fontFamily: 'Roboto_bold',
    fontSize: 14,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },
  headerLeft: {
    flex: 1,
  },
  headerBody: {
    flex: 5,
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 30,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
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

  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
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
  BtnText1: {
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
