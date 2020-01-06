import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5fb'
  },
  linearStyles: {
    borderRadius: 5
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    margin: 10,
  },
  button_main: {
    marginHorizontal: 8,
    marginVertical: 8,
  },
  gradientBtn: {
    color: 'white', fontSize: 18, fontFamily: 'Roboto_medium'
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
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: '#454545',
    fontFamily: 'Roboto_medium',
  },
});

export default styles;
