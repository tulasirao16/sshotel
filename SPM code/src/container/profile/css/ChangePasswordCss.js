
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 30
  },

  menu_button: {
    marginTop:-5,
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
    elevation: 0
  },

  buttonStyle: {
    backgroundColor: '#aa00ff',
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "20%",
    marginRight: "20%",
  },
  textBoxBtnHolder: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginBottom: 20,
  },

  textBox: {
    fontSize: 18,
    alignSelf: 'stretch',
    height: 45,
    paddingRight: 45,
    paddingLeft: 8,
    borderBottomWidth: 1,
    paddingVertical: 0,
    borderBottomColor: '#d6d5da',
    borderRadius: 0,
    color: '#333',
  },

  visibilityBtn: {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 5
  },
  BtnText: {
    fontFamily: 'Roboto_medium',
    fontSize: 15,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  getCenterView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  inputTopGap: {
    paddingTop:4
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
      activeIndicatorStyle1: {
      color: '#FFFFFF'
    },
  

});
export default styles;