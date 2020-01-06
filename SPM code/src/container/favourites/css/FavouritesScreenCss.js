import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  linearStyles: {
    width: DEVICE_WIDTH,

  },
  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },
  headerLeft: {
    flex: 1,
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 25
  },
  headerBody: {
    flex: 5
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },
  headerRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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

  list: {
    flexDirection: 'row',
    //width: DEVICE_WIDTH,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9',
    paddingBottom: 10
  },

  textBig: {
    fontSize: 14,
    fontFamily: 'Roboto_bold',
    color: '#025d8c'
  },


  textSmall: {
    fontSize: 12,
    color: '#01a4a1',
    fontFamily: 'Roboto_medium',
    paddingBottom: 2,
  },

  textNote: {
    fontSize: 11,
    color: '#808284',
    fontFamily: 'Roboto_medium',
  },

  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
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

  headermapIcon: {
    width: 25,
    height: 25,
    marginRight: 20
  },
  mapImg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  favCount: {
    marginHorizontal: 15,
    marginVertical: 10
  },

  thumbImg: {
    width: Device_Height / 11,
    height: Device_Height / 11,
    borderRadius: 50,
    resizeMode: 'cover'
  },

  favIcon: {
    width: Device_Height / 12,
    height: Device_Height / 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#f66a4b',
    alignItems: 'center',
    justifyContent: 'center'
  },

  ratings: {
    paddingTop: 5,
    paddingBottom: 5,
  },

  left: {
    flex: 1,
    marginRight: 5,
  },

  body: {
    flex: 3,
    marginRight: 10,
  },

  right: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: -10
  },
  favHeartStyle: {
    color: '#f66a4b',
    fontSize: 30,
    marginLeft: 0,
    marginRight: 0,
  },
  iconGap: {
    paddingRight: 16
  },
  favViewList: {
    flexDirection: 'row',
    //width: DEVICE_WIDTH,
    marginVertical: 10,
    borderBottomWidth: 0,
    borderColor: '#d9d9d9',
    paddingBottom: 10
  },
  favViewContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
   marginHorizontal:15,
   marginVertical:20
  },

  modalView: {
    flex: 1, 
    padding: 15, 
    marginTop: Device_Height/4
  },
  modalContainerStyles: {
      width: 300, 
      height: 180, 
      backgroundColor: '#fff', 
      padding: 15,
      borderRadius: 10
  },
  txtInfoViewStyle: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingVertical:20 
  },
  txtInfo: {
      color: '#333333', 
      fontSize: 14, 
      fontFamily: 'Roboto_medium'
  },
  btnsParentView: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingVertical: 10,
  },
  eachBtnView: {
      width:140,  
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingVertical: 10
  },
  btnStyle: { 
      width: 110, 
      marginLeft:20, 
      backgroundColor: '#01a4a2', 
      borderRadius:8, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  cancelBtn: {
      width: 110, 
      backgroundColor: '#025d8c', 
      marginLeft:10, 
      borderRadius:8, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  btnTxt: {
      color: '#fff', 
      fontFamily: 'Roboto_medium', 
      fontSize: 16 
  },
  noDataViewStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:DEVICE_WIDTH - 20,
    height:Device_Height - 150
  },
  noUser:{
    color:'#333',
    fontSize:14,
    fontFamily: 'Roboto_medium',
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
  activeIndicatorStyle: {
    color: '#FFFFFF'
  },
});

export default styles;