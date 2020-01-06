
import { StyleSheet, Dimensions, Platform } from 'react-native';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
   headerStyle: {
      // backgroundColor: 'rgba(69,85,117,0.7)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.8
   },

   status: {
      zIndex: 10,
      width: DEVICE_WIDTH,
      height: 21,
      backgroundColor: 'transparent',
      elevation: 0
    },

    callIconPosition: {
      position:'absolute',
      left: DEVICE_WIDTH/2.4,
      bottom: -3,
      zIndex: 999
  },

   content: {
      margin: 10,
   },
   pickerStyle: {
      width: undefined,
      height: 40,
      backgroundColor: '#01a4a2'
   },
   linearStyles: {
      width: DEVICE_WIDTH,

   },
   priceTagColorStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
   },
   parentView: {

      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

   },
   headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
   //  paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
   },
   headerLeft: {
      flex: 1,
   },
   iconMenuStyle: {
      color: '#fff',
      fontSize:30,
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
      flex: 2,
      flexDirection: 'row',
      justifyContent: 'center'
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
   bodyViewContainer: {
      marginHorizontal: 15,
      marginVertical: 30,
      width: DEVICE_WIDTH
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
   notificationBox: {
      width: 40,
      height: 30,
      borderWidth: 1,
      borderColor: '#025d8c',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
   },
   rightView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   imageCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
   },
   imageFit: {
      flex: 1,
      width: 50,
      height: 50,
      resizeMode: 'contain'
   },
   footerStyle:
   {
      padding: 7,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 2,
      borderTopColor: '#009688'
   },
   TouchableOpacity_style:
   {
      padding: 7,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F44336',
      borderRadius: 5,
   },

   TouchableOpacity_Inside_Text:
   {
      textAlign: 'center',
      color: '#fff',
      fontSize: 18,
   },
   regularFontStyle: {
      fontFamily: 'Roboto_medium',
      fontSize:14,
   },
   mediumBoldFontStyle: {
      fontFamily: 'Roboto_light',
      color: '#6d6d6d'
   },
   titleGap: {
      paddingBottom: 2
   },
   noNotificatonView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   deleteIconStyle: {
      color: '#fff'
   },
   smallFont: {
      fontSize: 13
   },
   titleColor: {
      color: '#01a4a2'
   },
   checkmarkCircle: {
      width: 40,
      height: 40,
      borderRadius: 50,
      borderWidth: 0.5,
      borderColor: 'transparent',
      backgroundColor:'#fff',
      marginRight:0,
      justifyContent:'center',
      alignItems:'center',
      marginLeft:0,
      position:'absolute',
      left:5,
      top:5,
      zIndex:99,
   },
   imageView: {
      width: 50,
      height: 50,
      borderRadius: 50,
      borderWidth: 0.5,
      borderColor: 'transparent',
      marginRight: 8
   },

   smallText:{
      marginTop:5,
      fontSize:12,
      color:'#adadad',
      fontFamily: 'Roboto_medium',
   },

   imgStyle: {
      width: 50,
      height: 50,
      borderRadius: 50,
      resizeMode: 'cover',
      borderWidth: 2,
      borderColor: '#eee',
      backgroundColor:'#eee'
   },
   regularFont: {
      fontSize: 13,
      fontFamily: 'Roboto_light',
      color: '#025d8c'
   },
   messageFont: {
      fontSize: 13,
      fontFamily: 'Roboto_light',
      color: '#333333'
   },
   smallFont: {
      fontSize: 12,
      fontFamily: 'Roboto_light',
      color: '#222222'
   },

   list: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginLeft: 0,
      marginTop:0,
      marginBottom:0,
      marginRight:0,
   },

   listItem: {
      marginLeft: 0,
      paddingTop:5,
      paddingBottom:5,
      paddingRight:7,
      paddingLeft:7,
      marginBottom:5,
   },

   listItemSelected:{
      backgroundColor:'#d3d3d3',
      marginLeft: 0,
      paddingTop:5,
      paddingBottom:5,
      paddingRight:7,
      paddingLeft:7,
      marginBottom:5,
    },

   listCardStyle: {
      elevation: 0.5
   },
   iconSearchStyle: {
      color: '#fff',
      fontSize: 25,
   },
   modalView: {
      flex: 1,
      padding: 15,
      marginTop: Device_Height / 4
   },
   modalContainerStyles: {
      width: 300,
      height: 180,
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10
   },
   txtInfoViewStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20
   },
   txtInfo: {
      color: '#333333',
      fontSize: 14,
      fontFamily: 'Roboto_medium'
   },
   btnsParentView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
   },
   eachBtnView: {
      width: 140,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10
   },
   btnStyle: {
      width: 110,
      marginLeft: 20,
      backgroundColor: '#01a4a2',
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
   },
   cancelBtn: {
      width: 110,
      backgroundColor: '#025d8c',
      marginLeft: 10,
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
   },
   btnTxt: {
      color: '#fff',
      fontFamily: 'Roboto_medium',
      fontSize: 16
   },
   noNotifications: {
      color: '#333',
      fontSize: 14,
      fontFamily: 'Roboto_medium',
   },
  iconDeleteStyle: {
      color: '#fff',
      fontSize: 25
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
   SelectedArea:{
       position:'absolute',
       width:DEVICE_WIDTH,
       backgroundColor:'grey',
       textAlign:'center',
       justifyContent:'center',
       textAlign:'center'
   },
   
   fontBold: {
      fontFamily:'Roboto_bold',
      fontSize:14
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
    call_button: {
      paddingTop:6,
      paddingBottom:6,
      paddingLeft:8,
      paddingRight:8,
      borderRadius:30,
      backgroundColor:'#fff',
      justifyContent:'center',
      alignItems:'center',
      marginLeft: 10,
   },
  lineHeightStyle: {
      lineHeight:30
  },
  underlineStyle: {
      textDecorationLine: 'underline',
      textDecorationStyle: 'solid',
      textDecorationColor: '#01a4a2'
  },
  mediumFontStyle: {
    fontFamily:'Roboto_medium',
    color:'#6d6d6d',
    fontSize:14,
},
BoldFontStyle:{
    fontFamily:'Roboto_bold'
},
titleGap: {
    paddingBottom:2
},
noNotificatonView: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
},
titleColorBlue: {
  color: '#025d8c'
},

deleteNotification: {
   backgroundColor: 'rgba(0,0,0, .3)',
   paddingTop:5, 
   paddingBottom:5, 
   marginLeft:15, 
   marginRight:15, 
   borderBottomWidth:0, 
   borderWidth:0, 
   borderColor: 'rgba(0,0,0, .3)', 
   borderRadius: 5, 
   // backgroundColor: '#E0F2F1', 
   elevation:0.5,
   marginVertical: 5,
   shadowColor: 'gray',
   shadowOpacity: 0.4,
   paddingLeft:12,
   paddingRight:12,
   fontSize:10,
   // padding:0,
   position:'relative',
   zIndex:99
},

deleteNoteView: {
   width: DEVICE_WIDTH-60
},

deltitleColor:{
   color: '#333333'
},

smallFontDelete: {
   fontSize:13,
   lineHeight:16,
},

delmediumFontStyle:{
   fontFamily:'Roboto_medium',
   color:'#333333',
   fontSize:14
},

deltitleColorBlue:{
   color: '#333333'
},

del_call_button:{
   paddingTop:6,
   paddingBottom:6,
   paddingLeft:8,
   paddingRight:8,
   borderRadius:30,
   backgroundColor: 'rgba(0,0,0, .3)',
   justifyContent:'center',
   alignItems:'center',
   marginLeft: 10,
},

eachNotification: {
   paddingTop:5, 
   paddingBottom:5, 
   marginLeft:15, 
   marginRight:15, 
   borderBottomWidth:0, 
   borderWidth:0, 
   borderColor: '#E0F2F1', 
   borderRadius: 5, 
   backgroundColor: '#E0F2F1', 
   elevation:0,
   marginVertical: 5,
   shadowColor: 'gray',
   shadowOpacity: 0.4,
   paddingLeft:12,
   paddingRight:12
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
