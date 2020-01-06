import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  content: {
    backgroundColor: '#fff',
    marginHorizontal:10,
    paddingVertical:5,
  },

  linearStyles: {
    width: DEVICE_WIDTH,
  },

  txtbold: {
    fontSize:14,
    fontFamily: 'Roboto_bold',
  },

  iconEditStyle: {
    color: '#fff',
    fontSize: 25,
    marginRight: 25
  },

  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
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


  iconMenuStyle: {
    color: '#fff',
    fontSize:30
  },
  iconCloseStyle: {
    color: '#fff',
    fontSize: 25,
  },

  headerBody: {
    flex: 6
  },

  headerRight: {
    flex: 2,
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },

  fontFamilyStyle: {
    fontFamily: 'Roboto_medium',
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
  // bodyContainer: {
  //   marginHorizontal: 10,
  //   marginVertical: 10,
  //   width: DEVICE_WIDTH-20
  // },

  button_main:{
    marginTop:20,
    width:DEVICE_WIDTH-30
  },

  gradientBtn:{
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto_medium'
  },

  btnMain:{
    flexDirection:'row',
    width:DEVICE_WIDTH,
    marginHorizontal:15,
    marginBottom:10,
  },

  heading:{
    marginHorizontal:10,
    paddingVertical:5
  },

  SubHeading:{
    width:DEVICE_WIDTH,
    backgroundColor:'#5db85c',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    marginBottom:10,
  },

  SubHeadingText:{
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Roboto_light'
  },

  listItem:{
    marginLeft:0,
    paddingTop:0,
    paddingBottom:0,
    paddingRight:0,
  },

  listMain:{
    flexDirection:'row',
    width:DEVICE_WIDTH,
    padding:10,
    borderBottomWidth: 0,
  },

  leftView:{
    flex:1
  },

  middleView:{
    flex:1,
    position:'absolute',
    top:10,
    right:50,
  },

  rightView:{
    flex:2,
  },

  bookingTitle:{
    fontSize: 16,
    fontFamily: 'Roboto_bold',
  },

  textLabel:{
    fontSize: 13,
    fontFamily: 'Roboto_light',
  },

  thickColor:{
    color:'#025d8c'
  },

  lightColor:{
    color:'#01a4a1'
  },

  greenColor:{
    color:'#5db85c'
  },

  bookingText:{
    fontSize: 14,
    fontFamily:'Roboto_medium'
  },

  linearBtnStyles: {
    borderRadius: 22
  },

  getCenterView: {
    // { marginHorizontal: 10, marginTop: 30 }
    flex: 2,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
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
  linearBtnStyles: {
    borderRadius: 22
  },
  // modal css
  modalView: {
    flex: 1, 
    // padding: 15, 
    marginTop: Device_Height/4
  },
  modalContainerStyles: {
      width: 300, 
      height: 180, 
      backgroundColor: '#fff', 
      padding: 15,
      borderRadius: 10
  },
  txtInfoViewStyle: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    // paddingVertical:20 
  },
  txtInfo: {
    color: '#333333', 
    fontSize: 14, 
    fontFamily: 'Roboto_medium'
  },
  btnsParentView: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop:20
    // paddingVertical: 10,
  },
  eachBtnView: {
    // width:140,  
    marginRight:10,
    justifyContent: 'center', 
    alignItems: 'center', 
    // paddingVertical: 10
  },
  btnStyle: { 
    width: 110, 
    marginLeft:20, 
    backgroundColor: '#01a4a2', 
    borderRadius:8, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  cancelBtn: {
    width: 110, 
    backgroundColor: '#025d8c', 
    marginLeft:10, 
    borderRadius:8, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  btnTxt: {
    color: '#fff', 
    fontFamily: 'Roboto_medium', 
    fontSize: 16 
  },
  floatingInputView: {
    padding: 10,
    paddingLeft: 0
  },
  plusCircle: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: Device_Height/19,
    height: Device_Height/19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor: '#000'
  },
  dobRight: {
    top:-10
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

});
export default styles;