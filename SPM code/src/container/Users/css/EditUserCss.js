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
    flex: 6
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
        height: Device_Height-90,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:15,
        paddingRight:15,
        // width: DEVICE_WIDTH-20,
        // left:10,
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
    floatingInputView: {
      marginBottom:10
    },
    DateGenderView: {
      flexDirection:'row',
      width: DEVICE_WIDTH-20,
    },
    DatePicker: {
      flex:2
    },
    horizontalMarginDatePicker: {
      marginRight:5
    },
    genderView: {
      flex:2
    },
    horizontalMarginGender: {
      marginLeft:5
    },
    datePickerView:{
      width: DEVICE_WIDTH/2.5,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderColor: '#009688',
      marginBottom:3
    },
    textInputStyle: {
      width:DEVICE_WIDTH-50,
      borderWidth:0.5,
      paddingHorizontal:10,
      paddingVertical:6,
      marginVertical:10,
      borderRadius:5,
      borderColor:'#019fa0',
      fontFamily:'Roboto_light'
  },
  titleTextInput:{
    fontSize: 14,
    color:'#6d6d6d',
    fontFamily:'Roboto_light'
  },
  rowDirection: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textAreaContainer: {
    marginBottom:7,
  },
  labels: {
    fontSize: 14,
    color: '#454545',
    fontFamily:'Roboto_light'
  },
  textArea: {
    height: 40,
    justifyContent: "flex-start",
    color: '#333',
    fontFamily: 'Roboto_light',
    fontSize: 17,
    borderColor: '#009688',
    borderBottomWidth: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    width: DEVICE_WIDTH - 30
  },

  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
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
  errorTxt: {
    color: 'red',
    fontFamily: 'Roboto_medium',
    fontSize: 13,
  },
  errorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

});
export default styles;