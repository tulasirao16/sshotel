import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
    },

    // profileImageView: {
    //     flex:2,
    // },

    // verifyBtnViewContainer: {
    //     flex:1,

    // },

    headerMainView: {
        flexDirection: 'row',
        width: DEVICE_WIDTH,
        height: 50,
        marginTop: 30,
        marginHorizontal: 20,
        paddingVertical: 10,
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

    headerRight: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    headerTitleStyle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Roboto_medium',
    },

    headermapIcon: {
        width: 25,
        height: 25,
    },


    emailViewContainer: {
        marginBottom: 15
    },

    addressViewContainer: {
        marginBottom: 15
    },

    contactViewContainer: {
        marginBottom: 15
    },

    nextBtn: {
        width: DEVICE_WIDTH - 30,
        height: 50,
        backgroundColor: '#014140',
        paddingHorizontal: 50,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center'
    },

    ImageView: {
        width: DEVICE_WIDTH,
        height: 150
    },
    imageStyle: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: 'cover'
    },
    // addressContentView: {
    //     flex:5,
    //     flexDirection:'row',
    //     padding:10
    // },
    addressEditView: {
        position: 'absolute',
        top: 10,
        right: 0
    },
    editIcon: {
        color: 'gray'
    },
    inputView: {
        flex: 5,
        flexDirection: 'row',
        paddingLeft: 10,
    },
    editView: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingRight: 0,
        paddingLeft: 30
    },
    textInputStyles: {
        // width:DEVICE_WIDTH-20,
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#009688',
    },

    otpInputStyles: {
        width: DEVICE_WIDTH - 40,
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#009688',
        marginTop: 10,
        marginBottom: 10,
    },

    input: {
        paddingTop: 10,
        paddingTop: 10,
        width: 200,
    },

    verifyTxt: {
        position: 'absolute',
        right: 20,
        top: 10
    },
    address: {
        fontFamily: 'Roboto_medium'
    },
    modalView: {
        backgroundColor: '#fff',
        height: 200,
    },

    modalContainer: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        textAlign: 'center'
    },

    modalHeader: {
        alignItems: 'center',
        textAlign: 'center'
    },

    firstName: {
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        paddingBottom: 5,
    },

    otpText: {
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        paddingBottom: 5,
    },

    doneBnt: {
        width: null,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 70,
        height: 50,
        backgroundColor: '#014140',
        borderRadius: 10,
        marginBottom: 10,
    },


    // button_main: {
    //     marginHorizontal: 8,
    //     marginVertical: 8,
    // },

    gradientBtn: {
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Roboto_medium'
    },


    styleOne: {
        marginTop: 10,
        marginBottom: 20,
    },
    noteFont: {
        fontSize: 12,
    },
    textCenter: {
        marginVertical:10,
        flexDirection: 'row', 
        justifyContent: 'center', 
        textAlign: 'center', 
        alignSelf: 'center', 
        fontFamily:'Roboto_medium',
    },
    textCenterNote: {
        marginVertical:10,
        flexDirection: 'row', 
        justifyContent: 'center', 
        textAlign: 'center', 
        alignSelf: 'center',
        fontSize: 12, 
        lineHeight:16,
        fontFamily:'Roboto_Italic',
    },
    buttonNext: {
        width: 140,
        backgroundColor: '#009688',
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },
    mobouter: {
        borderColor: '#025d8c',
        borderWidth: 2,
        backgroundColor: '#fff',
        borderRadius: 60,
        width: 100,
        height: 100,
        marginTop: 30,
    },

    mobile: {
        width: 80,
        height: 80,
        backgroundColor: '#025d8c',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 8
    },



});

export default styles;