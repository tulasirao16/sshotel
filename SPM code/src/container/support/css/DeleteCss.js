import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb',
  },

  content: {
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight:10,
    marginBottom:10,
    borderRadius:10,
    paddingTop:7,
    paddingBottom:7,
    paddingLeft:15,
    paddingRight:15,
  },

  linearStyles: {
    width: DEVICE_WIDTH,
  },

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
    flex: 1,
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
    opacity:0
  },

  headerTitleStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Roboto_medium',
  },
  fontFamilyStyle: {
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
  bodyContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: DEVICE_WIDTH-20
  },

  button_main:{
    marginTop:20,
    width:DEVICE_WIDTH-30
  },

  gradientBtn:{
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto_medium'
  },

  btnMain:{
    flexDirection:'row',
    width:DEVICE_WIDTH,
    marginHorizontal:15,
    marginBottom:10,
  },

  SubHeading:{
    width:DEVICE_WIDTH,
    backgroundColor:'#5db85c',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    marginBottom:10,
  },

  SubHeadingText:{
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Roboto_light'
  },

  listItem:{
    marginLeft:0,
    paddingTop:8,
    paddingBottom:8,
    paddingRight:0,
  },

  listMain:{
    flexDirection:'row',
    width:DEVICE_WIDTH,
  },

  leftView:{
    flex:1
  },

  rightView:{
    flex:2,
  },

  bookingTitle:{
    fontSize: 16,
    fontFamily: 'Roboto_light',
  },

  textLabel:{
    fontSize: 13,
    fontFamily: 'Roboto_light',
  },

  bookingText:{
    fontSize: 14,
    fontFamily:'Roboto_medium'
  },

  getCenterView: {
    // { marginHorizontal: 10, marginTop: 30 }
    flex: 2,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  BtnText: {
    fontFamily:'Roboto_light',
    fontSize:14,
    color:'#fff',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  
});
    export default styles;