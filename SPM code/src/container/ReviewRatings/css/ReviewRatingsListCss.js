import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb',
  },

  content: {
    margin:8,
  },

  card:{
    backgroundColor: '#fff',
    marginBottom:5,
    borderRadius:10,
    paddingTop:7,
    paddingBottom:7,
    paddingLeft:10,
    paddingRight:10,
    elevation:0,
  },

  cardItem:{
    marginLeft:0,
    paddingLeft:0,
    paddingTop:2,
    paddingBottom:2,
    paddingRight:0,
    // borderColor: '#e2e2e2',
    // borderBottomWidth: 0.5,
  },

  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },

  SuccessCircle: {
    position:'absolute',
    top:20,
    right:10,
    zIndex:99,
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#009688',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  chekMarkIcon:{
    color:'#fff',
    fontSize:40,
  },

  listMain:{
    flexDirection:'row',
    width:DEVICE_WIDTH,
  },

  leftView:{
    flex:2,
    alignItems:'flex-start'
  },

  rightView:{
    flex:3,
    alignItems:'flex-start'
  },

  textLabel:{
    fontSize: 13,
    fontFamily: 'Roboto_light',
  },

  serviceTitle:{
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },

  bookingText:{
    fontSize: 13,
    fontFamily:'Roboto_medium'
  },

  iconMenuStyle: {
    color: '#fff',
    fontSize:30,
  },

  iconSearchStyle:{
    color: '#fff',
    fontSize:25,
  },

  getCenterView: {
    // { marginHorizontal: 10, marginTop: 30 }
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },

  bodyContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10
  },

header: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 56,
    marginBottom: 6,
    backgroundColor: '#00bcd4'
},
label: {
    flexGrow: 1,
    fontSize: 20,
    fontWeight: `600`,
    textAlign: `left`,
    marginVertical: 8,
    paddingVertical: 3,
    color: `#f5fcff`,
    backgroundColor: `transparent`
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
  // paddingHorizontal: 15,
  paddingVertical: 10,
  marginBottom: 0,
  justifyContent: 'center'
},

  headerLeft: {
    flex: 1,
  },

  headerBody: {
    flex: 4
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

  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },

  iconMenuStyle: {
    color: '#fff',
    fontSize:30,
  },

  headermapIcon: {
    width: 25,
    height: 25,
  },

  headerRight: {
    flex: 1,
  },

  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },

  // header styles end
  textlabel: {
    fontFamily: 'Roboto_light',
    fontSize:13,
    color:'#575757',
  },

  itemStyle:{
    fontFamily: 'Roboto_medium',
    fontSize:14,
  },

  feedbackPicker:{
    fontFamily: 'Roboto_light',
    fontSize:13,
    color:'#575757',
    marginBottom:15,
    borderBottomWidth:1,
    borderColor:'#e6e6e6'
  },

  textInput:{
    width:DEVICE_WIDTH,
  },

  stackedLabel:{
    fontFamily: 'Roboto_light',
    fontSize:13,
    color:'#575757',
    marginBottom:15,
    borderBottomWidth:1,
    borderColor:'#e6e6e6'
  },

  BtnText: {
    fontFamily:'Roboto_light',
    fontSize:14,
    color:'#fff',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },

  textSmall: {
    fontSize: 16,
    fontFamily: 'Roboto_medium',
  },

  textBig: {
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },

  Title: {
    fontFamily: 'Roboto_light',
  },

  textSmall: {
    fontSize: 16,
    fontFamily: 'Roboto_light',
  },

  textBig: {
    fontSize: 18,
  },

  addbutton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#333',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },

  addIcon: {
    fontSize: 23,
    marginRight: 0,
    marginLeft: 0,
    color: '#939598'
  },

  AmenitiesView: {
    flexDirection: 'row',
    marginTop: 20,
  },

  mainView: {
    flexDirection: 'row',
    //width: DEVICE_WIDTH,
    marginBottom: 20,
  },
  DropdownView: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  labelView: {
    flex: 4,
    justifyContent: 'center',
  },
  minusView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonStyle: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  updateBtn: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btnNext: {
    width: DEVICE_WIDTH - 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  labelInput: {
    color: '#673AB7',
  },
  formInput: {
    borderBottomWidth: 1.5,
    borderColor: '#ccc',
    width: '100%'
  },
  input: {
    borderWidth: 0
  },

  textArea: {
    borderColor: '#ccc',
    borderWidth: 1.5,
    padding: 5,
    flexDirection: 'column',
    fontSize: 16,
    width: 320,
    height: 100,
    justifyContent: "flex-start"
  },

  headerStyle: {
    // backgroundColor: 'rgba(69,85,117,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8
  },
  pickerStyle: {
    width: undefined,
    height: 40,
    backgroundColor: '#01a4a2'
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
  },

  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notificationBox: {
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: '#025d8c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  // rightView: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  imageCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageFit: {
    flex: 1,
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },

  DialogStyle:{
    paddingHorizontal:10,
    paddingVertical:10,
  },

  dialogTitle:{
    fontSize: 14,
    fontFamily: 'Roboto_medium'
  },

  nofav:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:DEVICE_WIDTH - 20,
    height:Device_Height - 100
  },

  nofavTxt:{
    color:'#333',
    fontSize:14,
    fontFamily: 'Roboto_medium',
  },
  activeIndicatorView: {
    width: DEVICE_WIDTH,
    height: Device_Height,
    position:'absolute',
    zIndex:9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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