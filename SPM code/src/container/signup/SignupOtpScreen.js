import React from 'react';
// import { observer, inject } from 'mobx-react';
import { AsyncStorage, Platform, Image, TouchableOpacity, BackHandler, Dimensions, Animated, Keyboard, UIManager, TextInput, StyleSheet } from 'react-native';
import { Container, Button, View, Icon, Text, Content, Label, Left, Right } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/SignupOtpScreenCss';
import AwesomeButton from "react-native-really-awesome-button";
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

export default class SignupOtpScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  _onButtonNextPress() {
    navigation = this.props.navigation
    navigation.navigate('SPHomeScreen')
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={{ flex: 1, }}>
        <View>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} >
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <View>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => this.handleBackScreen} />
                </View>
              </View>
              <View style={styles.headerBody} >
                <View>
                  <Text style={styles.headerTitleStyle}> {i18n.t('lanButtonOTPVerify')}</Text>
                </View>
              </View>
              <View style={styles.headerRight} >
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.mobouter} >
              <View style={styles.mobile}>
                <Image source={require('../../../assets/otp-icon.png')} style={{ width: 60, height: 60, }} />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', textAlign: 'center', marginTop: 20 }}>
            <Text style={[styles.textCenter, styles.textFont]}>{`${i18n.t('lanLabelWaitOTPNumberWillBe')}  ${i18n.t('lanLabelVerifiedHere')}`}</Text>
          </View>
          <View style={styles.styleOne} >
            <TextInput
              style={{
                // backgroundColor: 'transparents',
                height: 50,
                textAlign: 'center',
                fontSize: 40,
                fontWeight: 'bold',
                fontFamily: 'Roboto_medium',
                color: 'black',
                marginTop: 15
              }}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              // onChangeText={(text) => this.setState({ otpNumber: text, errorMessage: '' })}
              placeholder='__ __ __ __'
              keyboardType={'phone-pad'}
              returnKeyType='go'
              autoFocus
              selectionColor='white'
              maxLength={4}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
            <Text style={[styles.textCenterNote, styles.textItalicFont]}> {`${i18n.t('lanLabelPleaseEnterTheOTPNumberManually')} ${i18n.t('lanLabelIfTheNumberIsNotVerifiedAutomatically')}`} </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Button transparent success style={{ paddingLeft: 20, paddingRight: 20 }} onPress={() => this.handleResendOTP()}><Text style={{ paddingLeft: 20, paddingRight: 20, fontFamily: (Platform.OS === 'ios') ? 'Avenir-Book' : 'sans-serif' }} uppercase={false}> {i18n.t('lanButtonResendOTP')} </Text></Button>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <AwesomeButton block success
                onPress={this._onButtonNextPress.bind(this)}
                width={DEVICE_WIDTH - 30} height={50} backgroundColor='transparent' backgroundShadow='transparent'
                backgroundDarker='transparent' paddingHorizontal={50} borderRadius={5}>
                <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Roboto_light' }}> {i18n.t('lanButtonSignIn')} </Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
        </View>
      </View>
    )
  }
}

