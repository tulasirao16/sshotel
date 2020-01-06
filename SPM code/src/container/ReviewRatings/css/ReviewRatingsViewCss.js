import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },

  content: {
    marginTop:0,
    marginLeft:8,
    marginRight:8,
    marginBottom:8,
  },

  headerMainView: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    height: 50,
    marginTop: 10,
    // paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 0,
    justifyContent: 'center'
  },

  activeIndicatorView: {
    width: DEVICE_WIDTH,
    height: Device_Height,
    position:'absolute',
    zIndex:9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    flex: 1,
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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

  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 21,
    backgroundColor: 'transparent',
    elevation:0
  },

  card:{
    backgroundColor: '#fff',
    marginBottom:5,
    borderRadius:10,
    paddingTop:7,
    paddingBottom:7,
    paddingLeft:10,
    paddingRight:10,
    elevation:0,
  },

  cardItem:{
    marginLeft:0,
    paddingLeft:0,
    paddingTop:2,
    paddingBottom:2,
    paddingRight:0,
    // borderColor: '#e2e2e2',
    // borderBottomWidth: 0.5,
  },

  listMain:{
    flexDirection:'row',
    width:DEVICE_WIDTH-50,
  },

  listItem:{
    // flexDirection:'row',
    width:DEVICE_WIDTH-50,
  },

  leftView:{
    flex:2
  },

  rightView:{
    flex:3,
    justifyContent:'flex-end',
    alignItems:'flex-end'
  },

  textLabel:{
    paddingBottom:3,
    fontSize: 13,
    fontFamily: 'Roboto_light',
  },

  bookingText:{
    fontSize: 14,
    fontFamily:'Roboto_medium'
  },

  linearStyles: {
    width: DEVICE_WIDTH,
  },

  bodyContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: DEVICE_WIDTH - 20
  },
  labelTxt: {
    fontSize: 17,
    marginVertical: 5,
    fontFamily: 'Roboto_medium',
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  serviceView:{
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 10,
    paddingVertical: 10
  },
  serviceTitle:{
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },
  serviceReview:{
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 10,
    paddingVertical: 10
  },
  serviceReviewTitle:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    width:DEVICE_WIDTH-20,
    borderWidth:1,
    borderColor:'#b479b5',
    marginVertical:3
  },

  serviceReviewComment: {
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 12,
    width:DEVICE_WIDTH-20,
    borderWidth:1,
    borderColor:'#b479b5',
    marginVertical:3
  },
  commentTxt: {
      marginTop:-10
  },

  businessNameView: {
    width: DEVICE_WIDTH-20,
    left:10,
    backgroundColor: '#dcf4ff',
    marginVertical:10
  },

  cardBusiness: {
    marginBottom:0,
    marginLeft:0,
    marginTop:0,
    marginRight:0
   },

   cardItemBusinessStyle: {
    paddingLeft:10,
    paddingTop:5,
    paddingBottom:5,
    paddingRight:10
  },

  leftImageView: {
    width:Device_Height/11, 
    height: Device_Height/11,
  },

  imageBox: {
    width:Device_Height/11.5, 
    height: Device_Height/11.5,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: 'transparent'
  },

  imgStyle: {
    width:Device_Height/11.5, 
    height: Device_Height/11.5,
    borderRadius: 50,
    resizeMode: 'cover'
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

  titleType: {
    fontSize: 13,
    color: '#025d8c',
    fontFamily: 'Roboto_light',
    paddingTop: 5
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
  iconMenuStyle1: {
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

});

  export default styles;
  
