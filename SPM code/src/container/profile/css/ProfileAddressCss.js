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
    fontSize:30,
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
  
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    // marginHorizontal: 10,
    paddingVertical:10,
    marginBottom: 0,
    justifyContent: 'center'
  },

  headerLeft: {
    flex: 1,
  },

  headerBody: {
    flex: 5
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    opacity:1
  },
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },
  dropdownLabels: {
    color: '#454545',
    fontFamily: 'Roboto_light',
    fontSize: 14
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
    floatingInputView: {
      padding:10
    },
    DateGenderView: {
      flexDirection:'row',
      width: DEVICE_WIDTH-20,
      left:10,
    },
    DatePicker: {
      flex:2
    },
    genderView: {
      flex:2
    },
    getCenterView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical:20
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
});
export default styles;