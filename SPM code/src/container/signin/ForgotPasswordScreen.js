import React from 'react';
import { Platform, ActivityIndicator, Image, Dimensions, TouchableOpacity, TouchableHighlight, Animated, Keyboard, TextInput, BackHandler } from 'react-native';
import { Button, View, Icon, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/ForgotPasswordScreenCss';
import AwesomeButton from 'react-native-really-awesome-button';
import Toast, { DURATION } from 'react-native-easy-toast';
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class ForgotPasswordScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      title:i18n.t('lanTitleForgotPasswordScreen'),
      header: null,
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0
      },
      headerTitleStyle: {
        textAlign: 'center',
        flex: 1,
        color: '#25c5df',
        fontSize: 18,
      },
      headerLeft: <Button transparent onPress={() => navigation.goBack()}><Icon name='ios-arrow-back' style={{ color: '#25c5df', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,

    }
  };
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      loading: false
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
  _validateForm = (text) => {
    Keyboard.dismiss();
    const UserStore = this.props.UserStore;
    let checkText = text.includes('@');
    if (checkText) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (text == '' || text == 'undefined') {
        this.refs.toast.show(i18n.t('lanErrorPleaseEnterEmailMobileNumber'));
      } else if (!reg.test(text)) {
        this.refs.toast.show(i18n.t('lanErrorEnterValidEmailMobileNumber'));
      } else {
        let post_json = {
          'userId': this.state.userId
        }
        this.setState({ loading: true });
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false });
          _this.refs.toast.show(i18n.t('lanLabelServerNotResponding'));
        }, 20000);
        UserStUserStoreore.postSPForgotPasswordSendOtp(post_json, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
          if (resObj.statusCode == '1001') {
            _this.props.navigation.navigate('OtpScreen', { Otp: resObj.statusResult.otpNumber });
          } else if (resObj.statusCode == '9986') {
            _this.refs.toast.show(i18n.t('lanErrorPleaseProvideARegisterdEmail'));
          } else {
            _this.refs.toast.show(i18n.t('lanErrorFailedToSendOTP'));
          }
        });
      }
    } else {
      const reg = /^\d{10}$/;
      if (text == '' || text == 'undefined') {
        this.refs.toast.show(i18n.t('lanErrorPleaseEnterEmailMobileNumber'));
      } else if (!reg.test(text)) {
        this.refs.toast.show(i18n.t('lanErrorEnterValidEmailMobileNumber'));
      } else {
        let post_json = {
          'userId': this.state.userId
        }
        this.setState({ loading: true });
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false });
          _this.refs.toast.show(i18n.t('lanLabelServerNotResponding'));
        }, 20000);
        UserStore.postSPForgotPasswordSendOtp(post_json, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
          if (resObj.statusCode == '1001') {
            _this.props.navigation.navigate('OtpScreen', { Otp: resObj.statusResult.otpNumber });
          } else if (resObj.statusCode == '9986') {
            _this.refs.toast.show(i18n.t('lanErrorPleaseProvideARegisterdMobileNumber'));
          } else {
            _this.refs.toast.show(i18n.t('lanErrorEnterValidEmailMobileNumber'));
          }
        });
      }
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
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <View>
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleForgotPassword')}</Text>
                </View>
              </View>
              <View style={styles.headerRight} ></View>
            </View>
          </LinearGradient>
          {this.state.loading
            ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
            : null}
        </View>
        <View style={styles.container}>
          <View style={styles.mobouter} >
            <View style={styles.mobile}>
              <Image source={require('../../../assets/sand-clock.png')} style={{ resizeMode: 'contain', width: 40, height: 40, }} />
            </View>
          </View>
          <View style={styles.input}>
            <FloatingLabelInput
              label={i18n.t('lanLabelEnterYourEmailMobileNumber')}
              value={this.state.userId}
              minLength={3} maxLength={50}
              onChangeText={(text) => this.setState({ userId: text })}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={() => this._validateForm(this.state.userId)}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText} >{i18n.t('lanCommonButtonSendOTP')} </Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
          {/* <View style={styles.nextBtnView}>
            <AwesomeButton block success
              onPress={() => this._validateForm(this.state.userId)}
              width={DEVICE_WIDTH - 30} height={50} backgroundColor='#01a5a2' backgroundShadow='#025d8c'
              backgroundDarker='#025d8c' paddingHorizontal={50} borderRadius={1525}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}> {'Send OTP'.toUpperCase()} </Text>
            </AwesomeButton>
          </View> */}
        </View>
        <Toast
          ref='toast'
          style={{ backgroundColor: '#ff0000', width: '100%', borderRadius: 0, padding: 10, }}
          position='top'
          positionValue={80}
          fadeInDuration={750}
          fadeOutDuration={1000}
          // opacity={0.8}
          textStyle={{ color: 'white', fontFamily: 'Roboto_medium' }}
        />
      </View>
    )
  }
}

// FloatingLabelInput Code Start
class FloatingLabelInput extends React.Component {
  state = {
    isFocused: false,
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [17, 14],
      }),
      color: '#9a9a9a',
      fontWeight: '400',
      fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'Roboto_medium'
    };
    return (
      <View style={{ paddingTop: 18, }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={this.state.isFocused ? { height: 30, fontSize: 17, fontWeight: '400', fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'Roboto_medium', color: '#000', borderBottomWidth: 2, borderBottomColor: '#bfbfbf' }
            : { height: 30, fontSize: 17, color: '#000', fontWeight: '400', fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'Roboto_medium', borderBottomWidth: 1, borderBottomColor: '#bfbfbf' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid='transparent'
          blurOnSubmit
        />
      </View>
    );
  }
}
// FloatingLabelInput Code End
