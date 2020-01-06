import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },

  content: {
    margin:8,
  },

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    // paddingHorizontal: 5,
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
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center', 
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


  mainView:{
    flexDirection:'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom:7,
    paddingLeft:16,
    paddingRight:16,
  },  

  LeftView: {
    flex: 2,
  },

  CenterView: {
    flex: 3,
  },

  RightView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  leftListItem:{
    flex:2,
  },

  centerListItem:{
    flex:4
  },

  list: {
    width:DEVICE_WIDTH,
    flexDirection: 'row',
    // justifyContent:'center', 
    // alignItems:'center',
    // borderBottomWidth:1, 
    // borderColor:'#ccc', 
    // height: 50,
  },

  listitem:{
    paddingRight:0,
    paddingTop:7,
    paddingBottom:7,
    marginLeft:0,
    borderBottomWidth:1, 
    borderColor:'#e3e3e3', 
    width:DEVICE_WIDTH - 50,
  },

  images: {
    resizeMode: 'cover',
    width:null,
    height:100,
    marginRight:10,
  },

  textSmall: {
    fontSize: 12,
    fontFamily: 'Roboto_medium',
  },

  textColor:{
    color: '#019c9e'
  },

  textLight: {
    fontSize: 13,
    fontFamily: 'Roboto_medium',
    color: '#999',
  },

  textMedium: {
    fontSize: 13,
    fontFamily: 'Roboto_medium',
    color: '#333',
  },

  textBig: {
    fontSize: 14,
    fontFamily: 'Roboto_bold',
    color: '#333',
  },

  btnModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },

  BtnText: {
    fontFamily: 'Roboto_bold',
    fontSize: 14,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default styles;