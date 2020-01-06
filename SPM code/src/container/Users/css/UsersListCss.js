import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get('window').width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  linearStyles: {
    width: DEVICE_WIDTH,

  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
},
content:{
  margin:0,
},
status: {
  zIndex: 10,
  elevation: 2,
  width: DEVICE_WIDTH,
  height: 21,
  backgroundColor: 'transparent',
  elevation:0
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

addmenu_button:{
  marginVertical: Platform.OS === 'ios' ? -10 : -6,
  paddingTop:6,
  paddingBottom:6,
  paddingLeft:8,
  paddingRight:8,
  borderRadius:30,
  justifyContent:'center',
  alignItems:'center'
},

header: {
    flexDirection:'row',
    paddingHorizontal:8,
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 50,
    marginBottom: 0,
    elevation:0
},
label: {
    flexGrow: 1,
    fontSize: 20,
      
    textAlign: 'left',
    marginVertical: 8,
    paddingVertical: 3,
    color: '#f5fcff',
    backgroundColor: 'transparent'
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
  iconMenuStyle: {
    color: '#fff',
    fontSize:30
  },
  iconHomeStyle:{
    fontSize:25,
    color:'#fff',
  },
  iconAddMenuStyle: {
    color: '#fff',
    fontSize:32
  },

  headerBody: {
    flex: 4
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },
  headerRight: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
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
  bodyContainer: {
    width: DEVICE_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingHorizontal: 12,
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
  searchHeaderStyle: {
      position:'absolute',
      top:-20
  },

  iconSearchStyle: {
    color: '#fff',
    fontSize: 25,
  },
  listMainView: {
    width: DEVICE_WIDTH - 20,
    height: Device_Height/6.7,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    elevation:1,
    borderRadius:5,
  },
  imgStyle: {
    width:Device_Height/10, 
    height: Device_Height/10,
    borderRadius: 5,
    resizeMode: 'cover'
  },
  listViewImageContainer: {
      width:Device_Height/8, 
      height: Device_Height/6,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      padding:5,
      paddingLeft:8
  },
  listViewLeftImageContainer: {
    width:Device_Height/6.75, 
    height: Device_Height/6.75,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5

  },
  leftUserImage: {
    width:Device_Height/6.75, 
    height: Device_Height/6.75,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    resizeMode: 'cover'
  },
  listViewBodyContainer: {
      width: DEVICE_WIDTH-(Device_Height/7.05),
      height: Device_Height/6.7,
      marginVertical:3,
      // justifyContent:'center',
      // alignItems: 'center', 
  },
  listSubContainer: {
    flexDirection: 'row',
    width: DEVICE_WIDTH-(Device_Height/7.05)-20,
    margin:2

  },
  imageBox: {
    width:Device_Height/10, 
    height: Device_Height/10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'transparent'
  },
  titlestyle: {
      fontFamily: 'Roboto_medium',
      fontSize:11,
      color: '#6e6e6e',
      paddingLeft:6
  },
  title: {
       fontFamily: 'Roboto_medium',
      fontSize:11,
      color: '#333333',
      paddingLeft:6  
  },
  titleColor: {
      fontFamily: 'Roboto_medium',
      fontSize:13,
      color: '#025d8c',
      paddingLeft:6  
  },
  noDataViewStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:DEVICE_WIDTH - 20,
    height:Device_Height - 150
  },
  noUser:{
    color:'#333',
    fontSize:14,
    fontFamily: 'Roboto_medium',
  },
  iconStyle: {
    color: '#01a4a2', 
    fontSize: 15
  },
  emailView: {
    width:18,
  },
  mobileView: {
    width:18,
  },
  nameView: {
    width:80
  },
  categoryView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH-(Device_Height/7)-20,
    height: Device_Height/7,
  },
  businessTitleView: {
    width: (DEVICE_WIDTH-(Device_Height/11))/2
  },
  userRoleView: {
    width: (DEVICE_WIDTH-(Device_Height/11))/4,
    flexDirection: 'row'
  },
  userIDView: {
    width: (DEVICE_WIDTH-(Device_Height/11))/2,
    flexDirection: 'row'
  },
  mailIconView: {
    width: (DEVICE_WIDTH-(Device_Height/11))/10,
    flexDirection: 'row',
    paddingLeft:10
  },
  statusBtnView: {
    width: (DEVICE_WIDTH-(Device_Height/11))/2,
    flexDirection:'row', 
    justifyContent: 'center', 
    marginRight:5
  },
//  =========================================================================
list: {
  flexDirection: 'row',
  //width: DEVICE_WIDTH,
  // marginTop: 10,
  borderBottomWidth: 1,
  borderColor: '#01a4a2',
  paddingVertical: 10
},
left: {
  flex: 1,
  marginRight: 5,
  justifyContent: 'center', 
},

thumbImg: {
  width: Device_Height / 11,
  height: Device_Height / 11,
  borderBottomLeftRadius: 50,
  borderBottomRightRadius: 50,
  borderTopRightRadius: 50,
  borderTopLeftRadius: 50,
  overflow: 'hidden',
  resizeMode: 'cover'
},
body: {
  flex: 3,
  marginRight: 10,
},

right: {
  flex: 1,
  alignItems: 'flex-end',
},
textBig: {
  fontSize: 14,
  fontFamily: 'Roboto_bold',
  color: '#025d8c'
},


textSmall: {
  fontSize: 14,
  color: '#01a4a1',
  fontFamily: 'Roboto_medium',
  paddingBottom: 2,
},

textNote: {
  fontSize: 14,
  color: '#808284',
  fontFamily: 'Roboto_medium',
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
  