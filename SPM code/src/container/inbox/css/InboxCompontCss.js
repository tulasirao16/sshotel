import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
  
  content:{
    padding:10,
  },
  
  card:{
    paddingLeft:0,
    paddingRight:0,
    paddingTop:0,
    marginLeft:0,
    paddingBottom:0,
    marginBottom:5,
    borderRadius:10,
    elevation:0,
  },

  carditem:{
    paddingLeft:0,
    paddingRight:0,
    paddingTop:0,
    paddingBottom:0,
    margin:0,
    marginLeft:0,
    elevation:0,
    borderRadius:10,
  },

  menu_button: {
    marginVertical: Platform.OS === 'ios' ? -6 : -6,
    paddingTop:6,
    paddingBottom:6,
    paddingLeft:8,
    paddingRight:8,
    borderRadius:30,
    justifyContent:'center',
    alignItems:'center'
  },


  // toggleSwitch:{
  //   position:'absolute',
  //   top:5,
  //   right:10,
  //   zIndex:99
  // },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 25
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
    marginTop: 10,
    // marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },
  headerLeft: {
    flex: 1
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize:30,
  },
  iconTrashStyle: {
    color: '#fff',
  },

  headerTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Roboto_medium',
  },
  headerRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
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
  mainView:{
    marginTop:10,
    marginBottom:10,
  },

  listItem:{
    paddingLeft:0,
  },

  listItemBodyStyle: {
    paddingTop:3,
    paddingBottom:0,
    marginBottom:0,
  },
  checkTimeView: {
    flexDirection: 'row'
  },
  // listItemBodyStyleOne: {
  //   borderBottomWidth: 0,
  //   height: 20,
  // },
  listItemStyle: {
    marginLeft: 0,
  },
  imageStyle: {
    width: 52,
    height: 52,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'green',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  imageView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: '#969696',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    textAlign:'center'
  },
  timeStyle: {
    color:'#c17ea1',
    fontFamily:'Roboto_medium'
  },
  fontStyle: {
    fontFamily:'Roboto_medium'
  },
  verticalLine: {
    height: 60,
    width: 1,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    position: 'absolute',
    top: -10,
    left: 24,
  },
  smallRound: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#25c5df',
    position: 'absolute',
    top: 14,
    left: -5
  },

  number: {
    // marginTop: -15,
    fontSize: 15,
    fontFamily: 'Roboto_medium',
    color:'#3db285',
    alignItems: 'center',
    justifyContent:'center',
    textAlign:'center'
  },

  myStarStyle: {
    color: '#f7931e',
    backgroundColor: 'transparent',
    width: 14,
    height: 14,
    fontSize: 14,
    borderColor: '#f7931e',
  },
  footerStyle:
  {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: '#009688'
  },

  TouchableOpacity_style:
  {
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 5,
  },

  TouchableOpacity_Inside_Text:
  {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  noteText: {
    fontSize: 11,
    fontFamily: 'Roboto_medium',
  },

  textCircle:{
    fontSize: 12,
    fontFamily: 'Roboto_medium',
  },

  mainText:{
    fontSize: 14,
    fontFamily: 'Roboto_light',
    paddingBottom:5,
  },

  note:{
    fontSize: 14,
    fontFamily: 'Roboto_medium',
    color:'#969696'
  },

  dateTime:{
    position:'absolute',
    top:3,
    right:7,
    fontSize: 12,
    fontFamily: 'Roboto_medium',
    color:'#969696'
  },
  container: {
    flex: 1,
    backgroundColor:'#ffffff',
  },

  iconDeleteStyle: {
    color: '#fff',
    fontSize: 20,
    marginRight: 15,
  },
  iconAddStyle: {
    color: '#fff',
    fontSize: 28
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize:30,
  },
  iconHomeStyle:{
    color: '#fff',
    fontSize:25,
  },
  iconSearchStyle: {
    color: '#fff',
    fontSize:25,
  },
  headerBody: {
    flex: 5
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },

  noAmenities: {
    paddingVertical: Device_Height/6,
    justifyContent: 'center',
    alignItems: 'center'
  },

  noAmenitiesText:{
    color:'#025d8c',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },

  status: {
    zIndex: 10,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
  },

  // status: {
  //   zIndex: 10,
  //   width: DEVICE_WIDTH,
  //   height: (Platform.ios ? 21 : 27 ),
  //   backgroundColor: 'transparent',
  //   elevation: 0,
  // },
  noDataViewStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:DEVICE_WIDTH - 20,
    height:Device_Height - 150
  },
  noMessages:{
    color:'#333',
    fontSize:14,
    fontFamily: 'Roboto_medium',
  },
  title: {
    fontSize: 14,
    color: 'green',
    fontFamily: 'Roboto_light',
  },
  direction: {
    flexDirection:'row'
  },
  footer: {
    width: DEVICE_WIDTH,
    paddingHorizontal:10,
    height: 87,
    backgroundColor: 'white',
    paddingVertical: 10,
    flexDirection: 'row'
  },
  inboxTextBox: {
    width: DEVICE_WIDTH-(Device_Height/9),
    height:Device_Height/14,
    borderRadius:4,
    padding:8,
    borderColor: 'gray',
    borderWidth: 0.8,
    color: 'black',
    fontFamily: 'Roboto_light',
    fontSize: 15
  },
  sendView: {
    width: Device_Height/14, 
    height: Device_Height/14, 
    borderRadius: 50,
    borderColor:'#32ab9f',
    backgroundColor: '#32ab9f',
    borderWidth:1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:5
  },
  messagesContainer: {
    height:Device_Height-160,
    // backgroundColor: 'pink',
  },
  activeIndicatorView: {
    width: DEVICE_WIDTH,
    height: Device_Height,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 1,
  },
  linearBtnStyles: {
    borderRadius: 22
  },
   BtnText: {
        fontFamily: 'Roboto_medium',
        fontSize: 15,
        color: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
        justifyContent:'center',
        alignItems:'center'
      },
      headerBodyReload: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // left:-20
      },
      headerTitleStyle1: {
        marginTop:-3,
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
      activeIndicatorStyle: {
      color: '#FFFFFF'
    },
});

export default styles;