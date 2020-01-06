import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    // header styles start
  linearStyles: {
    width: DEVICE_WIDTH,
  },

  iconMenuStyle: {
    color: '#fff',
  },
  modalView: {
      flex: 1, 
      padding: 15, 
      marginTop: Device_Height/4
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
      paddingVertical:20 
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
      width:140,  
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingVertical: 10
  },
  btnStyle: { 
      width: 110, 
      marginLeft:20, 
      backgroundColor: '#01a4a2', 
      borderRadius:8, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  cancelBtn: {
      width: 110, 
      backgroundColor: '#025d8c', 
      marginLeft:10, 
      borderRadius:8, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  btnTxt: {
      color: '#fff', 
      fontFamily: 'Roboto_medium', 
      fontSize: 16 
  },

  view: {
    padding: 10,
    margin: 2,
    backgroundColor: '#025d8c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    color: '#fff'
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

  headerLeft: {
    flex: 1,
  },

  headerBody: {
    flex: 5
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
  

  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },

  headermapIcon: {
    width: 25,
    height: 25,
  },

  headerRight: {
    flex: 2,
    flexDirection:'row',
    justifyContent:'center'
  },

  iconEditStyle:{
    color:'#fff',
    fontSize:25,
  },
  iconDeleteStyle:{
    color:'#fff',
    fontSize:25,
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },

  // header styles end

    headermapIcon: {
        width:30,
        height:25,
        marginLeft: 20
    },
    mapImg: {
        flex:1, 
        width:null,
        height:null,
        resizeMode: 'contain'
    },
    bodyContainer: {
        height: Device_Height-90
        // width: DEVICE_WIDTH-20,
        // left:10,
        // padding: 10
    },
    listLeftStyle: {
        width: DEVICE_WIDTH/11,
        backgroundColor: '#ddd'
    },
    label: {
        fontSize:12,
        color:'#989898'
    },
    regularFont: {
        fontFamily: 'Roboto_light'
    },
    mediumFont: {
        fontFamily:'Roboto_medium'
    },
    txtStyle: {
        fontSize:13,
        color:'#333'
    },
    listItemView: {
        marginLeft:0
    },
    listItemBody: {
        marginLeft: 4,
        paddingBottom:7,
        paddingTop:7,
        marginRight:14
    },
    iconStyle: {
        color: '#adabb1'
    },
    status: {
      zIndex: 10,
      elevation: 2,
      width: DEVICE_WIDTH,
      height: 21,
      backgroundColor: 'transparent',
      elevation:0
    },
    // ===============================================================
    bodyContent: {
        margin:10,
        borderRadius:4,
        backgroundColor: '#ffffff',
      },
      floatingInputView: {
        marginHorizontal:10,
        paddingVertical:10,
        borderBottomWidth: 0.5, 
        borderBottomColor: '#01a4a2',
        flexDirection: 'row'
      },
      regularFontSize: {
        fontSize: 14,
        color: '#8a8786'
       },
       regularTextFontSize: {
         fontSize: 14,
         color: '#333333'
        },
       labelGap: {
         paddingBottom: 8
       },
       textGap: {
         paddingVertical: 8,
         color:'#000000'
       },
       regularFontStyle: {
        fontFamily:'Roboto_medium',
      },
      semiBoldFontStyle: {
        fontFamily:'Roboto_medium',
      },
      boldFontStyle: {
        fontFamily:'Roboto_medium',
      },
      btnModal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
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