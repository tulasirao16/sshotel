
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingLeft:16,
        paddingRight:16,
        paddingTop:Device_Height/14,
    },

    nextBtnView:{
        marginTop:20,
    },
    
    fontFamilyStyle: {
      fontFamily: 'Roboto_medium',
    },

    button_main:{
      marginHorizontal:8,
      marginVertical:8,
    },

    gradientBtn:{
      backgroundColor: 'transparent',
      fontSize: 16,
      color: '#fff',
      fontFamily: 'Roboto_medium'
    },

    fbLoginBtnTxt: {
      color: '#fff', 
      fontSize: 11,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    },
    signupLinkTxt: {
      color:'#025d8c',
      fontFamily:'Roboto_bold'

    },

    headerMainView: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        width: DEVICE_WIDTH,
        height: 50,
        marginTop: 30,
        marginHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 0,
      },

      iconMenuStyle: {
        color: '#fff',
      },
    
      headerBody: {
        width: DEVICE_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },

      headerTitleStyle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Roboto_medium',
        left:-20
      },

      fbText:{
        color: '#fff', 
        fontSize: 16, 
        fontFamily:'Roboto_medium',
      },

      goText:{
        color: '#000', 
        fontSize: 16, 
        fontFamily:'Roboto_medium',
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

      FBbutton:{
        marginBottom:15,
      },

      fbBtn:{
          backgroundColor:'#3b5998',
          borderWidth:1,
          borderColor:'#2f4678',
          width:DEVICE_WIDTH-40,
          height:50,
          justifyContent:'flex-start',
          elevation:0,
      },

      FBIcon:{
        width:25,
        height:25,
        marginHorizontal:30
      },

      gobutton:{
        marginBottom:20,
      },

      goBtn:{
        backgroundColor:'#ffffff',
        borderWidth:1,
        borderColor:'#e9e9e9',
        width:DEVICE_WIDTH-40,
        height:50,
        justifyContent:'flex-start',
        elevation:0,
    },

    goIcon:{
      width:25,
      height:25,
      marginHorizontal:30
    },

    dont:{
      marginVertical:20, 
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    },

    signupText:{
      color: '#025d8c', 
      fontSize:14,
      fontFamily:'Roboto_medium', 
    },

    dontText:{
      color: '#999999', 
      fontSize:14,
      fontFamily:'Roboto_medium', 
    },

    input:{
        marginBottom:10
    },

    forget:{
        marginTop:10,
        alignItems:'flex-end',
    },

    forgetBtn:{
        fontSize:14,
        color:'#025d8c', 
        fontFamily:'Roboto_medium', 
    },
    centerAlignment: {
      marginTop:20, 
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    },
    imageStyle: {
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'contain'
    },
    imgStyle: {
      width:Device_Height/3, 
      height: Device_Height/6,
      borderRadius: 5,
      resizeMode: 'cover'
    },
    imageBox: {
      width:Device_Height/3, 
      height: Device_Height/6,
      borderRadius: 5,
      borderWidth: 0.5,
      borderColor: 'transparent'
    },
    orStyle: {
      fontFamily: 'Roboto_light',
      fontSize: 10,
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
    errorMessage: { 
      color: 'red',
      fontFamily: 'Roboto_light',
      fontSize:13
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
    
    landingView: {
      flexDirection: 'row',
      justifyContent:'center',
      alignItems:'center',
      width: DEVICE_WIDTH,
      height: Device_Height/4,
    },

    welcomeFieldStyle: {
      marginHorizontal: 30,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    fontFamilyStyle: {
      fontFamily: 'Roboto_medium',
    },

    welcomeText: {
      fontFamily: 'Roboto_medium',
      color: '#fff',
      fontSize: 18,
      marginTop: 20
    },
    visibilityBtn: {
      position: 'absolute',
      right: 10,
      bottom: 30
    },
});

export default styles;