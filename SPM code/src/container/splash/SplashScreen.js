import React from 'react';
import { BackHandler, Image, Platform, StyleSheet, View, AsyncStorage, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/SplashScreenCss';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

export default class SplashScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    // AsyncStorage.removeItem('authObj');
    // AsyncStorage.removeItem('authToken');
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const navigation = this.props.navigation;
    // var authToken = await AsyncStorage.getItem('authToken');
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      if(authObj && authObj.userAccount) {
        setTimeout(function () {
          navigation.navigate('SPHomeScreen');
          // navigation.navigate('PropertiesList');
        }, 2000);
      } else {
        setTimeout(function () {
          navigation.navigate('SigninScreen');
        }, 2000);
      }
    });
  }
  handleBackButton = () => {

    BackHandler.exitApp();

    return true;
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <ImageBackground 
          source={require('../../../assets/bln.gif')} 
          style={ styles.bgStyle}
        /> */}
        <LinearGradient colors={['#303f9f', '#03908a']} style={{ justifyContent:'center', alignItems: 'center', height: Device_Height, width: DEVICE_WIDTH }}>
          <View style={styles.loginField}>
            <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
          </View>
        </LinearGradient> 
      </View>
    );
  }
}


