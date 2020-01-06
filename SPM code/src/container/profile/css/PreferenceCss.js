import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
  
  headerRight: {
    flex: 2,
    marginRight: 10,
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
  bodyContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: DEVICE_WIDTH - 20
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
  labelTxt: {
    fontSize: 15,
    color: '#025d8c'
  },
  pickerLabel: {
    fontFamily: 'Roboto_light',
    fontSize:14,
    color: '#025d8c',
    padding:5,
    paddingBottom:0,
    padding: 5,
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
  getCenterView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:20
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
  }
 
    // buttonStyle:{
    //     backgroundColor:'#b3b3b3',
    //     justifyContent:"center",
    //     marginTop:10,
    //     marginBottom:10,
    //     marginRight:16,
    //     marginLeft:16,
    //     left:8,
    //     width: 150
    //    },
    //    buttonStyle1:{
    //     backgroundColor:'#36457f',
    //     justifyContent:"center",
    //     marginTop:10,
    //     marginBottom:10,
    //     marginRight:16,
    //     marginLeft:16,
    //     left:8,
    //     width: 150
    //    }

});

  export default styles;
  