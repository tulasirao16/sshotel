import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },

  required:{
    color:'red',
    fontSize:13,
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
  iconEditStyle: {
    color: '#fff',
    fontSize: 25
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
  status: {
    zIndex: 10,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
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
  listItem: {
    flexDirection: 'row',
    marginBottom: 7,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },
  listItemOne: {
    flexDirection: 'row',
    marginBottom: 7,
    paddingTop:4,
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
    height: Device_Height/3,
    marginBottom: 1,
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
  galleryCircle: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: Device_Height/15,
    height: Device_Height/15,
    position: 'absolute',
    right:10,
    bottom: Device_Height/11,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoCircle: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: Device_Height/15,
    height: Device_Height/15,
    position: 'absolute',
    right:10,
    top: 70,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusIcon: {
    fontSize: 27,
    color: '#025d8c'
  },
  thumbmailsView :{
  width:DEVICE_WIDTH-20,
  height:Device_Height/12,
   position: 'absolute',
   left:10,
   bottom:10,
   backgroundColor:'transparent',
   flexDirection: 'row'
  },
  thumbnail: {
    position: 'relative',
    width: DEVICE_WIDTH/7,
    height: Device_Height/12,
    borderColor: '#fff',
    borderWidth: 1,
    margin:3,
    zIndex: 99,
  },
  scrollInfoView: {
    height: Device_Height-((Device_Height/3)+80),
    backgroundColor: '#fff',
    width: DEVICE_WIDTH,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
    paddingBottom:10,
  },
  input: {
    paddingBottom: 10,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#404041'
  },
  textBig: {
    fontSize: 14,
    paddingLeft:5,
    paddingTop:3
  },
  txtFont: {
    fontFamily: 'Roboto_medium',
  },
  title:{
    fontSize:12,
    color:'#454545',
    fontFamily:'Roboto_light',    
  },
  titleRooms: {
    fontSize:11,
    color:'#454545',
    fontFamily:'Roboto_medium',    
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
    color:'teal'
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
    borderRadius:22
  },
  routingTitleStyle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
    marginVertical: 3
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
  floatingInputView: {
    paddingVertical:6,
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
  roomsTextColor: {
    color: '#025d8c',
    paddingLeft:0
  },
  pickerLabel: {
    fontSize: 14,
    color: '#222222',
    fontFamily: 'Roboto_light',
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
});

export default styles;
