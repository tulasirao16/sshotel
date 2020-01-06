import { StyleSheet, Dimensions, Platform } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#eef5fb'
  },
  linearGradientStyle: {
    paddingTop: 26,
    paddingBottom: 10,
    paddingHorizontal: 20,
    width: DEVICE_WIDTH,
    height: Device_Height/4
  },
  viewOne: { 
    width: DEVICE_WIDTH - 40, 
    backgroundColor: 'transparent', 
    height: Device_Height / 5, 
   
    flexDirection: 'row'   
  } ,

  eachRowParent: {
    flexDirection: 'row',
    width: DEVICE_WIDTH - 40,
    height: (Device_Height / 5)-30
  },
  eachView: {
    flex:2,
    backgroundColor:'rgba(255,255,255,.96)',
    borderRadius:6,
    margin:5,
    borderRadius:6,
    alignItems:'center',
    justifyContent: 'center',
   
  },
  shortViewTitle: {
    fontSize: 12,
    color:'#019fa0',
    fontFamily:'Roboto_light',
    paddingHorizontal:10,
    paddingTop:3
  },
  title:{
    fontSize: 14,
    color:'#6a78f9',
    fontFamily:'Roboto_light',
    paddingHorizontal:20,
    paddingVertical:0
  },
  calendarIcon: {
    fontSize: 40,
    color: '#6978f9',
    marginTop:-10
  },
  tabIcon: {
    fontSize: 50,
    color: '#ffffff',
  },
  countFont: {
      fontFamily: 'Roboto_light',
      fontSize:24,
      color: '#070706'
  },
  tabTitle: {
    fontFamily: 'Roboto_medium',
    fontSize:11,
    color: '#848888',
    paddingTop:5
  },
    tabTitleOne: {
    fontFamily: 'Roboto_light',
    fontSize:14,
    color: '#424240',
    paddingLeft:10
  },

  viewTwo: { 
    width: DEVICE_WIDTH - 40, 
    backgroundColor: '#ffffff', 
    height: Device_Height / 9, 
    marginVertical:5,
    borderRadius: 6,
    flexDirection: 'row'   
  } ,
  viewTwoAmount: { 
    width: DEVICE_WIDTH - 40, 
    backgroundColor: '#ffffff', 
    height: Device_Height / 8, 
    marginVertical:5,
    borderRadius: 6,
    flexDirection: 'row'   
  } ,
  eachViewTwoIcon: {
    width:DEVICE_WIDTH/4.5,
    height: Device_Height/9,
    backgroundColor: '#51e9c9',
    borderRadius:6,
    alignItems:'center',
    justifyContent: 'center'
  },
  eachViewTwoIconBg: {
    backgroundColor: '#8c74fa',
  },
  eachViewPropertyIconBg: {
    backgroundColor: '#eee',
  },
  eachViewTwoBody: {
    flex:3,
    borderRadius:6,
    alignItems:'flex-start',
    justifyContent: 'center'
  },
  eachViewTwoBodyBg: {
    backgroundColor: '#51e9c9',
  },
  eachViewTwoPrice: {
    flex:2,

    borderRadius:6,
    alignItems:'center',
    justifyContent: 'center'
  },
  eachViewTwoBlockedBg: {
    backgroundColor: '#E67474',
  },
  eachViewTwoAmountBg: {
    backgroundColor: '#46b971',
  },
  eachViewMessageBodyBg:{
    backgroundColor: '#54c6f8',
  },
  titleView: {
    marginTop: 5
  },
  imgStyle: {
    flex:1,
    width:null,
    height: null,
    resizeMode: 'cover',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 27
  }
  






  



});

export default styles;