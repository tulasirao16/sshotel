
import { StyleSheet, Dimensions, Platform } from 'react-native';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef5fb'
    },
    headerMainView: {
        flexDirection: 'row',
        width: DEVICE_WIDTH,
        height: 50,
        marginTop: 10,
        // paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 0,
        justifyContent: 'center'
      },
      headerLeft: {
        flex: 1
      },
      iconMenuStyle: {
        color: '#fff',
        fontSize: 30
      },
      headerBody: {
        flex: 6
      },
      headerTitleStyle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto_medium',
      },
      headerRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
      },
      status: {
        zIndex: 10,
        width: DEVICE_WIDTH,
        height: 21,
        backgroundColor: 'transparent',
        elevation: 0
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
  
      
    content: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        paddingBottom:15,
        marginTop: 5,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    button_main: {
        marginVertical: 10,
    },
    gradientBtn: {
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Roboto_medium'
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

    bodyContainer: {
        marginHorizontal: 15,
        width: DEVICE_WIDTH - 30,
        marginTop: 20
    },

    displaySelectedDates: {
        flexDirection: 'column',
        marginTop: 0,
    },
    timePickerView: {
        backgroundColor: '#01a4a2',
        height: 50
    },
    startDateView: {
        width: DEVICE_WIDTH - 30,
        flexDirection: 'row',
        paddingVertical:3
    },
    startEndHeadings: {
        color: '#025d8c',
        fontFamily: 'Roboto_medium',
        fontSize: 12,
        top: 2
    },
    dateTxt: {
        color: '#f66a4b',
        fontFamily: 'Roboto_medium',
        fontSize: 12,
        top:2
        // paddingHorizontal: 10
    },
    toDateTxt: {
        color: '#f66a4b',
        fontFamily: 'Roboto_medium',
        fontSize: 12,
        top: 2
        // paddingHorizontal: 10
    },
    businessNameView: {
        width: DEVICE_WIDTH-20,
        left:10,
        backgroundColor: '#dcf4ff',
        marginVertical:10
      },
      leftImageView: {
        width:Device_Height/8.5, 
        height: Device_Height/8.5,
      },
      imageBox: {
        width:Device_Height/9, 
        height: Device_Height/9,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: 'transparent'
      },
      imgStyle: {
        width:Device_Height/9,
        height: Device_Height/9,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        overflow: 'hidden',
        resizeMode: 'cover',
        borderWidth: 2,
        borderColor: '#eee',
        backgroundColor:'#eee'
      },
      card: {
       marginBottom:0,
       marginLeft:0,
       marginTop:0,
       marginRight:0
      },
      cardItemStyle: {
        paddingLeft:10,
        paddingTop:5,
        paddingBottom:5,
        paddingRight:10
      },
      floatingInputView: {
        padding: 10,
        paddingLeft: 0
      },
      propertyTitle: {
        fontSize: 15,
        color: '#01a4a2',
        fontFamily: 'Roboto_medium',
      },
      titleType: {
        fontSize: 13,
        color: '#025d8c',
        fontFamily: 'Roboto_light',
        paddingTop: 5
      },
      serviceTitle: {
        fontSize: 15,
        color: '#333333',
        fontFamily: 'Roboto_medium',
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
      blockingType: {
          flexDirection: 'row',
          margin: 5,
          padding: 5
      },
      blockingTypeText: {
            color: '#f66a4b',
            fontFamily: 'Roboto_medium',
            fontSize: 15,
            top: 2
            // paddingHorizontal: 10
        },
        blockingTypeTextValue: {
            color: '#025d8c',
            fontFamily: 'Roboto_medium',
            fontSize: 15,
            top: 2
            // paddingHorizontal: 10
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