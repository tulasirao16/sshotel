
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 20,
    },

    signinHeader:{
        width:DEVICE_WIDTH,
        height:150,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#333'
    },

    signinMain:{
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20,
    },

    mainTxt:{
        color: '#333',
        fontSize: 20,
        fontFamily: 'Roboto_medium',
    },

    nextBtnView: {
        marginTop: 20,
    },

    button_main: {
        marginVertical:10,
    },

    gradientBtn: {
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Roboto_medium'
    },

    textInput:{
        height: 50, 
        paddingHorizontal:10, 
        fontSize:14, 
        fontFamily: 'Roboto_medium', 
        borderWidth:1, 
        borderRadius:5, 
        borderColor:'#eee'
    },

    logImg:{
        width:150,
        height:117,
        resizeMode:'contain'
    },

    headerMainView: {
        flexDirection: 'row',
        width: DEVICE_WIDTH,
        height: 170,
        marginTop: 30,
        paddingVertical: 10,
        marginBottom: 0,
        justifyContent:'center',
        alignItems:'center'
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

    fbText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto_medium',
    },

    goText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Roboto_medium',
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

    FBbutton: {
        width: DEVICE_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    fbBtn: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e9e9e9',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignSelf:'flex-end',
        marginRight:20,
    },

    FBIcon: {
        width: 25,
        height: 25,
        marginHorizontal: 30
    },

    gobutton: {
        marginBottom: 20,
    },

    goBtn: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e9e9e9',
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignSelf:'flex-start',
    },

    goIcon: {
        width: 25,
        height: 25,
        marginHorizontal: 30
    },

    dont: {
        width: DEVICE_WIDTH,
        marginHorizontal: 30,
        marginTop:50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    signupText: {
        color: '#025d8c',
        fontSize: 14,
        fontFamily: 'Roboto_medium',
    },

    orView:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop:30,
        marginBottom:40,
        borderBottomWidth:1,
        borderColor:'#eee',
    },

    orBtn:{
        width:35,
        height:35,
        position:'absolute',
        top:-15,
        left:'47%',
        right:0,
        backgroundColor:'#fff',
        borderColor:'#eee',
        borderWidth:1,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center', 
        alignSelf:'center',
    },

    ORText: {
        color: '#999999',
        fontSize: 12,
        fontFamily: 'Roboto_medium',
        paddingLeft:0,
        paddingRight:0,
        marginLeft:0,
        marginRight:0
    },

    dontText: {
        color: '#999999',
        fontSize: 14,
        fontFamily: 'Roboto_medium',
    },

    input: {
        marginBottom: 10
    },

    forget: {
        marginTop:5,
        alignItems: 'flex-end',
    },

    forgetBtn: {
        fontSize: 13,
        color: '#025d8c',
        fontFamily: 'Roboto_medium',
    },




});

export default styles;