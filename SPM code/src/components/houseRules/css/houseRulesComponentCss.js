import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  guestTxt: {
    color: '#fff',
    fontSize: 20
  },
  modalView: {
    backgroundColor: '#fff',
    width: DEVICE_WIDTH - 50,
    height: Device_Height / 1
  },
  labelView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 15
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnModalSubmit: {
    backgroundColor: '#009688',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:6
  },
  btnTxt: {
    color: '#fff'
  },
  guestInfoView: {
    flexDirection: 'row',
    paddingVertical:10
  },
  guestTypeTitleView: {
    flex: 3
  },
  minusIconView: {
    flex: 1
  },
  guestNumberView: {
    flex: 2
  },
  plusIconView: {
    flex: 1
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  guestNumberTxtView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  guestNumberTxt: {
    paddingVertical: 7
  },
  guestTypeTxt: {
    paddingVertical: 6
  },
  ageinfoTxt: {
    fontSize:10,
  },
  listItem: {
    borderBottomWidth:0
},
labelView: {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  paddingVertical: 15,
  paddingHorizontal:15
},
labelTxt: {
    fontWeight:'700',
    color: '#333'
},
bigTxt: {
    color: '#333'
},
mainView:{
    marginVertical:15,
},
roomTypeView: {
    marginHorizontal:0,
},
buttonNext: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#009688',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },

  closeBtn:{
    position:'absolute',
    top:10,
    right:10,
    zIndex:99
  }

});

export default styles;