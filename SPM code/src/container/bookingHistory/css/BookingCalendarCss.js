
import { StyleSheet, Dimensions, Platform } from 'react-native';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#FFFFFF',
        marginTop: 10,
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
        height: 50,
        marginTop: 30,
        marginBottom: 0,
        paddingVertical: 10,

    },
    headerLeft: {
        flex: 1
    },
    iconMenuStyle: {
        color: '#fff',
        fontSize:25,
        paddingHorizontal:16
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
    },

    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,

    },

    bodyContainer: {
        marginHorizontal:15,
        width:DEVICE_WIDTH-30,
        marginTop:20
    },
    displaySelectedDates: {
        flexDirection:'column',
        marginTop:-25,
    },
    DispalyFromDateView: {
        flex:3,
        marginHorizontal:6
    },
    timePickerView: {
        backgroundColor:'#01a4a2',
        height:50
    },
    startEndHeadings: {
        paddingHorizontal:1,
        marginVertical:5,
        // color: '#01a4a2'
        color:'#f2f1f8',
        fontSize: 16
    },
    timeHeadings: {
        paddingHorizontal:1,
        marginVertical:10
    },
    timeContainer: {
        width:DEVICE_WIDTH-30,
        marginHorizontal:15,
    },
    errorView: {
       justifyContent:'center',
       alignItems: 'center'
    },
    dateTxt: {
        // color:'#333',
        color: 'white',
        fontFamily:'Roboto_light',
        fontSize:24,
        // paddingHorizontal:10
    },
    dateTxtSelect: {
        // color:'#333',
        color: 'white',
        fontFamily:'Roboto_light',
        fontSize:16,
        // paddingHorizontal:10
    },
    dateTxtError: {
        color:'red',
        fontFamily:'Roboto_medium',
        fontSize:16,
        paddingHorizontal:10
    },
    start: {
        marginLeft:-20
    },

    smallFont: {
        fontSize: 12,
    },
    fontFamilyStyle: {
        fontFamily: 'Roboto_medium'
    },
    fontBoldStyle: {
        fontFamily: 'Roboto_bold'
    },
    fontMediumStyle: {
        fontFamily: 'Roboto_light'
    },
    doneBtn : {
        width: DEVICE_WIDTH/2,
        paddingVertical:20,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:'pink',
        borderRadius:10
    }


});

export default styles;