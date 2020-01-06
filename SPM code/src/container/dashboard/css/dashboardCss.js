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
        fontFamily: 'Roboto_medium',
    },
    pageHeadingView: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pageHeading: {
        fontFamily: 'Roboto_medium',
    },
    title: {
        fontSize: 17,
        fontWeight: '400',
        color: '#454545',
        fontFamily: 'Roboto_medium',
        alignItems: 'center',
        justifyContent: 'center'
    },
    regularTxt: {
        paddingTop:10,
        fontSize:16,
        color: '#8a8786'
    },
    button_main: {
        marginTop: 10,
        marginBottom: 10,
    },
    main_div: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding:10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    left_div: {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:10,
    },
    mid_div: {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:10,
    },
    Right_div: {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    main_div1: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding:10,
        marginBottom: 10,
        flexDirection: 'row',
    },
    left_div1: {
        flex:1,
        marginRight:20,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    mid_div1: {
        flex:4,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    Right_div1: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    leftImg:{
        width:60,
        height:60,
        borderRadius:10,
        padding:10,
        backgroundColor:'#2cc2ea',
    },
    leftImg1:{
        width:60,
        height:60,
        borderRadius:10,
        padding:10,
        backgroundColor:'#4de9c9',
    },
    leftImg2:{
        width:60,
        height:60,
        borderRadius:10,
        padding:10,
        backgroundColor:'#72a4ff',
    },
    leftImg3:{
        width:60,
        height:60,
        borderRadius:10,
        padding:10,
        backgroundColor:'#8b72ff',
    },
    leftImg4:{
        width:60,
        height:60,
        borderRadius:10,
        padding:10,
        backgroundColor:'#697cff',
    },
    leftImg5:{
        width:60,
        height:60,
        borderRadius:10,
        padding:10,
        backgroundColor:'#027894',
    },
    textBig: {
        color:'#565b62',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Roboto_medium'
    },
    textSmall: {
        color:'#5170ff',
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Roboto_medium'
    },
    badge:{
        position:'absolute',
        top:-7,
        right:10,
        width:25,
        height:25,
        borderRadius:25,
        backgroundColor:'red',
        color:'#fff',
        alignItems:'center',
        justifyContent:'center',
        zIndex:99,
    },
    iconImage: {
        width: 40,
        height: 40,
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

    button_main: {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    gradientBtn: {
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Roboto_medium'
    },

    IconCalendar:{
        fontSize:50,
        color:'#333'
    },

    Icon1:{
        width:60,
        height:60,
        backgroundColor:'#2cc2ea',
        borderRadius:10,
    }
});

export default styles;