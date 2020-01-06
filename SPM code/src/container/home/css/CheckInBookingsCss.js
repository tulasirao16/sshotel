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
    content: {
        height: Device_Height - 100
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

    iconSearchStyle: {
        color: '#fff',
        fontSize: 25
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
        justifyContent: 'center',
    },

    menu_button: {
        marginVertical: Platform.OS === 'ios' ? -6 : -6,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
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
        left: 20
    },
    mainView: {
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    mainComponentView: {
        width: DEVICE_WIDTH - 20,
        flexDirection: 'row',
        // justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#dcdcdc',
        paddingTop: 12,
    },
    hotelContentView: {
        flex: 5
    },
    hoteStatusView: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },

    contnet: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textBig: {
        fontSize: 15,
        fontFamily: 'Roboto_medium',
    },
    textMedium: {
        fontSize: 14,
        color: '#9c9b9d',
        fontFamily: 'Roboto_light',
        paddingBottom: 3,
    },
    textSmall: {
        fontSize: 13,
        fontFamily: 'Roboto_light',
        paddingBottom: 3,
    },
    textDate: {
        fontSize: 13,
        fontFamily: 'Roboto_light',
    },

    bookedText: {
        fontSize: 11,
        fontFamily: 'DueDate',
        color: '#809b34',
        transform: [{ rotate: '-8deg' }],
        borderWidth: 2,
        borderColor: '#809b34',
        borderRadius: 5,
        padding: 5,
    },

    canceledTxt: {
        fontSize: 11,
        fontFamily: 'DueDate',
        color: '#cf242a',
        transform: [{ rotate: '-8deg' }],
        borderWidth: 2,
        borderColor: '#cf242a',
        borderRadius: 5,
        padding: 5,
    },

    completedTxt: {
        fontSize: 11,
        fontFamily: 'DueDate',
        color: '#0175b2',
        transform: [{ rotate: '-8deg' }],
        borderWidth: 2,
        borderColor: '#0175b2',
        borderRadius: 5,
        padding: 5,
    },

    StatusCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    statusTxt: {
        fontSize: 24,
        fontFamily: 'Roboto_light',
        color: '#3fc13e'
    },
    hotelDetails: {
        paddingBottom: 5,
        marginBottom: 5,
    },

    personIcon: {
        width: 20,
        height: 20,
        fontSize: 18,
        fontFamily: 'Roboto_light',
        color: '#999',
        marginRight: 5,
    },

    calIcon: {
        width: 20,
        height: 20,
        fontSize: 18,
        fontFamily: 'Roboto_light',
        color: '#999',
        marginRight: 5,
    },
    activeIndicatorView: {
        width: DEVICE_WIDTH,
        height: Device_Height,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',

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


});
export default styles;