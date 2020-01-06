
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearStyles: {
    width: DEVICE_WIDTH,

  },
headerMainView: {
  flexDirection: 'row',
  width: DEVICE_WIDTH,
  height: 50,
  marginTop: 10,
  // marginHorizontal: 10,
  paddingVertical: 10,
  marginBottom: 0,
  justifyContent: 'center'
},
headerLeft: {
  flex: 1,
},

headerBody: {
  flex: 6
},

headerTitleStyle: {
  color: '#fff',
  fontSize: 18,
  fontFamily: 'Roboto_medium',
},

iconMenuStyle: {
  color: '#fff',
  fontSize:30
},

iconHomeStyle:{
  color: '#fff',
  fontSize:25
},

headerRight: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
},
  menuIcon: {
    color: '#fff',
    fontSize: 27
  },
 
  headermapIcon: {
    width: 25,
    height: 25,
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
  
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  bodyContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: DEVICE_WIDTH - 20
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
  bodyContainer: {
    width: DEVICE_WIDTH
  },
  // profileContent: {
  //   flexDirection:'column',
  //   height:Device_Height
  // },
  profileImageView: {
    width: DEVICE_WIDTH,
    height: Device_Height / 3,
  },
  fitImage: {
    width: null,
    height: null,
    flex: 1,
    resizeMode: 'cover'
  },
  profileOptionsView: {
    marginHorizontal: 10,
    width: DEVICE_WIDTH - 20,
    marginVertical: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    width: DEVICE_WIDTH - 20
  },
  address: {
    flex: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  editIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addressTxt: {
    fontSize: 13,
    fontFamily: 'Roboto_medium',
    marginVertical: 3,
  },
  MobileTxt: {
    fontSize: 15,
    fontFamily: 'Roboto_medium',
    marginVertical: 3,
  },
  editIConStyle: {
    color: '#01a4a2',
    marginVertical: 3,
    fontSize:22
  },
  hrLine: {
    width: DEVICE_WIDTH - 40,
    borderWidth: 1,
    borderColor: '#025d8c',
    marginHorizontal: 10
  },
  checkIConStyle: {
    color: '#3fc13e',
    marginVertical: 3,
    fontSize:22
  },
  optionTitle: {
    marginHorizontal: 20,
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#01a4a2',
    height:40
  },

  button_main: {
    marginTop: 60,
  },

  button: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  styleOne: {
    margin: 30,
    marginTop: 100,
    marginBottom: 100,
  },
  noteFont: {
    fontSize: 12,
  },
  textCenter: {
    flex: 1, flexDirection: 'column', justifyContent: 'center', textAlign: 'center', alignSelf: 'center', color: 'white',
    fontSize: 80, marginVertical: 10,
  },
  textCenterNote: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 12,
    color: 'red'
  },
  textCenterNoteSuccess: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 12,
    color: 'green'
  },
  buttonNext: {
    width: 140,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#009688',
  },
  buttonNext: {
    width: 140,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#009688',
  },

  plusIcon: {
    flex: 1,
    backgroundColor: 'gray',
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 50,
    position: 'absolute',
    left: (Platform.OS === 'ios') ? 140 : 13,
    bottom: 16,
    zIndex: 1,
  },
  camicon: {
    position: 'absolute',
    top: 70,
    left: 160
  },
  profilepic: {
    height: 160,
    width: DEVICE_WIDTH,
  },
  imageContainer: {
    height: 150,
    width: DEVICE_WIDTH
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  input: {
    paddingBottom: 10,
  },

  textAreaContainer: {
    borderColor: '#009688',
    borderBottomWidth: 1,
    padding: 5,
    flexDirection: 'row',
    width: DEVICE_WIDTH - 30
  },
  textArea: {
    height: 50,
    justifyContent: "flex-start",
    fontWeight: '400',
    fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'sans-serif-condensed',
  },

  verified: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  inputFieldStyle: {
    width: DEVICE_WIDTH - 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#009688',
    marginBottom: 15
  },
  dobLeft: {
    width: 100
  },
  dobRight: {
    marginBottom: 13
  },
  labels: {
    color: '#9a9a9a'
  },
  mapIconView: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    top: -30,
    right: 10
  },
  mapIcon: {
    color: '#009688',
  },
  nextBtnView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'center'
  },
  title:{
    fontSize:14,
    color:'#333333',
    fontFamily:'Roboto_medium',    
  },

  titleRouting: {
    color: '#019fa0',
    paddingTop:4
  }
});

export default styles;