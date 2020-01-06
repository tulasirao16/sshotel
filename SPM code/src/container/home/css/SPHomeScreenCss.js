import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#eef5fb'
  },
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems:'center'
  },
  headerLeft: {
    flex:1,
  },

  headerBody: {
    flex: 4
  },
  headerRight: {
    flexDirection: 'row',
    flex:3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:10
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

  refreshIcon: {
    fontSize: 25,
    color: '#ffffff'
  },
  headerTitleStyle: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'Roboto_medium',
  },
  linearGradientStyle: {
    paddingTop: 26,
    paddingBottom: 10,
    // paddingHorizontal: 20,
    width: DEVICE_WIDTH,
    height: Device_Height/4
  },
  viewOne: { 
    width: (Platform.OS == 'ios' ? DEVICE_WIDTH - 40 : DEVICE_WIDTH - 40), 
    backgroundColor: '#ffffff', 
    // height: Device_Height / 5, 
    marginVertical:10,
    paddingVertical:8,
    borderRadius:6,   
  } ,

  eachRowParent: {
    flexDirection: 'row',
    width: DEVICE_WIDTH - 40,
    // height: (Device_Height / 1)-30
  },
  eachView: {
    flex:2,
    borderRadius:6,
    alignItems:'center',
    justifyContent: 'center',
   
  },
  shortViewTitle: {
    fontSize: 12,
    color:'#019fa0',
    fontFamily:'Roboto_light',
    paddingHorizontal:10,
    paddingTop:3
  },
  title:{
    fontSize: 14,
    color:'#6a78f9',
    fontFamily:'Roboto_light',
    paddingHorizontal:20,
    paddingBottom:8
  },
  calendarIcon: {
    fontSize: 40,
    color: '#6978f9',
    marginTop:-10
  },
  tabIcon: {
    fontSize: 50,
    color: '#ffffff',
  },

  starIcon:{
    fontSize: 60,
    color: '#ffffff',
  },

  businessIcon: {
    fontSize: 60,
    color: '#ffffff',
  },

  countFont: {
      fontFamily: 'Roboto_light',
      fontSize:24,
      color: '#070706'
  },
  tabTitle: {
    fontFamily: 'Roboto_medium',
    fontSize:11,
    color: '#848888',
    paddingTop:5
  },
    tabTitleOne: {
    fontFamily: 'Roboto_medium',
    fontSize:14,
    color: '#424240',
    paddingLeft:10
  },
  tabTitleOneSmall: {
    fontFamily: 'Roboto_medium',
    fontSize:11,
    color: '#424240',
    paddingLeft:10
  },

  viewTwo: { 
    width: DEVICE_WIDTH - 40, 
    backgroundColor: '#ffffff', 
    height: Device_Height / 9, 
    marginVertical:5,
    paddingRight:15,
    borderRadius: 6,
    flexDirection: 'row'   
  } ,
  viewTwoAmount: { 
    width: DEVICE_WIDTH - 40, 
    backgroundColor: '#ffffff', 
    height: Device_Height / 9, 
    marginVertical:5,
    paddingRight:15,
    borderRadius: 6,
    flexDirection: 'row'   
  } ,
  eachViewTwoIcon: {
    width:DEVICE_WIDTH/4.5,
    height: Device_Height/9,
    backgroundColor: '#51e9c9',
    borderRadius:6,
    alignItems:'center',
    justifyContent: 'center'
  },
  eachViewTwoIconBg: {
    backgroundColor: '#8c74fa',
  },
  eachViewPropertyIconBg: {
    backgroundColor: '#eee',
  },

  CreatePropertyIconBg:{
    backgroundColor: '#7D3C98',
  },

  eachViewTwoBody: {
    flex:3,
    borderRadius:6,
    alignItems:'flex-start',
    justifyContent: 'center'
  },
  eachViewTwoBodyBg: {
    backgroundColor: '#51e9c9',
  },
  eachViewTwoPrice: {
    flex:2,

    borderRadius:6,
    alignItems:'center',
    justifyContent: 'center'
  },
  eachViewTwoBlockedBg: {
    backgroundColor: '#E67474',
  },
  eachViewTwoAmountBg: {
    backgroundColor: '#46b971',
  },
  eachViewMessageBodyBg:{
    backgroundColor: '#54c6f8',
  },

  eachStarBodyBg:{
    backgroundColor: '#ffc300',
  },

  titleView: {
    marginTop: 5
  },
  imgStyle: {
    flex:1,
    width:null,
    height: null,
    resizeMode: 'cover'
  },

  imgiconStyle:{
    width:50,
    height: 50,
    resizeMode: 'cover'
  },

  menuIcon: {
    color: '#fff',
    fontSize: 30,
    lineHeight:30,
    justifyContent:'center',
    alignItems:'center'
  },

  addIcon:{
    color: '#333',
    fontSize: 50,
  },

  iconBellStyle: {
    color: '#fff',
    fontSize: 27,
  },
  notificationCircle: {
    backgroundColor: '#E67474',
    borderRadius: 50,
    width: 20,
    height: 20,
    position: 'absolute',
    right:-8,
    bottom:10,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    padding:2,
  },
  notificationIconView: {
    flex:1,
    marginTop:-5,
    alignItems: 'center',
    justifyContent: 'center',
    // width: 40,
    // height: 26,
  },
  headerbellIcon: {
    // width: 21,
    // height: 21,
    // marginRight: 20
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
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
  iconMenuStyle: {
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
    zIndex: Platform.OS === 'ios' ? 99 : 99,
    
  },
  activeIndicatorStyle: {
    color: '#FFFFFF'
  },


});

export default styles;