
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
        marginHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 0,
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
        fontWeight:'bold'
    },

    forgotText:{
        alignItems: 'center', 
        alignSelf:'center', 
        textAlign: 'center', 
        color:'#333333', 
        fontSize:14,
        lineHeight: 18,
    }
      


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