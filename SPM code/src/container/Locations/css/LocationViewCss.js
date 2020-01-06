
import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb',
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
    fontSize: 30
  },

  iconEditStyle:{
    color: '#fff',
    fontSize: 22
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

  headerBody: {
    flex: 5
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
  content: {
    margin: 10,
  },

  card: {
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0,
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
  textmedium: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Roboto_medium',
  },
  textSmall: {
    fontSize: 12,
    color: '#7c7879',
    fontFamily: 'Roboto_medium',
    paddingBottom: 3,
  },
  textBig: {
    fontSize: 15,
    fontFamily: 'Roboto_light',
  },
  textColor: {
    color: '#008001'
  },
  textColorRed: {
    color: 'red'
  },
  linearBtnStyles: {
    borderRadius: 22
  },
  businessNameView: {
    width: DEVICE_WIDTH-20,
    left: 10,
    backgroundColor: '#dcf4ff',
    marginTop: 10
  },
  leftImageView: {
    width: Device_Height/11, 
    height: Device_Height/11,
  },
  imageBusinessBox: {
    width: Device_Height/11.5, 
    height: Device_Height/11.5,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: 'transparent'
  },
  imgBusinessStyle: {
    width: Device_Height/11.5, 
    height: Device_Height/11.5,
    borderRadius: 50,
    resizeMode: 'cover'
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
  floatingInputView: {
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
  titleLocationType: {
    fontSize: 11,
    color: '#025d8c',
    fontFamily: 'Roboto_light',
    paddingTop: 1
  },
});

export default styles;