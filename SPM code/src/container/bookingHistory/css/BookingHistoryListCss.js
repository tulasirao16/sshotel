import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5fcff'
  },

  content: {
    height:Device_Height - 80
  },

  linearStyles: {
    width: DEVICE_WIDTH,
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


  headerLeft: {
    flex: 1
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 30,
  },
  iconSearchStyle: {
    color: '#fff',
    fontSize: 25,
  },
  iconHomeStyle: {
    marginTop:-2,
    color: '#fff',
    fontSize: 35,
  },
  headerBody: {
    flex: 5
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },
  headerRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
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
  headerPlusButton: {
    width: 15,
    height: 15,
  },
  filterIconsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  filterIcons: {
    color: '#fff'
  },
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 60,
    marginBottom: 0,
    elevation: 0
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
  mainView: {
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
  },

  mainComponentView: {
    flex: 1,
    width: DEVICE_WIDTH - 20,
    flexDirection: 'row',
    // justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
    paddingTop:2,
  },
  hotelContentView: {
    flex: 5
  },
  hoteStatusView: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  textBig: {
    fontSize: 15,
    fontFamily: 'Roboto_medium',
  },
  textMedium: {
    fontSize: 14,
    color: '#9c9b9d',
    fontFamily: 'Roboto_light',
    paddingBottom: 3,
  },
  textSmall: {
    fontSize: 13,
    fontFamily: 'Roboto_light',
    paddingBottom: 3,
  },
  textDate:{
    fontSize: 13,
    fontFamily: 'Roboto_light',
  },
 
  bookedText: {
    fontSize: 10,
    fontFamily: 'DueDate',
    color: '#809b34',
    transform: [{ rotate: '-8deg' }],
    borderWidth: 2,
    borderColor: '#809b34',
    borderRadius: 5,
    padding: 5,
    justifyContent:'center',
    alignItems:'center'
  },

  canceledTxt: {
    fontSize: 10,
    fontFamily: 'DueDate',
    color: '#cf242a',
    transform: [{ rotate: '-8deg' }],
    borderWidth: 2,
    borderColor: '#cf242a',
    borderRadius: 5,
    padding: 5,
    justifyContent:'center',
    alignItems:'center'
  },

  completedTxt: {
    fontSize: 10,
    fontFamily: 'DueDate',
    color: '#0175b2',
    transform: [{ rotate: '-8deg' }],
    borderWidth: 2,
    borderColor: '#0175b2',
    borderRadius: 5,
    padding: 5,
    justifyContent:'center',
    alignItems:'center'
  },

  StatusCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  statusTxt: {
    fontSize: 24,
    fontFamily: 'Roboto_light',
    color: '#3fc13e'
  },
  hotelDetails: {
    paddingBottom: 5,
    marginBottom: 5,
  },

  personIcon: {
    width: 20,
    height: 20,
    fontSize: 18,
    fontFamily: 'Roboto_light',
    color: '#999',
    marginRight: 5,
  },

  calIcon: {
    width: 20,
    height: 20,
    fontSize: 18,
    fontFamily: 'Roboto_light',
    color: '#999',
    marginRight: 5,
  },

  starIcon: {
    marginRight: 5,
    fontSize: 18,
    fontFamily: 'Roboto_light',
    color: '#ed8a19'
  },

  filterIconsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  filterIcons: {
    color: '#25c5df'
  },

  noDataViewStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:DEVICE_WIDTH - 20,
    height:Device_Height - 150
  },

  noBooking:{
    color:'#333',
    fontSize:14,
    fontFamily: 'Roboto_medium',
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
  // fontWeight: '700
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