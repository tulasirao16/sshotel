import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    linearStyles: {
        width: DEVICE_WIDTH,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
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
    iconHomeStyle: {
        color: '#fff',
        fontSize: 25
    },

    iconSearchStyle:{
        color: '#fff',
        fontSize: 25
    },
    
    headerBody: {
        flex: 5
    },
    headerTitleStyle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto_medium',
    },
    headerRight: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
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

    noAmenities: {
        paddingVertical: Device_Height / 6,
        justifyContent: 'center',
        alignItems: 'center'
    },

    noAmenitiesText: {
        color: '#025d8c',
        fontSize: 14,
        fontFamily: 'Roboto_medium',
    },
    status: {
        zIndex: 10,
        elevation: 2,
        width: DEVICE_WIDTH,
        height: 21,
        backgroundColor: 'transparent',
        elevation: 0
    },
    iconGap: {
        paddingRight: 16
    },
    getCenterView: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    BtnText: {
        fontFamily: 'Roboto_bold',
        fontSize: 14,
        color: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // =======================================
    bodyList: {
        width: DEVICE_WIDTH - 40,
        left: 5
    
    },
    mainView: {
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    mainComponentView: {
        width: DEVICE_WIDTH - 40,
        flexDirection: 'row',
        // justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#dcdcdc',
        paddingTop: 12,
    },
    card:{
        backgroundColor: '#fff',
        borderRadius:10,
        padding:5,
        elevation:0,
        marginTop:0,
        marginBottom:4
      },
    
      cardItem:{
        marginLeft:0,
        paddingLeft:0,
        paddingTop:2,
        paddingBottom:2,
        paddingRight:0,
        marginBottom:0
        // borderColor: '#e2e2e2',
        // borderBottomWidth: 0.5,
      },
      listMain:{
        flexDirection:'row',
        width:DEVICE_WIDTH-20,
      },
      ServiceTitle:{
        fontSize: 14,
        fontFamily:'Roboto_medium'
      },
      bookingTextLabel:{
        fontSize: 13,
        fontFamily:'Roboto_light',
        color:'#707070'
      },
      bookingTextToLabel:{
        fontSize: 13,
        fontFamily:'Roboto_light',
        color:'#707070',
        paddingLeft:20
      },
      bookingTextEnd:{
        fontSize: 13,
        fontFamily:'Roboto_light',
        // color: '#333333',
        color:'#f66a4b'
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
        justifyContent: 'center',
        alignItems: 'center'
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