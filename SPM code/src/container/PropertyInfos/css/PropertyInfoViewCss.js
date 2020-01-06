import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb',
  },

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    // paddingHorizontal: 5,
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
  iconEditStyle: {
    color: '#fff',
    fontSize: 23
  },
  headerBody: {
    flex: 5
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
  content: {
    // padding: 10,
    // paddingHorizontal:15,
    margin: 10,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 7,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },
  profilepic: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    height: 160,
    width: '100%',
    backgroundColor: '#34429b',
  },
  button: {
    width: DEVICE_WIDTH - 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnNext: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnModalSubmit: {
    width: DEVICE_WIDTH - 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnTxt: {
    color: '#fff'
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  imageView: {
    width: DEVICE_WIDTH,
    height: 240,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  plusCircle: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 80,
    height: 80,
    position: 'absolute',
    top: Device_Height / 12,
    left: DEVICE_WIDTH / 2.5,
    right: 0,
    bottom: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusIcon: {
    fontSize: 60,
    color: '#989898'
  },
  thumbmailsView: {

  },
  thumbnail: {
    position: 'relative',
    width: 50,
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    zIndex: 99,
  },
  thumbnail2: {
    position: 'absolute',
    bottom: 10,
    left: 70,
    width: 50,
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    zIndex: 99,
  },
  thumbnail3: {
    position: 'absolute',
    bottom: 10,
    left: 130,
    width: 50,
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    zIndex: 99,
  },
  input: {
    paddingBottom: 10,
  },
  textBig: {
    fontSize: 14,
    paddingLeft: 1,
    paddingTop: 3
  },
  rightData: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  txtFont: {
    fontFamily: 'Roboto_light',
  },
  title: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Roboto_medium',
  },
  regularTxt: {
    color: '#8a8786'
  },
  buttonStyle: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapIconStyle: {
    color: 'teal'
  },
  btnNext: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  camIconView: {
    backgroundColor: '#929496',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  camIcon: {
    color: '#fff',
    fontSize: 50
  },
  btnNext: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textArea: {
    borderColor: '#a7a9ac',
    borderBottomWidth: 1,
    padding: 5,
    flexDirection: 'column',
    fontSize: 16,
    width: 320,
    height: 100,
    justifyContent: "flex-start"
  },
  imgStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  linearBtnStyles: {
    borderRadius: 22
  },
  titleRouting: {
    color: '#019fa0',
    paddingVertical: 4
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
    width: DEVICE_WIDTH - 20,
    left: 10,
    backgroundColor: '#dcf4ff',
    marginTop: 10
  },
  leftImageView: {
    width: Device_Height / 9,
    height: Device_Height / 9,
  },
  imageBusinessBox: {
    width: Device_Height / 9,
    height: Device_Height / 9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#eee',
  },
  imgBusinessStyle: {
    width: Device_Height / 9,
    height: Device_Height / 9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#eee',
    resizeMode: 'cover'
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
  verticalGap: {
    marginTop: 2.5,
    marginBottom: 4
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
