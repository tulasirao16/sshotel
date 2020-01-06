import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
    linearGradientRouter: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
      },
      routerLogoImageView: {
        width: 170,
        height: 130,
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
      },
      imageFit: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        flex: 1,
        width: null,
        width: null,
        resizeMode: 'contain'
    
      },
      regularFontStyle: {
        fontFamily: 'Roboto_medium',
        fontSize:14,
      },
      mediumBoldFontStyle: {
        fontFamily: 'Roboto_light'
      },
      titleGap: {
        paddingBottom: 2
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
      leftIcon:{
        fontSize: 21, 
        color: '#01a4a1', 
        width: 20, 
        marginRight: 10
      },
      aminityText: {
        fontSize:3,
        color:'red',
        fontFamily:'Roboto_medium'
      },
      bodyView: {
        padding: 10,
        backgroundColor: '#f6f5f6'
      },
      eachRow: {
        height: Device_Height/7,
        backgroundColor: 'transparent',
        flexDirection:'row',
        justifyContent: 'center',
        // marginVertical: 10
      },
      eachView: {
        flex:2,
        height: Device_Height/7,
        backgroundColor: 'transparent',
        padding:5,
        justifyContent: 'center',
        alignItems: 'center' ,
      },
      iconCircle: {
        width: Device_Height/10.5,
        height: Device_Height/10.5,
        borderRadius: 50,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation:5
      },
      iconStyle: {
        color: '#01a4a2',
      },

      iconAddStyle:{
        fontSize:40
      },
      
      iconActiveCircle: {
        width: Device_Height/10.5,
        height: Device_Height/10.5,
        borderRadius: 50,
        backgroundColor: '#01a4a2',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation:5
      },
      iconActiveStyle: {
        color: '#ffffff',
      },
      routerTitle: {
        fontFamily: 'Roboto_medium',
        fontSize:13,
        color: '#025d8c',
        marginVertical:5,
        textAlign:'center'
      },
      headerMainViewReload: {
        flexDirection: 'row',
        width: DEVICE_WIDTH,
        height: 50,
        marginTop: 30,
        marginBottom: 0,
        paddingVertical: 10,
      },
      headerTitleStyleReload: {
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
      headerBodyNoInternet: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      headerTitleStyle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto_medium',
      },

    


});

export default styles;