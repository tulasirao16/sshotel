import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef5fb'
    },
    linearStyles: {
        borderRadius: 5
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 10,
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
    },
    headerStyle: {
        paddingTop: 20,
        paddingBottom: 10,
        height: 80
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#d9d9d9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    textSmall: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    textBig: {
        fontSize: 14,
        fontFamily: 'Roboto_light',
        color: '#333'
    },
    list: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        height: 50,
    },
    circle: {
        borderWidth: 1,
        width: 30,
        height: 30,
        borderColor: '#595959',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    removeIcon: {
        textAlign: 'center',
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addIcon: {
        textAlign: 'center',
        fontSize: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profilepic: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 40,
        height: 160,
        width: '100%',
        backgroundColor: '#34429b',
    },
    btnModalSubmit: {
        width: DEVICE_WIDTH - 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTxt: {
        color: '#fff'
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150
    },
    backgroundImage: {
        resizeMode: 'contain',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    imageView: {
        width: DEVICE_WIDTH,
        height: 200,
        flex: 1,
        flexDirection: 'row',
        marginTop: 7,
        marginBottom: 7,
    },

    textSmall: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 14,
        color: '#454545',
        fontFamily: 'Roboto',
    },
    buttonStyle: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnNext: {
        width: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    regularFont: {
        fontFamily: 'Roboto_medium',
        fontSize: 14
    },
    camIconView: {
        backgroundColor: '#929496',
        borderRadius: 50,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    camIcon: {
        color: '#fff',
        fontSize: 50
    },
    btnNext: {
        width: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textArea: {
        borderColor: '#a7a9ac',
        borderBottomWidth: 1,
        padding: 5,
        flexDirection: 'column',
        fontSize: 16,
        width: 320,
        height: 100,
        justifyContent: "flex-start"
    },
    textSmall: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    closeButton: {
        fontSize: 30,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 99,
    },
    modalView: {
        backgroundColor: '#fff',
        width: DEVICE_WIDTH - 50,
        height: Device_Height / 2
    },
    proprtyModule: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 10
    },
    labelView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingVertical: 15
    },
    minusView: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center'
    },
    countView: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    plusView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnModal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15
    },
    btnTxt: {
        color: '#fff'
    }
});

export default styles;
