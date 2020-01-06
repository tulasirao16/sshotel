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
  button_main: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  gradientBtn: {
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  textBig: {
    fontSize: 14,
    fontFamily: 'Roboto_light',
    color: '#333'
  },
  linearStyles: {
    borderRadius: 5
  },
});

export default styles;
