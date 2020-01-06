import React from 'react';
import { observer, inject } from 'mobx-react';
import { Image, ActivityIndicator, Dimensions, Keyboard, TextInput, BackHandler } from 'react-native';
import { Button, View, Icon, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/otpScreenCss';
import AwesomeButton from 'react-native-really-awesome-button';
import Toast, { DURATION } from 'react-native-easy-toast';
import i18n from 'i18n-js';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class OtpScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      sentOtp: this.props.navigation.state.params && this.props.navigation.state.params.Otp ? this.props.navigation.state.params.Otp : '',
      reload: false,
      reloadFunction: '',
      loading: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  submitOtp = (otp) => {
    Keyboard.dismiss()
    const UserStore = this.props.UserStore;
    if (otp.length < 4) {
      this.refs.toast.show(i18n.t('lanErrorPleaseEnterFourDigitsOfOTP'))
    } else {
      let post_json = {
        otp: this.state.otp
      }
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false });
        _this.refs.toast.show(i18n.t('lanLabelServerNotResponding'));
      }, 20000);
      UserStore.postForgotPasswordOtpValidation(post_json, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '1002') {
          _this.setState({ loading: false })
          _this.props.navigation.navigate('CreatePassword');
        } else {
          _this.setState({ loading: false })
          _this.refs.toast.show(i18n.t('lanErrorInvalidOTP'));
        }
      });
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={{ flex: 1, }}>
        <View>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <View>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
                </View>
              </View>
              <View style={styles.headerBody} >
                <View>
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleOTPVerify')}</Text>
                </View>
              </View>
              <View style={styles.headerRight} >
              </View>
            </View>
          </LinearGradient>
          {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        </View>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.mobouter} >
              <View style={styles.mobile}>
                <Image source={require('../../../assets/otp-icon.png')} style={{ width: 60, height: 60, }} />
              </View>
            </View>
          </View>
          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', textAlign: 'center', }}>
            <Text style={styles.textCenter}>{i18n.t('lanLabelWaitOTPNumberWillBe')}  {'\n'} {i18n.t('lanLabelVerifiedHere')} </Text>
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
              onChangeText={(text) => this.setState({ otp: text })}
              value={this.state.otp}
              maxLength={4}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Button transparent >
              <Text>{this.state.sentOtp}</Text>
            </Button>
          </View>

          <View style={{ flexDirection: 'row', textAlign: 'center' }}>
            <Text style={[styles.textCenterNote]}>{i18n.t('lanLabelPleaseEnterTheOTPNumberManually')} {'\n'} {i18n.t('lanLabelIfTheNumberIsNotVerifiedAutomatically')} </Text>
          </View>
          {/* <View style={{ flexDirection: 'row', justifyContent:'center', alignItems:'center' }}>
            <Button transparent success><Text style={{ paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', }} uppercase={false}> Resend OTP </Text></Button>
          </View> */}
          <View style={styles.getCenterView} >
            <AwesomeButton block success
              onPress={() => this.submitOtp(this.state.otp)}
              width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={40}>
              <Text style={styles.BtnText} > {i18n.t('lanCommonButtonSubmit')}</Text>
            </AwesomeButton>
          </View>
        </View>
        <Toast
          ref='toast'
          style={{ backgroundColor: '#ff0000', width: '100%', marginTop: 8, }}
          position='top'
          positionValue={70}
          fadeInDuration={50}
          fadeOutDuration={500}
          opacity={0.8}
          textStyle={{ color: 'white' }}
        />
      </View>
    )
  }
}
