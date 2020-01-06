import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef5fb'
    },
    linearBtnStyles: {
        borderRadius:5
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal:8,
        margin: 10,
    },
    headerStyle: {
        paddingTop: 20,
        paddingBottom: 10,
        height: 80
    },
    headerLeft: {
        flex: 1,
    },
    headerTitleView: {
        flex: 4,
    },
    headerTitle: {
        fontSize: 18,
        justifyContent: 'flex-start',
        fontFamily: 'Roboto_light',
        paddingTop: 10,
        color: '#fff',
    },
    headerRight: {
        flex: 1,
    },
    txtFont: {
        fontFamily: 'Roboto_light',
    },
    pageHeadingView: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pageHeading: {
        fontFamily: 'Roboto_light',
    },
    title: {
        fontSize: 17,
        fontWeight: '400',
        color: '#454545',
        fontFamily: 'Roboto_light',
        alignItems: 'center',
        justifyContent: 'center'
    },
    regularTxt: {
        color: '#8a8786'
    },
    button_main: {
        marginTop: 10,
        marginBottom: 10,
    },
    main_div: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    left_div: {
        flex: 2,
        backgroundColor: '#eef5fb',
        height: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:10
    },
    Right_div: {
        flex: 2,
        backgroundColor: '#eef5fb',
        height: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:10
    },
    textSmall: {
        textAlign: 'center',
        fontSize: 14,
        width: 100,
        fontFamily: 'Roboto_light'
    },
    iconImage: {
        width: 50,
        height: 50,
    },
    button: {
        width: DEVICE_WIDTH - 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    btnNext: {
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Roboto_light'
    },
    share_button: {
        width: 30,
        height: 40,
        padding: 5,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99,
        backgroundColor: '#01a3a2'
    },
    private_button: {
        width: 30,
        height: 40,
        padding: 5,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99,
        backgroundColor: '#025d8c'
    },
    textBig: {
        paddingLeft: 0,
        paddingRight: 0,
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Roboto_light'
    },
    button_main: {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    gradientBtn: {
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Roboto_light'
    }
});

export default styles;