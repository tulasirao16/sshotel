import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },

  content: {
    margin: 8,
  },

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    // paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },

  headerLeft: {
    flex: 1
  },

  iconSearchStyle: {
    color: '#fff',
    fontSize: 25,
  },

  iconMenuStyle: {
    color: '#fff',
    fontSize: 30,
  },

  headerBody: {
    flex: 4
  },

  menu_button: {
    marginVertical: Platform.OS === 'ios' ? -6 : -6,
    marginTop: -5,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },

  headerRight: {
    flex: 1,
    justifyContent: 'center',
  },


  mainView: {
    flexDirection: 'row',
    // width: DEVICE_WIDTH-16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 7,
  },

  LeftView: {
    flex: 1,
  },

  CenterView: {
    flex: 3,
  },

  RightView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  leftListItem: {
    flex: 2,
  },

  centerListItem: {
    flex: 4
  },

  list: {
    flexDirection: 'row',
    // justifyContent:'center', 
    // alignItems:'center',
    // borderBottomWidth:1, 
    // borderColor:'#ccc', 
    // height: 50,
  },

  listitem: {
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 2,
    marginLeft: 0,
    borderBottomWidth: 0,
  },

  images: {
    resizeMode: 'cover',
    width: null,
    height: 100,
    marginRight: 10,
  },

  textSmall: {
    fontSize: 12,
    fontFamily: 'Roboto_medium',
  },

  textColor: {
    color: '#019c9e'
  },

  textLight: {
    fontSize: 12,
    fontFamily: 'Roboto_medium',
    color: '#999',
  },

  textMedium: {
    fontSize: 13,
    fontFamily: 'Roboto_medium',
    color: '#333',
  },

  textBig: {
    fontSize: 13,
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconMenuStyle: {
    color: '#fff',
    fontSize: 30,
  },
  headerBodyReload: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // left:-20
  },
  headerTitleStyle: {
    marginTop: -3,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
    // fontWeight: '700'
  },
  serverNotText: {
    fontSize: 14,
    fontFamily: 'Roboto_medium',
    marginTop: 10
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
