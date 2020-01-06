import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5fcff'
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

  linearStyles: {
    width: DEVICE_WIDTH,
  },
  
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },

  headerLeft: {
    flex: 1
  },
  iconMenuStyle: {
    color: '#fff',
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
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    flexDirection:'row',
    paddingHorizontal:15,
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 60,
    marginBottom: 0,
    elevation:0
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
businessNameView: {
  width: DEVICE_WIDTH-20,
  left: 10,
  backgroundColor: '#dcf4ff',
  marginTop: 10
},
leftImageView: {
  width: Device_Height/11, 
  height: Device_Height/11,
},
imageBusinessBox: {
  width: Device_Height/11.5, 
  height: Device_Height/11.5,
  borderRadius: 50,
  borderWidth: 0.5,
  borderColor: 'transparent'
},
imgBusinessStyle: {
  width: Device_Height/11.5, 
  height: Device_Height/11.5,
  borderRadius: 50,
  resizeMode: 'cover'
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