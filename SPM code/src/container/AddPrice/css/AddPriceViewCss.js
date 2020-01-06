import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
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
    flex: 2,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
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
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0,
  },

  collapseHeader: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    flexDirection:'row',
    flex:1
  },

  // collapseHeader: {
  //   backgroundColor: '#ffffff',
  //   paddingTop: 7,
  //   paddingBottom:10,
  //   marginBottom:5
  // },


  collapseHeaderText:{
    color: '#333',
    fontSize: 15,
    fontFamily: 'Roboto_medium',
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

  contents: {
    margin:10,
    height:Device_Height-170
  },

  floatingInputView: {
    marginHorizontal:10, 
    paddingVertical:5,
    borderBottomWidth: 0.5, 
    borderBottomColor: '#01a4a2',
    flexDirection: 'row'
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
  textmedium: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Roboto_medium',
  },
  textbig: {
    fontSize: 16,
    lineHeight: 18,
    fontFamily: 'Roboto_medium',
    marginBottom:10,
  },

  textSmall: {
    fontSize: 12,
    color: '#7c7879',
    fontFamily: 'Roboto_medium',
    paddingBottom: 3,
  },

  rightData: {
    justifyContent: 'flex-end',
    alignItems:'flex-end',
    textAlign:'right',
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
    width: DEVICE_WIDTH,
  },
  DatePicker: {
    flex:2
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
    paddingBottom: 8
  },
  textGap: {
    paddingVertical: 8,
    color:'#000000'
  },
  bodyStyle: {

  },
  scrollingContent: {
    width: DEVICE_WIDTH,
    height: Device_Height-(100+(Device_Height/9))
  },
  bodyContent: {
    margin:10,
    borderRadius:4,
    backgroundColor: '#ffffff',
  },
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },
  pickerView: {
    width: DEVICE_WIDTH/2, 
    height:40, 
    borderWidth:0.7, 
    borderColor: '#025d8c', 
    borderRadius: 5,
    marginBottom:5
  },
  businessNameView: {
    width: DEVICE_WIDTH-20,
    left:10,
    backgroundColor: '#dcf4ff',
    marginTop:10,
    marginBottom:0
  },
  leftImageView: {
    width:Device_Height/9, 
    height: Device_Height/9,
  },
  imageBox: {
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
  },
  imgStyle: {
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
    resizeMode: 'cover',
  },
  card: {
    paddingTop:10,
    // backgroundColor: '#fff',
    // marginBottom: 5,
    // borderRadius: 10,
    // paddingTop: 7,
    // paddingBottom: 7,
    // paddingLeft: 10,
    // paddingRight: 10,
    // elevation: 0,
    // height: Device_Height-170,
  },
  cardItem: {
    flexDirection: 'row',
    marginLeft: 0,
    paddingLeft: 0,
    paddingTop: 2,
    paddingBottom: 4,
    marginBottom: 5,
    paddingRight: 0,
    borderColor: '#e2e2e2',
    borderBottomWidth: 0.5,
  },

  cardBusiness: {
    marginBottom: 0,
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0
   },

   cardItemBusinessStyle: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10
  },

  businessNamesView: {
    padding: 10,
    paddingLeft: 0
  },
  propertyTitle: {
    fontSize: 15,
    color: '#01a4a2',
    fontFamily: 'Roboto_medium',
  },
  titleType: {
    fontSize: 13,
    color: '#025d8c',
    fontFamily: 'Roboto_light',
    paddingTop: 5
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
  titleLocationType: {
    fontSize: 11,
    color: '#025d8c',
    fontFamily: 'Roboto_medium',
    paddingTop: 1
  },
  


});

export default styles;