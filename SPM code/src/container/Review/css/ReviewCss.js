import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
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

  headerTitle: {
    fontSize: 16,
    justifyContent: 'flex-start',
    fontFamily: 'Roboto_medium',
    paddingTop: 10,
    color: '#fff',
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

  headerStyle: {
    paddingTop: 20,
    paddingBottom: 10,
    height: 80
  },

  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#d9d9d9',
    paddingBottom: 5,
    marginBottom: 5,
  },

  textSmall: {
    fontSize: 10,
    fontFamily: 'Roboto_medium',
    color: '#999'
  },

  textMedium: {
    fontSize: 15,
    fontFamily: 'Roboto_medium',
    color: '#333'
  },

  textBig: {
    fontSize: 15,
    fontFamily: 'Roboto_medium',
    color: '#333'
  },

  textHover: {
    fontSize: 12,
    fontFamily: 'Roboto_medium',
    color: '#025d8c'
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





});

export default styles;
