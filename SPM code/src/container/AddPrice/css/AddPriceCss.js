import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },

  collapseHeader: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    flexDirection:'row',
    flex:1
  },

  collapse1:{
    position:'relative',
    marginBottom:10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0,
  },

  collapse2:{
    position:'relative',
    marginBottom:10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0,
  },

  collapse3:{
    position:'relative',
    marginBottom:10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0,
  },

  collapseHeaderText:{
    color: '#333',
    fontSize: 15,
    fontFamily: 'Roboto_medium',
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
  iconMenuStyle: {
    color: '#fff',
    fontSize: 30,
  },
  headerBody: {
    flex: 6
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto_medium',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  status: {
    zIndex: 10,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation: 0
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

  noAmenities: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  noAmenitiesText:{
    color:'#999',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal:5
  },
  floatingInputView: {
    marginRight:5,
    paddingVertical:5,
    marginBottom:5,
  },

  CheckBoxInputView:{
    paddingVertical:5,
    marginBottom:5,
    flexDirection:'row'
  },
 
  button_main: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  gradientBtn: {
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto_medium'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },
  textSmall: {
    fontSize: 14,
    fontFamily:'Roboto_medium',
    color:'#333'
  },
  textHover:{
    fontSize: 12,
    fontFamily: 'Roboto_medium',
    color:'#025d8c'
  },
  regularFontStyle: {
    fontFamily:'Roboto_light',
  },
  semiBoldFontStyle: {
    fontFamily:'Roboto_medium',
  },
  boldFontStyle: {
    fontFamily:'Roboto_medium',
  },
  DateGenderView: {
    flexDirection:'row',
    width: DEVICE_WIDTH -50,
  },
  floatingpicker:{
    // flex:2,
    width: DEVICE_WIDTH / 2
  },
  DatePicker: {
    // flex:2,
    width: DEVICE_WIDTH / 2
  },
  DatePickerAddPrice: {
    flex:2,
  },
  genderView: {
    flex:2
  },
  regularFontSize: {
   fontSize: 13,
   color: '#8a8786'
  },
  regularTextFontSize: {
    fontSize: 13,
    color: '#333333'
   },
  labelGap: {
    paddingBottom: 5
  },
  textGap: {
    paddingVertical: 3
  },
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },
  businessNameView: {
    width: DEVICE_WIDTH,
  },
  leftImageView: {
    width: Device_Height/9, 
    height: Device_Height/9,
  },
  imageBusinessBox: {
    width: Device_Height/9, 
    height: Device_Height/9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee', 
    backgroundColor:'#eee'
  },
  imgBusinessStyle: {
    width: Device_Height/9, 
    height: Device_Height/9,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee', 
    backgroundColor:'#eee',
    resizeMode: 'cover'
  },
  cardBusiness: {
   marginBottom: 0,
   marginLeft: 0,
   marginTop: 0,
   marginRight: 0,
   backgroundColor: '#fff',
   borderRadius: 10,
   elevation: 0,
  },
  cardItemBusinessStyle: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10
  },
  floatingInputBusinessView: {
    padding: 10,
    paddingLeft: 0
  },
  propertyTitle: {
    fontSize: 15,
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
  },
  reapetingDateTxt: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Roboto_medium',
  },
  titleType: {
    fontSize: 13,
    color: '#025d8c',
    fontFamily: 'Roboto_light',
    paddingTop: 3
  },
  serviceTitle: {
    fontSize: 15,
    color: '#333333',
    fontFamily: 'Roboto_medium',
  },
  serviceType: {
    fontSize: 13,
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },

  BtnText: {
    fontFamily: 'Roboto_medium',
    fontSize: 15,
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearBtnStyles: {
    borderRadius: 22
  },
  bodyView: {
    margin: 10, 
    backgroundColor: '#ffffff', 
    // padding:6, 
    // borderRadius: 10
  },

  bodyContainer: {
    height: Device_Height - 90
  },

  bodyViewAddPrice: {
    margin: 10, 
  },
  titleRadio: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Roboto_light',
  },
  titleCheckbox:{
    fontSize: 14,
    color: '#454545',
    fontFamily: 'Roboto_medium',
  },
  leftSpace: {
    paddingLeft:3
  },
  titleLocationType: {
    fontSize: 11,
    color: '#025d8c',
    fontFamily: 'Roboto_medium',
    paddingTop: 1
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
    color: '#ffffff'
  },
  subHeadingStyle: {
    fontSize: 18, 
    fontFamily: 'Roboto_medium',
    color: '#000',
    paddingLeft: 10,
    paddingRight: 10
  },

  errorIconView: {
    position: 'absolute',
    right:5,
    bottom: 10
  },

  errorIcon: {
    fontSize: 20,
    color: 'red',
    fontFamily: 'Roboto_medium',
  },

  successIcon: {
    fontSize: 20,
    color: 'green',
    fontFamily: 'Roboto_medium',
  },
  headerMainViewReload: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 30,
    marginBottom: 0,
    paddingVertical: 10,
  },
  headerTitleStyleReload: {
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
  headerBodyReload: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // left:-20
  },
  headerLeftReload: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  },
  linearBtnStyles: {
  borderRadius: 22
}, required: {
  color: 'red',
  marginTop:-5
}

});

export default styles;