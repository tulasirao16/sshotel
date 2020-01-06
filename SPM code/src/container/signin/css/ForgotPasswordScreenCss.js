
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingLeft:16,
        paddingRight:16,
        paddingTop:30,
    },

    nextBtnView:{
        marginTop:20,
    },

    headerMainView: {
        flexDirection: 'row',
        width: DEVICE_WIDTH,
        height: 50,
        marginTop: 30,
        // marginHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 0,
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
      },
    
      headerBody: {
        flex: 4
      },

      headerRight: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
      },

      headerTitleStyle: {
        color: '#fff',
        fontSize: 18,
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

      FBbutton:{
        marginBottom:15,
      },

      fbBtn:{
          backgroundColor:'#3b5998',
          borderWidth:1,
          borderColor:'#2f4678',
          width:DEVICE_WIDTH-30,
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
        width:DEVICE_WIDTH-30,
        height:50,
        justifyContent:'flex-start',
        elevation:0,
    },

    goIcon:{
      width:25,
      height:25,
      marginHorizontal:30
    },

    mobouter:{
      borderColor:'#025d8c',
      borderWidth:2,
      backgroundColor:'#fff',
      borderRadius: 60,
      width:100,
      height:100,
      marginTop:10,
      marginBottom:30,
      alignItems:'center',
      marginHorizontal:110
    },
    
    mobile:{
      width:80,
      height:80,
      backgroundColor: '#025d8c',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf:'center',
      marginVertical:8
    },

    dontText:{
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20,
        marginTop:20,
    },

    input:{
        marginBottom:10
    },

    forget:{
        marginTop:30,
        justifyContent:'center',
        alignItems:'center',
        
    },

    forgetBtn:{
        color:'#025d8c',
        fontFamily: 'Roboto_medium',
    },

    forgotText:{
        alignItems: 'center', 
        alignSelf:'center', 
        textAlign: 'center', 
        color:'#333333', 
        fontSize:14,
        lineHeight: 18,
    },
    visibilityBtn: {
      position: 'absolute',
      right: 3,
      height: 40,
      width: 35,
      padding: 5,
      bottom:5,
    },

    BtnText: {
      fontFamily: 'Roboto_bold',
      fontSize: 14,
      color: '#fff',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    linearBtnStyles: {
      borderRadius: 22
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
      zIndex: 1,
    },
    activeIndicatorStyle: {
      color: '#FFFFFF'
    },


});

export default styles;
// import { StyleSheet, Dimensions, Platform } from 'react-native';
// const DEVICE_WIDTH = Dimensions.get(`window`).width;
// const Device_Height = Dimensions.get('window').height;

// const styles = StyleSheet.create({
//     container: {
//         flex:1,
//         paddingLeft:16,
//         paddingRight:16,
//         paddingTop:30,
//     },

//     nextBtnView:{
//         marginTop:20,
//     },

//     headerMainView: {
//         flexDirection: 'row',
//         width: DEVICE_WIDTH,
//         height: 50,
//         marginTop: 30,
//         marginHorizontal: 20,
//         paddingVertical: 10,
//         marginBottom: 0,
//       },

//       headerLeft: {
//         flex: 1
//       },

//       iconMenuStyle: {
//         color: '#fff',
//       },
    
//       headerBody: {
//         flex: 4
//       },

//       headerRight: {
//         flex: 2,
//         flexDirection: 'row',
//         justifyContent: 'center',
//       },

//       headerTitleStyle: {
//         color: '#fff',
//         fontSize: 16,
//         fontFamily:'Roboto_medium',
//       },

//       headermapIcon: {
//         width: 25,
//         height: 25,
//       },


//       mapImg: {
//         flex: 1,
//         width: null,
//         height: null,
//         resizeMode: 'contain'
//       },

//       FBbutton:{
//         marginBottom:15,
//       },

//       fbBtn:{
//           backgroundColor:'#3b5998',
//           borderWidth:1,
//           borderColor:'#2f4678',
//           width:DEVICE_WIDTH-30,
//           height:50,
//           justifyContent:'flex-start',
//           elevation:0,
//       },

//       FBIcon:{
//         width:25,
//         height:25,
//         marginHorizontal:30
//       },

//       gobutton:{
//         marginBottom:20,
//       },

//       goBtn:{
//         backgroundColor:'#ffffff',
//         borderWidth:1,
//         borderColor:'#e9e9e9',
//         width:DEVICE_WIDTH-30,
//         height:50,
//         justifyContent:'flex-start',
//         elevation:0,
//     },

//     goIcon:{
//       width:25,
//       height:25,
//       marginHorizontal:30
//     },

//     mobouter:{
//       borderColor:'#025d8c',
//       borderWidth:2,
//       backgroundColor:'#fff',
//       borderRadius: 60,
//       width:100,
//       height:100,
//       marginTop:10,
//       marginBottom:30,
//       alignItems:'center',
//       marginHorizontal:110
//     },
    
//     mobile:{
//       width:80,
//       height:80,
//       backgroundColor: '#025d8c',
//       borderRadius: 50,
//       alignItems: 'center',
//       justifyContent: 'center',
//       alignSelf:'center',
//       marginVertical:8
//     },

//     dontText:{
//         justifyContent:'center',
//         alignItems:'center',
//         marginBottom:20,
//         marginTop:20,
//     },

//     input:{
//         marginBottom:10
//     },

//     forget:{
//         marginTop:30,
//         justifyContent:'center',
//         alignItems:'center',
        
//     },

//     forgetBtn:{
//         color:'#025d8c',
//         fontWeight:'bold'
//     },

//     forgotText:{
//         alignItems: 'center', 
//         alignSelf:'center', 
//         textAlign: 'center', 
//         color:'#333333',  
//         fontSize:14,
//         lineHeight: 18,
//     },

//     button_main:{
//       marginHorizontal:8,
//       marginVertical:8,
//     },

//     gradientBtn:{
//       backgroundColor: 'transparent',
//       fontSize: 16,
//       color: '#fff',
//       fontFamily: 'Roboto_medium'
//     },
      


// });

// export default styles;