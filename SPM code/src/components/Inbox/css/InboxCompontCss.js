import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    listItemBodyStyle: {
        borderBottomWidth:0,
      },

      content:{
        marginLeft:15,
        marginRight:15,
      },

      listItemRightStyle:{
        borderBottomWidth:0,
        marginRight:5,
        // position:'absolute',
        // right:10,
        // top:10,
        // zIndex:999,
      },
      
      listItemStyle: {
        paddingBottom:Platform.OS === 'ios' ? 10 : 0,
        marginLeft:0,
        borderBottomWidth:0.5,
        borderBottomColor: '#c9c9c9',
      },

      // imageStyle: {
      //   width: 52, 
      //   height:  52, 
      //   borderRadius: 50,
      //   borderWidth: 1, 
      //   borderColor: 'green',
      // },

      imageView1:{
        width: Device_Height/11, 
        height: Device_Height/11, 
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        overflow: 'hidden',
      },

      image: {
        width: 40, 
        height: 40, 
        borderRadius: 50
      },
      imageView: {
        width: Device_Height/13, 
        height: Device_Height/13, 
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        overflow: 'hidden',
        borderColor:'gray',
        borderWidth:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      imageStyle: {
        width: null,
        height: null,
        flex: 1,
        resizeMode: 'contain',
        borderRadius: 50,
      },
      verticalLine: {
        height:DEVICE_WIDTH/8,
        width:1,
        borderWidth:1,
        borderColor: '#eee',
        position: 'absolute',
        top:-20,
        left:24
      },
      smallRound: {
        width:10,
        height:10,
        borderRadius:5,
        backgroundColor: '#25c5df',
        position: 'absolute',
        top:14,
        left:-5
      },
      mainView: {
        marginHorizontal:10,
        // paddingVertical:5,
      },
      number: {
        marginTop: -10
      },
      spPropertyTitle: {
        fontFamily: 'Roboto_medium',
        fontSize:14,
        color: '#111111'
      },
      locationText: {
        fontSize:12,
        // color: '#25c5df',
        fontFamily: 'Roboto_medium',
      },
      spMessageListText: {
        fontSize:12,
        fontFamily: 'Roboto_medium',
        color: '#999999'
      },
      spMessageTime: {
        fontFamily: 'Roboto_light',
        fontWeight: '400',
        fontSize: 10,
        color: '#fff'
      },
      spMessageListTime: {
        fontFamily: 'Roboto_medium',
        fontSize: 10,
        color: '#737373'
      },
      spUnreadMessageCount: {
        fontFamily: 'Roboto_medium',
        fontWeight: '600',
        fontSize: 10,
        color: '#ffffff'
      },
      flexStart: {
        justifyContent: 'flex-start'
      },
      flexEnd: {
        justifyContent: 'flex-end'
      },
      flexCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
      },
      badge: {
        width: Device_Height/23,
        height: Device_Height/23,
        backgroundColor: '#32ab9f',
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        // position: 'absolute',
        // bottom:10,
        // right:10
      },
      // new
      cardSp: {
        backgroundColor: '#32ab9f',
        paddingHorizontal:10,
        paddingVertical: 10,
        width: DEVICE_WIDTH-80,
        left:25,
        elevation:0.4,
        marginVertical:5,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      },
      cardSpDelete: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal:10,
        paddingVertical: 10,
        width: DEVICE_WIDTH-80,
        left:25,
        elevation:0.4,
        marginVertical:5,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      },
      cardSpRead: {
        backgroundColor: 'red',
        
      },
      cardEu: {
        backgroundColor: '#e5eef3',
        padding:10,
        width: DEVICE_WIDTH-80,
        left:55,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 6,
        elevation:0.4,
        marginVertical:5,
      },
      cardEuDelete: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding:10,
        width: DEVICE_WIDTH-80,
        left:55,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 6,
        elevation:0.4,
        marginVertical:5,
      },
      // cardItemEu: {
      //   width:DEVICE_WIDTH-60,
      //   alignItems: 'flex-end' 
      // },
      cardItemEuone: {
        width:DEVICE_WIDTH-60,
        flexDirection:'row',
        paddingRight: 5
      },
      triangleEu: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 20,
        borderLeftWidth: 20,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#eee',
        position:'absolute',
        top: 0,
        right:-15
      },
      triangleSp: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 10,
        borderTopColor: '#32ab9f',
        borderRightColor: '#32ab9f',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        position:'absolute',
        top: 0,
        left:-15
      },
      spMessageText: {
        fontSize: 15,
        color: '#ffffff',
        fontFamily: 'Roboto_light',
      },
      euMessageText: {
        fontSize: 15,
        color: '#555',
        fontFamily: 'Roboto_light',
      },
      spMessageTextMessage: {
        fontSize: 13,
        color: '#ffffff',
        fontFamily: 'Roboto_light',
      },
      euMessageTextMessage: {
        fontSize: 13,
        color: '#555',
        fontFamily: 'Roboto_light',
      },
      triangleEuDelete: {
        width: DEVICE_WIDTH,
        backgroundColor: 'rgba(0,0,0,0.3)',
        position:'absolute',
        top: -5,
        left: -55,
        right: 0,
        bottom: -5
      },
      triangleSpDelete: {
        width: DEVICE_WIDTH,
        backgroundColor: 'rgba(0,0,0,0.3)',
        position:'absolute',
        top: -5,
        left: -25,
        right: 0,
        bottom: -5
      },
      unreadMessageView: {
        position: 'absolute',
        right: 7,
        top:10,
        width:20,
        height:20
      },
      unreadImg: {
        flex:1,
        width: null,
        height: null,
        resizeMode: 'contain'
      },
      spMessageTimeEu: {
        fontFamily: 'Roboto_light',
        fontWeight: '400',
        fontSize: 10,
        color: '#737373'
      },
  });
  
  export default styles;