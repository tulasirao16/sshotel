
import { StyleSheet, Dimensions, Platform } from 'react-native';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex:1,
    },

    headerStyle: {
        // backgroundColor: 'rgba(69,85,117,0.7)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.8
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
        height: 45,
        marginTop: 33,
        marginHorizontal: 20,
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
    headerTitleStyle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Roboto_medium',
    },
    headerRight: {
        flex: 1,
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
        padding:20,
        width: DEVICE_WIDTH-40
    },
    view: {
        paddingBottom:5,
        marginBottom:10,
        width:DEVICE_WIDTH,
        borderBottomWidth:1,
        borderColor:'#e3e3e3'
    },
    textFont: {
        fontFamily:'Roboto_medium'
    },
    headingStyle: {
        paddingVertical:4,
        color:'#01a4a2',
        
    },
    textStyle: {
        color: '#000',
        paddingVertical:2,
    },

    getCenterView: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    BtnText: {
        fontFamily: 'Roboto_light',
        fontSize: 14,
        color: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconDeleteStyle: {
        color: '#fff',
        fontSize: 25,
        marginRight:15
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

});

export default styles;