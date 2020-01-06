import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  
    listitem: {
      paddingTop: 5,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 5,
    },
  
    ticketsCount: {
      backgroundColor: '#e3f2fd',
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    textMedium: {
      fontSize: 15,
      color: '#7c7879',
      fontFamily: 'Roboto_medium',
    },
    textSmall: {
      paddingTop: 5,
      fontSize: 12,
      color: '#7c7879',
      fontFamily: 'Roboto_medium',
    },
    textBig: {
      fontSize: 14,
      fontFamily: 'Roboto_light',
    },
    noDataViewStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: DEVICE_WIDTH - 20,
      height: Device_Height - 150
    },
    noMessages: {
      color: '#333',
      fontSize: 14,
      fontFamily: 'Roboto_medium',
    },
    title: {
      fontSize: 14,
      color: 'green',
      fontFamily: 'Roboto_light',
    },
    direction: {
      flexDirection: 'row'
    },
    iconSearchStyle: {
      color: '#fff',
      fontSize: 22,
      marginRight: 15,
    },
    noIdproof: {
      color: '#333',
      fontSize: 14,
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
    headerTitleStyle: {
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
  